import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ThemeToggle from './components/ThemeToggle';
import AuthModal from './components/auth/AuthModal';
import HomePage from './components/HomePage';
import LostPage from './components/LostPage';
import FoundPage from './components/FoundPage';
import SearchPage from './components/SearchPage';
import { User, LogOut, Menu, X } from 'lucide-react';
import './App.css';

type Page = 'home' | 'lost' | 'found' | 'search';

function AppContent() {
  const { isAuthenticated, user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    setShowMobileMenu(false);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    setCurrentPage('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'lost':
        return <LostPage onBack={() => setCurrentPage('home')} />;
      case 'found':
        return <FoundPage onBack={() => setCurrentPage('home')} />;
      case 'search':
        return <SearchPage onBack={() => setCurrentPage('home')} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      color: '#f1f5f9'
    }}>
      {/* Animated Background */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', zIndex: 0 }}>
        <div style={{
          position: 'absolute',
          top: '-10rem',
          right: '-10rem',
          width: '20rem',
          height: '20rem',
          background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'pulse 4s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-10rem',
          left: '-10rem',
          width: '20rem',
          height: '20rem',
          background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'pulse 4s ease-in-out infinite',
          animationDelay: '2s'
        }}></div>
      </div>

      {/* Header */}
      <header style={{
        position: 'relative',
        zIndex: 10,
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Logo */}
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              cursor: 'pointer'
            }} onClick={() => setCurrentPage('home')}>
              Lost & Found
            </h1>

            {/* Desktop Navigation */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="hidden md:flex">
              <button
                onClick={() => handleNavigate('home')}
                style={{
                  color: currentPage === 'home' ? '#60a5fa' : '#d1d5db',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#f1f5f9'}
                onMouseLeave={(e) => e.currentTarget.style.color = currentPage === 'home' ? '#60a5fa' : '#d1d5db'}
              >
                Home
              </button>
              <button
                onClick={() => handleNavigate('lost')}
                style={{
                  color: currentPage === 'lost' ? '#60a5fa' : '#d1d5db',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#f1f5f9'}
                onMouseLeave={(e) => e.currentTarget.style.color = currentPage === 'lost' ? '#60a5fa' : '#d1d5db'}
              >
                Report Lost
              </button>
              <button
                onClick={() => handleNavigate('found')}
                style={{
                  color: currentPage === 'found' ? '#60a5fa' : '#d1d5db',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#f1f5f9'}
                onMouseLeave={(e) => e.currentTarget.style.color = currentPage === 'found' ? '#60a5fa' : '#d1d5db'}
              >
                Report Found
              </button>
              <button
                onClick={() => handleNavigate('search')}
                style={{
                  color: currentPage === 'search' ? '#60a5fa' : '#d1d5db',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#f1f5f9'}
                onMouseLeave={(e) => e.currentTarget.style.color = currentPage === 'search' ? '#60a5fa' : '#d1d5db'}
              >
                AI Search
              </button>
            </nav>

            {/* Auth Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <ThemeToggle />
              
              {isAuthenticated && user ? (
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: 'none',
                      border: 'none',
                      color: '#d1d5db',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{
                      width: '2rem',
                      height: '2rem',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}>
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="hidden md:block">{user.name}</span>
                  </button>

                  {showUserMenu && (
                    <div style={{
                      position: 'absolute',
                      right: 0,
                      top: '100%',
                      marginTop: '0.5rem',
                      width: '12rem',
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '0.5rem',
                      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                      zIndex: 50
                    }}>
                      <div style={{ padding: '0.5rem 0' }}>
                        <button
                          onClick={() => {
                            setShowAuthModal(true);
                            setShowUserMenu(false);
                          }}
                          style={{
                            width: '100%',
                            padding: '0.5rem 1rem',
                            textAlign: 'left',
                            color: '#d1d5db',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                        >
                          <User size={16} />
                          Profile
                        </button>
                        <button
                          onClick={handleLogout}
                          style={{
                            width: '100%',
                            padding: '0.5rem 1rem',
                            textAlign: 'left',
                            color: '#ef4444',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    color: 'white',
                    padding: '0.5rem 1.5rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '0.875rem',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.3)';
                  }}
                >
                  Sign In
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#d1d5db',
                  cursor: 'pointer'
                }}
              >
                {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden" style={{
              marginTop: '1rem',
              paddingTop: '1rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  onClick={() => handleNavigate('home')}
                  style={{
                    padding: '0.75rem',
                    textAlign: 'left',
                    background: currentPage === 'home' ? 'rgba(96, 165, 250, 0.1)' : 'none',
                    border: 'none',
                    color: currentPage === 'home' ? '#60a5fa' : '#d1d5db',
                    cursor: 'pointer',
                    borderRadius: '0.5rem'
                  }}
                >
                  Home
                </button>
                <button
                  onClick={() => handleNavigate('lost')}
                  style={{
                    padding: '0.75rem',
                    textAlign: 'left',
                    background: currentPage === 'lost' ? 'rgba(96, 165, 250, 0.1)' : 'none',
                    border: 'none',
                    color: currentPage === 'lost' ? '#60a5fa' : '#d1d5db',
                    cursor: 'pointer',
                    borderRadius: '0.5rem'
                  }}
                >
                  Report Lost
                </button>
                <button
                  onClick={() => handleNavigate('found')}
                  style={{
                    padding: '0.75rem',
                    textAlign: 'left',
                    background: currentPage === 'found' ? 'rgba(96, 165, 250, 0.1)' : 'none',
                    border: 'none',
                    color: currentPage === 'found' ? '#60a5fa' : '#d1d5db',
                    cursor: 'pointer',
                    borderRadius: '0.5rem'
                  }}
                >
                  Report Found
                </button>
                <button
                  onClick={() => handleNavigate('search')}
                  style={{
                    padding: '0.75rem',
                    textAlign: 'left',
                    background: currentPage === 'search' ? 'rgba(96, 165, 250, 0.1)' : 'none',
                    border: 'none',
                    color: currentPage === 'search' ? '#60a5fa' : '#d1d5db',
                    cursor: 'pointer',
                    borderRadius: '0.5rem'
                  }}
                >
                  AI Search
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main style={{ position: 'relative', zIndex: 1 }}>
        {renderPage()}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={isAuthenticated ? 'profile' : 'login'}
      />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
