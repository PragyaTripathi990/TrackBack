import React from 'react';
import { Search, Package, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HomePageProps {
  onNavigate: (page: 'lost' | 'found' | 'search') => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', position: 'relative' }}>
      {/* Hero Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '4rem 1rem',
        textAlign: 'center'
      }}>
        {/* Main Heading */}
        <div style={{
          marginBottom: '3rem',
          animation: 'fadeIn 0.8s ease-out'
        }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '800',
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: '1.2'
          }}>
            AI-Powered Lost & Found
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: '#cbd5e1',
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: '1.8'
          }}>
            Reuniting people with their belongings using advanced AI image recognition and semantic search
          </p>
        </div>

        {/* Authentication Notice */}
        {!isAuthenticated && (
          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '3rem',
            maxWidth: '600px',
            margin: '0 auto 3rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <AlertCircle size={24} style={{ color: '#60a5fa', flexShrink: 0 }} />
            <p style={{ color: '#93c5fd', textAlign: 'left', margin: 0 }}>
              <strong>Please sign in</strong> to report lost or found items and use AI search features
            </p>
          </div>
        )}

        {/* Main Action Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          maxWidth: '1000px',
          margin: '0 auto 4rem'
        }}>
          {/* Report Lost Item Card */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '1.5rem',
            padding: '2.5rem',
            transition: 'all 0.3s ease',
            cursor: isAuthenticated ? 'pointer' : 'not-allowed',
            opacity: isAuthenticated ? 1 : 0.6
          }}
          onClick={() => isAuthenticated && onNavigate('lost')}
          onMouseEnter={(e) => {
            if (isAuthenticated) {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(59, 130, 246, 0.3)';
              e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          }}>
            <div style={{
              width: '4rem',
              height: '4rem',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <Search size={32} color="white" />
            </div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: 'white',
              marginBottom: '1rem'
            }}>
              Report Lost Item
            </h2>
            <p style={{
              color: '#cbd5e1',
              fontSize: '1rem',
              lineHeight: '1.6',
              marginBottom: '1.5rem'
            }}>
              Upload photos and details of your lost item. Our AI will automatically search for matches.
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              color: '#60a5fa',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              <Sparkles size={16} />
              <span>AI-Powered Matching</span>
            </div>
          </div>

          {/* Report Found Item Card */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '1.5rem',
            padding: '2.5rem',
            transition: 'all 0.3s ease',
            cursor: isAuthenticated ? 'pointer' : 'not-allowed',
            opacity: isAuthenticated ? 1 : 0.6
          }}
          onClick={() => isAuthenticated && onNavigate('found')}
          onMouseEnter={(e) => {
            if (isAuthenticated) {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(139, 92, 246, 0.3)';
              e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.5)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          }}>
            <div style={{
              width: '4rem',
              height: '4rem',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <Package size={32} color="white" />
            </div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: 'white',
              marginBottom: '1rem'
            }}>
              Report Found Item
            </h2>
            <p style={{
              color: '#cbd5e1',
              fontSize: '1rem',
              lineHeight: '1.6',
              marginBottom: '1.5rem'
            }}>
              Found something? Upload it and help reunite items with their owners automatically.
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              color: '#a78bfa',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              <Sparkles size={16} />
              <span>Auto-Match Technology</span>
            </div>
          </div>

          {/* AI Search Card */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '1.5rem',
            padding: '2.5rem',
            transition: 'all 0.3s ease',
            cursor: isAuthenticated ? 'pointer' : 'not-allowed',
            opacity: isAuthenticated ? 1 : 0.6
          }}
          onClick={() => isAuthenticated && onNavigate('search')}
          onMouseEnter={(e) => {
            if (isAuthenticated) {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(236, 72, 153, 0.3)';
              e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 0.5)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          }}>
            <div style={{
              width: '4rem',
              height: '4rem',
              background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <Sparkles size={32} color="white" />
            </div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: 'white',
              marginBottom: '1rem'
            }}>
              AI Search
            </h2>
            <p style={{
              color: '#cbd5e1',
              fontSize: '1rem',
              lineHeight: '1.6',
              marginBottom: '1.5rem'
            }}>
              Search using text descriptions or upload an image. AI finds similar items across all reports.
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              color: '#f9a8d4',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              <Sparkles size={16} />
              <span>Image & Text Search</span>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '1.5rem',
          padding: '3rem 2rem',
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          <h3 style={{
            fontSize: '1.75rem',
            fontWeight: '700',
            color: 'white',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            How It Works
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            textAlign: 'left'
          }}>
            <div>
              <div style={{
                fontSize: '2rem',
                marginBottom: '0.5rem'
              }}>🔍</div>
              <h4 style={{
                color: '#60a5fa',
                fontWeight: '600',
                marginBottom: '0.5rem'
              }}>Smart AI Matching</h4>
              <p style={{
                color: '#cbd5e1',
                fontSize: '0.9rem',
                lineHeight: '1.6'
              }}>
                Our AI analyzes images and descriptions to find potential matches automatically
              </p>
            </div>
            <div>
              <div style={{
                fontSize: '2rem',
                marginBottom: '0.5rem'
              }}>🎯</div>
              <h4 style={{
                color: '#a78bfa',
                fontWeight: '600',
                marginBottom: '0.5rem'
              }}>Cross-Modal Search</h4>
              <p style={{
                color: '#cbd5e1',
                fontSize: '0.9rem',
                lineHeight: '1.6'
              }}>
                Search with text and find image matches, or vice versa - AI understands both
              </p>
            </div>
            <div>
              <div style={{
                fontSize: '2rem',
                marginBottom: '0.5rem'
              }}>⚡</div>
              <h4 style={{
                color: '#f9a8d4',
                fontWeight: '600',
                marginBottom: '0.5rem'
              }}>Instant Results</h4>
              <p style={{
                color: '#cbd5e1',
                fontSize: '0.9rem',
                lineHeight: '1.6'
              }}>
                Get similarity scores and ranked results in seconds using vector search
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
