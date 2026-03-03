import React, { useState } from 'react';
import { CalendarIcon, ClockIcon, ChevronDownIcon } from 'lucide-react';
interface Doctor {
  id: number;
  nombre: string;
  apellido: string;
  especialidad: string;
}
interface DaySchedule {
  enabled: boolean;
  startTime: string;
  endTime: string;
  slotDuration: number;
}
type WeekSchedule = Record<string, DaySchedule>;
const DOCTORS: Doctor[] = [
{
  id: 1,
  nombre: 'Carlos',
  apellido: 'Mendoza',
  especialidad: 'Medicina General'
},
{
  id: 2,
  nombre: 'Ana',
  apellido: 'Torres',
  especialidad: 'Pediatría'
},
{
  id: 3,
  nombre: 'Roberto',
  apellido: 'Vega',
  especialidad: 'Odontología'
}];

const DAYS = [
{
  key: 'lunes',
  label: 'Lunes'
},
{
  key: 'martes',
  label: 'Martes'
},
{
  key: 'miercoles',
  label: 'Miércoles'
},
{
  key: 'jueves',
  label: 'Jueves'
},
{
  key: 'viernes',
  label: 'Viernes'
},
{
  key: 'sabado',
  label: 'Sábado'
},
{
  key: 'domingo',
  label: 'Domingo'
}];

const defaultDay: DaySchedule = {
  enabled: false,
  startTime: '08:00',
  endTime: '17:00',
  slotDuration: 30
};
const defaultWeek: WeekSchedule = Object.fromEntries(
  DAYS.map((d) => [
  d.key,
  {
    ...defaultDay,
    enabled: d.key !== 'sabado' && d.key !== 'domingo'
  }]
  )
);
function generateSlots(start: string, end: string, duration: number): string[] {
  const slots: string[] = [];
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  let current = sh * 60 + sm;
  const endMin = eh * 60 + em;
  while (current + duration <= endMin) {
    const h = Math.floor(current / 60).
    toString().
    padStart(2, '0');
    const m = (current % 60).toString().padStart(2, '0');
    slots.push(`${h}:${m}`);
    current += duration;
  }
  return slots;
}
export function Schedules() {
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [schedule, setSchedule] = useState<WeekSchedule>(defaultWeek);
  const [saved, setSaved] = useState(false);
  const doctor = DOCTORS.find((d) => d.id === selectedDoctor);
  const updateDay = (day: string, updates: Partial<DaySchedule>) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        ...updates
      }
    }));
    setSaved(false);
  };
  const allSlots = DAYS.filter((d) => schedule[d.key].enabled).flatMap((d) => {
    const ds = schedule[d.key];
    return generateSlots(ds.startTime, ds.endTime, ds.slotDuration).map(
      (t) => ({
        day: d.label,
        time: t
      })
    );
  });
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
          <CalendarIcon size={22} className="text-blue-600" />
          Crear Horarios
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Configure el horario semanal y genere turnos automáticos
        </p>
      </div>

      {/* Doctor selector */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-5">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Seleccionar Médico
        </label>
        <select
          value={selectedDoctor ?? ''}
          onChange={(e) => {
            setSelectedDoctor(Number(e.target.value) || null);
            setSaved(false);
          }}
          className="w-full max-w-sm border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

          <option value="">-- Seleccione un médico --</option>
          {DOCTORS.map((d) =>
          <option key={d.id} value={d.id}>
              Dr. {d.nombre} {d.apellido} — {d.especialidad}
            </option>
          )}
        </select>
        {doctor &&
        <p className="mt-2 text-xs text-blue-600 font-medium">
            Configurando horario para: Dr. {doctor.nombre} {doctor.apellido} (
            {doctor.especialidad})
          </p>
        }
      </div>

      {selectedDoctor &&
      <>
          {/* Weekly schedule */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-5">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-700">
                Configuración Semanal
              </h2>
            </div>
            <div className="divide-y divide-slate-50">
              {DAYS.map((day) => {
              const ds = schedule[day.key];
              return (
                <div
                  key={day.key}
                  className={`px-5 py-4 flex flex-wrap items-center gap-4 ${!ds.enabled ? 'opacity-50' : ''}`}>

                    <div className="flex items-center gap-3 w-28">
                      <button
                      onClick={() =>
                      updateDay(day.key, {
                        enabled: !ds.enabled
                      })
                      }
                      className={`relative w-10 h-5 rounded-full transition-colors ${ds.enabled ? 'bg-blue-600' : 'bg-slate-200'}`}>

                        <span
                        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${ds.enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />

                      </button>
                      <span className="text-sm font-medium text-slate-700">
                        {day.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-slate-500">Inicio</label>
                      <input
                      type="time"
                      value={ds.startTime}
                      onChange={(e) =>
                      updateDay(day.key, {
                        startTime: e.target.value
                      })
                      }
                      disabled={!ds.enabled}
                      className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50" />

                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-slate-500">Fin</label>
                      <input
                      type="time"
                      value={ds.endTime}
                      onChange={(e) =>
                      updateDay(day.key, {
                        endTime: e.target.value
                      })
                      }
                      disabled={!ds.enabled}
                      className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50" />

                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-slate-500">Duración</label>
                      <select
                      value={ds.slotDuration}
                      onChange={(e) =>
                      updateDay(day.key, {
                        slotDuration: Number(e.target.value)
                      })
                      }
                      disabled={!ds.enabled}
                      className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50">

                        <option value={15}>15 min</option>
                        <option value={20}>20 min</option>
                        <option value={30}>30 min</option>
                        <option value={45}>45 min</option>
                        <option value={60}>60 min</option>
                      </select>
                    </div>
                    {ds.enabled &&
                  <span className="text-xs text-slate-400 ml-auto">
                        {
                    generateSlots(
                      ds.startTime,
                      ds.endTime,
                      ds.slotDuration
                    ).length
                    }{' '}
                        turnos
                      </span>
                  }
                  </div>);

            })}
            </div>
          </div>

          {/* Slot preview */}
          {allSlots.length > 0 &&
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-5">
              <h2 className="text-sm font-semibold text-slate-700 mb-3">
                Vista Previa — {allSlots.length} turnos generados
              </h2>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                {allSlots.map((slot, i) =>
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">

                    <ClockIcon size={11} />
                    {slot.day} {slot.time}
                  </span>
            )}
              </div>
            </div>
        }

          <div className="flex justify-end">
            <button
            onClick={() => setSaved(true)}
            className="px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-medium transition-colors">

              {saved ? '✓ Horario Guardado' : 'Guardar Horario'}
            </button>
          </div>
        </>
      }
    </div>);

}