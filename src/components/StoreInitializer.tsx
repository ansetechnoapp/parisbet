'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/lib/store';

export default function StoreInitializer() {
  const { initialized, loadUser } = useUserStore();
  
  useEffect(() => {
    if (!initialized) {
      loadUser();
    }
  }, [initialized, loadUser]);
  
  return null;
} 