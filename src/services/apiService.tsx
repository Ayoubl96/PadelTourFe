const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const apiFetch = async (
  endpoint: string,
  method: string,
  body: object = {},
  contentType: string = 'application/json',
  token: string | null = null, // Parametro per il token Bearer
) => {
  const headers: HeadersInit = {
    Accept: 'application/json',
    'Content-Type': contentType,
  };

  // Se è presente un token, aggiungilo nell'intestazione Authorization
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let bodyEncoded: string | undefined; // Per il corpo della richiesta, per GET non sarà usato

  // Se non è una GET, prepara il corpo della richiesta
  if (method !== 'GET') {
    if (contentType === 'application/x-www-form-urlencoded') {
      const formBody: Record<string, string> = body as Record<string, string>;
      bodyEncoded = new URLSearchParams(formBody).toString();
    } else {
      bodyEncoded = JSON.stringify(body);
    }
  }

  const requestOptions: RequestInit = {
    method,
    headers,
    body: bodyEncoded, // Solo per metodi che richiedono un body
  };

  const response = await fetch(`${apiUrl}${endpoint}`, requestOptions);
  return response;
};

// Funzione per il login
export const loginUser = async (username: string, password: string) => {
  try {
    const response = await apiFetch(
      '/login',
      'POST',
      { username, password },
      'application/x-www-form-urlencoded',
    );

    if (response.status === 200) {
      const data = await response.json();
      return { success: true, data }; // Successo
    }

    if (response.status === 403) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.message || 'Credenziali errate';
      return { success: false, error: errorMessage }; // Credenziali errate
    }

    // Errore generico
    const errorData = await response.json().catch(() => null);
    const errorMessage =
      errorData?.message || 'Si è verificato un errore, riprova.';
    return { success: false, error: errorMessage }; // Errore generico
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Errore nella chiamata, riprova',
    };
  }
};

// Funzione per ottenere i dati dell'azienda
export const getCompanyData = async () => {
  const token = localStorage.getItem('token'); // Recupera il token dal localStorage
  if (!token) {
    return { success: false, error: 'Token non trovato' }; // Se il token non è presente
  }

  try {
    const response = await apiFetch(
      '/companies/me/', // Endpoint per ottenere i dati dell'azienda
      'GET', // Metodo GET senza corpo
      {}, // Corpo vuoto, non necessario per GET
      'application/json', // Content-Type JSON
      token, // Aggiungi il token Bearer nell'intestazione
    );

    if (response.status === 200) {
      const data = await response.json();
      return { success: true, data }; // Successo
    }

    // Gestione degli errori specifici per lo status
    if (response.status === 403) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.message || 'Accesso non autorizzato';
      return { success: false, error: errorMessage }; // Accesso non autorizzato
    }

    // Errore generico
    const errorData = await response.json().catch(() => null);
    const errorMessage =
      errorData?.message || 'Si è verificato un errore, riprova.';
    return { success: false, error: errorMessage }; // Errore generico
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Errore nella chiamata, riprova',
    };
  }
};
