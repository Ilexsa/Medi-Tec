import React, { useMemo, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CalendarIcon, ClockIcon, PlusIcon, TrashIcon, UserCheckIcon,
  CalendarDaysIcon, CalendarPlusIcon, CheckCircle2Icon, PlayCircleIcon,
  FileTextIcon, AlertCircleIcon,
} from 'lucide-react'

// --- Servicios de API ---
import { getDoctors, DoctorApi } from '../services/doctors'
import { getHorarios, createHorario, deleteHorario, updateHorario } from '../services/schedules'
import { generarTurnos, generarTurnosAdicionales } from '../services/turns'

const DAYS = [
  { key: 'lunes', label: 'Lunes', jsDay: 1 },
  { key: 'martes', label: 'Martes', jsDay: 2 },
  { key: 'miercoles', label: 'Miércoles', jsDay: 3 },
  { key: 'jueves', label: 'Jueves', jsDay: 4 },
  { key: 'viernes', label: 'Viernes', jsDay: 5 },
  { key: 'sabado', label: 'Sábado', jsDay: 6 },
  { key: 'domingo', label: 'Domingo', jsDay: 0 },
]

interface DaySchedule {
  enabled: boolean
  startTime: string
  endTime: string
  slots: number
  numTurnosAuto: number
  horarioId?: number
}

type WeekSchedule = Record<string, DaySchedule>

const defaultDay: DaySchedule = {
  enabled: false, startTime: '08:00', endTime: '14:00', slots: 20, numTurnosAuto: 0,
}
const defaultWeek: WeekSchedule = Object.fromEntries(
  DAYS.map((d) => [d.key, { ...defaultDay, enabled: d.key !== 'sabado' && d.key !== 'domingo' }])
)

interface SavedSchedule {
  id: number
  doctorId: number
  doctorName: string
  dayKey: string
  dayName: string
  startTime: string
  endTime: string
  duracionSlot: number
  numTurnosAuto: number
  startDate: string
  endDate: string
  status: 'Activo' | 'Inactivo'
}

interface GeneratedSlotBatch {
  id: number
  doctorName: string
  date: string
  details: string
  slotsCount: number
  type: 'Masivo' | 'Adicional'
}

