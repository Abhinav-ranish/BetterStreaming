'use client';

import AuthForm from '@/components/AuthForm';
import FadeInWrapper from '@/components/FadeInWrapper';

export default function LoginPage() {
  return (
    <FadeInWrapper>
      <AuthForm mode="login" />
    </FadeInWrapper>
  );
}
