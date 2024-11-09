import React from 'react';

import { LoginModule } from '@/subscribe/Login-module';

import { Footer } from '../templates/Footer';

const Login: React.FC = () => {
  return (
    <div className="text-gray-600 antialiased">
      <LoginModule />
      <Footer />
    </div>
  );
};

export default Login;