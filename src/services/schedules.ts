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
interface BaseResponse<T> {
  status: string;
  data: T;
  message?: string;
}

// --- Funciones del Servicio ---

export async function getHorarios(medicoId: number): Promise<HorarioApi[]> {
  const res = await apiFetch<BaseResponse<HorarioApi[]>>(`/medicos/${medicoId}/horarios`);
  if (res.status !== 'success') throw new Error(res.message || 'Error al obtener horarios');
  return res.data;
}

export async function createHorario(medicoId: number, payload: HorarioCreatePayload): Promise<HorarioApi> {
  const res = await apiFetch<BaseResponse<HorarioApi>>(`/medicos/${medicoId}/horarios`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (res.status !== 'success') throw new Error(res.message || 'Error al crear horario');
  return res.data;
}

export async function updateHorario(medicoId: number, horarioId: number, payload: HorarioUpdatePayload): Promise<void> {
  const res = await apiFetch<BaseResponse<null>>(`/medicos/${medicoId}/horarios/${horarioId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  if (res.status !== 'success') throw new Error(res.message || 'Error al actualizar horario');
}

export async function deleteHorario(medicoId: number, horarioId: number): Promise<void> {
  const res = await apiFetch<BaseResponse<null>>(`/medicos/${medicoId}/horarios/${horarioId}`, {
    method: 'DELETE',
  });
  if (res.status !== 'success') throw new Error(res.message || 'Error al eliminar horario');
}