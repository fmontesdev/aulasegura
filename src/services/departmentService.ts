/**
 * Service para operaciones CRUD de departamentos
 */

import { Department } from '../types/Department';
import apiService from './apiService';

export const departmentService = {
  // Obtiene todos los departamentos
  async getAllDepartments(): Promise<Department[]> {
    return apiService.get<Department[]>('/departments');
  },
};
