import { jwtDecode } from 'jwt-decode';
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

interface DecodedToken {
  exp?: number; // Rendi 'exp' opzionale
  // Altre proprietà del token se necessario
}

const DashboardModule: React.FC = () => {
  const router = useRouter();

  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType] = useState<'success' | 'error'>('success');
  const [token, setToken] = useState<string | null>(null);

  const errorMessage = "C'è stato un problema con la tua richiesta, riprova";

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
    setTimeout(() => setSnackbarVisible(false), 3000); // Nasconde la snackbar dopo 3 secondi
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');

    if (!storedToken) {
      // Se non esiste un token, fai il redirect a /login
      router.push('/login');
      return;
    }

    try {
      const decodedToken = jwtDecode<DecodedToken>(storedToken); // Decodifica il token
      const currentTime = Date.now() / 1000; // Ottieni il tempo attuale in secondi

      if (decodedToken.exp === undefined || decodedToken.exp < currentTime) {
        // Se 'exp' non è definito o se il token è scaduto, rimuovilo e fai il redirect a /login
        localStorage.removeItem('token');
        showSnackbar(
          'La tua sessione è scaduta, per favore effettua nuovamente il login.',
        );
        router.push('/login');
      } else {
        // Se il token è valido e non è scaduto, vai avanti
        setToken(storedToken); // Imposta il token nello stato, se necessario
      }
    } catch (error) {
      router.push('/login');
    }
  }, [router]);

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
          showSnackbar('Dati aziendali caricati con successo!');
        } else {
          showSnackbar(data.message || errorMessage);
        }
      } catch (error) {
        showSnackbar(errorMessage);
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
