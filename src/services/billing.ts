import { apiFetch } from './apiClient';

export interface FacturaApi {
    id: number;
    inquilino_id: number;
    paciente_id: number;
    cierre_caja_id?: number | null;
    numero_factura: string;
    fecha_emision: string;
    subtotal: number;
    impuestos: number;
    descuentos: number;
    total: number;
    saldo_pendiente: number;
    estado: string; // "Emitida", "Pagada Parcial", "Pagada", "Anulada"
    metodo_pago?: string | null;
    identificacion_cliente?: string | null;
    nombre_cliente?: string | null;
    direccion_cliente?: string | null;
    telefono_cliente?: string | null;
    email_cliente?: string | null;
    observaciones?: string | null;
    detalles?: FacturaDetalleApi[];
}

export interface FacturaDetalleApi {
    id: number;
    factura_id: number;
    item_tipo: string; // "Consulta", "Examen", "Servicio", "Medicamento"
    item_id?: number | null;
    descripcion: string;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    impuesto_porcentaje: number;
    impuesto_monto: number;
    descuento_porcentaje: number;
    descuento_monto: number;
    total: number;
}

export interface CierreCajaApi {
    id: number;
    inquilino_id: number;
    usuario_id: number;
    fecha_apertura: string;
    fecha_cierre?: string | null;
    monto_inicial: number;
    monto_efectivo_sistema: number;
    monto_bancos_sistema: number;
    monto_efectivo_declarado?: number | null;
    monto_bancos_declarado?: number | null;
    diferencia_efectivo?: number | null;
    diferencia_bancos?: number | null;
    estado: string; // "Abierta", "Cerrada"
    observaciones?: string | null;
}

export interface PagoApi {
    id: number;
    factura_id: number;
    cierre_caja_id?: number | null;
    fecha_pago: string;
    monto: number;
    metodo_pago: string; // "Efectivo", "Tarjeta", "Transferencia", "Seguro"
    referencia?: string | null;
    observaciones?: string | null;
}

type SingleResponse<T> = { success: boolean; data: T; message?: string; error?: string };
type ListResponse<T> = { success: boolean; data: { data: T[]; pagination?: any }; message?: string; error?: string };
type MessageResponse = { success: boolean; message?: string; error?: string };

// =======================
// FACTURAS
// =======================
export async function listInvoices(params?: { page?: number; limit?: number; paciente_id?: number; estado?: string }): Promise<ListResponse<FacturaApi>['data']> {
    const q = new URLSearchParams();
    if (params?.page) q.set('page', String(params.page));
    if (params?.limit) q.set('limit', String(params.limit));
    if (params?.paciente_id) q.set('paciente_id', String(params.paciente_id));
    if (params?.estado) q.set('estado', params.estado);
    const suffix = q.toString() ? `?${q.toString()}` : '';
    
    const res = await apiFetch<ListResponse<FacturaApi>>(`/facturas${suffix}`);
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al listar facturas');
    return res.data;
}

export async function createInvoice(payload: Partial<FacturaApi>): Promise<FacturaApi> {
    const res = await apiFetch<SingleResponse<FacturaApi>>('/facturas', { method: 'POST', body: JSON.stringify(payload) });
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al crear factura');
    return res.data;
}

export async function getInvoice(id: number): Promise<FacturaApi> {
    const res = await apiFetch<SingleResponse<FacturaApi>>(`/facturas/${id}`);
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al obtener factura');
    return res.data;
}

export async function cancelInvoice(id: number, motivo?: string): Promise<void> {
    const res = await apiFetch<MessageResponse>(`/facturas/${id}/anular`, { method: 'PUT', body: JSON.stringify({ motivo_anulacion: motivo }) });
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al anular factura');
}

export async function addPayment(facturaId: number, payload: Partial<PagoApi>): Promise<PagoApi> {
    const res = await apiFetch<SingleResponse<PagoApi>>(`/facturas/${facturaId}/pagos`, { method: 'POST', body: JSON.stringify(payload) });
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al registrar pago');
    return res.data;
}

export async function listPayments(facturaId: number): Promise<PagoApi[]> {
    const res = await apiFetch<{success: boolean, data: PagoApi[], error?: string}>(`/facturas/${facturaId}/pagos`);
    if (!res?.success) throw new Error(res?.error || 'Error al listar pagos');
    return res.data;
}

// =======================
// CAJA
// =======================
export async function listRegisters(params?: { page?: number; limit?: number }): Promise<ListResponse<CierreCajaApi>['data']> {
    const q = new URLSearchParams();
    if (params?.page) q.set('page', String(params.page));
    if (params?.limit) q.set('limit', String(params.limit));
    const suffix = q.toString() ? `?${q.toString()}` : '';
    
    const res = await apiFetch<ListResponse<CierreCajaApi>>(`/caja${suffix}`);
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al listar cierres de caja');
    return res.data;
}

export async function getCurrentRegister(): Promise<CierreCajaApi> {
    const res = await apiFetch<SingleResponse<CierreCajaApi>>('/caja/actual');
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al obtener caja actual');
    return res.data;
}

export async function openRegister(monto_inicial: number, observaciones?: string): Promise<CierreCajaApi> {
    const res = await apiFetch<SingleResponse<CierreCajaApi>>('/caja/abrir', { method: 'POST', body: JSON.stringify({ monto_inicial, observaciones }) });
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al abrir caja');
    return res.data;
}

export async function closeRegister(payload: { monto_efectivo_declarado: number; monto_bancos_declarado: number; observaciones?: string }): Promise<void> {
    const res = await apiFetch<MessageResponse>('/caja/cerrar', { method: 'POST', body: JSON.stringify(payload) });
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al cerrar caja');
}

export async function getRegisterSummary(id: number): Promise<any> {
    const res = await apiFetch<SingleResponse<any>>(`/caja/${id}/resumen`);
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al obtener resumen de caja');
    return res.data;
}

export async function getRegister(id: number): Promise<CierreCajaApi> {
    const res = await apiFetch<SingleResponse<CierreCajaApi>>(`/caja/${id}`);
    if (!res?.success) throw new Error(res?.error || res?.message || 'Error al obtener caja');
    return res.data;
}
