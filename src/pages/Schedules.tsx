import React, { useMemo, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CalendarIcon,
  ClockIcon,
  PlusIcon,
  TrashIcon,
  UserCheckIcon,
  CalendarDaysIcon,
  CalendarPlusIcon,
  CheckCircle2Icon,
  PlayCircleIcon,
  FileTextIcon,
  AlertCircleIcon,
} from 'lucide-react'

// --- Servicios de API ---
import { getDoctors, DoctorApi } from '../services/doctors'
import { getHorarios, createHorario, deleteHorario, updateHorario, HorarioApi } from '../services/schedules'
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
  slots: number // duracion_slot (requerido por API)
  numTurnosAuto: number // num_turnos_automaticos
  horarioId?: number
}

type WeekSchedule = Record<string, DaySchedule>

const defaultDay: DaySchedule = {
  enabled: false,
  startTime: '08:00',
  endTime: '14:00',
  slots: 20,
  numTurnosAuto: 0,
}

const defaultWeek: WeekSchedule = Object.fromEntries(
  DAYS.map((d) => [d.key, { ...defaultDay, enabled: d.key !== 'sabado' && d.key !== 'domingo' }])
)

interface SavedSchedule {
  id: number // El ID real del horario (horarioId)
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
  scheduleId: number
  doctorName: string
  date: string
  dayName: string
  startTime: string
  endTime: string
  slotsCount: number
  status: 'Generado' | 'Disponible'
}

interface AdditionalSlot {
  id: number
  doctorId: number
  doctorName: string
  date: string
  startTime: string
  endTime: string
  slots: number
}

