import React from 'react';
import { motion } from 'framer-motion';
import { CalendarIcon, PlusIcon } from 'lucide-react';
const appointments = [
{
  id: 1,
  patient: 'María González',
  doctor: 'Dr. García',
  specialty: 'Cardiología',
  date: '02/03/2025',
  time: '08:30',
  status: 'Confirmado'
},
{
  id: 2,
  patient: 'Carlos Rodríguez',
  doctor: 'Dra. Martínez',
  specialty: 'Neurología',
  date: '02/03/2025',
  time: '09:00',
  status: 'Pendiente'
},
{
  id: 3,
  patient: 'Ana Fernández',
  doctor: 'Dr. López',
  specialty: 'Pediatría',
  date: '02/03/2025',
  time: '09:30',
  status: 'Confirmado'
},
{
  id: 4,
  patient: 'Luis Pérez',
  doctor: 'Dra. Rodríguez',
  specialty: 'Traumatología',
  date: '03/03/2025',
  time: '10:00',
  status: 'Cancelado'
},
{
  id: 5,
  patient: 'Sofía Díaz',
  doctor: 'Dr. Fernández',
  specialty: 'Oncología',
  date: '03/03/2025',
  time: '10:30',
  status: 'Confirmado'
},
{
  id: 6,
  patient: 'Roberto Sánchez',
  doctor: 'Dr. García',
  specialty: 'Cardiología',
  date: '04/03/2025',
  time: '11:00',
  status: 'Pendiente'
}];

const statusStyles: Record<string, string> = {
  Confirmado: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  Pendiente: 'bg-amber-50 text-amber-700 border border-amber-100',
  Cancelado: 'bg-red-50 text-red-600 border border-red-100'
};
export function Appointments() {
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
              {appointments.map((appt, i) =>
              <motion.tr
                key={appt.id}
                initial={{
                  opacity: 0
                }}
                animate={{
                  opacity: 1
                }}
                transition={{
                  delay: i * 0.05
                }}
                className="hover:bg-slate-50/50 transition-colors">

                  <td className="px-5 py-3.5 text-sm font-medium text-slate-800">
                    {appt.patient}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">
                    {appt.doctor}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-500 hidden md:table-cell">
                    {appt.specialty}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">
                    {appt.date}
                  </td>
                  <td className="px-5 py-3.5 text-sm font-mono text-slate-700">
                    {appt.time}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[appt.status]}`}>

                      {appt.status}
                    </span>
                  </td>
                </motion.tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>);

}