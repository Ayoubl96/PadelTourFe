import React from 'react';

import { LoggedHeader } from '@/hero/LoggedHeader';

import { DashboardModule } from '../logged/DashboardModule';
import { Footer } from '../templates/Footer';

const Dashboard: React.FC = () => {
  return (
    <div className="text-gray-600 antialiased">
      <LoggedHeader />
      <DashboardModule />
      <Footer />
    </div>
  );
};

export default Dashboard;
