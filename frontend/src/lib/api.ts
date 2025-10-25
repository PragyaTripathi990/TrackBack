import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('auth-token');
      localStorage.removeItem('user-data');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Types
export interface Item {
  id: string;
  user_id: string;
  type: 'lost' | 'found';
  title: string;
  description: string;
  category?: string;
  location: string;
  date_lost_or_found: string;
  image_url?: string;
  status: 'active' | 'resolved' | 'expired';
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar_url?: string;
  };
  similarity_score?: number;
}

export interface SearchResult extends Item {
  similarity_score: number;
}

export interface CreateItemDto {
  user_id: string;
  type: 'lost' | 'found';
  title: string;
  description: string;
  category?: string;
  location: string;
  date_lost_or_found?: string;
  image_url?: string;
  contact_info?: Record<string, any>;
}

// API Functions

// Items
export const items = {
  getAll: (params?: {
    type?: 'lost' | 'found';
    status?: string;
    category?: string;
    location?: string;
    limit?: number;
    offset?: number;
  }) => api.get<{ success: boolean; data: Item[]; count: number }>('/items', { params }),

  getById: (id: string) => api.get<{ success: boolean; data: Item }>(`/items/${id}`),

  create: (data: CreateItemDto) => api.post<{ success: boolean; data: Item }>('/items', data),

  update: (id: string, data: Partial<Item>) =>
    api.patch<{ success: boolean; data: Item }>(`/items/${id}`, data),

  delete: (id: string) => api.delete<{ success: boolean }>(`/items/${id}`),

  getMatches: (id: string, threshold?: number) =>
    api.get<{ success: boolean; data: any[]; count: number }>(`/items/${id}/matches`, {
      params: { threshold },
    }),
};

// Search
export const search = {
  byText: (query: string, options?: { type?: 'lost' | 'found'; threshold?: number; limit?: number }) =>
    api.post<{ success: boolean; data: SearchResult[]; count: number }>('/search/text', {
      query,
      ...options,
    }),

  byImage: (imageUrl: string, options?: { type?: 'lost' | 'found'; threshold?: number; limit?: number }) =>
    api.post<{ success: boolean; data: SearchResult[]; count: number }>('/search/image', {
      image_url: imageUrl,
      ...options,
    }),

  hybrid: (params: {
    query?: string;
    image_url?: string;
    type?: 'lost' | 'found';
    threshold?: number;
    limit?: number;
  }) => api.post<{ success: boolean; data: SearchResult[]; count: number }>('/search/hybrid', params),

  getCategories: () => api.get<{ success: boolean; data: any[] }>('/search/categories'),
};

// Upload
export const upload = {
  image: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    return api.post<{
      success: boolean;
      data: { url: string; path: string; filename: string; size: number; mimetype: string };
    }>('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  deleteImage: (path: string) => api.delete('/upload/image', { data: { path } }),
};

// Users
export const users = {
  getAll: () => api.get<{ success: boolean; data: any[] }>('/users'),

  getById: (id: string) => api.get<{ success: boolean; data: any }>(`/users/${id}`),

  create: (data: { email: string; name: string; phone?: string; location?: string }) =>
    api.post<{ success: boolean; data: any }>('/users', data),

  update: (id: string, data: Partial<any>) =>
    api.patch<{ success: boolean; data: any }>(`/users/${id}`, data),

  getItems: (id: string, params?: { type?: 'lost' | 'found'; status?: string }) =>
    api.get<{ success: boolean; data: Item[]; count: number }>(`/users/${id}/items`, { params }),
};

export default api;

