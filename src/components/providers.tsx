'use client';

import { useEffect } from 'react';
import { useAuth } from '@/stores/auth';

export function Providers({ children }: { children: React.ReactNode }) {
  const { initialize } = useAuth();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return <>{children}</>;
}