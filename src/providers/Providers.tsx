'use client';

import React from 'react';

import { DataProvider } from '@/providers/DataProvider';
import { AssessmentProvider } from '@/providers/AssessmentProvider';
import { AdminDataProvider } from './AdminDataProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DataProvider>
      <AssessmentProvider>
        <AdminDataProvider>{children}</AdminDataProvider>
      </AssessmentProvider>
    </DataProvider>
  );
}
