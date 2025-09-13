'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/stores/auth';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { checkAuth } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      if (error) {
        toast.error(`Erreur d'authentification: ${error}`);
        router.push('/auth/login');
        return;
      }

      if (token) {
        apiClient.setToken(token);
        await checkAuth();
        toast.success('Connexion réussie !');
        router.push('/dashboard');
      } else {
        toast.error('Token manquant');
        router.push('/auth/login');
      }
    };

    handleCallback();
  }, [searchParams, router, checkAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-secondary-600">Connexion en cours...</p>
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <CallbackContent />
    </Suspense>
  );
}