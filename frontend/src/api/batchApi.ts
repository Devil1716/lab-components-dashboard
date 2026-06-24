import { apiClient } from './index';

export interface LabBatch {
  id: string;
  semester_id: string;
  lab_id: string;
  batch_name: string;
  max_students: number;
  status: 'active' | 'inactive';
}

export const BatchAPI = {
  getAll: async () => (await apiClient.get<LabBatch[]>('/batches')).data,
  getByLab: async (labId: string) => (await apiClient.get<LabBatch[]>(`/batches/lab/${labId}`)).data,
  create: async (data: Omit<LabBatch, 'id'>) => (await apiClient.post<LabBatch>('/batches', data)).data,
  update: async (id: string, data: Partial<LabBatch>) => (await apiClient.put<LabBatch>(`/batches/${id}`, data)).data,
  delete: async (id: string) => (await apiClient.delete(`/batches/${id}`)).data,
};
