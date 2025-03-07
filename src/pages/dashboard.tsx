// src/pages/Dashboard.tsx
import React from 'react';

import { CompanyProvider } from '@/context/CompanyContext';
import { LoggedHeader } from '@/hero/LoggedHeader';

import { DashboardModule } from '../logged/DashboardModule';
import { Footer } from '../templates/Footer';

const Dashboard: React.FC = () => {
  return (
    <CompanyProvider>
      <div className="text-gray-600 antialiased">
        <LoggedHeader />
        <DashboardModule />
        <Footer />
      </div>
    </CompanyProvider>
  );
};

export default Dashboard;
