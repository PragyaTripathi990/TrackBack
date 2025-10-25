const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const axios = require('axios');

// Get all items (with filters)
router.get('/', async (req, res) => {
  try {
    const { 
      type, 
      status = 'active', 
      category, 
      location, 
      limit = 20, 
      offset = 0 
    } = req.query;

    let query = supabase
      .from('items')
      .select(`
        *,
        user:users(id, name, email, phone, avatar_url)
      `)
      .eq('status', status)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (type) {
      query = query.eq('type', type);
    }

    if (category) {
      query = query.eq('category', category);
    }

    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json({
      success: true,
      data,
      count: data.length
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get single item by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('items')
      .select(`
        *,
        user:users(id, name, email, phone, avatar_url)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      });
    }

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create new item (lost or found)
router.post('/', async (req, res) => {
  try {
    const {
      user_id,
      type,
      title,
      description,
      category,
      location,
      date_lost_or_found,
      image_url,
      contact_info
    } = req.body;

    // Validate required fields
    if (!user_id || !type || !title || !description || !location) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Validate type
    if (!['lost', 'found'].includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'Type must be either "lost" or "found"'
      });
    }

    // Ensure user exists in database (for mock auth compatibility)
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', user_id)
      .single();

    if (!existingUser) {
      // Create user if doesn't exist (for mock auth)
      const { error: userError } = await supabase
        .from('users')
        .insert([{
          id: user_id,
          email: `user_${user_id}@lostandfound.local`,
          name: 'User',
          created_at: new Date().toISOString()
        }]);
      
      if (userError) {
        console.warn('Could not create user:', userError.message);
      }
    }

    // Generate embeddings using CLIP service
    let image_embedding = null;
    let text_embedding = null;

    try {
      const clipServiceUrl = process.env.CLIP_SERVICE_URL || 'http://localhost:8000';
      
      // Generate text embedding
      const textResponse = await axios.post(`${clipServiceUrl}/encode/text`, {
        text: `${title}. ${description}. Location: ${location}`
      }, { timeout: 10000 });
      
      if (textResponse.data && textResponse.data.embedding) {
        text_embedding = textResponse.data.embedding;
      }

      // Generate image embedding if image_url is provided
      if (image_url) {
        const imageResponse = await axios.post(`${clipServiceUrl}/encode/image`, {
          image_url: image_url
        }, { timeout: 15000 });
        
        if (imageResponse.data && imageResponse.data.embedding) {
          image_embedding = imageResponse.data.embedding;
        }
      }
    } catch (clipError) {
      console.warn('CLIP service error:', clipError.message);
      // Continue without embeddings - they can be generated later
    }

    // Insert item into database
    const { data, error } = await supabase
      .from('items')
      .insert([
        {
          user_id,
          type,
          title,
          description,
          category,
          location,
          date_lost_or_found: date_lost_or_found || new Date().toISOString(),
          image_url,
          image_embedding,
          text_embedding,
          contact_info,
          status: 'active'
        }
      ])
      .select(`
        *,
        user:users(id, name, email, phone, avatar_url)
      `)
      .single();

    if (error) throw error;

    // Find potential matches asynchronously
    if (data.id && (image_embedding || text_embedding)) {
      findAndStorePotentialMatches(data.id).catch(err => 
        console.error('Error finding matches:', err)
      );
    }

    res.status(201).json({
      success: true,
      data,
      message: 'Item created successfully'
    });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update item
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove fields that shouldn't be updated directly
    delete updates.id;
    delete updates.created_at;
    delete updates.image_embedding;
    delete updates.text_embedding;

    const { data, error } = await supabase
      .from('items')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        user:users(id, name, email, phone, avatar_url)
      `)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      });
    }

    res.json({
      success: true,
      data,
      message: 'Item updated successfully'
    });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete item (soft delete by changing status)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('items')
      .update({ status: 'expired' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      });
    }

    res.json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get potential matches for an item
router.get('/:id/matches', async (req, res) => {
  try {
    const { id } = req.params;
    const { threshold = 0.7 } = req.query;

    const { data, error } = await supabase
      .rpc('find_potential_matches', {
        item_id_param: id,
        similarity_threshold: parseFloat(threshold)
      });

    if (error) throw error;

    res.json({
      success: true,
      data: data || [],
      count: data ? data.length : 0
    });
  } catch (error) {
    console.error('Error finding matches:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Helper function to find and store potential matches
async function findAndStorePotentialMatches(itemId, threshold = 0.7) {
  try {
    const { data: matches, error } = await supabase
      .rpc('find_potential_matches', {
        item_id_param: itemId,
        similarity_threshold: threshold
      });

    if (error || !matches || matches.length === 0) {
      return;
    }

    // Get the item type to determine which is lost and which is found
    const { data: item } = await supabase
      .from('items')
      .select('type')
      .eq('id', itemId)
      .single();

    if (!item) return;

    // Prepare match records
    const matchRecords = matches.map(match => ({
      lost_item_id: item.type === 'lost' ? itemId : match.match_id,
      found_item_id: item.type === 'found' ? itemId : match.match_id,
      similarity_score: match.similarity_score,
      status: 'pending'
    }));

    // Insert matches (ignore duplicates)
    await supabase
      .from('matches')
      .upsert(matchRecords, { 
        onConflict: 'lost_item_id,found_item_id',
        ignoreDuplicates: true 
      });

  } catch (error) {
    console.error('Error storing matches:', error);
  }
}

module.exports = router;

