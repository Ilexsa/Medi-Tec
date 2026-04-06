import { apiFetch } from './apiClient';

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: any;
}

export interface PatientApi {
  id: number;
  inquilino_id?: number;
  identificacion: string;
  tipo_identificacion: string;
  nombres: string;
  apellidos: string;
  fecha_nacimiento: string; // ISO string
  genero: string; // male | female | other
  email?: string | null;
  telefono?: string | null;
  celular?: string | null;
  direccion?: string | null;
  ciudad?: string | null;
  tipo_sangre?: string | null;
  alergias?: string | null;
  condiciones_cronicas?: string | null;
  contacto_emergencia_nombre?: string | null;
  contacto_emergencia_telefono?: string | null;
  contacto_emergencia_relacion?: string | null;
  aseguradora?: string | null;
  numero_seguro?: string | null;
  url_foto_perfil?: string | null;
  estado?: string; // active | inactive
  // Campos calculados
  edad?: number;
  nombres_completos?: string;
  tiene_alergias?: boolean;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface PatientsListData {
  data: PatientApi[];
  pagination: Pagination;
}

export interface PatientCreateApi {
  identificacion: string;
  tipo_identificacion: string;
  nombres: string;
  apellidos: string;
  fecha_nacimiento: string;
  genero: string;
  email?: string | null;
  telefono?: string | null;
  celular?: string | null;
  direccion?: string | null;
  ciudad?: string | null;
  tipo_sangre?: string | null;
  alergias?: string | null;
  condiciones_cronicas?: string | null;
  contacto_emergencia_nombre?: string | null;
  contacto_emergencia_telefono?: string | null;
  contacto_emergencia_relacion?: string | null;
  aseguradora?: string | null;
  numero_seguro?: string | null;
  estado?: string | null;
}

export async function getPatients(): Promise<PatientApi[]> {
  const res = await apiFetch<ApiEnvelope<PatientsListData>>('/pacientes');
  if (!res?.success) throw new Error(res?.message || 'Error al obtener pacientes');
  return res.data?.data ?? [];
}

export async function searchPatients(query: string): Promise<PatientApi[]> {
  const res = await apiFetch<ApiEnvelope<PatientsListData>>(`/pacientes/buscar?q=${encodeURIComponent(query)}`);
  if (!res?.success) throw new Error(res?.message || 'Error al buscar pacientes');
  return res.data?.data ?? [];
}

export async function getPatient(id: number): Promise<PatientApi> {
  const res = await apiFetch<ApiEnvelope<PatientApi>>(`/pacientes/${id}`);
  if (!res?.success) throw new Error(res?.message || 'Error al obtener paciente');
  return res.data;
}

export async function getPatientPrescriptions(id: number): Promise<any[]> {
  const res = await apiFetch<ApiEnvelope<any[]>>(`/pacientes/${id}/recetas`);
  if (!res?.success) throw new Error(res?.message || 'Error al obtener recetas del paciente');
  return res.data ?? [];
}

export async function getPatientBillingSummary(id: number): Promise<any> {
  const res = await apiFetch<ApiEnvelope<any>>(`/pacientes/${id}/facturacion/resumen`);
  if (!res?.success) throw new Error(res?.message || 'Error al obtener resumen de facturación');
  return res.data;
}

// Nota: endpoints típicos REST (si tu backend usa otra ruta, cámbialo aquí)
export async function createPatient(payload: PatientCreateApi): Promise<PatientApi> {
  const res = await apiFetch<ApiEnvelope<PatientApi>>('/pacientes', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  if (!res?.success) throw new Error(res?.message || 'Error al crear paciente');
  return (res.data as any) ?? (res as any);
}

export async function updatePatient(id: number, payload: Partial<PatientCreateApi>): Promise<PatientApi> {
  const res = await apiFetch<ApiEnvelope<PatientApi>>(`/pacientes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
  if (!res?.success) throw new Error(res?.message || 'Error al actualizar paciente');
  return (res.data as any) ?? (res as any);
}

export async function deletePatient(id: number): Promise<void> {
  const res = await apiFetch<ApiEnvelope<unknown>>(`/pacientes/${id}`, {
    method: 'DELETE'
  });
  if (!res?.success) throw new Error(res?.message || 'Error al eliminar paciente');
}
