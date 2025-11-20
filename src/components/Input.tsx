import React from 'react';

export default function Input({ value, onChange, placeholder = '', type = 'text', error }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string; error?: string | null }) {
  return (
    <div className="flex flex-col">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        type={type}
        className="p-3 border rounded"
      />
      {error && <div className="text-sm text-red-600 mt-1">{error}</div>}
    </div>
  );
}
