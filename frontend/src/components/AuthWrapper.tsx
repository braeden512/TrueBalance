'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Navbar from './ui/navbar';
import Loading from './ui/loading';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  // if not authenticated, redirect immediately
  if (!isAuthenticated) {
    router.push('/login');
    return null; // nothing rendered while redirecting
  }

  // if authenticated, render the page
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
