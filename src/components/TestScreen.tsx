import React from 'react';

export default function TestScreen() {
  console.log('TestScreen renderizado');
  return (
    <div style={{ padding: 20, backgroundColor: 'lightblue', minHeight: '100vh' }}>
      <h1>🎉 Prueba Exitosa</h1>
      <p>Si ves esto, el frontend está funcionando.</p>
      <p>Ruta actual: {typeof window !== 'undefined' ? window.location.pathname : ''}</p>
    </div>
  );
}
