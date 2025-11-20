import React from 'react';

export default function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="text-red-600 text-sm mt-2">{message}</div>
  );
}
