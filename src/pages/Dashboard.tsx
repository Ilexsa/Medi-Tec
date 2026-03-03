import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UsersIcon,
  CalendarIcon,
  UserCheckIcon,
  ClipboardListIcon,
  TrendingUpIcon,
  ArrowRightIcon,
  ClockIcon } from
'lucide-react';
export function Dashboard() {
  const navigate = useNavigate();
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-800">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {new Date().toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Pacientes Hoy
            </p>
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <UsersIcon size={16} className="text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-800">12</p>
          <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
            <TrendingUpIcon size={11} /> +3 vs ayer
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Citas Agendadas
            </p>
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <CalendarIcon size={16} className="text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-800">9</p>
          <p className="text-xs text-slate-400 mt-1">3 pendientes</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Médicos Activos
            </p>
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              <UserCheckIcon size={16} className="text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-800">3</p>
          <p className="text-xs text-slate-400 mt-1">En consulta ahora</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Exámenes Pendientes
            </p>
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <ClipboardListIcon size={16} className="text-amber-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-800">5</p>
          <p className="text-xs text-amber-600 mt-1">Por procesar</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Today's queue */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-700">
              Cola de Hoy
            </h2>
            <button
              onClick={() => navigate('/medical-consult')}
              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 transition-colors">

              Ver todo <ArrowRightIcon size={12} />
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {[
            {
              patient: 'María García',
              time: '08:30',
              doctor: 'Dr. Mendoza',
              status: 'En Atención'
            },
            {
              patient: 'Luis Rodríguez',
              time: '09:00',
              doctor: 'Dr. Mendoza',
              status: 'Pendiente'
            },
            {
              patient: 'Sofía López',
              time: '08:30',
              doctor: 'Dra. Torres',
              status: 'Pendiente'
            },
            {
              patient: 'Elena Vargas',
              time: '10:00',
              doctor: 'Dr. Vega',
              status: 'Pendiente'
            }].
            map((item, i) =>
            <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                <div className="flex items-center gap-1.5 text-slate-400 w-14">
                  <ClockIcon size={12} />
                  <span className="text-xs">{item.time}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">
                    {item.patient}
                  </p>
                  <p className="text-xs text-slate-400">{item.doctor}</p>
                </div>
                <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.status === 'En Atención' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>

                  {item.status}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-700">
              Acciones Rápidas
            </h2>
          </div>
          <div className="p-4 grid grid-cols-2 gap-3">
            {[
            {
              label: 'Nueva Consulta',
              path: '/medical-consult',
              color: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
              icon: <ClipboardListIcon size={18} />
            },
            {
              label: 'Reservar Turno',
              path: '/book-appointment',
              color: 'bg-purple-50 text-purple-700 hover:bg-purple-100',
              icon: <CalendarIcon size={18} />
            },
            {
              label: 'Nuevo Paciente',
              path: '/patients',
              color: 'bg-green-50 text-green-700 hover:bg-green-100',
              icon: <UsersIcon size={18} />
            },
            {
              label: 'Facturación',
              path: '/billing',
              color: 'bg-amber-50 text-amber-700 hover:bg-amber-100',
              icon: <UserCheckIcon size={18} />
            }].
            map((action) =>
            <button
              key={action.path}
              onClick={() => navigate(action.path)}
              className={`flex items-center gap-3 p-4 rounded-xl text-sm font-medium transition-colors ${action.color}`}>

                {action.icon}
                {action.label}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>);

}