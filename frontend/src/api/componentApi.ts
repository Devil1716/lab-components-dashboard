import api from './index';

export interface Component {
  id?: string;
  component_name: string;
  category?: string;
  description?: string;
  unit_price: number;
  total_quantity: number;
  available_quantity: number;
  damaged_quantity: number;
  under_review_quantity: number;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

export const ComponentAPI = {
  getAll: async () => {
    const res = await api.get<Component[]>('/components');
    return res.data;
  },
  getById: async (id: string) => {
    const res = await api.get<Component>(`/components/${id}`);
    return res.data;
  },
  create: async (data: Omit<Component, 'id' | 'created_at' | 'updated_at'>) => {
    const res = await api.post<Component>('/components', data);
    return res.data;
  },
  update: async (id: string, data: Partial<Component>) => {
    const res = await api.put<Component>(`/components/${id}`, data);
    return res.data;
  },
  delete: async (id: string) => {
    await api.delete(`/components/${id}`);
  }
};
