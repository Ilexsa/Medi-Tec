import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarIcon, PlusIcon } from 'lucide-react';
import { CitaApi, listAppointments } from '../services/appointments';

const statusStyles: Record<string, string> = {
  Confirmada: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  Completada: 'bg-indigo-50 text-indigo-700 border border-indigo-100',
  Programada: 'bg-blue-50 text-blue-700 border border-blue-100',
  Pendiente: 'bg-amber-50 text-amber-700 border border-amber-100',
  Cancelada: 'bg-red-50 text-red-600 border border-red-100'
};

export function Appointments() {
  const [appointments, setAppointments] = useState<CitaApi[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  const fetchAppointments = async () => {
    setLoading(true);
    setErrorText('');
    try {
      const res = await listAppointments();
      setAppointments((res as any).data ?? res ?? []);
    } catch(e: any) {
      setErrorText(e?.message || 'Error al obtener turnos/citas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchAppointments();
  }, []);
  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Turnos</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Gestión de turnos y citas médicas
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-800 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">
          <PlusIcon className="w-4 h-4" />
          Nuevo Turno
        </button>
      </div>

      {errorText && (
        <div className="mb-4 flex items-center p-4 bg-red-50 border border-red-100 rounded-xl">
           <p className="text-sm text-red-800">{errorText}</p>
        </div>
      )}

      <motion.div
        initial={{
          opacity: 0,
          y: 12
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.35
        }}
        className="bg-white rounded-xl border border-slate-100 shadow-card overflow-hidden">

        <div className="flex items-center gap-3 p-5 border-b border-slate-100">
          <CalendarIcon className="w-5 h-5 text-blue-700" />
          <h3 className="text-sm font-semibold text-slate-900">
            Próximos Turnos
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50">
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3.5">
                  Paciente
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3.5">
                  Médico
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3.5 hidden md:table-cell">
                  Especialidad
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3.5">
                  Fecha
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3.5">
                  Hora
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3.5">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-6 text-slate-500">Cargando turnos...</td></tr>
              ) : appointments.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-6 text-slate-500">No hay turnos registrados</td></tr>
              ) : appointments.map((appt, i) => {
                const parts = appt.fecha_hora?.split('T') || ['', ''];
                const date = parts[0];
                const timeStr = parts[1]?.substring(0, 5) || '';
                return (
              <motion.tr
                key={appt.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5 text-sm font-medium text-slate-800">
                    {appt.paciente_nombres} {appt.paciente_apellidos}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">
                    {appt.medico_nombres} {appt.medico_apellidos}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-500 hidden md:table-cell">
                    {appt.motivo || '—'}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">
                    {date}
                  </td>
                  <td className="px-5 py-3.5 text-sm font-mono text-slate-700">
                    {timeStr}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[appt.estado] || statusStyles.Programada}`}>
                      {appt.estado}
                    </span>
                  </td>
                </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>);

}