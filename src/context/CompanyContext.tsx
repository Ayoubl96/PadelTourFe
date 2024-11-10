// src/context/CompanyContext.tsx
import type { ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { getCompanyData } from '@/services/apiService'; // Funzione per ottenere i dati aziendali

interface CompanyData {
  id: number;
  login: string;
  name: string;
  address: string;
  email: string;
  phone_number: string;
  created_at: string;
}

interface CompanyContextType {
  companyData: CompanyData | null;
  isLoading: boolean;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

// Define the type for the props of the CompanyProvider component, including children
interface CompanyProviderProps {
  children: ReactNode;
}

export const CompanyProvider: React.FC<CompanyProviderProps> = ({
  children,
}) => {
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const result = await getCompanyData();
        if (result.success) {
          setCompanyData(result.data);
        } else {
          setCompanyData(null); // O gestisci l'errore a modo tuo
        }
      } catch (error) {
        setCompanyData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  return (
    <CompanyContext.Provider value={{ companyData, isLoading }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error(
      "useCompany deve essere usato all'interno di CompanyProvider",
    );
  }
  return context;
};
