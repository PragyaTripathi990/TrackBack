-- Lost and Found Database Schema with pgvector support
-- Run this in your Supabase SQL Editor

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    location VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Items table (both lost and found items)
CREATE TABLE IF NOT EXISTS items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(10) NOT NULL CHECK (type IN ('lost', 'found')),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50),
    location VARCHAR(255) NOT NULL,
    date_lost_or_found TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    image_url TEXT,
    image_embedding vector(512),  -- CLIP embeddings are 512-dimensional
    text_embedding vector(512),   -- Text embeddings from CLIP
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'expired')),
    contact_info JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Matches table (potential matches between lost and found items)
CREATE TABLE IF NOT EXISTS matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lost_item_id UUID REFERENCES items(id) ON DELETE CASCADE,
    found_item_id UUID REFERENCES items(id) ON DELETE CASCADE,
    similarity_score FLOAT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(lost_item_id, found_item_id)
);

-- Reports table (for inappropriate content or spam)
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID REFERENCES items(id) ON DELETE CASCADE,
    reporter_id UUID REFERENCES users(id) ON DELETE SET NULL,
    reason TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_items_type ON items(type);
CREATE INDEX IF NOT EXISTS idx_items_status ON items(status);
CREATE INDEX IF NOT EXISTS idx_items_user_id ON items(user_id);
CREATE INDEX IF NOT EXISTS idx_items_created_at ON items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_items_location ON items(location);
CREATE INDEX IF NOT EXISTS idx_matches_lost_item ON matches(lost_item_id);
CREATE INDEX IF NOT EXISTS idx_matches_found_item ON matches(found_item_id);
CREATE INDEX IF NOT EXISTS idx_matches_similarity ON matches(similarity_score DESC);

-- Create vector similarity search indexes (using HNSW for better performance)
CREATE INDEX IF NOT EXISTS idx_items_image_embedding ON items 
USING hnsw (image_embedding vector_cosine_ops);

CREATE INDEX IF NOT EXISTS idx_items_text_embedding ON items 
USING hnsw (text_embedding vector_cosine_ops);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_items_updated_at 
    BEFORE UPDATE ON items 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to search items by image embedding similarity
CREATE OR REPLACE FUNCTION search_items_by_image(
    query_embedding vector(512),
    item_type VARCHAR DEFAULT NULL,
    similarity_threshold FLOAT DEFAULT 0.5,
    max_results INT DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    title VARCHAR,
    description TEXT,
    location VARCHAR,
    image_url TEXT,
    type VARCHAR,
    similarity_score FLOAT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        i.id,
        i.title,
        i.description,
        i.location,
        i.image_url,
        i.type,
        1 - (i.image_embedding <=> query_embedding) AS similarity_score,
        i.created_at
    FROM items i
    WHERE 
        i.status = 'active'
        AND i.image_embedding IS NOT NULL
        AND (item_type IS NULL OR i.type = item_type)
        AND 1 - (i.image_embedding <=> query_embedding) >= similarity_threshold
    ORDER BY i.image_embedding <=> query_embedding
    LIMIT max_results;
END;
$$ LANGUAGE plpgsql;

-- Function to search items by text embedding similarity
CREATE OR REPLACE FUNCTION search_items_by_text(
    query_embedding vector(512),
    item_type VARCHAR DEFAULT NULL,
    similarity_threshold FLOAT DEFAULT 0.5,
    max_results INT DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    title VARCHAR,
    description TEXT,
    location VARCHAR,
    image_url TEXT,
    type VARCHAR,
    similarity_score FLOAT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        i.id,
        i.title,
        i.description,
        i.location,
        i.image_url,
        i.type,
        1 - (i.text_embedding <=> query_embedding) AS similarity_score,
        i.created_at
    FROM items i
    WHERE 
        i.status = 'active'
        AND i.text_embedding IS NOT NULL
        AND (item_type IS NULL OR i.type = item_type)
        AND 1 - (i.text_embedding <=> query_embedding) >= similarity_threshold
    ORDER BY i.text_embedding <=> query_embedding
    LIMIT max_results;
END;
$$ LANGUAGE plpgsql;

-- Function to find potential matches automatically
CREATE OR REPLACE FUNCTION find_potential_matches(
    item_id_param UUID,
    similarity_threshold FLOAT DEFAULT 0.7
)
RETURNS TABLE (
    match_id UUID,
    match_title VARCHAR,
    match_description TEXT,
    match_location VARCHAR,
    match_image_url TEXT,
    similarity_score FLOAT
) AS $$
DECLARE
    item_type_var VARCHAR;
    image_emb vector(512);
    text_emb vector(512);
BEGIN
    -- Get the item's type and embeddings
    SELECT type, image_embedding, text_embedding 
    INTO item_type_var, image_emb, text_emb
    FROM items 
    WHERE id = item_id_param;
    
    -- Find opposite type items with similar embeddings
    RETURN QUERY
    SELECT 
        i.id,
        i.title,
        i.description,
        i.location,
        i.image_url,
        GREATEST(
            COALESCE(1 - (i.image_embedding <=> image_emb), 0),
            COALESCE(1 - (i.text_embedding <=> text_emb), 0)
        ) AS similarity_score
    FROM items i
    WHERE 
        i.status = 'active'
        AND i.id != item_id_param
        AND i.type != item_type_var
        AND (
            (i.image_embedding IS NOT NULL AND image_emb IS NOT NULL AND 1 - (i.image_embedding <=> image_emb) >= similarity_threshold)
            OR 
            (i.text_embedding IS NOT NULL AND text_emb IS NOT NULL AND 1 - (i.text_embedding <=> text_emb) >= similarity_threshold)
        )
    ORDER BY similarity_score DESC
    LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- Insert some sample categories
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO categories (name, icon) VALUES
    ('Electronics', '📱'),
    ('Bags & Luggage', '🎒'),
    ('Clothing', '👕'),
    ('Accessories', '👓'),
    ('Documents', '📄'),
    ('Keys', '🔑'),
    ('Wallets & Purses', '👛'),
    ('Books & Stationery', '📚'),
    ('Sports Equipment', '⚽'),
    ('Jewelry', '💍'),
    ('Other', '📦')
ON CONFLICT (name) DO NOTHING;

-- Create view for active items with user info
CREATE OR REPLACE VIEW items_with_users AS
SELECT 
    i.id,
    i.type,
    i.title,
    i.description,
    i.category,
    i.location,
    i.date_lost_or_found,
    i.image_url,
    i.status,
    i.created_at,
    i.updated_at,
    u.id as user_id,
    u.name as user_name,
    u.email as user_email,
    u.phone as user_phone,
    u.avatar_url as user_avatar
FROM items i
LEFT JOIN users u ON i.user_id = u.id
WHERE i.status = 'active';

-- Grant necessary permissions (adjust based on your Supabase setup)
-- You may need to run these with appropriate roles
-- GRANT USAGE ON SCHEMA public TO anon, authenticated;
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
-- GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

