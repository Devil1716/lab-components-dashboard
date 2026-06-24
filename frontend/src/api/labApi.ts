import { apiClient } from './index';

export interface Lab {
  id: string;
  semester_id: string;
  lab_name: string;
}

export const LabAPI = {
  getAll: async () => (await apiClient.get<Lab[]>('/labs')).data,
  getBySemester: async (semesterId: string) => (await apiClient.get<Lab[]>(`/labs/semester/${semesterId}`)).data,
  create: async (data: Omit<Lab, 'id'>) => (await apiClient.post<Lab>('/labs', data)).data,
  update: async (id: string, data: Partial<Lab>) => (await apiClient.put<Lab>(`/labs/${id}`, data)).data,
  delete: async (id: string) => (await apiClient.delete(`/labs/${id}`)).data,
};
