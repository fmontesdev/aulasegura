// Valida el formato de un email
export const validateEmail = (value: string): string => {
  const trimmedValue = value.trim();
  
  // Verifica si está vacío
  if (trimmedValue.length === 0) {
    return 'Ingresa tu email';
  }
  
  // Regex para validar formato de email
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!emailRegex.test(trimmedValue)) {
    return 'El email no es válido';
  }
  
  // Verifica que no empiece o termine con punto
  if (trimmedValue.startsWith('.') || trimmedValue.endsWith('.')) {
    return 'El email no es válido';
  }
  
  // Verifica puntos consecutivos
  if (trimmedValue.includes('..')) {
    return 'El email no es válido';
  }
  
  return '';
};

// Valida el formato de una contraseña
export const validatePassword = (value: string): string => {
  // Verifica si está vacío
  if (value.length === 0) {
    return 'Ingresa tu contraseña';
  }
  
  // Regex que verifica que contenga al menos una mayúscula, una minúscula, un número y min. 8 caracteres
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$/;
  
  if (!passwordRegex.test(value)) {
    return 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número';
  }
  
  return '';
};
