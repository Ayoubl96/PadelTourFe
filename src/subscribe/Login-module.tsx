import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/router';
import type { ChangeEvent, FormEvent } from 'react';
import React, { useEffect, useState } from 'react';

import { Section } from '@/layout/Section';
import { Snackbar } from '@/templates/Snackbar';

interface DecodedToken {
  exp: number; // Timestamp di scadenza del token
}

const LoginModule: React.FC = () => {
  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const router = useRouter();

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const errorMessage =
    "C'è stato un problema con la tua registrazione, riprova";

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
    setTimeout(() => setSnackbarVisible(false), 3000); // Nasconde la snackbar dopo 3 secondi
  };

  const formData = new URLSearchParams();
  formData.append('username', login);
  formData.append('password', password);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: DecodedToken = jwtDecode(token); // Assicurati che questa riga funzioni
        const currentTime = Date.now() / 1000; // Ottieni il tempo attuale in secondi
        if (decodedToken.exp < currentTime) {
          localStorage.removeItem('token'); // Rimuovi il token
          showSnackbar(
            'La tua sessione è scaduta, per favore effettua nuovamente il login.',
          );
          router.push('/login');
        } else {
          router.push('/dashboard'); // Reindirizzamento alla dashboard se il token è valido
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Errore nella decodifica del token:', error);
      }
    }
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });
      const data = await response.json();
      if (response.ok) {
        showSnackbar('Account creato con successo!');
        localStorage.setItem('token', data.access_token); // Assicurati che il token includa le informazioni sulla scadenza
        setTimeout(() => {
          router.push('/dashboard'); // Reindirizzamento alla pagina di dashboard
        }, 1000);
      } else {
        showSnackbar(data.message[0].messages[0].message);
      }
    } catch (error) {
      showSnackbar(errorMessage);
    }
  };

  return (
    <Section>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="login"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="login"
                  name="login"
                  type="text"
                  required
                  autoComplete="login"
                  value={login}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setLogin(e.target.value)
                  }
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Not a member?{' '}
            <a
              href="#"
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Start a 14 day free trial
            </a>
          </p>
        </div>
      </div>
      {snackbarVisible && <Snackbar title={snackbarMessage} />}
    </Section>
  );
};

export { LoginModule };
