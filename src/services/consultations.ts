import { apiFetch } from './apiClient';

export interface ConsultaApi {
  id: number;
  cita_id: number;
  inquilino_id: number;
  paciente_id: number;
  medico_id: number;
  sintomas?: string | null;
  motivo_consulta?: string | null;
  examen_fisico?: string | null;
  notas_privadas?: string | null;
  estado: string; // "En curso", "Finalizada"
  fecha_inicio: string;
  fecha_fin?: string | null;
}

export interface DiagnosticoApi {
  id: number;
  consulta_id: number;
  cie10_id?: number | null;
  tipo: string; // "Presuntivo", "Definitivo"
  observaciones?: string | null;
}

type SingleResponse = {
  success: boolean;
  data: ConsultaApi;
  message?: string;
  error?: string;
};

type ListDiagnosticosResponse = {
    success: boolean;
    data: DiagnosticoApi[];
    message?: string;
    error?: string;
};

type MessageResponse = {
  success: boolean;
  message?: string;
  error?: string;
};

export async function startConsultationFromAppointment(payload: { cita_id: number }): Promise<ConsultaApi> {
  const res = await apiFetch<SingleResponse>('/consultas/iniciar', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  if (!res?.success) throw new Error(res?.error || res?.message || 'Error al iniciar consulta');
  return res.data;
}

export async function getConsultation(id: number): Promise<ConsultaApi> {
  const res = await apiFetch<SingleResponse>(`/consultas/${id}`);
  if (!res?.success) throw new Error(res?.error || res?.message || 'Error al obtener consulta');
  return res.data;
}

export async function updateConsultation(id: number, payload: Partial<ConsultaApi>): Promise<void> {
  const res = await apiFetch<MessageResponse>(`/consultas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
  if (!res?.success) throw new Error(res?.error || res?.message || 'Error al actualizar consulta');
}

export async function finishConsultation(id: number): Promise<void> {
  const res = await apiFetch<MessageResponse>(`/consultas/${id}/finalizar`, {
    method: 'POST'
  });
  if (!res?.success) throw new Error(res?.error || res?.message || 'Error al finalizar consulta');
}

export async function getDiagnoses(consultaId: number): Promise<DiagnosticoApi[]> {
  const res = await apiFetch<ListDiagnosticosResponse>(`/consultas/${consultaId}/diagnosticos`);
  if (!res?.success) throw new Error(res?.error || res?.message || 'Error al obtener diagnósticos');
  return res.data;
}

export async function addDiagnosis(consultaId: number, payload: Partial<DiagnosticoApi>): Promise<DiagnosticoApi> {
  const res = await apiFetch<{ success: boolean; data: DiagnosticoApi; error?: string; message?: string }>(`/consultas/${consultaId}/diagnosticos`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  if (!res?.success) throw new Error(res?.error || res?.message || 'Error al agregar diagnóstico');
  return res.data;
}

export async function replaceDiagnoses(consultaId: number, payload: Partial<DiagnosticoApi>[]): Promise<void> {
    const res = await apiFetch<MessageResponse>(`/consultas/${consultaId}/diagnosticos`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al reemplazar diagnósticos');
}

export async function getRecipesForConsultation(consultaId: number): Promise<any[]> {
    const res = await apiFetch<{ success: boolean; data: any[]; error?: string; message?: string }>(`/consultas/${consultaId}/recetas`);
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al obtener recetas de la consulta');
    return res.data;
}
