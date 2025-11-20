import React from 'react';

export default function SuccessMessage({ mensaje }: { mensaje: string }) {
  return (
    <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded mb-3">
      {mensaje}
    </div>
  );
}
