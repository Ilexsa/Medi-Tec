import { apiFetch } from './apiClient';

export interface RecetaApi {
  id: number;
  consulta_id: number;
  paciente_id: number;
  medico_id: number;
  fecha_emision: string;
  estado: string; // "Emitida", "Despachada", "Anulada"
  notas?: string | null;
  items?: RecetaItemApi[];
}

export interface RecetaItemApi {
    id: number;
    receta_id: number;
    medicamento_id?: number | null;
    medicamento_texto?: string | null;
    cantidad: number;
    dosis: string;
    frecuencia: string;
    duracion: string;
    instrucciones_adicionales?: string | null;
}

export interface OrdenMedicaApi {
    id: number;
    cita_id?: number | null;
    consulta_id?: number | null;
    paciente_id: number;
    medico_id: number;
    tipo_orden: string; // "Examen Laboratorio", "Imagenologia", "Procedimiento"
    fecha_emision: string;
    estado: string; // "Emitida", "Procesada", "Anulada"
    observaciones?: string | null;
    items?: OrdenMedicaItemApi[];
}

export interface OrdenMedicaItemApi {
    id: number;
    orden_medica_id: number;
    catalogo_examen_id?: number | null;
    examen_texto?: string | null;
    cantidad: number;
    indicaciones?: string | null;
    resultado?: string | null;
}

type SingleResponse<T> = { success: boolean; data: T; message?: string; error?: string };
type ListResponse<T> = { success: boolean; data: { data: T[]; pagination?: any }; message?: string; error?: string };
type MessageResponse = { success: boolean; message?: string; error?: string };

// =======================
// RECETAS
// =======================
export async function createRecipe(payload: Partial<RecetaApi>): Promise<RecetaApi> {
    const res = await apiFetch<SingleResponse<RecetaApi>>('/recetas', { method: 'POST', body: JSON.stringify(payload) });
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al crear receta');
    return res.data;
}

export async function getRecipe(id: number): Promise<RecetaApi> {
    const res = await apiFetch<SingleResponse<RecetaApi>>(`/recetas/${id}`);
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al obtener receta');
    return res.data;
}

export async function changeRecipeState(id: number, estado: string): Promise<void> {
    const res = await apiFetch<MessageResponse>(`/recetas/${id}/estado`, { method: 'PUT', body: JSON.stringify({ estado }) });
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al cambiar estado de receta');
}

export async function addRecipeItem(recetaId: number, payload: Partial<RecetaItemApi>): Promise<RecetaItemApi> {
    const res = await apiFetch<SingleResponse<RecetaItemApi>>(`/recetas/${recetaId}/items`, { method: 'POST', body: JSON.stringify(payload) });
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al agregar item a receta');
    return res.data;
}

export async function removeRecipeItem(recetaId: number, itemId: number): Promise<void> {
    const res = await apiFetch<MessageResponse>(`/recetas/${recetaId}/items/${itemId}`, { method: 'DELETE' });
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al eliminar item de receta');
}

export async function listRecipesByPatient(pacienteId: number): Promise<RecetaApi[]> {
    const res = await apiFetch<{success: boolean, data: RecetaApi[], error?: string}>(`/pacientes/${pacienteId}/recetas`);
    if (!res?.success) throw new Error(res?.error || 'Error al listar recetas');
    return res.data;
}

// =======================
// ÓRDENES MÉDICAS
// =======================
export async function listMedicalOrders(params?: { page?: number; limit?: number; paciente_id?: number }): Promise<ListResponse<OrdenMedicaApi>['data']> {
    const q = new URLSearchParams();
    if (params?.page) q.set('page', String(params.page));
    if (params?.limit) q.set('limit', String(params.limit));
    if (params?.paciente_id) q.set('paciente_id', String(params.paciente_id));
    const suffix = q.toString() ? `?${q.toString()}` : '';
    
    const res = await apiFetch<ListResponse<OrdenMedicaApi>>(`/ordenes-medicas${suffix}`);
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al listar órdenes médicas');
    return res.data;
}

export async function createMedicalOrder(payload: Partial<OrdenMedicaApi>): Promise<OrdenMedicaApi> {
    const res = await apiFetch<SingleResponse<OrdenMedicaApi>>('/ordenes-medicas', { method: 'POST', body: JSON.stringify(payload) });
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al crear orden médica');
    return res.data;
}

export async function getMedicalOrder(id: number): Promise<OrdenMedicaApi> {
    const res = await apiFetch<SingleResponse<OrdenMedicaApi>>(`/ordenes-medicas/${id}`);
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al obtener orden médica');
    return res.data;
}

export async function cancelMedicalOrder(id: number, motivo?: string): Promise<void> {
    const res = await apiFetch<MessageResponse>(`/ordenes-medicas/${id}/anular`, { method: 'PUT', body: JSON.stringify({ motivo_anulacion: motivo }) });
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al anular orden médica');
}

export async function processMedicalOrder(id: number): Promise<void> {
    const res = await apiFetch<MessageResponse>(`/ordenes-medicas/${id}/procesar`, { method: 'PUT' });
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al procesar orden médica');
}

export async function addMedicalOrderItem(ordenId: number, payload: Partial<OrdenMedicaItemApi>): Promise<OrdenMedicaItemApi> {
    const res = await apiFetch<SingleResponse<OrdenMedicaItemApi>>(`/ordenes-medicas/${ordenId}/items`, { method: 'POST', body: JSON.stringify(payload) });
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al agregar item');
    return res.data;
}

export async function updateMedicalOrderResult(ordenId: number, itemId: number, resultado: string): Promise<void> {
    const res = await apiFetch<MessageResponse>(`/ordenes-medicas/${ordenId}/items/${itemId}/resultado`, { method: 'PUT', body: JSON.stringify({ resultado }) });
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al actualizar resultado');
}

export async function removeMedicalOrderItem(ordenId: number, itemId: number): Promise<void> {
    const res = await apiFetch<MessageResponse>(`/ordenes-medicas/${ordenId}/items/${itemId}`, { method: 'DELETE' });
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al eliminar item');
}
