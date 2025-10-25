# 🏗️ System Architecture

## Overview

The Lost & Found system consists of 4 main components working together:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Backend   │────▶│CLIP Service │     │  Supabase   │
│   (React)   │◀────│  (Node.js)  │◀────│  (Python)   │     │(PostgreSQL) │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
      │                    │                                         │
      │                    └─────────────────────────────────────────┘
      │                           Storage & Database
      └────────────────────────────────────────────────────────────▶
                          Direct Supabase Auth (Optional)
```

---

## Component Details

### 1. Frontend (React + TypeScript + Tailwind)

**Location**: `/frontend/`  
**Port**: 5173  
**Purpose**: User interface and experience

```
Frontend
├── User Interface (React Components)
│   ├── Authentication (Login/Register/Profile)
│   ├── Item Management (Report Lost/Found)
│   └── Search Interface (Text/Image/Hybrid)
│
├── State Management (React Context)
│   ├── AuthContext (user state)
│   └── ThemeContext (dark mode)
│
└── API Client (Axios)
    └── Communicates with Backend API
```

**Key Features**:
- Modern dark mode UI
- Real-time search
- Image upload with preview
- Responsive design
- Authentication flow
- Error handling

---

### 2. Backend (Node.js + Express)

**Location**: `/backend/`  
**Port**: 5000  
**Purpose**: Business logic and API gateway

```
Backend API
├── Routes
│   ├── /api/items      → CRUD for items
│   ├── /api/search     → AI-powered search
│   ├── /api/upload     → Image handling
│   └── /api/users      → User management
│
├── Middleware
│   ├── CORS            → Cross-origin requests
│   ├── Helmet          → Security headers
│   └── Compression     → Response compression
│
└── Integrations
    ├── Supabase Client → Database & Storage
    └── Axios           → CLIP Service calls
