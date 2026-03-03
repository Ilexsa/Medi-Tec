import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  StethoscopeIcon,
  SearchIcon,
  CalendarIcon,
  PlayCircleIcon,
  ClockIcon } from
'lucide-react';
interface Consultation {
  id: number;
  patientName: string;
  doctorId: number;
  time: string;
  reason: string;
  status: 'Pendiente' | 'En Atención' | 'Completada';
}
interface DoctorGroup {
  id: number;
  name: string;
  specialty: string;
  consultations: Consultation[];
}
const MOCK_DATA: DoctorGroup[] = [
{
  id: 1,
  name: 'Dr. Carlos Mendoza',
  specialty: 'Medicina General',
  consultations: [
  {
    id: 101,
    patientName: 'Juan Pérez',
    doctorId: 1,
    time: '08:00',
    reason: 'Control rutinario',
    status: 'Completada'
  },
  {
    id: 102,
    patientName: 'María García',
    doctorId: 1,
    time: '08:30',
    reason: 'Dolor de cabeza',
    status: 'En Atención'
  },
  {
    id: 103,
    patientName: 'Luis Rodríguez',
    doctorId: 1,
    time: '09:00',
    reason: 'Fiebre persistente',
    status: 'Pendiente'
  },
  {
    id: 104,
    patientName: 'Carmen Díaz',
    doctorId: 1,
    time: '09:30',
    reason: 'Chequeo anual',
    status: 'Pendiente'
  }]

},
{
  id: 2,
  name: 'Dra. Ana Torres',
  specialty: 'Pediatría',
  consultations: [
  {
    id: 201,
    patientName: 'Pedro Martínez (menor)',
    doctorId: 2,
    time: '08:00',
    reason: 'Vacunación',
    status: 'Completada'
  },
  {
    id: 202,
    patientName: 'Sofía López (menor)',
    doctorId: 2,
    time: '08:30',
    reason: 'Tos y resfriado',
    status: 'Pendiente'
  },
  {
    id: 203,
    patientName: 'Diego Sánchez (menor)',
    doctorId: 2,
    time: '09:00',
    reason: 'Control de peso',
    status: 'Pendiente'
  }]

},
{
  id: 3,
  name: 'Dr. Roberto Vega',
  specialty: 'Odontología',
  consultations: [
  {
    id: 301,
    patientName: 'Elena Vargas',
    doctorId: 3,
    time: '10:00',
    reason: 'Limpieza dental',
    status: 'Pendiente'
  },
  {
    id: 302,
    patientName: 'Miguel Torres',
    doctorId: 3,
    time: '10:30',
    reason: 'Dolor molar',
    status: 'Pendiente'
  }]

}];

const statusConfig = {
  Pendiente: 'bg-amber-100 text-amber-700',
  'En Atención': 'bg-blue-100 text-blue-700',
  Completada: 'bg-green-100 text-green-700'
};
export function MedicalConsult() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [search, setSearch] = useState('');
  const filtered = MOCK_DATA.map((group) => ({
    ...group,
    consultations: group.consultations.filter(
      (c) =>
      c.patientName.toLowerCase().includes(search.toLowerCase()) ||
      c.reason.toLowerCase().includes(search.toLowerCase()) ||
      c.status.toLowerCase().includes(search.toLowerCase())
    )
  })).filter((g) => g.consultations.length > 0);
  const totalConsults = MOCK_DATA.reduce(
    (acc, g) => acc + g.consultations.length,
    0
  );
  const pending = MOCK_DATA.reduce(
    (acc, g) =>
    acc + g.consultations.filter((c) => c.status === 'Pendiente').length,
    0
  );
  const inProgress = MOCK_DATA.reduce(
    (acc, g) =>
    acc + g.consultations.filter((c) => c.status === 'En Atención').length,
    0
  );
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
          <StethoscopeIcon size={22} className="text-blue-600" />
          Consultas del Día
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Cola de atención médica agrupada por médico
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500 mb-1">Total Consultas</p>
          <p className="text-2xl font-bold text-slate-800">{totalConsults}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-amber-600 mb-1">Pendientes</p>
          <p className="text-2xl font-bold text-amber-600">{pending}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-blue-600 mb-1">En Atención</p>
          <p className="text-2xl font-bold text-blue-600">{inProgress}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2">
          <CalendarIcon size={15} className="text-slate-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="text-sm focus:outline-none" />

        </div>
        <div className="relative flex-1 min-w-48">
          <SearchIcon
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Buscar paciente, motivo, estado..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />

        </div>
      </div>

      {/* Doctor groups */}
      <div className="space-y-4">
        {filtered.map((group) =>
        <div
          key={group.id}
          className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

            <div className="flex items-center gap-3 px-5 py-3.5 bg-slate-50 border-b border-slate-100">
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                {group.name.split(' ')[1]?.[0]}
                {group.name.split(' ')[2]?.[0]}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {group.name}
                </p>
                <p className="text-xs text-slate-500">{group.specialty}</p>
              </div>
              <span className="ml-auto text-xs text-slate-400">
                {group.consultations.length} consultas
              </span>
            </div>
            <div className="divide-y divide-slate-50">
              {group.consultations.map((consult) =>
            <div
              key={consult.id}
              className="flex items-center gap-4 px-5 py-3.5">

                  <div className="flex items-center gap-1.5 text-slate-500 w-14">
                    <ClockIcon size={13} />
                    <span className="text-xs font-medium">{consult.time}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">
                      {consult.patientName}
                    </p>
                    <p className="text-xs text-slate-500">{consult.reason}</p>
                  </div>
                  <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[consult.status]}`}>

                    {consult.status}
                  </span>
                  {consult.status !== 'Completada' &&
              <button
                onClick={() =>
                navigate(`/medical-attention/${consult.id}`)
                }
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-medium transition-colors">

                      <PlayCircleIcon size={13} />
                      Iniciar Atención
                    </button>
              }
                  {consult.status === 'Completada' &&
              <button
                onClick={() =>
                navigate(`/medical-attention/${consult.id}`)
                }
                className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium transition-colors hover:bg-slate-50">

                      Ver Detalle
                    </button>
              }
                </div>
            )}
            </div>
          </div>
        )}
        {filtered.length === 0 &&
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <StethoscopeIcon
            size={32}
            className="text-slate-300 mx-auto mb-3" />

            <p className="text-slate-400 text-sm">
              No hay consultas para esta fecha
            </p>
          </div>
        }
      </div>
    </div>);

}