'use client';

import { Suspense } from 'react';
import LoginForm from '../../../component/LoginForm';

export default function LoginPage() {
  return (
    <div className="login-page-container">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
