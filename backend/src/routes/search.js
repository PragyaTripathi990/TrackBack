const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const axios = require('axios');

// Search by text using CLIP embeddings
router.post('/text', async (req, res) => {
  try {
    const { 
      query, 
      type, 
      threshold = 0.5, 
      limit = 10 
    } = req.body;

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Query text is required'
      });
    }

    // Generate text embedding using CLIP service
    const clipServiceUrl = process.env.CLIP_SERVICE_URL || 'http://localhost:8000';
    
    let textEmbedding;
    try {
      const response = await axios.post(
        `${clipServiceUrl}/encode/text`,
        { text: query },
        { timeout: 10000 }
      );
      
      if (!response.data || !response.data.embedding) {
        throw new Error('Invalid response from CLIP service');
      }
      
      textEmbedding = response.data.embedding;
    } catch (clipError) {
      console.error('CLIP service error:', clipError.message);
      return res.status(503).json({
        success: false,
        error: 'Search service temporarily unavailable. Please try again.',
        details: clipError.message
      });
    }

    // Search using vector similarity
    const { data, error } = await supabase
      .rpc('search_items_by_text', {
        query_embedding: textEmbedding,
        item_type: type || null,
        similarity_threshold: parseFloat(threshold),
        max_results: parseInt(limit)
      });

    if (error) throw error;

    // Enrich results with user information
    const itemIds = data.map(item => item.id);
    let enrichedData = data;

    if (itemIds.length > 0) {
      const { data: items, error: itemsError } = await supabase
        .from('items')
        .select(`
          *,
          user:users(id, name, email, phone, avatar_url)
        `)
        .in('id', itemIds);

      if (!itemsError && items) {
        enrichedData = data.map(result => {
          const fullItem = items.find(item => item.id === result.id);
          return {
            ...fullItem,
            similarity_score: result.similarity_score
          };
        });
      }
    }

    res.json({
      success: true,
      data: enrichedData,
      count: enrichedData.length,
      query: query,
      metadata: {
        threshold,
        type: type || 'all'
      }
    });
  } catch (error) {
    console.error('Error in text search:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Search by image using CLIP embeddings
router.post('/image', async (req, res) => {
  try {
    const { 
      image_url, 
      type, 
      threshold = 0.5, 
      limit = 10 
    } = req.body;

    if (!image_url || typeof image_url !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Image URL is required'
      });
    }

    // Generate image embedding using CLIP service
    const clipServiceUrl = process.env.CLIP_SERVICE_URL || 'http://localhost:8000';
    
    let imageEmbedding;
    try {
      const response = await axios.post(
        `${clipServiceUrl}/encode/image`,
        { image_url },
        { timeout: 15000 }
      );
      
      if (!response.data || !response.data.embedding) {
        throw new Error('Invalid response from CLIP service');
      }
      
      imageEmbedding = response.data.embedding;
    } catch (clipError) {
      console.error('CLIP service error:', clipError.message);
      return res.status(503).json({
        success: false,
        error: 'Image search service temporarily unavailable. Please try again.',
        details: clipError.message
      });
    }

    // Search using vector similarity
    const { data, error } = await supabase
      .rpc('search_items_by_image', {
        query_embedding: imageEmbedding,
        item_type: type || null,
        similarity_threshold: parseFloat(threshold),
        max_results: parseInt(limit)
      });

    if (error) throw error;

    // Enrich results with user information
    const itemIds = data.map(item => item.id);
    let enrichedData = data;

    if (itemIds.length > 0) {
      const { data: items, error: itemsError } = await supabase
        .from('items')
        .select(`
          *,
          user:users(id, name, email, phone, avatar_url)
        `)
        .in('id', itemIds);

      if (!itemsError && items) {
        enrichedData = data.map(result => {
          const fullItem = items.find(item => item.id === result.id);
          return {
            ...fullItem,
            similarity_score: result.similarity_score
          };
        });
      }
    }

    res.json({
      success: true,
      data: enrichedData,
      count: enrichedData.length,
      metadata: {
        threshold,
        type: type || 'all'
      }
    });
  } catch (error) {
    console.error('Error in image search:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Hybrid search (combines text and image)
router.post('/hybrid', async (req, res) => {
  try {
    const { 
      query, 
      image_url, 
      type, 
      threshold = 0.5, 
      limit = 10 
    } = req.body;

    if ((!query || query.trim().length === 0) && !image_url) {
      return res.status(400).json({
        success: false,
        error: 'Either query text or image URL is required'
      });
    }

    const results = [];
    const seenIds = new Set();

    // If text query is provided, search by text
    if (query && query.trim().length > 0) {
      const textResponse = await axios.post(
        `http://localhost:${process.env.PORT || 5000}/api/search/text`,
        { query, type, threshold, limit },
        { timeout: 15000 }
      );
      
      if (textResponse.data && textResponse.data.data) {
        textResponse.data.data.forEach(item => {
          if (!seenIds.has(item.id)) {
            results.push({
              ...item,
              match_type: 'text'
            });
            seenIds.add(item.id);
          }
        });
      }
    }

    // If image URL is provided, search by image
    if (image_url) {
      const imageResponse = await axios.post(
        `http://localhost:${process.env.PORT || 5000}/api/search/image`,
        { image_url, type, threshold, limit },
        { timeout: 15000 }
      );
      
      if (imageResponse.data && imageResponse.data.data) {
        imageResponse.data.data.forEach(item => {
          if (!seenIds.has(item.id)) {
            results.push({
              ...item,
              match_type: 'image'
            });
            seenIds.add(item.id);
          } else {
            // If already found via text, mark as both
            const existing = results.find(r => r.id === item.id);
            if (existing) {
              existing.match_type = 'both';
              // Average the similarity scores
              existing.similarity_score = (existing.similarity_score + item.similarity_score) / 2;
            }
          }
        });
      }
    }

    // Sort by similarity score
    results.sort((a, b) => b.similarity_score - a.similarity_score);

    // Limit results
    const limitedResults = results.slice(0, parseInt(limit));

    res.json({
      success: true,
      data: limitedResults,
      count: limitedResults.length,
      metadata: {
        threshold,
        type: type || 'all',
        searchType: 'hybrid',
        hasTextQuery: !!query,
        hasImageQuery: !!image_url
      }
    });
  } catch (error) {
    console.error('Error in hybrid search:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get categories
router.get('/categories', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;

    res.json({
      success: true,
      data: data || []
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;

