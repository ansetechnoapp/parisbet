'use client';

import { Suspense } from 'react';
import { FaSpinner } from 'react-icons/fa';
import LoginForm from '../../../components/LoginForm';

export default function LoginPage() {
  return (
    <div className="login-page-container">
      <Suspense fallback={
        <div className="flex h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <FaSpinner className="animate-spin text-green-600 h-12 w-12 mx-auto" />
            <p className="mt-4 text-gray-600 font-medium">Chargement...</p>
          </div>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
