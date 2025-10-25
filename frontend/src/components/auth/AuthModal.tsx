import React, { useState } from 'react';
import { X } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import UserProfile from './UserProfile';
import { useAuth } from '../../contexts/AuthContext';

type AuthMode = 'login' | 'register' | 'forgot-password' | 'profile';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
}

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'login' 
}) => {
  const { isAuthenticated } = useAuth();
  const [currentMode, setCurrentMode] = useState<AuthMode>(
    isAuthenticated ? 'profile' : initialMode
  );

  React.useEffect(() => {
    if (isAuthenticated && currentMode !== 'profile') {
      setCurrentMode('profile');
    }
  }, [isAuthenticated, currentMode]);

  if (!isOpen) return null;

  const handleModeChange = (mode: AuthMode) => {
    setCurrentMode(mode);
  };

  const handleSuccess = () => {
    if (currentMode === 'login' || currentMode === 'register') {
      onClose();
    }
  };

  const renderContent = () => {
    switch (currentMode) {
      case 'login':
        return (
          <LoginForm
            onSuccess={handleSuccess}
            onSwitchToRegister={() => handleModeChange('register')}
            onSwitchToForgotPassword={() => handleModeChange('forgot-password')}
          />
        );
      case 'register':
        return (
          <RegisterForm
            onSuccess={handleSuccess}
            onSwitchToLogin={() => handleModeChange('login')}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPasswordForm
            onSuccess={handleSuccess}
            onBack={() => handleModeChange('login')}
          />
        );
      case 'profile':
        return <UserProfile onClose={onClose} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform transition-all">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute -top-4 -right-4 z-10 w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          {/* Content */}
          <div className="relative">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

