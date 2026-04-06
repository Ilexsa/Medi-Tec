import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  StethoscopeIcon,
  SearchIcon,
  CalendarIcon,
  PlayCircleIcon,
  ClockIcon } from
'lucide-react';

import { CitaApi, listAppointments } from '../services/appointments';
import { DoctorApi, getDoctors } from '../services/doctors';

interface DoctorGroup {
  id: number;
  name: string;
  specialty: string;
  consultations: CitaApi[];
}

const statusConfig: Record<string, string> = {
  Pendiente: 'bg-amber-100 text-amber-700',
  'En Atención': 'bg-blue-100 text-blue-700',
  Completada: 'bg-green-100 text-green-700'
};
export function MedicalConsult() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [search, setSearch] = useState('');
  const [appointments, setAppointments] = useState<CitaApi[]>([]);
  const [doctors, setDoctors] = useState<DoctorApi[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [appts, docs] = await Promise.all([
        listAppointments({ limit: 500 }),
        getDoctors({ limit: 100 })
      ]);
      setAppointments((appts as any).data ?? appts ?? []);
      setDoctors((docs as any).data ?? docs ?? []);
    } catch(e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  const groups = useMemo(() => {
    const map = new Map<number, DoctorGroup>();
    doctors.forEach(d => {
      map.set(d.id, {
        id: d.id,
        name: `Dr. ${d.nombres} ${d.apellidos}`,
        specialty: d.nombre_especialidad || 'General',
        consultations: []
      });
    });

    appointments.forEach(a => {
      if (!a.fecha_hora?.startsWith(selectedDate)) return;
      if (typeof a.medico_id === 'number' && map.has(a.medico_id)) {
        map.get(a.medico_id)!.consultations.push(a);
      } else {
        // Just in case medico lacks record
        if (!map.has(a.medico_id)) {
           map.set(a.medico_id, {
              id: a.medico_id,
              name: `Dr. ${a.medico_nombres} ${a.medico_apellidos}`,
              specialty: 'General',
              consultations: []
           });
        }
        map.get(a.medico_id)!.consultations.push(a);
      }
    });
    return Array.from(map.values()).filter(g => g.consultations.length > 0);
  }, [appointments, doctors, selectedDate]);

  const filtered = useMemo(() => {
    return groups.map((group) => ({
      ...group,
      consultations: group.consultations.filter(
        (c) => {
          const pat = `${c.paciente_nombres} ${c.paciente_apellidos}`.toLowerCase();
          const reason = (c.motivo || '').toLowerCase();
          const pstate = (c.estado || '').toLowerCase();
          const srch = search.toLowerCase();
          return pat.includes(srch) || reason.includes(srch) || pstate.includes(srch);
        }
      )
    })).filter((g) => g.consultations.length > 0);
  }, [groups, search]);

  const totalConsults = groups.reduce((acc, g) => acc + g.consultations.length, 0);
  const pending = groups.reduce(
    (acc, g) => acc + g.consultations.filter((c) => c.estado === 'Pendiente' || c.estado === 'Programada').length,
    0
  );
  const inProgress = groups.reduce(
    (acc, g) => acc + g.consultations.filter((c) => c.estado === 'En Atención' || c.estado === 'En Curso').length,
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
              {group.consultations.map((consult) => {
                const timeStr = consult.fecha_hora?.split('T')[1]?.substring(0, 5) || '00:00';
                return (
            <div
              key={consult.id}
              className="flex items-center gap-4 px-5 py-3.5">
                  <div className="flex items-center gap-1.5 text-slate-500 w-14">
                    <ClockIcon size={13} />
                    <span className="text-xs font-medium">{timeStr}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">
                      {consult.paciente_nombres} {consult.paciente_apellidos}
                    </p>
                    <p className="text-xs text-slate-500">{consult.motivo || 'Sin motivo'}</p>
                  </div>
                  <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[consult.estado] || statusConfig.Pendiente}`}>
                    {consult.estado}
                  </span>
                  {consult.estado !== 'Completada' &&
              <button
                onClick={() =>
                navigate(`/medical-attention/${consult.id}`)
                }
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-medium transition-colors">
                      <PlayCircleIcon size={13} />
                      Iniciar Atención
                    </button>
              }
                  {consult.estado === 'Completada' &&
              <button
                onClick={() =>
                navigate(`/medical-attention/${consult.id}`)
                }
                className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium transition-colors hover:bg-slate-50">
                      Ver Detalle
                    </button>
              }
                </div>
                );
            })}
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