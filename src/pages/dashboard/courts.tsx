// pages/index.tsx

import React, { useEffect, useState } from 'react';

import { LoggedHeader } from '@/hero/LoggedHeader';
import CourtList from '@/logged/CourtsList';
import { Footer } from '@/templates/Footer';

interface Field {
  name: string;
  images: string[];
}

const Court: React.FC = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFields = async () => {
      const token = localStorage.getItem('token'); // Recupera il token dal local storage
      if (!token) {
        setError('Token non trovato. Effettua il login.');
        return;
      }

      try {
        const res = await fetch('http://localhost:8000/court/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Errore nel recupero dei dati.');
        }

        const data: Field[] = await res.json();
        setFields(data);
        // eslint-disable-next-line @typescript-eslint/no-shadow
      } catch (error) {
        setError('Impossibile recuperare i campi.');
      }
    };

    fetchFields();
  }, []);

  return (
    <div className="text-gray-600 antialiased">
      <LoggedHeader />
      {error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <CourtList fields={fields} />
      )}
      <Footer />
    </div>
  );
};

export default Court;
