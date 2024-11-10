export const verifyToken = (token: string | undefined) => {
  if (!token) {
    return false; // If the token is undefined or empty, return false
  }

  try {
    const parts = token.split('.');
    if (parts.length !== 3 || !parts[1]) {
      return false; // Invalid JWT token format or missing payload
    }

    const decodedToken = JSON.parse(atob(parts[1])); // Decodifica il JWT
    return decodedToken.exp > Date.now() / 1000; // Verifica se il token è scaduto
  } catch (error) {
    return false; // Se non si può decodificare il token, consideriamolo non valido
  }
};
