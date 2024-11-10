// pages/login.tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { loginUser } from '../services/apiService';
import Snackbar from '../templates/Snackbar';
import { verifyToken } from '../utils/tokenUtils';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarTimeout, setSnackbarTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const isTokenValid = verifyToken(token);
      if (isTokenValid) {
        router.push('/dashboard');
      } else {
        localStorage.removeItem('token');
      }
    }
  }, []);

  const showErrorSnackbar = () => {
    if (snackbarTimeout) {
      clearTimeout(snackbarTimeout);
    }

    setShowSnackbar(true);
    const timeout = setTimeout(() => setShowSnackbar(false), 3000);
    setSnackbarTimeout(timeout);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await loginUser(username, password);

    if (result.success && result.data?.access_token) {
      // Salva il token e reindirizza alla dashboard
      localStorage.setItem('token', result.data.access_token);
      router.push('/dashboard');
    } else {
      // Mostra il messaggio di errore
      setErrorMessage(result.error || 'Login failed');
      showErrorSnackbar();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-96 rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-center text-2xl font-bold">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              Username
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-lg border border-gray-300 p-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="mt-1 w-full rounded-lg border border-gray-300 p-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-500 py-2 text-white"
          >
            Login
          </button>
        </form>
      </div>
      <Snackbar message={errorMessage} show={showSnackbar} />
    </div>
  );
};

export default LoginPage;