export function Schedules() {
  const [activeTab, setActiveTab] = useState<'schedule' | 'generate' | 'additional'>('schedule')
  
  // --- Estados de API Globales ---
  const [doctorsList, setDoctorsList] = useState<DoctorApi[]>([])

  // --- Tab 1 State (Configurar Horarios) ---
  const [selectedDoctor, setSelectedDoctor] = useState<number | ''>('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [schedule, setSchedule] = useState<WeekSchedule>(defaultWeek)
  const [savedSchedules, setSavedSchedules] = useState<SavedSchedule[]>([]) // Ahora es una lista plana de días
  
  // --- Tab 2 State (Generar Turnos) ---
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | ''>('')
  const [generatedSlots, setGeneratedSlots] = useState<GeneratedSlotBatch[]>([])
  
  // --- Tab 3 State (Turnos Adicionales) ---
  const [addSelectedDoctor, setAddSelectedDoctor] = useState<number | ''>('')
  const [addDate, setAddDate] = useState('')
  const [addStartTime, setAddStartTime] = useState('15:00')
  const [addEndTime, setAddEndTime] = useState('18:00')
  const [addSlots, setAddSlots] = useState<number>(10)
  const [additionalSlots, setAdditionalSlots] = useState<AdditionalSlot[]>([])

  // --- Carga Inicial de Médicos ---
  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await getDoctors({ limit: 100 })
        if (res && res.data) setDoctorsList(res.data)
      } catch (err) {
        console.error("Error cargando médicos", err)
      }
    }
    fetchDocs()
  }, [])

  // --- Carga de Horarios al seleccionar Médico ---
  useEffect(() => {
    if (selectedDoctor) {
      loadDoctorSchedules(Number(selectedDoctor))
    } else {
      setSchedule(defaultWeek)
      setStartDate('')
      setEndDate('')
      setSavedSchedules([])
    }
  }, [selectedDoctor])

  const loadDoctorSchedules = async (medicoId: number) => {
    try {
      const apiHorarios = await getHorarios(medicoId)
      
      const newWeekConfig = Object.fromEntries(DAYS.map(d => [d.key, { ...defaultDay, enabled: false }]))
      const newSavedSchedules: SavedSchedule[] = []
      
      let minStart = ''
      let maxEnd = ''

      const doc = doctorsList.find(d => d.id === medicoId)
      const doctorName = doc ? `Dr. ${doc.nombres} ${doc.apellidos}` : 'Médico Desconocido'

      apiHorarios.forEach(h => {
        const dMatch = DAYS.find(d => d.jsDay === h.dia_semana)
        if (dMatch) {
          // Poblar el Grid
          newWeekConfig[dMatch.key] = {
            enabled: h.activo,
            startTime: h.hora_inicio.substring(0, 5),
            endTime: h.hora_fin.substring(0, 5),
            slots: h.duracion_slot,
            numTurnosAuto: h.num_turnos_automaticos || 0,
            horarioId: h.id
          }

          // Fechas para la cabecera
          if (h.fecha_vigencia_desde && !minStart) minStart = h.fecha_vigencia_desde.split('T')[0]
          if (h.fecha_vigencia_hasta && !maxEnd) maxEnd = h.fecha_vigencia_hasta.split('T')[0]

          // Añadir registro individual para la tabla
          newSavedSchedules.push({
            id: h.id,
            doctorId: medicoId,
            doctorName,
            dayKey: dMatch.key,
            dayName: dMatch.label,
            startTime: h.hora_inicio.substring(0, 5),
            endTime: h.hora_fin.substring(0, 5),
            duracionSlot: h.duracion_slot,
            numTurnosAuto: h.num_turnos_automaticos || 0,
            startDate: h.fecha_vigencia_desde ? h.fecha_vigencia_desde.split('T')[0] : '',
            endDate: h.fecha_vigencia_hasta ? h.fecha_vigencia_hasta.split('T')[0] : '',
            status: h.activo ? 'Activo' : 'Inactivo'
          })
        }
      })

      setSchedule(newWeekConfig)
      if (minStart) setStartDate(minStart)
      if (maxEnd) setEndDate(maxEnd)

      // Ordenar por el orden de la semana de DAYS
      newSavedSchedules.sort((a, b) => {
        return DAYS.findIndex(d => d.key === a.dayKey) - DAYS.findIndex(d => d.key === b.dayKey)
      })

      setSavedSchedules(newSavedSchedules)
    } catch (err) {
      console.error("No se pudieron cargar los horarios", err)
      setSchedule(defaultWeek)
      setSavedSchedules([])
    }
  }

  const activeDaysCount = Object.values(schedule).filter((d) => d.enabled).length
  const weeklyAutoTurns = Object.values(schedule).reduce((acc, d) => acc + (d.enabled ? d.numTurnosAuto : 0), 0)

  const updateDay = (day: string, updates: Partial<DaySchedule>) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        ...updates,
      },
    }))
  }

  // --- Handlers Tab 1 ---
  const handleSaveSchedule = async () => {
    if (!selectedDoctor || !startDate || !endDate) {
      alert('Por favor complete el médico y las fechas de inicio y vigencia.')
      return
    }

    const doc = doctorsList.find((d) => d.id === selectedDoctor)
    if (!doc) return

    try {
      for (const day of DAYS) {
        const ds = schedule[day.key]
        
        const payload = {
          dia_semana: day.jsDay,
          hora_inicio: ds.startTime,
          hora_fin: ds.endTime,
          duracion_slot: ds.slots,
          num_turnos_automaticos: ds.numTurnosAuto,
          especialidad_id: doc.especialidad_id,
          fecha_vigencia_desde: startDate,
          fecha_vigencia_hasta: endDate,
          activo: true
        }

        if (ds.enabled) {
          if (ds.horarioId) {
            await updateHorario(Number(selectedDoctor), ds.horarioId, payload)
          } else {
            await createHorario(Number(selectedDoctor), payload)
          }
        } else if (!ds.enabled && ds.horarioId) {
          await deleteHorario(Number(selectedDoctor), ds.horarioId)
        }
      }
      
      alert('Configuración de horarios guardada exitosamente.')
      loadDoctorSchedules(Number(selectedDoctor))
      
    } catch (error: any) {
      alert(`Error al procesar horario: ${error.message}`)
    }
  }

  // Ahora elimina un registro específico (un solo día)
  const handleDeleteSingleSchedule = async (horarioId: number, dayKey: string) => {
    if (confirm('¿Está seguro de eliminar este día del horario?')) {
      try {
        await deleteHorario(Number(selectedDoctor), horarioId)
        // Actualiza el UI localmente para que sea instantáneo
        setSavedSchedules((prev) => prev.filter((s) => s.id !== horarioId))
        updateDay(dayKey, { enabled: false, horarioId: undefined })
      } catch (err: any) {
        alert("Error al eliminar el día: " + err.message)
      }
    }
  }

  // --- Handlers Tab 2 & 3 ---
  // (La lógica permanece igual, usando los endpoints de turns.ts)
  const handleGenerateSlots = async () => {
    if (!selectedDoctor) return alert("Seleccione un médico en la pestaña de configuración.")

    try {
      const payload = {
        medico_id: Number(selectedDoctor),
        fecha_inicio: startDate, // Tomamos las fechas de la plantilla base configurada
        fecha_fin: endDate,
        duracion_slot: 30, // Opcion extra
        sobrescribir: true
      }
      
      const res = await generarTurnos(payload)
      alert(`Generación exitosa. ${res.turnos_generados} turnos creados.`)
    } catch (error: any) {
      alert("Error al generar: " + error.message)
    }
  }

  const handleAddAdditionalSlots = async () => { /* ... (Igual que antes) ... */ }
  const handleDeleteAdditionalSlot = (id: number) => { /* ... (Igual que antes) ... */ }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarDaysIcon className="w-6 h-6 text-blue-700" />
            Horarios y Turnos
          </h1>
          <p className="text-sm text-slate-500 mt-1">Gestión de plantillas, generación de turnos y slots adicionales</p>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }} className="flex gap-2 bg-slate-100 p-1 rounded-xl w-fit overflow-x-auto">
        {/* ... (Botones de tabs iguales) ... */}
        <button onClick={() => setActiveTab('schedule')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all relative whitespace-nowrap ${activeTab === 'schedule' ? 'text-blue-800 bg-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          <CalendarIcon className="w-4 h-4" /> Configurar Horarios
        </button>
        <button onClick={() => setActiveTab('generate')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all relative whitespace-nowrap ${activeTab === 'generate' ? 'text-blue-800 bg-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          <ClockIcon className="w-4 h-4" /> Generar Turnos
        </button>
        <button onClick={() => setActiveTab('additional')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all relative whitespace-nowrap ${activeTab === 'additional' ? 'text-blue-800 bg-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          <CalendarPlusIcon className="w-4 h-4" /> Turnos Adicionales
        </button>
      </motion.div>

      <AnimatePresence mode="wait">
        {activeTab === 'schedule' && (
          <motion.div key="schedule" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="space-y-6">
            
            {/* Cabecera del Formulario */}
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
                    {doctorsList.map((d) => (
                      <option key={d.id} value={d.id}>Dr. {d.nombres} {d.apellidos}</option>
                    ))}
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
                  {DAYS.map((day, i) => {
                    const ds = schedule[day.key]
                    return (
                      <motion.div key={day.key} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className={`px-5 py-4 flex flex-wrap items-center gap-3 transition-opacity ${!ds.enabled ? 'opacity-60 bg-slate-50/50' : ''}`}>
                        <div className="flex items-center gap-3 w-28">
                          <button onClick={() => updateDay(day.key, { enabled: !ds.enabled })} role="switch" aria-checked={ds.enabled} className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${ds.enabled ? 'bg-blue-600' : 'bg-slate-300'}`}>
                            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${ds.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                          </button>
                          <span className="text-sm font-medium text-slate-700">{day.label}</span>
                        </div>
                        
                        <div className="flex items-center gap-1.5">
                          <label className="text-xs text-slate-500">De:</label>
                          <input type="time" value={ds.startTime} onChange={(e) => updateDay(day.key, { startTime: e.target.value })} disabled={!ds.enabled} className="w-24 border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-400" />
                        </div>
                        
                        <div className="flex items-center gap-1.5">
                          <label className="text-xs text-slate-500">A:</label>
                          <input type="time" value={ds.endTime} onChange={(e) => updateDay(day.key, { endTime: e.target.value })} disabled={!ds.enabled} className="w-24 border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-400" />
                        </div>

                        {/* SLOT: Oculto visualmente o minimizado si ya no es el foco, pero lo mantengo pequeño para enviar el payload correcto */}
                        <div className="flex items-center gap-1.5 ml-auto">
                           <label className="text-[10px] text-slate-400">Slot(m)</label>
                           <input type="number" min="1" value={ds.slots} onChange={(e) => updateDay(day.key, { slots: parseInt(e.target.value) || 0 })} disabled={!ds.enabled} className="w-14 border border-slate-200 rounded-lg px-1.5 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-400 text-center" />
                        </div>

                        {/* NUEVO INPUT ESTRELLA: Turnos Automáticos */}
                        <div className="flex items-center gap-2">
                          <label className="text-xs font-semibold text-slate-700">Max. Turnos</label>
                          <input type="number" min="0" value={ds.numTurnosAuto} onChange={(e) => updateDay(day.key, { numTurnosAuto: parseInt(e.target.value) || 0 })} disabled={!ds.enabled} className="w-16 border border-blue-300 rounded-lg px-2 py-1.5 text-sm font-bold text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-400 text-center disabled:border-slate-200" placeholder="0" />
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              {/* Summary Card */}
              <div className="space-y-6">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-blue-50 rounded-xl border border-blue-100 p-6">
                  <h3 className="text-sm font-semibold text-blue-900 mb-4 flex items-center gap-2">
                    <CheckCircle2Icon className="w-5 h-5 text-blue-600" /> Resumen
                  </h3>
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
                  <button onClick={handleSaveSchedule} className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 bg-blue-800 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm">
                    <CalendarPlusIcon className="w-5 h-5" /> Guardar Horario
                  </button>
                </motion.div>
              </div>
            </div>

            {/* TABLA DE PLANTILLAS: AHORA DESGLOSADA POR DÍA */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-base font-semibold text-slate-800">Detalle de Horarios Guardados</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Día</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Horario (Inicio - Fin)</th>
                      <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Turnos Auto.</th>
                      <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Vigencia</th>
                      <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Estado</th>
                      <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Eliminar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    <AnimatePresence>
                      {savedSchedules.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-5 py-8 text-center text-sm text-slate-400">
                            No hay días registrados para este médico.
                          </td>
                        </tr>
                      ) : (
                        savedSchedules.map((s, i) => (
                          <motion.tr key={s.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ delay: i * 0.05 }} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-5 py-3.5 text-sm font-bold text-slate-800">{s.dayName}</td>
                            <td className="px-5 py-3.5 text-sm text-slate-600">
                              {s.startTime} a {s.endTime} <span className="text-xs text-slate-400">({s.duracionSlot}m)</span>
                            </td>
                            <td className="px-5 py-3.5 text-sm text-center font-bold text-blue-700">{s.numTurnosAuto}</td>
                            <td className="px-5 py-3.5 text-sm text-center text-slate-600">
                              {s.startDate} - {s.endDate}
                            </td>
                            <td className="px-5 py-3.5 text-center">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${s.status === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                {s.status}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              <button
                                onClick={() => handleDeleteSingleSchedule(s.id, s.dayKey)}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title={`Eliminar ${s.dayName}`}
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </td>
                          </motion.tr>
                        ))
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ... (Las pestañas de Generar Turnos y Adicionales quedan idénticas) ... */}
      </AnimatePresence>
    </div>
  )
}