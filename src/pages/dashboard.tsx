import React from 'react';

import { DashboardModule } from '../logged/DashboardModule';
import { Footer } from '../templates/Footer';

const Dashboard: React.FC = () => {
  return (
    <div className="text-gray-600 antialiased">
      <DashboardModule />
      <Footer />
    </div>
  );
};

export default Dashboard;
