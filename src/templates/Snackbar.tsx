// Snackbar.tsx
import { useEffect, useState } from 'react';

interface SnackbarProps {
  message: string;
  show: boolean;
}

const Snackbar: React.FC<SnackbarProps> = ({ message, show }) => {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setVisible(true);
      setTimeout(() => setVisible(false), 3000);
    }
  }, [show]);

  return visible ? (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 rounded-lg bg-red-600 px-4 py-2 text-white shadow-lg">
      {message}
    </div>
  ) : null;
};

export default Snackbar;
