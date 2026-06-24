import { apiClient } from './index';

export interface Semester {
  id: string;
  name: string;
  academic_year: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at?: string;
}

export const SemesterAPI = {
  getAll: async () => (await apiClient.get<Semester[]>('/semesters')).data,
  getById: async (id: string) => (await apiClient.get<Semester>(`/semesters/${id}`)).data,
  create: async (data: Omit<Semester, 'id'>) => (await apiClient.post<Semester>('/semesters', data)).data,
  update: async (id: string, data: Partial<Semester>) => (await apiClient.put<Semester>(`/semesters/${id}`, data)).data,
  delete: async (id: string) => (await apiClient.delete(`/semesters/${id}`)).data,
};
