import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { Section } from '@/layout/Section';

interface CompanyData {
  id: number;
  login: string;
  name: string;
  address: string;
  email: string;
  phone_number: string;
  created_at: string;
}

const DashboardModule: React.FC = () => {
  const router = useRouter();

  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>(
    'success',
  );
  const [token, setToken] = useState<string | null>(null);

  const errorMessage = "C'è stato un problema con la tua richiesta, riprova";

  const showSnackbar = (message: string, type: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarVisible(true);
    setTimeout(() => setSnackbarVisible(false), 3000); // Nasconde la snackbar dopo 3 secondi
  };

  useEffect(() => {
    // Verifica che il codice venga eseguito solo lato client
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      router.push('/login'); // Reindirizza alla pagina di login se il token non è presente
    } else {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchCompanyData = async () => {
      try {
        const response = await fetch('http://localhost:8000/companies/me/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setCompanyData(data); // Salva i dati dell'azienda nello stato
          showSnackbar('Dati aziendali caricati con successo!', 'success');
        } else {
          showSnackbar(data.message || errorMessage, 'error');
        }
      } catch (error) {
        showSnackbar(errorMessage, 'error');
      }
    };

    fetchCompanyData(); // Esegue la chiamata API quando il token è disponibile
  }, [token]); // Effettua la chiamata solo quando `token` è stato impostato

  return (
    <Section>
      {/* Snackbar */}
      {snackbarVisible && (
        <div className={`snackbar ${snackbarType}`}>{snackbarMessage}</div>
      )}

      {/* Render dei dati dell'azienda */}
      {companyData && (
        <div className="company-info">
          <h2>Informazioni Azienda</h2>
          <p>
            <strong>ID:</strong> {companyData.id}
          </p>
          <p>
            <strong>Login:</strong> {companyData.login}
          </p>
          <p>
            <strong>Nome:</strong> {companyData.name}
          </p>
          <p>
            <strong>Indirizzo:</strong> {companyData.address}
          </p>
          <p>
            <strong>Email:</strong> {companyData.email}
          </p>
          <p>
            <strong>Numero di Telefono:</strong> {companyData.phone_number}
          </p>
          <p>
            <strong>Data di Creazione:</strong>{' '}
            {new Date(companyData.created_at).toLocaleDateString()}
          </p>
        </div>
      )}
    </Section>
  );
};

export { DashboardModule };
