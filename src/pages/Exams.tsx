import React from 'react';
import { motion } from 'framer-motion';
import { FlaskConicalIcon, PlusIcon } from 'lucide-react';
const exams = [
{
  id: 1,
  patient: 'María González',
  type: 'Hemograma Completo',
  doctor: 'Dr. García',
  date: '02/03/2025',
  status: 'Pendiente',
  priority: 'Normal'
},
{
  id: 2,
  patient: 'Carlos Rodríguez',
  type: 'Resonancia Magnética',
  doctor: 'Dra. Martínez',
  date: '02/03/2025',
  status: 'En Proceso',
  priority: 'Urgente'
},
{
  id: 3,
  patient: 'Ana Fernández',
  type: 'Radiografía de Tórax',
  doctor: 'Dr. López',
  date: '01/03/2025',
  status: 'Completado',
  priority: 'Normal'
},
{
  id: 4,
  patient: 'Luis Pérez',
  type: 'Electrocardiograma',
  doctor: 'Dr. García',
  date: '01/03/2025',
  status: 'Completado',
  priority: 'Normal'
},
{
  id: 5,
  patient: 'Sofía Díaz',
  type: 'Tomografía Computada',
  doctor: 'Dr. Fernández',
  date: '03/03/2025',
  status: 'Pendiente',
  priority: 'Urgente'
}];

const statusStyles: Record<string, string> = {
  Pendiente: 'bg-amber-50 text-amber-700 border border-amber-100',
  'En Proceso': 'bg-blue-50 text-blue-700 border border-blue-100',
  Completado: 'bg-emerald-50 text-emerald-700 border border-emerald-100'
};
const priorityStyles: Record<string, string> = {
  Normal: 'text-slate-500',
  Urgente: 'text-red-600 font-semibold'
};
export function Exams() {
  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Exámenes</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Gestión de estudios y análisis clínicos
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-800 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">
          <PlusIcon className="w-4 h-4" />
          Solicitar Examen
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 shadow-card p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">15</p>
          <p className="text-xs text-slate-500 mt-1">Pendientes</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-card p-4 text-center">
          <p className="text-2xl font-bold text-blue-700">8</p>
          <p className="text-xs text-slate-500 mt-1">En Proceso</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-card p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">42</p>
          <p className="text-xs text-slate-500 mt-1">Completados</p>
        </div>
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
          <FlaskConicalIcon className="w-5 h-5 text-blue-700" />
          <h3 className="text-sm font-semibold text-slate-900">
            Exámenes Recientes
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
                  Tipo de Examen
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3.5 hidden md:table-cell">
                  Médico
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3.5">
                  Fecha
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3.5">
                  Prioridad
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3.5">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {exams.map((exam, i) =>
              <motion.tr
                key={exam.id}
                initial={{
                  opacity: 0
                }}
                animate={{
                  opacity: 1
                }}
                transition={{
                  delay: i * 0.06
                }}
                className="hover:bg-slate-50/50 transition-colors">

                  <td className="px-5 py-3.5 text-sm font-medium text-slate-800">
                    {exam.patient}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">
                    {exam.type}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-500 hidden md:table-cell">
                    {exam.doctor}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">
                    {exam.date}
                  </td>
                  <td
                  className={`px-5 py-3.5 text-xs ${priorityStyles[exam.priority]}`}>

                    {exam.priority}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[exam.status]}`}>

                      {exam.status}
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