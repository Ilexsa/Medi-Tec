import { apiFetch } from './apiClient';

// --- Interfaces de Modelos ---
export interface HorarioApi {
  id: number;
  medico_id: number;
  inquilino_id: number;
  dia_semana: number; // 0=Domingo, 6=Sábado
  hora_inicio: string;
  hora_fin: string;
  duracion_slot: number;
  intervalo_descanso: number;
  especialidad_id: number;
  fecha_vigencia_desde: string | null;
  fecha_vigencia_hasta: string | null;
  activo: boolean;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  num_turnos_automaticos?: number;
}

export interface HorarioCreatePayload {
  dia_semana: number;
  hora_inicio: string;
  hora_fin: string;
  duracion_slot: number;
  intervalo_descanso?: number;
  especialidad_id: number;
  fecha_vigencia_desde?: string;
  fecha_vigencia_hasta?: string;
  num_turnos_automaticos?: number;
}

export interface HorarioUpdatePayload {
  hora_inicio?: string;
  hora_fin?: string;
  duracion_slot?: number;
  intervalo_descanso?: number;
  fecha_vigencia_desde?: string;
  fecha_vigencia_hasta?: string;
  activo?: boolean;
}

// --- Interfaces de Respuestas ---
// CORRECCIÓN: El backend envía 'success' (boolean), no 'status'
interface BaseResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// --- Funciones del Servicio ---

export async function getHorarios(medicoId: number): Promise<HorarioApi[]> {
  const res = await apiFetch<BaseResponse<HorarioApi[]>>(`/medicos/${medicoId}/horarios`);
  // CORRECCIÓN: Validar res.success
  if (!res.success) throw new Error(res.error || res.message || 'Error al obtener horarios');
  return res.data;
}

export async function createHorario(medicoId: number, payload: HorarioCreatePayload): Promise<HorarioApi> {
  const res = await apiFetch<BaseResponse<HorarioApi>>(`/medicos/${medicoId}/horarios`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  // CORRECCIÓN: Validar res.success
  if (!res.success) throw new Error(res.error || res.message || 'Error al crear horario');
  return res.data;
}

export async function updateHorario(medicoId: number, horarioId: number, payload: HorarioUpdatePayload): Promise<void> {
  // Nota: Algunos endpoints de actualización devuelven null en la data
  const res = await apiFetch<BaseResponse<any>>(`/medicos/${medicoId}/horarios/${horarioId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  // CORRECCIÓN: Validar res.success
  if (!res.success) throw new Error(res.error || res.message || 'Error al actualizar horario');
}

export async function deleteHorario(medicoId: number, horarioId: number): Promise<void> {
  const res = await apiFetch<BaseResponse<any>>(`/medicos/${medicoId}/horarios/${horarioId}`, {
    method: 'DELETE',
  });
  // CORRECCIÓN: Validar res.success
  if (!res.success) throw new Error(res.error || res.message || 'Error al eliminar horario');
}