import React, { useEffect, useMemo, useState } from 'react'
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
} from 'lucide-react'
import { getDoctors } from '../services/doctors'
import {
  createHorario,
  deleteHorario,
  getHorarios,
  updateHorario,
} from '../services/schedules'
import type { HorarioApi } from '../services/schedules'
import { generarTurnos, generarTurnosAdicionales } from '../services/turns'

type DoctorOption = {
  id: number
  nombre: string
  apellido: string
  especialidad: string
  especialidad_id: number
}
const DAYS = [
  {
    key: 'lunes',
    label: 'Lunes',
  },
  {
    key: 'martes',
    label: 'Martes',
  },
  {
    key: 'miercoles',
    label: 'Miércoles',
  },
  {
    key: 'jueves',
    label: 'Jueves',
  },
  {
    key: 'viernes',
    label: 'Viernes',
  },
  {
    key: 'sabado',
    label: 'Sábado',
  },
  {
    key: 'domingo',
    label: 'Domingo',
  },
]

const DAY_TO_NUM: Record<string, number> = {
  domingo: 0,
  lunes: 1,
  martes: 2,
  miercoles: 3,
  jueves: 4,
  viernes: 5,
  sabado: 6,
}

const NUM_TO_DAY: Record<number, string> = Object.fromEntries(
  Object.entries(DAY_TO_NUM).map(([k, v]) => [v, k]),
)

function toHHMM(apiTime: string): string {
  // "09:00:00" -> "09:00"
  return (apiTime || '').slice(0, 5)
}

function toApiTime(hhmm: string): string {
  // "09:00" -> "09:00:00"
  const t = (hhmm || '').trim()
  if (!t) return '00:00:00'
  return t.length === 5 ? `${t}:00` : t
}

function timeToMinutes(hhmm: string): number {
  const [h, m] = (hhmm || '0:0').split(':')
  return Number(h) * 60 + Number(m)
}

function calcDuracionSlot(startHHMM: string, endHHMM: string, slots: number): number {
  const start = timeToMinutes(startHHMM)
  const end = timeToMinutes(endHHMM)
  const windowMin = Math.max(0, end - start)
  if (windowMin <= 0) return 30
  const s = Math.max(1, slots)
  return Math.max(5, Math.floor(windowMin / s))
}
interface DaySchedule {
  enabled: boolean
  startTime: string
  endTime: string
  slots: number
}
type WeekSchedule = Record<string, DaySchedule>
const defaultDay: DaySchedule = {
  enabled: false,
  startTime: '08:00',
  endTime: '14:00',
  slots: 20,
}
const defaultWeek: WeekSchedule = Object.fromEntries(
  DAYS.map((d) => [
    d.key,
    {
      ...defaultDay,
      enabled: d.key !== 'sabado' && d.key !== 'domingo',
    },
  ]),
)
interface SavedSchedule {
  id: number
  doctorId: number
  doctorName: string
  startDate: string
  endDate: string
  totalSlots: number
  status: 'Activo' | 'Finalizado'
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
  const [activeTab, setActiveTab] = useState<'schedule' | 'additional'>(
    'schedule',
  )

  // API data
  const [doctors, setDoctors] = useState<DoctorOption[]>([])
  const [loadingDoctors, setLoadingDoctors] = useState(false)
  const [doctorsError, setDoctorsError] = useState('')

  const [horarios, setHorarios] = useState<HorarioApi[]>([])
  const [loadingHorarios, setLoadingHorarios] = useState(false)
  const [horariosError, setHorariosError] = useState('')

