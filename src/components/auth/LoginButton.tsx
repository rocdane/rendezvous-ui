import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Provider } from '../../services/authService';

interface LoginButtonProps {
  provider: Provider;
  className?: string;
  children: React.ReactNode;
}

export const LoginButton: React.FC<LoginButtonProps> = ({ 
  provider, 
  className = '', 
  children 
}) => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      await login(provider);
    } catch (error) {
      console.error(`Error logging in with ${provider}:`, error);
      alert(`Failed to login with ${provider}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogin}
      disabled={isLoading}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
        isLoading ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      {isLoading ? 'Connexion...' : children}
    </button>
  );
};