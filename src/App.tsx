import React, { useEffect } from 'react';
import AppNavigator from './navigation/AppNavigator';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  useEffect(() => {
    const onError = (e: ErrorEvent) => {
      console.error('Error global:', e.message, e.filename, e.lineno, e.colno);
    };
    window.addEventListener('error', onError);

    return () => {
      window.removeEventListener('error', onError);
    };
  }, []);

  return (
    <AuthProvider>
      <div style={{ minHeight: '100vh', backgroundColor: '#f0f0f0' }}>
        <AppNavigator />
      </div>
    </AuthProvider>
  );
}
