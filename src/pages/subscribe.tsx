import React from 'react';

import { SubscribeModule } from '@/subscribe/Subscribe-module';

import { Footer } from '../templates/Footer';

const Subscribe: React.FC = () => {
  return (
    <div className="text-gray-600 antialiased">
      <SubscribeModule />
      <Footer />
    </div>
  );
};

export default Subscribe;