export function Schedules() {
  const [activeTab, setActiveTab] = useState<'schedule' | 'generate' | 'additional'>('schedule')
  const [doctorsList, setDoctorsList] = useState<DoctorApi[]>([])

  // --- Tab 1 State (Configurar Horarios) ---
  const [selectedDoctor, setSelectedDoctor] = useState<number | ''>('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [schedule, setSchedule] = useState<WeekSchedule>(defaultWeek)
  const [savedSchedules, setSavedSchedules] = useState<SavedSchedule[]>([])
  
  // --- Tab 2 State (Generar Turnos Masivos) ---
  const [genSelectedDoctor, setGenSelectedDoctor] = useState<number | ''>('')
  const [genStartDate, setGenStartDate] = useState('')
  const [genEndDate, setGenEndDate] = useState('')
  const [genSlotDuration, setGenSlotDuration] = useState<number>(20)
  const [genOverwrite, setGenOverwrite] = useState<boolean>(true)
  
  // --- Tab 3 State (Turnos Adicionales) ---
  const [addSelectedDoctor, setAddSelectedDoctor] = useState<number | ''>('')
  const [addDate, setAddDate] = useState('')
  const [addSlots, setAddSlots] = useState<number>(1)

  // Registro visual de turnos generados (Compartido para Tab 2 y 3)
  const [generatedLogs, setGeneratedLogs] = useState<GeneratedSlotBatch[]>([])

  useEffect(() => {
    getDoctors({ limit: 100 }).then(res => setDoctorsList(res.data)).catch(console.error)
  }, [])

  useEffect(() => {
    if (selectedDoctor) loadDoctorSchedules(Number(selectedDoctor))
    else { setSchedule(defaultWeek); setStartDate(''); setEndDate(''); setSavedSchedules([]); }
  }, [selectedDoctor])

  const loadDoctorSchedules = async (medicoId: number) => {
    try {
      const apiHorarios = await getHorarios(medicoId)
      const newWeekConfig = Object.fromEntries(DAYS.map(d => [d.key, { ...defaultDay, enabled: false }]))
      const newSavedSchedules: SavedSchedule[] = []
      let minStart = '', maxEnd = ''
      const doc = doctorsList.find(d => d.id === medicoId)
      const doctorName = doc ? `Dr. ${doc.nombres} ${doc.apellidos}` : 'Médico Desconocido'

      apiHorarios.forEach(h => {
        const dMatch = DAYS.find(d => d.jsDay === h.dia_semana)
        if (dMatch) {
          newWeekConfig[dMatch.key] = {
            enabled: h.activo, startTime: h.hora_inicio.substring(0, 5), endTime: h.hora_fin.substring(0, 5),
            slots: h.duracion_slot, numTurnosAuto: h.num_turnos_automaticos || 0, horarioId: h.id
          }
          if (h.fecha_vigencia_desde && !minStart) minStart = h.fecha_vigencia_desde.split('T')[0]
          if (h.fecha_vigencia_hasta && !maxEnd) maxEnd = h.fecha_vigencia_hasta.split('T')[0]
          newSavedSchedules.push({
            id: h.id, doctorId: medicoId, doctorName, dayKey: dMatch.key, dayName: dMatch.label,
            startTime: h.hora_inicio.substring(0, 5), endTime: h.hora_fin.substring(0, 5),
            duracionSlot: h.duracion_slot, numTurnosAuto: h.num_turnos_automaticos || 0,
            startDate: h.fecha_vigencia_desde ? h.fecha_vigencia_desde.split('T')[0] : '',
            endDate: h.fecha_vigencia_hasta ? h.fecha_vigencia_hasta.split('T')[0] : '',
            status: h.activo ? 'Activo' : 'Inactivo'
          })
        }
      })
      setSchedule(newWeekConfig); if (minStart) setStartDate(minStart); if (maxEnd) setEndDate(maxEnd);
      newSavedSchedules.sort((a, b) => DAYS.findIndex(d => d.key === a.dayKey) - DAYS.findIndex(d => d.key === b.dayKey))
      setSavedSchedules(newSavedSchedules)
    } catch (err) { setSchedule(defaultWeek); setSavedSchedules([]); }
  }

  const activeDaysCount = Object.values(schedule).filter((d) => d.enabled).length
  const weeklyAutoTurns = Object.values(schedule).reduce((acc, d) => acc + (d.enabled ? d.numTurnosAuto : 0), 0)

  const updateDay = (day: string, updates: Partial<DaySchedule>) => {
    setSchedule((prev) => ({ ...prev, [day]: { ...prev[day], ...updates } }))
  }

  const handleSaveSchedule = async () => {
    if (!selectedDoctor || !startDate || !endDate) return alert('Complete el médico y las fechas.')
    const doc = doctorsList.find((d) => d.id === selectedDoctor)
    if (!doc) return
    try {
      for (const day of DAYS) {
        const ds = schedule[day.key]
        const payload = {
          dia_semana: day.jsDay, hora_inicio: ds.startTime, hora_fin: ds.endTime,
          duracion_slot: ds.slots, num_turnos_automaticos: ds.numTurnosAuto,
          especialidad_id: doc.especialidad_id, fecha_vigencia_desde: startDate, fecha_vigencia_hasta: endDate, activo: true
        }
        if (ds.enabled) {
          if (ds.horarioId) await updateHorario(Number(selectedDoctor), ds.horarioId, payload)
          else await createHorario(Number(selectedDoctor), payload)
        } else if (!ds.enabled && ds.horarioId) {
          await deleteHorario(Number(selectedDoctor), ds.horarioId)
        }
      }
      alert('Configuración guardada exitosamente.')
      loadDoctorSchedules(Number(selectedDoctor))
    } catch (error: any) { alert(`Error: ${error.message}`) }
  }

  const handleDeleteSingleSchedule = async (horarioId: number, dayKey: string) => {
    if (confirm('¿Eliminar este día del horario?')) {
      try {
        await deleteHorario(Number(selectedDoctor), horarioId)
        setSavedSchedules((prev) => prev.filter((s) => s.id !== horarioId))
        updateDay(dayKey, { enabled: false, horarioId: undefined })
      } catch (err: any) { alert("Error: " + err.message) }
    }
  }

  // ==========================================
  // HANDLERS TAB 2: GENERAR TURNOS MASIVOS
  // ==========================================
  const handleGenerateMasivo = async () => {
    if (!genSelectedDoctor || !genStartDate || !genEndDate || genSlotDuration <= 0) {
      return alert("Por favor complete todos los campos de generación.")
    }

    try {
      const payload = {
        medico_id: Number(genSelectedDoctor),
        fecha_inicio: genStartDate,
        fecha_fin: genEndDate,
        duracion_slot: genSlotDuration,
        sobrescribir: genOverwrite
      }
      
      const res = await generarTurnos(payload)
      const doc = doctorsList.find(d => d.id === genSelectedDoctor)

      alert(`¡Éxito! Se generaron ${res.turnos_generados} turnos en el calendario.`)
      
      setGeneratedLogs(prev => [{
        id: Date.now(),
        doctorName: doc ? `Dr. ${doc.nombres} ${doc.apellidos}` : 'Médico',
        date: new Date().toLocaleDateString(),
        details: `${genStartDate} al ${genEndDate} (${genSlotDuration}m)`,
        slotsCount: res.turnos_generados,
        type: 'Masivo'
      }, ...prev])

    } catch (error: any) {
      alert("Error al generar turnos: " + error.message)
    }
  }

  // ==========================================
  // HANDLERS TAB 3: TURNOS ADICIONALES
  // ==========================================
  const handleGenerateAdicional = async () => {
    if (!addSelectedDoctor || !addDate || addSlots <= 0) {
      return alert("Complete el médico, fecha y cantidad de turnos.")
    }

    try {
      const payload = {
        medico_id: Number(addSelectedDoctor),
        fecha: addDate,
        cantidad: addSlots
      }
      
      const res = await generarTurnosAdicionales(payload)
      const doc = doctorsList.find(d => d.id === addSelectedDoctor)

      alert(`¡Éxito! Se generaron ${res.turnos_generados} turnos adicionales.`)

      setGeneratedLogs(prev => [{
        id: Date.now(),
        doctorName: doc ? `Dr. ${doc.nombres} ${doc.apellidos}` : 'Médico',
        date: new Date().toLocaleDateString(),
        details: `Para el día ${addDate}`,
        slotsCount: res.turnos_generados,
        type: 'Adicional'
      }, ...prev])

      setAddSlots(1) // reset
    } catch (error: any) {
      alert("Error al generar turnos adicionales: " + error.message)
    }
  }

  const handleDeleteLog = (id: number) => {
    setGeneratedLogs(prev => prev.filter(log => log.id !== id))
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header y Tabs quedan iguales */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarDaysIcon className="w-6 h-6 text-blue-700" /> Horarios y Turnos
          </h1>
          <p className="text-sm text-slate-500 mt-1">Gestión de plantillas, generación masiva y slots adicionales</p>
        </div>
      </div>

      <div className="flex gap-2 bg-slate-100 p-1 rounded-xl w-fit overflow-x-auto">
        <button onClick={() => setActiveTab('schedule')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'schedule' ? 'text-blue-800 bg-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          <CalendarIcon className="w-4 h-4" /> Configurar Horarios
        </button>
        <button onClick={() => setActiveTab('generate')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'generate' ? 'text-blue-800 bg-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          <PlayCircleIcon className="w-4 h-4" /> Generar Masivo
        </button>
        <button onClick={() => setActiveTab('additional')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'additional' ? 'text-blue-800 bg-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          <CalendarPlusIcon className="w-4 h-4" /> Turnos Adicionales
        </button>
      </div>

      <AnimatePresence mode="wait">
        
        {/* ================= TAB 1: HORARIOS (Oculto en este snippet para no alargar, asume que es lo mismo que ya validamos) ================= */}
        {activeTab === 'schedule' && (
           <motion.div key="schedule" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              {/* Parámetros Generales */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                  <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                    <UserCheckIcon className="w-5 h-5 text-blue-600" /> Parámetros Generales
                  </h2>
                </div>
                <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Médico</label>
                    <select value={selectedDoctor} onChange={(e) => setSelectedDoctor(Number(e.target.value) || '')} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                      <option value="">-- Seleccione un médico --</option>
                      {doctorsList.map((d) => <option key={d.id} value={d.id}>Dr. {d.nombres} {d.apellidos}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Vigencia Desde</label>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Vigencia Hasta</label>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                  </div>
                </div>
              </div>

              {/* Grid Semanal */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                      <ClockIcon className="w-5 h-5 text-blue-600" /> Configuración por Día
                    </h2>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {DAYS.map((day) => {
                      const ds = schedule[day.key]
                      return (
                        <div key={day.key} className={`px-5 py-4 flex flex-wrap items-center gap-3 transition-opacity ${!ds.enabled ? 'opacity-60 bg-slate-50/50' : ''}`}>
                          <div className="flex items-center gap-3 w-28">
                            <button onClick={() => updateDay(day.key, { enabled: !ds.enabled })} className={`relative inline-flex h-6 w-11 rounded-full border-2 border-transparent transition-colors ${ds.enabled ? 'bg-blue-600' : 'bg-slate-300'}`}>
                              <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${ds.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                            <span className="text-sm font-medium text-slate-700">{day.label}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <label className="text-xs text-slate-500">De:</label>
                            <input type="time" value={ds.startTime} onChange={(e) => updateDay(day.key, { startTime: e.target.value })} disabled={!ds.enabled} className="w-24 border border-slate-200 rounded-lg px-2 py-1.5 text-sm" />
                          </div>
                          <div className="flex items-center gap-1.5">
                            <label className="text-xs text-slate-500">A:</label>
                            <input type="time" value={ds.endTime} onChange={(e) => updateDay(day.key, { endTime: e.target.value })} disabled={!ds.enabled} className="w-24 border border-slate-200 rounded-lg px-2 py-1.5 text-sm" />
                          </div>
                          <div className="flex items-center gap-1.5 ml-auto">
                            <label className="text-[10px] text-slate-400">Slot(m)</label>
                            <input type="number" min="1" value={ds.slots} onChange={(e) => updateDay(day.key, { slots: parseInt(e.target.value) || 0 })} disabled={!ds.enabled} className="w-14 border border-slate-200 rounded-lg px-1.5 py-1 text-xs text-center" />
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="text-xs font-semibold text-slate-700">Max. Turnos</label>
                            <input type="number" min="0" value={ds.numTurnosAuto} onChange={(e) => updateDay(day.key, { numTurnosAuto: parseInt(e.target.value) || 0 })} disabled={!ds.enabled} className="w-16 border border-blue-300 rounded-lg px-2 py-1.5 text-sm font-bold text-blue-700 text-center" />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-blue-50 rounded-xl border border-blue-100 p-6">
                    <h3 className="text-sm font-semibold text-blue-900 mb-4 flex items-center gap-2"><CheckCircle2Icon className="w-5 h-5" /> Resumen</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-3 border-b border-blue-200/50">
                        <span className="text-sm text-blue-800">Días activos</span>
                        <span className="font-semibold text-blue-900">{activeDaysCount}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-sm font-medium text-blue-900">Total Turnos/Semana</span>
                        <span className="text-2xl font-bold text-blue-700">{weeklyAutoTurns}</span>
                      </div>
                    </div>
                    <button onClick={handleSaveSchedule} className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 bg-blue-800 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold">
                      <CalendarPlusIcon className="w-5 h-5" /> Guardar Horario
                    </button>
                  </div>
                </div>
              </div>

              {/* Tabla Plantillas por Día */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100"><h2 className="text-base font-semibold text-slate-800">Detalle de Horarios Guardados</h2></div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-left text-xs font-semibold text-slate-500 uppercase">
                        <th className="px-5 py-3">Día</th>
                        <th className="px-5 py-3">Horario</th>
                        <th className="px-5 py-3 text-center">Turnos Auto.</th>
                        <th className="px-5 py-3 text-center">Vigencia</th>
                        <th className="px-5 py-3 text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {savedSchedules.length === 0 ? (
                        <tr><td colSpan={5} className="px-5 py-8 text-center text-sm text-slate-400">No hay días registrados.</td></tr>
                      ) : (
                        savedSchedules.map((s) => (
                          <tr key={s.id} className="hover:bg-slate-50">
                            <td className="px-5 py-3.5 text-sm font-bold text-slate-800">{s.dayName}</td>
                            <td className="px-5 py-3.5 text-sm text-slate-600">{s.startTime} a {s.endTime} <span className="text-xs text-slate-400">({s.duracionSlot}m)</span></td>
                            <td className="px-5 py-3.5 text-sm text-center font-bold text-blue-700">{s.numTurnosAuto}</td>
                            <td className="px-5 py-3.5 text-sm text-center text-slate-600">{s.startDate} - {s.endDate}</td>
                            <td className="px-5 py-3.5 text-right">
                              <button onClick={() => handleDeleteSingleSchedule(s.id, s.dayKey)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><TrashIcon className="w-4 h-4" /></button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
           </motion.div>
        )}

        {/* ================= TAB 2: GENERAR TURNOS MASIVOS ================= */}
        {activeTab === 'generate' && (
          <motion.div key="generate" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                  <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                    <PlayCircleIcon className="w-5 h-5 text-blue-600" /> Generar Turnos desde Plantilla
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">El sistema leerá los horarios activos del médico en este rango de fechas y creará los turnos reales.</p>
                </div>
                
                <div className="p-6 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Médico</label>
                    <select value={genSelectedDoctor} onChange={(e) => setGenSelectedDoctor(Number(e.target.value) || '')} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 bg-white">
                      <option value="">-- Seleccione un médico --</option>
                      {doctorsList.map((d) => <option key={d.id} value={d.id}>Dr. {d.nombres} {d.apellidos}</option>)}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Fecha Inicio</label>
                      <input type="date" value={genStartDate} onChange={e => setGenStartDate(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Fecha Fin</label>
                      <input type="date" value={genEndDate} onChange={e => setGenEndDate(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 bg-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 items-center">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Duración del Turno (min)</label>
                      <input type="number" value={genSlotDuration} onChange={e => setGenSlotDuration(Number(e.target.value))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 bg-white" />
                    </div>
                    <div className="flex items-center gap-2 mt-6">
                      <input type="checkbox" id="overwrite" checked={genOverwrite} onChange={e => setGenOverwrite(e.target.checked)} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                      <label htmlFor="overwrite" className="text-sm font-medium text-slate-700">Sobrescribir turnos existentes</label>
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-slate-100 flex justify-end">
                    <button onClick={handleGenerateMasivo} className="flex items-center gap-2 px-6 py-3 bg-blue-800 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm">
                      <PlayCircleIcon className="w-5 h-5" /> Generar en Calendario
                    </button>
                  </div>
                </div>
              </div>

              {/* LOG DE GENERACIÓN (Sirve para Tab 2 y 3) */}
              <div className="bg-green-50 rounded-xl border border-green-100 p-6 h-fit">
                <h3 className="text-sm font-semibold text-green-900 mb-4 flex items-center gap-2">
                  <FileTextIcon className="w-5 h-5 text-green-600" /> Historial de Generación
                </h3>
                <div className="space-y-3">
                  {generatedLogs.length === 0 ? (
                    <p className="text-xs text-green-700 bg-green-100/50 p-3 rounded-lg flex gap-2">
                      <AlertCircleIcon className="w-4 h-4 flex-shrink-0" /> No hay turnos generados en esta sesión.
                    </p>
                  ) : (
                    generatedLogs.map(log => (
                      <div key={log.id} className="bg-white p-3 rounded-lg border border-green-200 text-sm flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-slate-800">{log.doctorName}</p>
                          <p className="text-xs text-slate-500">{log.details}</p>
                          <span className={`mt-1 inline-block px-2 py-0.5 rounded text-[10px] font-bold ${log.type === 'Masivo' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                            {log.type}
                          </span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-bold text-green-600">+{log.slotsCount}</span>
                          <button onClick={() => handleDeleteLog(log.id)} className="text-[10px] text-slate-400 hover:text-red-500 mt-2">Limpiar</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================= TAB 3: TURNOS ADICIONALES ================= */}
        {activeTab === 'additional' && (
          <motion.div key="additional" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                  <CalendarPlusIcon className="w-5 h-5 text-blue-600" /> Turnos Extras (Sobrecupo)
                </h2>
                <p className="text-sm text-slate-500 mt-1">Genera turnos adicionales a la capacidad normal del día.</p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Médico</label>
                    <select value={addSelectedDoctor} onChange={(e) => setAddSelectedDoctor(Number(e.target.value) || '')} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 bg-white">
                      <option value="">-- Seleccione un médico --</option>
                      {doctorsList.map((d) => <option key={d.id} value={d.id}>Dr. {d.nombres} {d.apellidos}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Fecha del Sobrecupo</label>
                    <input type="date" value={addDate} onChange={(e) => setAddDate(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Cantidad Extra a Generar</label>
                    <input type="number" min="1" value={addSlots} onChange={(e) => setAddSlots(parseInt(e.target.value) || 0)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 bg-white" />
                  </div>
                </div>
                <div className="mt-6 pt-5 border-t border-slate-100 flex justify-end">
                  <button onClick={handleGenerateAdicional} className="flex items-center gap-2 px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm">
                    <PlusIcon className="w-5 h-5" /> Agregar Turnos Adicionales
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}