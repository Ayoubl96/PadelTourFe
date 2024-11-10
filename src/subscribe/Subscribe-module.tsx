import Link from 'next/link';
import { useRouter } from 'next/router';
import type { ChangeEvent, FormEvent } from 'react';
import React, { useState } from 'react';

import { Section } from '@/layout/Section';

import Snackbar from '../templates/Snackbar';

const SubscribeModule: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [phoneNumber, setNumber] = useState<string>('');
  const [address, setAddress] = useState<string>('');

  const router = useRouter();

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const errorMessage =
    "C'è stato un problema con la tua registrazione, riprova";
  const errorMessagePassword = 'Passwords do not match!';

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
    setTimeout(() => setSnackbarVisible(false), 3000); // Nasconde la snackbar dopo 3 secondi
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showSnackbar(errorMessagePassword);
      return;
    }

    try {
      const response = await fetch(
        'http://localhost:8000/companies/submit-registration/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password,
            phone_number: phoneNumber,
            name,
            address,
          }),
        },
      );
      const data = await response.json();
      if (response.ok) {
        showSnackbar('Account creato con successo!');
        setTimeout(() => {
          router.push('/subscribe/thank-you'); // Reindirizzamento alla pagina di ringraziamento
        }, 1500);
      } else {
        showSnackbar(data.message[0].messages[0].message);
      }
    } catch (error) {
      showSnackbar(errorMessage);
    }
  };

  return (
    <Section>
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="w-full max-w-md rounded bg-white p-6 shadow-md">
          <h2 className="mb-6 text-center text-2xl font-bold">Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Fullname</label>
              <input
                type="text"
                className="w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={name}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Phone Number</label>
              <input
                type="phone-number"
                className="w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={phoneNumber}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setNumber(e.target.value)
                }
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Address</label>
              <input
                type="text"
                className="w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={address}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setAddress(e.target.value)
                }
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email Address</label>
              <input
                type="email"
                className="w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                className="w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Confirm Password</label>
              <input
                type="password"
                className="w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={confirmPassword}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setConfirmPassword(e.target.value)
                }
                required
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-blue-500 py-2 text-white transition duration-300 hover:bg-blue-600"
            >
              Sign Up
            </button>
          </form>
          <div className="mt-4 text-center">
            <Link href="/login" className="text-blue-500">
              Already have an account? Sign In
            </Link>
          </div>
        </div>
      </div>
      {/* Snackbar component */}
      {snackbarVisible && (
        <Snackbar message={snackbarMessage} show={snackbarVisible} />
      )}
    </Section>
  );
};

export { SubscribeModule };
