import { apiFetch } from './apiClient';

export interface CatalogoItem {
  id: number;
  codigo?: string | null;
  nombre?: string;
  descripcion?: string | null;
  precio_referencial?: number;
  tipo?: string | null; // Medicamento, Insumo, Servicio, etc
  activo: boolean;
  
  // Campos específicos para Medicamentos
  nombre_generico?: string;
  nombre_comercial?: string;
  categoria?: string;
  presentacion?: string;
  es_controlado?: boolean;
}

type ListResponse<T> = {
  success: boolean;
  data: {
    data: T[];
    pagination?: { page: number; limit: number; total: number; total_pages: number };
  };
  message?: string;
  error?: string;
};

type SingleResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
};

type MessageResponse = {
  success: boolean;
  message?: string;
  error?: string;
};

// =======================
// MEDICAMENTOS
// =======================
export async function listMedicines(params?: { page?: number; limit?: number; q?: string }): Promise<ListResponse<CatalogoItem>['data']> {
    const q = new URLSearchParams();
    if (params?.page) q.set('page', String(params.page));
    if (params?.limit) q.set('limit', String(params.limit));
    if (params?.q) q.set('q', params.q);

    const suffix = q.toString() ? (params?.q ? `/buscar?${q.toString()}` : `?${q.toString()}`) : '';
    const res = await apiFetch<ListResponse<CatalogoItem>>(`/catalogo-medicamentos${suffix}`);
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al listar medicamentos');
    return res.data;
}

export async function createMedicine(payload: Partial<CatalogoItem>): Promise<CatalogoItem> {
    const res = await apiFetch<SingleResponse<CatalogoItem>>('/catalogo-medicamentos', { method: 'POST', body: JSON.stringify(payload) });
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al crear medicamento');
    return res.data;
}

export async function updateMedicine(id: number, payload: Partial<CatalogoItem>): Promise<void> {
    const res = await apiFetch<MessageResponse>(`/catalogo-medicamentos/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al actualizar medicamento');
}

export async function deleteMedicine(id: number): Promise<void> {
    const res = await apiFetch<MessageResponse>(`/catalogo-medicamentos/${id}`, { method: 'DELETE' });
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al eliminar medicamento');
}

export async function getMedicine(id: number): Promise<CatalogoItem> {
    const res = await apiFetch<SingleResponse<CatalogoItem>>(`/catalogo-medicamentos/${id}`);
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al obtener medicamento');
    return res.data;
}

// =======================
// ITEMS FACTURABLES
// =======================
export async function listBillableItems(params?: { page?: number; limit?: number; q?: string }): Promise<ListResponse<CatalogoItem>['data']> {
    const q = new URLSearchParams();
    if (params?.page) q.set('page', String(params.page));
    if (params?.limit) q.set('limit', String(params.limit));
    if (params?.q) q.set('q', params.q);

    const suffix = q.toString() ? (params?.q ? `/buscar?${q.toString()}` : `?${q.toString()}`) : '';
    const res = await apiFetch<ListResponse<CatalogoItem>>(`/catalogo-items${suffix}`);
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al listar items');
    return res.data;
}

export async function createBillableItem(payload: Partial<CatalogoItem>): Promise<CatalogoItem> {
    const res = await apiFetch<SingleResponse<CatalogoItem>>('/catalogo-items', { method: 'POST', body: JSON.stringify(payload) });
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al crear item facturable');
    return res.data;
}

export async function updateBillableItem(id: number, payload: Partial<CatalogoItem>): Promise<void> {
    const res = await apiFetch<MessageResponse>(`/catalogo-items/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al actualizar item facturable');
}

export async function deleteBillableItem(id: number): Promise<void> {
    const res = await apiFetch<MessageResponse>(`/catalogo-items/${id}`, { method: 'DELETE' });
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al eliminar item facturable');
}

export async function getBillableItem(id: number): Promise<CatalogoItem> {
    const res = await apiFetch<SingleResponse<CatalogoItem>>(`/catalogo-items/${id}`);
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al obtener item facturable');
    return res.data;
}

// =======================
// EXÁMENES
// =======================
export async function listExams(params?: { page?: number; limit?: number }): Promise<ListResponse<CatalogoItem>['data']> {
    const q = new URLSearchParams();
    if (params?.page) q.set('page', String(params.page));
    if (params?.limit) q.set('limit', String(params.limit));

    const suffix = q.toString() ? `?${q.toString()}` : '';
    const res = await apiFetch<ListResponse<CatalogoItem>>(`/catalogo-examenes${suffix}`);
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al listar examenes');
    return res.data;
}

export async function createExam(payload: Partial<CatalogoItem>): Promise<CatalogoItem> {
    const res = await apiFetch<SingleResponse<CatalogoItem>>('/catalogo-examenes', { method: 'POST', body: JSON.stringify(payload) });
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al crear examen');
    return res.data;
}

export async function updateExam(id: number, payload: Partial<CatalogoItem>): Promise<void> {
    const res = await apiFetch<MessageResponse>(`/catalogo-examenes/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al actualizar examen');
}

export async function deleteExam(id: number): Promise<void> {
    const res = await apiFetch<MessageResponse>(`/catalogo-examenes/${id}`, { method: 'DELETE' });
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al eliminar examen');
}

export async function getExam(id: number): Promise<CatalogoItem> {
    const res = await apiFetch<SingleResponse<CatalogoItem>>(`/catalogo-examenes/${id}`);
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al obtener examen');
    return res.data;
}