```

**Responsibilities**:
- Validate requests
- Upload images to Supabase Storage
- Generate embeddings via CLIP Service
- Store data in PostgreSQL
- Perform vector similarity searches
- Return ranked results

---

### 3. CLIP Service (Python + FastAPI)

**Location**: `/clip-service/`  
**Port**: 8000  
**Purpose**: AI embedding generation

```
CLIP Service
├── Model (OpenAI CLIP)
│   └── clip-vit-base-patch32
│       ├── Vision Encoder  (images → vectors)
│       └── Text Encoder    (text → vectors)
│
├── Endpoints
│   ├── POST /encode/text      → Text embedding
│   ├── POST /encode/image     → Image embedding
│   ├── POST /encode/batch/*   → Batch processing
│   └── POST /similarity/*     → Compute similarity
│
└── Processing
    ├── Download images
    ├── Preprocess inputs
    ├── Generate 512-dim vectors
    └── Return embeddings
```

**How it Works**:
1. Receives text or image URL
2. Preprocesses input for CLIP
3. Runs through neural network
4. Returns 512-dimensional embedding
5. Embeddings represent "meaning"

---

### 4. Database (Supabase PostgreSQL + pgvector)

**Location**: Cloud (Supabase)  
**Purpose**: Data persistence and vector search

```
Database (PostgreSQL + pgvector)
├── Tables
│   ├── users           → User accounts
│   ├── items           → Lost/Found items
│   │   ├── metadata    (title, description, location)
│   │   ├── image_embedding[512]   (visual features)
│   │   └── text_embedding[512]    (semantic features)
│   ├── matches         → Potential matches
│   ├── categories      → Item categories
│   └── reports         → Content moderation
│
├── Functions (PL/pgSQL)
│   ├── search_items_by_text()   → Vector similarity
│   ├── search_items_by_image()  → Vector similarity
│   └── find_potential_matches() → Auto-matching
│
├── Indexes (HNSW)
│   ├── idx_items_image_embedding  → Fast image search
│   └── idx_items_text_embedding   → Fast text search
│
└── Storage
    └── lost-found-images/  → Image files
```

**Vector Search**:
```sql
-- Find similar items using cosine distance
SELECT *, 
       1 - (text_embedding <=> query_embedding) AS similarity
FROM items
WHERE 1 - (text_embedding <=> query_embedding) > 0.5
ORDER BY text_embedding <=> query_embedding
LIMIT 10;
```

---

## Data Flow

### Flow 1: Reporting a Lost Item

```
User                Frontend              Backend           CLIP Service      Database
 │                     │                    │                    │               │
 │─(1) Fill Form──────▶│                    │                    │               │
 │   (title, desc,     │                    │                    │               │
 │    location, image) │                    │                    │               │
 │                     │                    │                    │               │
 │                     │─(2) Upload Image──▶│                    │               │
 │                     │                    │─(3) Save to────────┼──────────────▶│
 │                     │                    │    Storage         │               │
 │                     │                    │◀─(4) Get URL───────┼───────────────│
 │                     │                    │                    │               │
 │                     │                    │─(5) Generate Text──▶│               │
 │                     │                    │    Embedding       │               │
 │                     │                    │◀─(6) Return Vector─│               │
 │                     │                    │    [512 numbers]   │               │
 │                     │                    │                    │               │
 │                     │                    │─(7) Generate Image─▶│               │
 │                     │                    │    Embedding       │               │
 │                     │                    │◀─(8) Return Vector─│               │
 │                     │                    │    [512 numbers]   │               │
 │                     │                    │                    │               │
 │                     │                    │─(9) Store Item─────────────────────▶│
 │                     │                    │    with embeddings │               │
 │                     │                    │                    │               │
 │                     │                    │─(10) Find Matches──────────────────▶│
 │                     │                    │     (auto)         │               │
 │                     │◀─(11) Success─────│                    │               │
 │◀(12) Show Result────│                    │                    │               │
```

**Time**: ~10-15 seconds total
- Upload: 2-3 seconds
- Text embedding: 0.5-1 second
- Image embedding: 1-2 seconds
- Database save: <1 second
- Find matches: 1-2 seconds

---

### Flow 2: Text Search

```
User                Frontend              Backend           CLIP Service      Database
 │                     │                    │                    │               │
 │─(1) Type Query─────▶│                    │                    │               │
 │   "black wallet    │                    │                    │               │
 │    near library"   │                    │                    │               │
 │                     │                    │                    │               │
 │                     │─(2) POST Search───▶│                    │               │
 │                     │    {query: "..."}  │                    │               │
 │                     │                    │                    │               │
 │                     │                    │─(3) Generate───────▶│               │
 │                     │                    │    Text Embedding  │               │
 │                     │                    │◀─(4) Return────────│               │
 │                     │                    │    [512 numbers]   │               │
 │                     │                    │                    │               │
 │                     │                    │─(5) Vector Search──────────────────▶│
 │                     │                    │    Find Similar    │               │
 │                     │                    │    Text Embeddings │               │
 │                     │                    │◀─(6) Results───────────────────────│
 │                     │                    │    Ranked by       │               │
 │                     │                    │    Similarity      │               │
 │                     │◀─(7) Return────────│                    │               │
 │                     │    Results         │                    │               │
 │◀(8) Show Results────│                    │                    │               │
 │   with Scores      │                    │                    │               │
```

**Time**: ~2-5 seconds
- Generate embedding: 0.5-1 second
- Vector search: 0.5-1 second
- Data enrichment: 0.5-1 second

---

### Flow 3: Image Search

```
User                Frontend              Backend           CLIP Service      Database
 │                     │                    │                    │               │
 │─(1) Upload Photo───▶│                    │                    │               │
 │                     │                    │                    │               │
 │                     │─(2) Upload to──────▶│                    │               │
 │                     │    Backend         │                    │               │
 │                     │                    │─(3) Save to────────┼──────────────▶│
 │                     │                    │    Storage         │               │
 │                     │                    │◀─(4) Get URL───────┼───────────────│
 │                     │                    │                    │               │
 │                     │                    │─(5) Generate───────▶│               │
 │                     │                    │    Image Embedding │               │
 │                     │                    │◀─(6) Return────────│               │
 │                     │                    │    [512 numbers]   │               │
 │                     │                    │                    │               │
 │                     │                    │─(7) Vector Search──────────────────▶│
 │                     │                    │    Find Similar    │               │
 │                     │                    │    Image Embeddings│               │
 │                     │                    │◀─(8) Results───────────────────────│
 │                     │◀─(9) Return────────│                    │               │
 │◀(10) Show Results───│                    │                    │               │
```

**Time**: ~5-8 seconds
- Image upload: 2-3 seconds
- Generate embedding: 1-2 seconds
- Vector search: 0.5-1 second

---

## Vector Embeddings Explained

### What is an Embedding?

```
Text: "black wallet"
       ↓
    [CLIP Model]
       ↓
Vector: [0.23, -0.45, 0.78, ..., 0.12]  ← 512 numbers
                                            representing "meaning"

Image: photo of wallet
       ↓
    [CLIP Model]
       ↓
Vector: [0.21, -0.43, 0.80, ..., 0.14]  ← Similar numbers!
                                            because similar meaning
```

### Why Embeddings are Magical

```
Traditional Search:
"wallet" ONLY matches "wallet" ❌

Embedding Search:
"wallet" matches:
  - "wallet"          (100% similar)
  - "purse"           (85% similar)
  - "billfold"        (82% similar)
  - "leather holder"  (75% similar) ✅
```

### Cross-Modal Search

```
Same "Meaning Space":

Text Space          Image Space
    ↓                   ↓
  [CLIP]            [CLIP]
    ↓                   ↓
    └─────▶ [Shared Vector Space] ◀─────┘
                     ↓
            Can compare text ↔ image!
```

Example:
```
Query: "black laptop bag"        [0.2, 0.5, -0.3, ...]
Image: photo of backpack         [0.19, 0.52, -0.28, ...]
                                   ↑ Very similar vectors!
Result: 87% match ✅
```

---

## Performance Optimization

### 1. Vector Indexes (HNSW)

```
Without Index:
Search 10,000 items: ~5 seconds ❌

With HNSW Index:
Search 10,000 items: <100ms ✅
```

**How it works**:
- Builds hierarchical graph of vectors
- Navigates graph instead of checking all items
- Trade-off: Slight accuracy loss for 50x speed gain

### 2. Batch Processing

```
Generate 10 embeddings:
One at a time: 10 seconds ❌
Batch: 2 seconds ✅
```

### 3. Caching

```
Same query twice:
First time: 3 seconds
Second time: <100ms (cached embeddings)
```

---

## Security Architecture

```
User Request
    ↓
[CORS Check] ← Only allow from trusted origins
    ↓
[Helmet Security Headers] ← XSS, CSP protection
    ↓
[Input Validation] ← Check file size, type, etc.
    ↓
[Authentication] ← Verify user token
    ↓
[Rate Limiting] ← Prevent abuse (future)
    ↓
[SQL Injection Prevention] ← Parameterized queries
    ↓
Process Request
```

---

## Deployment Architecture (Future)

```
Production Setup:

                     [Load Balancer]
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
    [Frontend]        [Backend]         [CLIP Service]
    (Vercel)          (Railway)         (AWS Lambda)
         │                 │                 │
         └─────────────────┼─────────────────┘
                           │
                    [Supabase Cloud]
                  (PostgreSQL + Storage)
```

**Scaling Considerations**:
- Frontend: CDN distribution
- Backend: Horizontal scaling (multiple instances)
- CLIP Service: GPU instances for faster inference
- Database: Read replicas for search queries
- Storage: CDN for images

---

## Technology Decisions

### Why React?
- Component reusability
- Large ecosystem
- TypeScript support
- Excellent developer experience

### Why Node.js?
- JavaScript everywhere
- Non-blocking I/O
- Great for API gateway
- Easy to deploy

### Why Python for AI?
- Best ML/AI libraries
- HuggingFace support
- CLIP model available
- Easy to prototype

### Why Supabase?
- PostgreSQL (reliable)
- pgvector extension
- Built-in storage
- Easy to use
- Free tier

### Why CLIP?
- State-of-the-art model
- Cross-modal capabilities
- Open source
- Pre-trained (no training needed)
- 512-dim embeddings (good balance)

---

## Monitoring & Logging

```
Frontend:
├── Browser Console (errors)
├── React DevTools (state)
└── Network Tab (API calls)

Backend:
├── Morgan (HTTP logs)
├── Console.log (custom logs)
└── Error middleware (error tracking)

CLIP Service:
├── FastAPI logs
├── Model loading status
└── Processing times

Database:
├── Supabase Dashboard
├── Query performance
└── Storage usage
```

---

## Future Enhancements

### Phase 2:
- Real-time notifications (WebSockets)
- Email alerts for matches
- Mobile app (React Native)

### Phase 3:
- Admin dashboard
- Analytics and reporting
- Multi-language support

### Phase 4:
- Voice search
- QR code generation
- Map integration
- Chat system

---

## Conclusion

This architecture provides:
- ✅ Scalability (can handle thousands of items)
- ✅ Performance (sub-second search after embedding)
- ✅ Reliability (PostgreSQL, error handling)
- ✅ Security (validation, CORS, parameterized queries)
- ✅ Maintainability (clear separation of concerns)
- ✅ Extensibility (easy to add features)

**The magic**: CLIP's ability to understand semantic meaning enables fuzzy matching and cross-modal search that traditional keyword search cannot achieve! 🎉

