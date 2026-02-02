/**
 * Hooks de TanStack Query para gestión de departamentos
 */

import { useQuery } from '@tanstack/react-query';
import { departmentService } from '../../services/departmentService';

// Keys para el caché de React Query
export const departmentKeys = {
  all: ['departments'] as const,
  lists: () => [...departmentKeys.all, 'list'] as const,
};

// Hook para obtener todos los departamentos
export function useDepartments() {
  return useQuery({
    queryKey: departmentKeys.lists(),
    queryFn: () => departmentService.getAllDepartments(),
    staleTime: 1000 * 60 * 10, // 10 minutos (los departamentos no cambian frecuentemente)
  });
}
