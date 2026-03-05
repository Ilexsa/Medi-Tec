import { apiFetch } from './apiClient';

// --- Interfaces de Modelos ---
export interface TurnoDisponible {
  turno_id: number;
  medico_id: number;
  medico_nombre: string;
  especialidad_id: number;
  especialidad: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  duracion_minutos: number;
  disponible: boolean;
}

export interface ResumenTurno {
  fecha: string;
  turnos_disponibles: number;
  turnos_ocupados: number;
  turnos: TurnoDisponible[];
}

export interface GenerarTurnosResponse {
  turnos_generados: number;
  medico_id: number;
  fecha?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
}

// --- Interfaces de Payloads ---
export interface BuscarTurnosParams {
  fecha_inicio: string;
  fecha_fin: string;
  medico_id?: number;
  especialidad_id?: number;
  duracion_minutos?: number;
}

export interface GenerarTurnosPayload {
  medico_id: number;
  fecha_inicio: string;
  fecha_fin: string;
  duracion_slot: number;
  sobrescribir?: boolean;
}

export interface GenerarAdicionalesPayload {
  medico_id: number;
  fecha: string;
  cantidad: number;
}

export interface ReservarTurnoPayload {
  turno_id: number;
  paciente_id?: number;
  tipo_cita?: string;
  motivo?: string;
  notas?: string;
}

// --- Interfaces de Respuestas ---
interface BaseResponse<T> {
  status: string;
  data: T;
  message?: string;
}

// --- Funciones del Servicio ---

export async function getTurnosDisponibles(params: BuscarTurnosParams): Promise<TurnoDisponible[]> {
  const q = new URLSearchParams();
  q.set('fecha_inicio', params.fecha_inicio);
  q.set('fecha_fin', params.fecha_fin);
  
  if (params.medico_id) q.set('medico_id', String(params.medico_id));
  if (params.especialidad_id) q.set('especialidad_id', String(params.especialidad_id));
  if (params.duracion_minutos) q.set('duracion_minutos', String(params.duracion_minutos));

  const res = await apiFetch<BaseResponse<TurnoDisponible[]>>(`/turnos/disponibles?${q.toString()}`);
  if (res.status !== 'success') throw new Error(res.message || 'Error al buscar turnos disponibles');
  return res.data;
}

export async function getResumenTurnos(medicoId: number, fechaInicio: string, fechaFin: string): Promise<ResumenTurno[]> {
  const q = new URLSearchParams({
    medico_id: String(medicoId),
    fecha_inicio: fechaInicio,
    fecha_fin: fechaFin,
  });

  // Asumiendo que el endpoint es /turnos/resumen según la agrupación de rutas
  const res = await apiFetch<BaseResponse<ResumenTurno[]>>(`/turnos/resumen?${q.toString()}`);
  if (res.status !== 'success') throw new Error(res.message || 'Error al obtener resumen de turnos');
  return res.data;
}

export async function generarTurnos(payload: GenerarTurnosPayload): Promise<GenerarTurnosResponse> {
  const res = await apiFetch<BaseResponse<GenerarTurnosResponse>>('/turnos/generar', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (res.status !== 'success') throw new Error(res.message || 'Error al generar turnos');
  return res.data;
}

export async function generarTurnosAdicionales(payload: GenerarAdicionalesPayload): Promise<GenerarTurnosResponse> {
  const res = await apiFetch<BaseResponse<GenerarTurnosResponse>>('/turnos/generar-adicionales', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (res.status !== 'success') throw new Error(res.message || 'Error al generar turnos adicionales');
  return res.data;
}

export async function reservarTurno(payload: ReservarTurnoPayload): Promise<void> {
  const res = await apiFetch<BaseResponse<null>>('/turnos/reservar', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (res.status !== 'success') throw new Error(res.message || 'Error al reservar el turno');
}

export async function liberarTurno(turnoId: number): Promise<void> {
  const res = await apiFetch<BaseResponse<null>>(`/turnos/${turnoId}/liberar`, {
    method: 'PUT',
  });
  if (res.status !== 'success') throw new Error(res.message || 'Error al liberar el turno');
}