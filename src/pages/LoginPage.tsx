import React, { useState } from 'react';
import { LoginForm } from '../components/users/LoginForm';
import { RegisterForm } from '../components/users/RegisterForm';

export const LoginPage: React.FC = () => {
  const [showRegister, setShowRegister] = useState(false);

  return showRegister ? (
    <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
  ) : (
    <LoginForm onSwitchToRegister={() => setShowRegister(true)} />
  );
};