  const [saving, setSaving] = useState(false)
  // Tab 1 State
  const [selectedDoctor, setSelectedDoctor] = useState<number | ''>('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [schedule, setSchedule] = useState<WeekSchedule>(defaultWeek)
  const [savedSchedules, setSavedSchedules] = useState<SavedSchedule[]>([
    {
      id: 1,
      doctorId: 1,
      doctorName: 'Dr. Carlos Mendoza',
      startDate: '2025-03-01',
      endDate: '2025-03-31',
      totalSlots: 400,
      status: 'Activo',
    },
  ])
  // Tab 2 State
  const [addSelectedDoctor, setAddSelectedDoctor] = useState<number | ''>('')
  const [addDate, setAddDate] = useState('')
  const [addStartTime, setAddStartTime] = useState('15:00')
  const [addEndTime, setAddEndTime] = useState('18:00')
  const [addSlots, setAddSlots] = useState<number>(10)
  const [additionalSlots, setAdditionalSlots] = useState<AdditionalSlot[]>([])

  useEffect(() => {
    const run = async () => {
      setLoadingDoctors(true)
      setDoctorsError('')
      try {
        const res = await getDoctors({ page: 1, limit: 200 })
        const mapped: DoctorOption[] = (res.data || []).map((d) => ({
          id: d.id,
          nombre: d.nombres || '',
          apellido: d.apellidos || '',
          especialidad: d.nombre_especialidad || 'Sin especialidad',
          especialidad_id: d.especialidad_id,
        }))
        setDoctors(mapped)
      } catch (e: any) {
        setDoctorsError(e?.message || 'No se pudieron cargar los médicos')
      } finally {
        setLoadingDoctors(false)
      }
    }
    run()
  }, [])

  const fetchHorarios = async (medicoId: number) => {
    setLoadingHorarios(true)
    setHorariosError('')
    try {
      const list = await getHorarios(medicoId)
      setHorarios(list)

      // Prefill week schedule (1 bloque por día). Si hay más de uno, toma el primero.
      const nextWeek: WeekSchedule = JSON.parse(JSON.stringify(defaultWeek))
      for (const h of list) {
        const dayKey = NUM_TO_DAY[h.dia_semana]
        if (!dayKey || !nextWeek[dayKey]) continue
        nextWeek[dayKey] = {
          enabled: !!h.activo,
          startTime: toHHMM(h.hora_inicio),
          endTime: toHHMM(h.hora_fin),
          slots: h.num_turnos_automaticos ?? 0,
        }
      }
      setSchedule(nextWeek)
    } catch (e: any) {
      setHorariosError(e?.message || 'No se pudieron cargar los horarios')
      setHorarios([])
    } finally {
      setLoadingHorarios(false)
    }
  }

  useEffect(() => {
    if (!selectedDoctor) {
      setHorarios([])
      setHorariosError('')
      setSchedule(defaultWeek)
      return
    }
    fetchHorarios(Number(selectedDoctor))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDoctor])
  // Derived calculations for Tab 1
  const activeDaysCount = Object.values(schedule).filter(
    (d) => d.enabled,
  ).length
  const weeklySlots = Object.values(schedule).reduce(
    (acc, d) => acc + (d.enabled ? d.slots : 0),
    0,
  )
  const estimatedTotalSlots = useMemo(() => {
    if (!startDate || !endDate) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    if (end < start) return 0
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    const weeks = diffDays / 7
    return Math.floor(weeks * weeklySlots)
  }, [startDate, endDate, weeklySlots])
  const updateDay = (day: string, updates: Partial<DaySchedule>) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        ...updates,
      },
    }))
  }
  const handleGenerateSchedule = async () => {
    if (!selectedDoctor || !startDate || !endDate) {
      alert('Por favor complete el médico y las fechas de inicio y vigencia.')
      return
    }
    if (new Date(endDate) < new Date(startDate)) {
      alert('La fecha de vigencia debe ser posterior a la fecha de inicio.')
      return
    }

    const medicoId = Number(selectedDoctor)
    const doc = doctors.find((d) => d.id === medicoId)
    if (!doc) {
      alert('No se encontró el médico seleccionado.')
      return
    }

    setSaving(true)
    try {
      // 1) Upsert de horarios por día
      const existingByDay = new Map<number, HorarioApi>()
      for (const h of horarios) {
        if (!existingByDay.has(h.dia_semana)) existingByDay.set(h.dia_semana, h)
      }

      const ops: Promise<any>[] = []
      for (const d of DAYS) {
        const dayNum = DAY_TO_NUM[d.key]
        const ds = schedule[d.key]
        const existing = existingByDay.get(dayNum)

        if (ds.enabled) {
          const duracion_slot = calcDuracionSlot(ds.startTime, ds.endTime, ds.slots)
          const common = {
            hora_inicio: toApiTime(ds.startTime),
            hora_fin: toApiTime(ds.endTime),
            duracion_slot,
            intervalo_descanso: 0,
            fecha_vigencia_desde: startDate,
            fecha_vigencia_hasta: endDate,
            activo: true,
          }

          if (existing) {
            ops.push(updateHorario(medicoId, existing.id, common))
          } else {
            ops.push(
              createHorario(medicoId, {
                dia_semana: dayNum,
                ...common,
                especialidad_id: doc.especialidad_id,
                num_turnos_automaticos: Math.max(0, ds.slots),
              }),
            )
          }
        } else if (existing && existing.activo) {
          // Si lo apagas desde la UI, lo marcamos como inactivo
          ops.push(updateHorario(medicoId, existing.id, { activo: false }))
        }
      }

      await Promise.all(ops)
      await fetchHorarios(medicoId)

      // 2) Generar turnos masivos en el rango (usa /turnos/generar)
      const firstEnabled = DAYS.find((d) => schedule[d.key].enabled)
      const duracion_slot = firstEnabled
        ? calcDuracionSlot(
            schedule[firstEnabled.key].startTime,
            schedule[firstEnabled.key].endTime,
            schedule[firstEnabled.key].slots,
          )
        : 30

      const sobrescribir = confirm(
        '¿Deseas sobrescribir (recrear) los turnos DISPONIBLES en el rango seleccionado?\n\nSi le das Cancelar, se intentará generar sin sobrescribir.',
      )

      const gen = await generarTurnos({
        medico_id: medicoId,
        fecha_inicio: startDate,
        fecha_fin: endDate,
        duracion_slot,
        sobrescribir,
      })

      const newSchedule: SavedSchedule = {
        id: Date.now(),
        doctorId: doc.id,
        doctorName: `Dr. ${doc.nombre} ${doc.apellido}`,
        startDate,
        endDate,
        totalSlots: gen.turnos_generados ?? estimatedTotalSlots,
        status: 'Activo',
      }
      setSavedSchedules((prev) => [newSchedule, ...prev])

      alert('Horarios guardados y turnos generados correctamente.')
    } catch (e: any) {
      alert(e?.message || 'Error al guardar/generar')
    } finally {
      setSaving(false)
    }
  }
  const handleDeleteSchedule = (id: number) => {
    if (confirm('¿Está seguro de eliminar esta configuración de horario?')) {
      setSavedSchedules((prev) => prev.filter((s) => s.id !== id))
    }
  }
  const handleAddAdditionalSlots = async () => {
    if (
      !addSelectedDoctor ||
      !addDate ||
      !addStartTime ||
      !addEndTime ||
      addSlots <= 0
    ) {
      alert('Por favor complete todos los campos correctamente.')
      return
    }
    const medicoId = Number(addSelectedDoctor)
    const doc = doctors.find((d) => d.id === medicoId)
    if (!doc) {
      alert('No se encontró el médico seleccionado.')
      return
    }

    try {
      const res = await generarTurnosAdicionales({
        medico_id: medicoId,
        fecha: addDate,
        cantidad: addSlots,
      })
      const newSlot: AdditionalSlot = {
        id: Date.now(),
        doctorId: doc.id,
        doctorName: `Dr. ${doc.nombre} ${doc.apellido}`,
        date: addDate,
        startTime: addStartTime,
        endTime: addEndTime,
        slots: res.turnos_generados ?? addSlots,
      }
      setAdditionalSlots((prev) => [newSlot, ...prev])
      // Reset form
      setAddSelectedDoctor('')
      setAddDate('')
      setAddStartTime('15:00')
      setAddEndTime('18:00')
      setAddSlots(10)
      alert('Turnos adicionales generados.')
    } catch (e: any) {
      alert(e?.message || 'Error al generar turnos adicionales')
    }
  }
  const handleDeleteAdditionalSlot = (id: number) => {
    if (confirm('¿Está seguro de eliminar estos turnos adicionales?')) {
      setAdditionalSlots((prev) => prev.filter((s) => s.id !== id))
    }
  }
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{
          opacity: 0,
          y: -12,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.35,
        }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarDaysIcon className="w-6 h-6 text-blue-700" />
            Horarios y Turnos
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Gestión de horarios regulares y turnos adicionales para médicos
          </p>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.35,
          delay: 0.1,
        }}
        className="flex gap-2 bg-slate-100 p-1 rounded-xl w-fit"
      >
        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all relative ${activeTab === 'schedule' ? 'text-blue-800' : 'text-slate-500 hover:text-slate-700'}`}
        >
          {activeTab === 'schedule' && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-white rounded-lg shadow-sm"
              transition={{
                type: 'spring',
                bounce: 0.2,
                duration: 0.6,
              }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            Configurar Horario
          </span>
        </button>
        <button
          onClick={() => setActiveTab('additional')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all relative ${activeTab === 'additional' ? 'text-blue-800' : 'text-slate-500 hover:text-slate-700'}`}
        >
          {activeTab === 'additional' && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-white rounded-lg shadow-sm"
              transition={{
                type: 'spring',
                bounce: 0.2,
                duration: 0.6,
              }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            <CalendarPlusIcon className="w-4 h-4" />
            Turnos Adicionales
          </span>
        </button>
      </motion.div>

      <AnimatePresence mode="wait">
        {activeTab === 'schedule' ? (
          <motion.div
            key="schedule"
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -10,
            }}
            transition={{
              duration: 0.2,
            }}
            className="space-y-6"
          >
            {/* Config Form */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                  <UserCheckIcon className="w-5 h-5 text-blue-600" />
                  Datos Generales
                </h2>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Médico
                  </label>
                  <select
                    value={selectedDoctor}
                    onChange={(e) =>
                      setSelectedDoctor(Number(e.target.value) || '')
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">-- Seleccione un médico --</option>
                    {loadingDoctors ? (
                      <option value="" disabled>
                        Cargando médicos...
                      </option>
                    ) : doctorsError ? (
                      <option value="" disabled>
                        {doctorsError}
                      </option>
                    ) : (
                      doctors.map((d) => (
                        <option key={d.id} value={d.id}>
                          Dr. {d.nombre} {d.apellido} ({d.especialidad})
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Fecha de Inicio
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Fecha de Vigencia
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Weekly Grid & Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                  <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                    <ClockIcon className="w-5 h-5 text-blue-600" />
                    Horario Semanal
                  </h2>
                </div>
                <div className="divide-y divide-slate-50">
                  {DAYS.map((day, i) => {
                    const ds = schedule[day.key]
                    return (
                      <motion.div
                        key={day.key}
                        initial={{
                          opacity: 0,
                          x: -10,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        transition={{
                          delay: i * 0.05,
                        }}
                        className={`px-5 py-4 flex flex-wrap items-center gap-4 transition-opacity ${!ds.enabled ? 'opacity-60 bg-slate-50/50' : ''}`}
                      >
                        <div className="flex items-center gap-3 w-32">
<button
                            onClick={() =>
                              updateDay(day.key, {
                                enabled: !ds.enabled,
                              })
                            }
                            role="switch"
                            aria-checked={ds.enabled}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${ds.enabled ? 'bg-blue-600' : 'bg-slate-300'}`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${ds.enabled ? 'translate-x-5' : 'translate-x-0'}`}
                            />
                          </button>
                          <span className="text-sm font-medium text-slate-700">
                            {day.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-slate-500 w-10">
                            Inicio
                          </label>
                          <input
                            type="time"
                            value={ds.startTime}
                            onChange={(e) =>
                              updateDay(day.key, {
                                startTime: e.target.value,
                              })
                            }
                            disabled={!ds.enabled}
                            className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-400"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-slate-500 w-8">
                            Fin
                          </label>
                          <input
                            type="time"
                            value={ds.endTime}
                            onChange={(e) =>
                              updateDay(day.key, {
                                endTime: e.target.value,
                              })
                            }
                            disabled={!ds.enabled}
                            className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-400"
                          />
                        </div>
                        <div className="flex items-center gap-2 ml-auto">
                          <label className="text-xs text-slate-500">
                            Turnos/día
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={ds.slots}
                            onChange={(e) =>
                              updateDay(day.key, {
                                slots: parseInt(e.target.value) || 0,
                              })
                            }
                            disabled={!ds.enabled}
                            className="w-20 border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-400 text-center"
                          />
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              {/* Summary Card */}
              <div className="space-y-6">
                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.95,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={{
                    delay: 0.2,
                  }}
                  className="bg-blue-50 rounded-xl border border-blue-100 p-6"
                >
                  <h3 className="text-sm font-semibold text-blue-900 mb-4 flex items-center gap-2">
                    <CheckCircle2Icon className="w-5 h-5 text-blue-600" />
                    Resumen de Generación
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-blue-200/50">
                      <span className="text-sm text-blue-800">
                        Días activos por semana
                      </span>
                      <span className="font-semibold text-blue-900">
                        {activeDaysCount}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-blue-200/50">
                      <span className="text-sm text-blue-800">
                        Turnos por semana
                      </span>
                      <span className="font-semibold text-blue-900">
                        {weeklySlots}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm font-medium text-blue-900">
                        Total Turnos Estimados
                      </span>
                      <span className="text-2xl font-bold text-blue-700">
                        {estimatedTotalSlots}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleGenerateSchedule}
                    disabled={saving}
                    className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 bg-blue-800 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
                  >
                    <CalendarPlusIcon className="w-5 h-5" />
                    {saving ? 'Guardando / Generando...' : 'Guardar y Generar Turnos'}
                  </button>
                </motion.div>
              </div>
            </div>

            {/* Horarios en API (del médico seleccionado) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-800">
                  Horarios (API)
                </h2>
                {selectedDoctor && (
                  <button
                    onClick={() => fetchHorarios(Number(selectedDoctor))}
                    className="text-sm font-medium text-blue-700 hover:text-blue-800"
                  >
                    Refrescar
                  </button>
                )}
              </div>

              {!selectedDoctor ? (
                <div className="p-6 text-sm text-slate-500">Selecciona un médico para ver sus horarios.</div>
              ) : loadingHorarios ? (
                <div className="p-6 text-sm text-slate-500">Cargando horarios...</div>
              ) : horariosError ? (
                <div className="p-6 text-sm text-red-600">{horariosError}</div>
              ) : horarios.length === 0 ? (
                <div className="p-6 text-sm text-slate-500">Este médico aún no tiene horarios configurados.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Día</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Horario</th>
                        <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Duración</th>
                        <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Turnos auto</th>
                        <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Activo</th>
                        <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {horarios
                        .slice()
                        .sort((a, b) => a.dia_semana - b.dia_semana)
                        .map((h) => (
                          <tr key={h.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-5 py-3.5 text-sm text-slate-800 font-medium">
                              {DAYS.find((d) => d.key === NUM_TO_DAY[h.dia_semana])?.label || h.dia_semana}
                            </td>
                            <td className="px-5 py-3.5 text-sm text-slate-600">
                              {toHHMM(h.hora_inicio)} - {toHHMM(h.hora_fin)}
                            </td>
                            <td className="px-5 py-3.5 text-sm text-center text-slate-600">
                              {h.duracion_slot} min
                            </td>
                            <td className="px-5 py-3.5 text-sm text-center text-slate-600">
                              {h.num_turnos_automaticos ?? '-'}
                            </td>
                            <td className="px-5 py-3.5 text-center">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${h.activo ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}
                              >
                                {h.activo ? 'Sí' : 'No'}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              <button
                                onClick={async () => {
                                  if (!selectedDoctor) return
                                  if (!confirm('¿Eliminar este horario?')) return
                                  try {
                                    await deleteHorario(Number(selectedDoctor), h.id)
                                    await fetchHorarios(Number(selectedDoctor))
                                  } catch (e: any) {
                                    alert(e?.message || 'Error al eliminar horario')
                                  }
                                }}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Eliminar horario"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>

            {/* Saved Schedules Table */}
            <motion.div
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.3,
              }}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div className="p-5 border-b border-slate-100">
                <h2 className="text-base font-semibold text-slate-800">
                  Horarios Generados
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Médico
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Vigencia
                      </th>
                      <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Total Turnos
                      </th>
                      <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Estado
                      </th>
                      <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    <AnimatePresence>
                      {savedSchedules.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-5 py-8 text-center text-sm text-slate-400"
                          >
                            No hay horarios generados.
                          </td>
                        </tr>
                      ) : (
                        savedSchedules.map((s, i) => (
                          <motion.tr
                            key={s.id}
                            initial={{
                              opacity: 0,
                              x: -10,
                            }}
                            animate={{
                              opacity: 1,
                              x: 0,
                            }}
                            exit={{
                              opacity: 0,
                              x: 10,
                            }}
                            transition={{
                              delay: i * 0.05,
                            }}
                            className="hover:bg-slate-50/50 transition-colors"
                          >
                            <td className="px-5 py-3.5 text-sm font-medium text-slate-800">
                              {s.doctorName}
                            </td>
                            <td className="px-5 py-3.5 text-sm text-slate-600">
                              {new Date(s.startDate).toLocaleDateString()} -{' '}
                              {new Date(s.endDate).toLocaleDateString()}
                            </td>
                            <td className="px-5 py-3.5 text-sm text-center font-semibold text-blue-700">
                              {s.totalSlots}
                            </td>
                            <td className="px-5 py-3.5 text-center">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${s.status === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}
                              >
                                {s.status}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              <button
                                onClick={() => handleDeleteSchedule(s.id)}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Eliminar horario"
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
        ) : (
          <motion.div
            key="additional"
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -10,
            }}
            transition={{
              duration: 0.2,
            }}
            className="space-y-6"
          >
            {/* Additional Slots Form */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                  <CalendarPlusIcon className="w-5 h-5 text-blue-600" />
                  Agregar Turnos Adicionales
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Genere slots extra para un médico en una fecha específica,
                  fuera de su horario regular.
                </p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 items-end">
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Médico
                    </label>
                    <select
                      value={addSelectedDoctor}
                      onChange={(e) =>
                        setAddSelectedDoctor(Number(e.target.value) || '')
                      }
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="">-- Seleccione un médico --</option>
                      {loadingDoctors ? (
                        <option value="" disabled>
                          Cargando médicos...
                        </option>
                      ) : doctorsError ? (
                        <option value="" disabled>
                          {doctorsError}
                        </option>
                      ) : (
                        doctors.map((d) => (
                          <option key={d.id} value={d.id}>
                            Dr. {d.nombre} {d.apellido}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Fecha
                    </label>
                    <input
                      type="date"
                      value={addDate}
                      onChange={(e) => setAddDate(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Inicio
                      </label>
                      <input
                        type="time"
                        value={addStartTime}
                        onChange={(e) => setAddStartTime(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Fin
                      </label>
                      <input
                        type="time"
                        value={addEndTime}
                        onChange={(e) => setAddEndTime(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Cant. Turnos
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={addSlots}
                      onChange={(e) =>
                        setAddSlots(parseInt(e.target.value) || 0)
                      }
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleAddAdditionalSlots}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-800 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Agregar Turnos Adicionales
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Slots Table */}
            <motion.div
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.1,
              }}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div className="p-5 border-b border-slate-100">
                <h2 className="text-base font-semibold text-slate-800">
                  Turnos Adicionales Generados
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Médico
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Fecha
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Horario
                      </th>
                      <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Turnos Generados
                      </th>
                      <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    <AnimatePresence>
                      {additionalSlots.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-5 py-8 text-center text-sm text-slate-400"
                          >
                            No hay turnos adicionales registrados.
                          </td>
                        </tr>
                      ) : (
                        additionalSlots.map((slot, i) => (
                          <motion.tr
                            key={slot.id}
                            initial={{
                              opacity: 0,
                              x: -10,
                            }}
                            animate={{
                              opacity: 1,
                              x: 0,
                            }}
                            exit={{
                              opacity: 0,
                              x: 10,
                            }}
                            transition={{
                              delay: i * 0.05,
                            }}
                            className="hover:bg-slate-50/50 transition-colors"
                          >
                            <td className="px-5 py-3.5 text-sm font-medium text-slate-800">
                              {slot.doctorName}
                            </td>
                            <td className="px-5 py-3.5 text-sm text-slate-600">
                              {new Date(slot.date).toLocaleDateString()}
                            </td>
                            <td className="px-5 py-3.5 text-sm text-slate-600">
                              {slot.startTime} - {slot.endTime}
                            </td>
                            <td className="px-5 py-3.5 text-sm text-center font-semibold text-blue-700">
                              +{slot.slots}
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              <button
                                onClick={() =>
                                  handleDeleteAdditionalSlot(slot.id)
                                }
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Eliminar turnos"
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
      </AnimatePresence>
    </div>
  )
}
