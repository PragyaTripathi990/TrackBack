import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  location?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; message: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (token: string, password: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to generate UUID v4
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Mock API functions - replace with actual API calls
const mockApi = {
  login: async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check localStorage for existing users
    const usersData = localStorage.getItem('registered-users');
    const users = usersData ? JSON.parse(usersData) : [];
    
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      return { success: true, user: userWithoutPassword, token: 'mock-jwt-token' };
    }
    
    // Demo user fallback
    if (email === 'demo@example.com' && password === 'password123') {
      const user = {
        id: generateUUID(),
        email: 'demo@example.com',
        name: 'Demo User',
        avatar: 'https://via.placeholder.com/150/667eea/ffffff?text=DU',
        phone: '+1234567890',
        location: 'New York, NY'
      };
      return { success: true, user, token: 'mock-jwt-token' };
    }
    return { success: false, message: 'Invalid email or password' };
  },
  
  register: async (name: string, email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get existing users
    const usersData = localStorage.getItem('registered-users');
    const users = usersData ? JSON.parse(usersData) : [];
    
    // Check if email exists
    if (users.some((u: any) => u.email === email)) {
      return { success: false, message: 'Email already exists' };
    }
    
    // Create new user with proper UUID
    const newUser = {
      id: generateUUID(), // ✅ FIXED: Use proper UUID instead of timestamp
      email,
      name,
      password, // Store password (in production, this would be hashed on backend)
      avatar: `https://via.placeholder.com/150/667eea/ffffff?text=${name.charAt(0).toUpperCase()}`,
      phone: '',
      location: ''
    };
    
    // Save to localStorage
    users.push(newUser);
    localStorage.setItem('registered-users', JSON.stringify(users));
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    return { success: true, user: userWithoutPassword, token: 'mock-jwt-token' };
  },
  
  forgotPassword: async (email: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, message: 'Password reset link sent to your email' };
  },
  
  resetPassword: async (token: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, message: 'Password reset successfully' };
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    const token = Cookies.get('auth-token');
    const userData = localStorage.getItem('user-data');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        Cookies.remove('auth-token');
        localStorage.removeItem('user-data');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await mockApi.login(email, password);
      
      if (response.success) {
        setUser(response.user);
        Cookies.set('auth-token', response.token, { expires: 7 }); // 7 days
        localStorage.setItem('user-data', JSON.stringify(response.user));
        return { success: true, message: 'Login successful' };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      return { success: false, message: 'Login failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, confirmPassword: string) => {
    try {
      if (password !== confirmPassword) {
        return { success: false, message: 'Passwords do not match' };
      }
      
      if (password.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters' };
      }
      
      setIsLoading(true);
      const response = await mockApi.register(name, email, password);
      
      if (response.success) {
        setUser(response.user);
        Cookies.set('auth-token', response.token, { expires: 7 });
        localStorage.setItem('user-data', JSON.stringify(response.user));
        return { success: true, message: 'Registration successful' };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      return { success: false, message: 'Registration failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    Cookies.remove('auth-token');
    localStorage.removeItem('user-data');
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      if (!user) return { success: false, message: 'Not authenticated' };
      
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('user-data', JSON.stringify(updatedUser));
      return { success: true, message: 'Profile updated successfully' };
    } catch (error) {
      return { success: false, message: 'Failed to update profile' };
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const response = await mockApi.forgotPassword(email);
      return response;
    } catch (error) {
      return { success: false, message: 'Failed to send reset email' };
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      const response = await mockApi.resetPassword(token, password);
      return response;
    } catch (error) {
      return { success: false, message: 'Failed to reset password' };
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    forgotPassword,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

