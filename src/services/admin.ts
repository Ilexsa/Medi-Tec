import { apiFetch } from './apiClient';

export interface UsuarioApi {
  id: number;
  email: string;
  nombres: string;
  apellidos: string;
  rol: string;
  especialidad_id?: number;
  estado: string;
  // added manually to support what admin created over time
  inquilino_id?: number;
  identificacion?: string | null;
}

export interface InquilinoApi {
    id: number;
    nombre: string;
    subdominio: string;
    email?: string | null;
    telefono?: string | null;
    direccion?: string | null;
    tipo_plan: string;
    estado: string; // "Activo", "Inactivo", "Suspendido"
    // adicionales de creación
    ruc?: string | null;
    pais?: string | null;
    admin_nombre?: string | null;
    admin_email?: string | null;
}

export interface SuscripcionApi {
    plan_id?: number;
    medico_id?: number | null;
    fecha_inicio: string;
    fecha_fin: string;
    estado?: string;
}

export interface PlanSuscripcionApi {
    id: number;
    nombre: string;
    precio: number;
    duracion_dias: number;
    max_medicos: number;
}

type SingleResponse<T> = { success: boolean; data: T; message?: string; error?: string };
type ListResponse<T> = { success: boolean; data: { data: T[]; pagination?: any }; message?: string; error?: string };
type MessageResponse = { success: boolean; message?: string; error?: string };

// =======================
// USUARIOS (Para un Tenant)
// =======================
export async function listUsers(params?: { page?: number; limit?: number }): Promise<ListResponse<UsuarioApi>['data']> {
    const q = new URLSearchParams();
    if (params?.page) q.set('page', String(params.page));
    if (params?.limit) q.set('limit', String(params.limit));
    const suffix = q.toString() ? `?${q.toString()}` : '';
    
    const res = await apiFetch<ListResponse<UsuarioApi>>(`/usuarios${suffix}`);
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al listar usuarios');
    return res.data;
}

export async function createUser(payload: Partial<UsuarioApi> & { password?: string }): Promise<UsuarioApi> {
    const res = await apiFetch<SingleResponse<UsuarioApi>>('/usuarios', { method: 'POST', body: JSON.stringify(payload) });
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al crear usuario');
    return res.data;
}

export async function getUser(id: number): Promise<UsuarioApi> {
    const res = await apiFetch<SingleResponse<UsuarioApi>>(`/usuarios/${id}`);
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al obtener usuario');
    return res.data;
}

export async function updateUser(id: number, payload: Partial<UsuarioApi>): Promise<void> {
    const res = await apiFetch<MessageResponse>(`/usuarios/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al actualizar usuario');
}

export async function changeUserPassword(id: number, password: string): Promise<void> {
    const res = await apiFetch<MessageResponse>(`/usuarios/${id}/cambiar-password`, { method: 'PUT', body: JSON.stringify({ new_password: password }) });
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al cambiar contraseña');
}

export async function deleteUser(id: number): Promise<void> {
    const res = await apiFetch<MessageResponse>(`/usuarios/${id}`, { method: 'DELETE' });
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al eliminar usuario');
}

// =======================
// INQUILINOS (Para SuperAdmin y Admin Actual)
// =======================
export async function listTenants(): Promise<ListResponse<InquilinoApi>['data']> {
    const res = await apiFetch<ListResponse<InquilinoApi>>(`/inquilinos`);
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al listar inquilinos');
    return res.data;
}

export async function getCurrentTenant(): Promise<InquilinoApi> {
    const res = await apiFetch<SingleResponse<InquilinoApi>>('/inquilinos/actual');
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al obtener inquilino actual');
    return res.data;
}

export async function updateCurrentTenant(payload: Partial<InquilinoApi>): Promise<void> {
    const res = await apiFetch<MessageResponse>('/inquilinos/actual', { method: 'PUT', body: JSON.stringify(payload) });
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al actualizar inquilino');
}

// =======================
// SUSCRIPCIONES
// =======================
export async function createTenant(payload: Partial<InquilinoApi>): Promise<InquilinoApi> {
    const res = await apiFetch<SingleResponse<InquilinoApi>>('/inquilinos', { method: 'POST', body: JSON.stringify(payload) });
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al crear inquilino');
    return res.data;
}

export async function getTenant(id: number): Promise<InquilinoApi> {
    const res = await apiFetch<SingleResponse<InquilinoApi>>(`/inquilinos/${id}`);
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al obtener inquilino');
    return res.data;
}

export async function updateTenantStatus(id: number, estado: string): Promise<void> {
    const res = await apiFetch<MessageResponse>(`/inquilinos/${id}/estado`, { method: 'PUT', body: JSON.stringify({ estado }) });
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al cambiar estado de inquilino');
}

// =======================
// SUSCRIPCIONES
// =======================
export async function listSubscriptions(): Promise<ListResponse<SuscripcionApi>['data']> {
    const res = await apiFetch<ListResponse<SuscripcionApi>>(`/suscripciones`);
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al listar suscripciones');
    return res.data;
}

export async function createSubscription(payload: Partial<SuscripcionApi>): Promise<SuscripcionApi> {
    const res = await apiFetch<SingleResponse<SuscripcionApi>>('/suscripciones', { method: 'POST', body: JSON.stringify(payload) });
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al crear suscripción');
    return res.data;
}

export async function getSubscription(id: number): Promise<SuscripcionApi> {
    const res = await apiFetch<SingleResponse<SuscripcionApi>>(`/suscripciones/${id}`);
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al obtener suscripción');
    return res.data;
}

export async function updateSubscriptionStatus(id: number, estado: string): Promise<void> {
    const res = await apiFetch<MessageResponse>(`/suscripciones/${id}/estado`, { method: 'PUT', body: JSON.stringify({ estado }) });
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al actualizar estado suscripción');
}

export async function listSubscriptionsByTenant(tenantId: number): Promise<ListResponse<SuscripcionApi>['data']> {
    const res = await apiFetch<ListResponse<SuscripcionApi>>(`/inquilinos/${tenantId}/suscripciones`);
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al listar suscripciones de inquilino');
    return res.data;
}

export async function assignSubscriptionToTenant(tenantId: number, payload: Partial<SuscripcionApi>): Promise<SuscripcionApi> {
    const res = await apiFetch<SingleResponse<SuscripcionApi>>(`/inquilinos/${tenantId}/suscripciones`, { method: 'POST', body: JSON.stringify(payload) });
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al asignar suscripción al inquilino');
    return res.data;
}
