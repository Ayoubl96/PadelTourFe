// src/logged/DashboardModule.tsx
import React from 'react';

import { useCompany } from '@/context/CompanyContext';
import { Section } from '@/layout/Section';

const DashboardModule: React.FC = () => {
  const { companyData, isLoading } = useCompany(); // Usa il context per ottenere i dati aziendali e il flag di caricamento

  if (isLoading) {
    return (
      <Section>
        <h1 className="h1 text-center">Hello</h1>
        <p className="mt-4 text-center">Caricamento dati aziendali...</p>
      </Section>
    );
  }

  return (
    <Section>
      <h1 className="h1 text-center">Hello</h1>
      {companyData ? (
        <div className="mt-4 text-center">
          <h2>{companyData.name}</h2>
          <p>{companyData.address}</p>
          <p>Email: {companyData.email}</p>
          <p>Phone: {companyData.phone_number}</p>
          <p>
            Member since:{' '}
            {new Date(companyData.created_at).toLocaleDateString()}
          </p>
        </div>
      ) : (
        <p className="mt-4 text-center">
          Errore nel caricamento dei dati aziendali
        </p>
      )}
    </Section>
  );
};

export { DashboardModule };
