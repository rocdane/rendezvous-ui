import React from 'react';
import Image from 'next/image';
import { useAuth } from '../../contexts/AuthContext';

export const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center space-x-4">
          <Image
            className="h-12 w-12 rounded-full"
            src={user.avatar ?? '/default-avatar.png'}
            alt={user.name}
            width={48}
            height={48}
            style={{ borderRadius: '9999px' }}
          />
        <div>
          <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
          <p className="text-sm text-gray-500">{user.email}</p>
          <p className="text-xs text-gray-400 capitalize">
            Connecté via {user.provider}
          </p>
        </div>
      </div>
      
      <div className="mt-4">
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
};