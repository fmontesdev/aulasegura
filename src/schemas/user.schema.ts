import { z } from 'zod';
import { RoleName } from '../types/User';

// Schema para usuario
export const UserSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastname: z.string().min(2, 'Los apellidos deben tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string()
    .refine(
      (val) => {
        // Si está vacío, es válido (modo edición)
        if (val === '') return true;
        // Si tiene contenido, debe cumplir las validaciones
        return val.length >= 8;
      },
      { message: 'La contraseña debe tener al menos 8 caracteres' }
    )
    .refine(
      (val) => val === '' || /[A-Z]/.test(val),
      { message: 'Debe contener al menos una mayúscula' }
    )
    .refine(
      (val) => val === '' || /[a-z]/.test(val),
      { message: 'Debe contener al menos una minúscula' }
    )
    .refine(
      (val) => val === '' || /[0-9]/.test(val),
      { message: 'Debe contener al menos un número' }
    ),
  roles: z.array(z.nativeEnum(RoleName))
    .min(1, 'Debe seleccionar al menos un rol'),
  avatar: z.string().min(1, 'Selecciona un avatar'),
  departmentId: z.number().optional(),
}).refine(
  (data) => {
    // Si uno de los roles es teacher, departmentId es obligatorio
    if (data.roles.includes(RoleName.TEACHER)) {
      return data.departmentId !== undefined;
    }
    return true;
  },
  {
    message: 'El departamento es obligatorio para profesores',
    path: ['departmentId'],
  }
);

export type UserFormData = z.infer<typeof UserSchema>;
