'use client';

import AuthForm from '@/components/AuthForm';
import FadeInWrapper from '@/components/FadeInWrapper';

export default function RegisterPage() {
  return (
    <FadeInWrapper>
      <AuthForm mode="register" />
    </FadeInWrapper>
  );
}
