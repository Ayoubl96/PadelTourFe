import React from 'react';

import LoginPage from '../subscribe/Login-module';
import { Footer } from '../templates/Footer';

const Login: React.FC = () => {
  return (
    <div className="text-gray-600 antialiased">
      <LoginPage />
      <Footer />
    </div>
  );
};

export default Login;
