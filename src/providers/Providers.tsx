'use client';

import React from 'react';

import QueryProvider from '@/providers/QueryProvider';
import { DataProvider } from '@/providers/DataProvider';
import { AssessmentProvider } from '@/providers/AssessmentProvider';
import { AdminDataProvider } from './AdminDataProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <DataProvider>
        <AssessmentProvider>
          <AdminDataProvider>{children}</AdminDataProvider>
        </AssessmentProvider>
      </DataProvider>
    </QueryProvider>
  );
}
