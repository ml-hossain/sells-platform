'use client';

import { useEffect } from 'react';
import { swManager } from '@/lib/service-worker';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    // Only register in production or when explicitly enabled
    const shouldRegister = process.env.NODE_ENV === 'production' || 
                          process.env.NEXT_PUBLIC_SW_ENABLED === 'true';

    if (shouldRegister && swManager.isServiceWorkerSupported()) {
      swManager.register().then((registration) => {
        // Registration successful
      }).catch((error) => {
        // Registration failed
      });
    }

    // Cleanup function
    return () => {
      // Any cleanup if needed
    };
  }, []);

  // This component doesn't render anything
  return null;
}
