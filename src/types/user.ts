import { Department } from './department';

// Usuario
export interface User {
  userId: string;
  name: string;
  lastname: string;
  email: string;
  avatar: string;
  roles: string[];
  department?: Department;
}