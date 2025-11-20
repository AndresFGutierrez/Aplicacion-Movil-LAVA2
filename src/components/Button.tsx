import React from 'react';

export default function Button({ children, onClick, disabled = false, className = '' }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; className?: string; }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded bg-black text-white disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}
