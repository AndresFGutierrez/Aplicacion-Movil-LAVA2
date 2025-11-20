export const validarPlacaColombia = (placa: string): boolean => {
  if (!placa) return false;
  const regex = /^[A-Z]{3}\d{3}$/i;
  return regex.test(placa.trim().toUpperCase());
};

export const validarTelefonoColombia = (telefono: string): boolean => {
  if (!telefono) return false;
  // Acepta formatos: +57XXXXXXXXXX o 3XXXXXXXXX o 3XXXXXXXXX (sin código)
  const digitos = telefono.replace(/[^0-9]/g, '');
  if (digitos.length === 10 && digitos.startsWith('3')) return true; // celular nacional sin prefijo
  if (digitos.length === 12 && digitos.startsWith('57')) return true; // con prefijo 57
  return false;
};

export const formatearTelefonoColombia = (telefono: string): string => {
  const digitos = telefono.replace(/[^0-9]/g, '');
  if (digitos.length === 10 && digitos.startsWith('3')) return `+57${digitos}`;
  if (digitos.length === 12 && digitos.startsWith('57')) return `+${digitos}`;
  return telefono;
};

export const validarEmail = (email: string): boolean => {
  if (!email) return false;
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
  return re.test(email.trim());
};

export const validarPassword = (password: string): boolean => {
  if (!password) return false;
  // mínimo 8 caracteres
  return password.length >= 8;
};
