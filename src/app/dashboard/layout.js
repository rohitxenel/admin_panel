// src/app/dashboard/layout.js
'use client';
import AppLayout from '@/components/layout/AppLayout';
import ProtectedRoute from '../../components/layout/ProtectedRoute';


export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      <AppLayout>
        {children}
      </AppLayout>
    </ProtectedRoute>
  );
}