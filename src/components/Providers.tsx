'use client';

import { SessionProvider } from 'next-auth/react';
import { CineVerseProvider } from '@/lib/store';
import { ToastProvider } from '@/components/ui/Toast';

export function Providers({ 
  children,
  initialData
}: { 
  children: React.ReactNode,
  initialData: any
}) {
  return (
    <SessionProvider>
      <CineVerseProvider initialData={initialData}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </CineVerseProvider>
    </SessionProvider>
  );
}
