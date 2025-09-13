import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export const CallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const state = searchParams.get('state');

      if (error) {
        // Envoyer l'erreur à la fenêtre parent
        window.opener?.postMessage({
          type: 'SOCIAL_AUTH_ERROR',
          error: error
        }, window.location.origin);
        window.close();
      } else if (code) {
        // Envoyer le code d'autorisation à la fenêtre parent
        window.opener?.postMessage({
          type: 'SOCIAL_AUTH_SUCCESS',
          code: code,
          state: state
        }, window.location.origin);
        window.close();
      } else {
        // Cas d'erreur générique
        window.opener?.postMessage({
          type: 'SOCIAL_AUTH_ERROR',
          error: 'No authorization code received'
        }, window.location.origin);
        window.close();
      }
    };

    // Petite pause pour s'assurer que la page est prête
    const timer = setTimeout(handleCallback, 100);
    
    return () => clearTimeout(timer);
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Authentification en cours...</p>
      </div>
    </div>
  );
};