import {
  Disclosure,
  DisclosureButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { jwtDecode } from 'jwt-decode';
import router from 'next/router';
import React, { useEffect, useState } from 'react';

import Snackbar from '../templates/Snackbar'; // Importa il componente Snackbar

const navigation = [
  { name: 'Dashboard', href: '/dashboard/' },
  { name: 'Court', href: '/dashboard/courts/' },
  { name: 'Tournament', href: '#' },
  { name: 'Players', href: '#' },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface DecodedToken {
  exp?: number; // Rendi 'exp' opzionale
  // Altre proprietà del token se necessario
}

const LoggedHeader = () => {
  const [currentPath, setCurrentPath] = useState<string>('');
  const [isClient, setIsClient] = useState<boolean>(false); // Stato per determinare se siamo lato client
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false); // Stato per la visibilità della snackbar
  const [snackbarMessage, setSnackbarMessage] = useState<string>(''); // Messaggio della snackbar

  const checkToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const decodedToken = jwtDecode<DecodedToken>(token); // Decodifica il token
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp === undefined || currentTime > decodedToken.exp) {
        // Se il token è scaduto, fai il redirect al login
        localStorage.removeItem('token'); // Rimuovi il token scaduto
        setSnackbarMessage('Token scaduto. Effettua il login.');
        setShowSnackbar(true);
        router.push('/login');
      }
    } catch (error) {
      // Se si verifica un errore durante il decodificare il token
      setSnackbarMessage('Errore, ricarica pagina');
      setShowSnackbar(true);
    }
  };

  useEffect(() => {
    setIsClient(true); // Indica che siamo nel client, non nel server

    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname); // Aggiorna il percorso attuale
    };

    // Impostiamo il percorso corrente solo se siamo nel client
    if (isClient) {
      checkToken();
      setCurrentPath(window.location.pathname);
    }

    window.addEventListener('popstate', handleLocationChange); // Ascolta cambiamenti nel percorso
    return () => {
      window.removeEventListener('popstate', handleLocationChange); // Pulizia dell'event listener
    };
  }, [isClient]); // Dipendenza su `isClient` per attivarsi solo quando il DOM è pronto

  // Non renderizzare nulla finché non siamo nel client
  if (!isClient) {
    return null;
  }

  return (
    <>
      {/* Mostra la snackbar se necessario */}
      <Snackbar message={snackbarMessage} show={showSnackbar} />

      <Disclosure as="nav" className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon
                  aria-hidden="true"
                  className="block size-6 group-data-[open]:hidden"
                />
                <XMarkIcon
                  aria-hidden="true"
                  className="hidden size-6 group-data-[open]:block"
                />
              </DisclosureButton>
            </div>
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex shrink-0 items-center">
                <img
                  alt="Your Company"
                  src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"
                  className="h-8 w-auto"
                />
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      aria-current={
                        currentPath === item.href ? 'page' : undefined
                      }
                      className={classNames(
                        currentPath === item.href
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'rounded-md px-3 py-2 text-sm font-medium',
                      )}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <button
                type="button"
                className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                <span className="absolute -inset-1.5" />
                <span className="sr-only">View notifications</span>
                <BellIcon aria-hidden="true" className="size-6" />
              </button>
              <Menu as="div" className="relative ml-3">
                <div>
                  <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <img
                      alt=""
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      className="size-8 rounded-full"
                    />
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                    >
                      Your Profile
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                    >
                      Settings
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                    >
                      Sign out
                    </a>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </div>
        </div>
      </Disclosure>
    </>
  );
};

export { LoggedHeader };
