import React, { useMemo, useState } from 'react'
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
interface Doctor {
  id: number
  nombre: string
  apellido: string
  especialidad: string
}
const DOCTORS: Doctor[] = [
  {
    id: 1,
    nombre: 'Carlos',
    apellido: 'Mendoza',
    especialidad: 'Medicina General',
  },
  {
    id: 2,
    nombre: 'Ana',
    apellido: 'Torres',
    especialidad: 'Pediatría',
  },
  {
    id: 3,
    nombre: 'Roberto',
    apellido: 'Vega',
    especialidad: 'Odontología',
  },
]
const DAYS = [
  {
    key: 'lunes',
    label: 'Lunes',
    jsDay: 1,
  },
  {
    key: 'martes',
    label: 'Martes',
    jsDay: 2,
  },
  {
    key: 'miercoles',
    label: 'Miércoles',
    jsDay: 3,
  },
  {
    key: 'jueves',
    label: 'Jueves',
    jsDay: 4,
  },
  {
    key: 'viernes',
    label: 'Viernes',
    jsDay: 5,
  },
  {
    key: 'sabado',
    label: 'Sábado',
    jsDay: 6,
  },
  {
    key: 'domingo',
    label: 'Domingo',
    jsDay: 0,
  },
]
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
  weekConfig: WeekSchedule
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
  const [activeTab, setActiveTab] = useState<
    'schedule' | 'generate' | 'additional'
  >('schedule')
  // --- Tab 1 State (Configurar Horarios) ---
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
      weekConfig: defaultWeek,
    },
  ])
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
  // --- Derived calculations for Tab 1 ---
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
  // --- Handlers for Tab 1 ---
  const handleSaveSchedule = () => {
    if (!selectedDoctor || !startDate || !endDate) {
      alert('Por favor complete el médico y las fechas de inicio y vigencia.')
      return
    }
    if (new Date(endDate) < new Date(startDate)) {
      alert('La fecha de vigencia debe ser posterior a la fecha de inicio.')
      return
    }
    const doc = DOCTORS.find((d) => d.id === selectedDoctor)
    if (!doc) return
    const newSchedule: SavedSchedule = {
      id: Date.now(),
      doctorId: doc.id,
      doctorName: `Dr. ${doc.nombre} ${doc.apellido}`,
      startDate,
      endDate,
      totalSlots: estimatedTotalSlots,
      status: 'Activo',
      weekConfig: schedule,
    }
    setSavedSchedules((prev) => [newSchedule, ...prev])
    // Reset form
    setSelectedDoctor('')
    setStartDate('')
    setEndDate('')
    setSchedule(defaultWeek)
  }
  const handleDeleteSchedule = (id: number) => {
    if (confirm('¿Está seguro de eliminar esta configuración de horario?')) {
      setSavedSchedules((prev) => prev.filter((s) => s.id !== id))
      // Also clear selection in Tab 2 if deleted
      if (selectedScheduleId === id) setSelectedScheduleId('')
    }
  }
  // --- Handlers for Tab 2 ---
  const selectedScheduleForGeneration = savedSchedules.find(
    (s) => s.id === selectedScheduleId,
  )
  const handleGenerateSlots = () => {
    if (!selectedScheduleForGeneration) return
    const start = new Date(selectedScheduleForGeneration.startDate)
    const end = new Date(selectedScheduleForGeneration.endDate)
    // Fix timezone offset issues by adding T12:00:00 to parse as local noon
    const startLocal = new Date(
      `${selectedScheduleForGeneration.startDate}T12:00:00`,
    )
    const endLocal = new Date(
      `${selectedScheduleForGeneration.endDate}T12:00:00`,
    )
    const newBatches: GeneratedSlotBatch[] = []
    let currentDate = new Date(startLocal)
    while (currentDate <= endLocal) {
      const jsDay = currentDate.getDay() // 0 = Sunday, 1 = Monday, etc.
      // Find matching day config
      const dayConfig = DAYS.find((d) => d.jsDay === jsDay)
      if (dayConfig) {
        const configForDay =
          selectedScheduleForGeneration.weekConfig[dayConfig.key]
        if (configForDay && configForDay.enabled && configForDay.slots > 0) {
          // Format date as YYYY-MM-DD
          const year = currentDate.getFullYear()
          const month = String(currentDate.getMonth() + 1).padStart(2, '0')
          const day = String(currentDate.getDate()).padStart(2, '0')
          const dateString = `${year}-${month}-${day}`
          // Check if we already generated this exact batch to avoid duplicates
          const alreadyGenerated = generatedSlots.some(
            (g) =>
              g.scheduleId === selectedScheduleForGeneration.id &&
              g.date === dateString,
          )
          if (!alreadyGenerated) {
            newBatches.push({
              id: Date.now() + Math.random(),
              scheduleId: selectedScheduleForGeneration.id,
              doctorName: selectedScheduleForGeneration.doctorName,
              date: dateString,
              dayName: dayConfig.label,
              startTime: configForDay.startTime,
              endTime: configForDay.endTime,
              slotsCount: configForDay.slots,
              status: 'Generado',
            })
          }
        }
      }
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1)
    }
    if (newBatches.length > 0) {
      setGeneratedSlots((prev) => [...newBatches, ...prev])
      alert(`Se generaron ${newBatches.length} bloques de turnos exitosamente.`)
    } else {
      alert(
        'No se generaron nuevos turnos. Es posible que ya hayan sido generados o la configuración no tenga días activos.',
      )
    }
  }
  const handleDeleteGeneratedBatch = (id: number) => {
    if (confirm('¿Está seguro de eliminar estos turnos generados?')) {
      setGeneratedSlots((prev) => prev.filter((s) => s.id !== id))
    }
  }
  // --- Handlers for Tab 3 ---
  const handleAddAdditionalSlots = () => {
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
    const doc = DOCTORS.find((d) => d.id === addSelectedDoctor)
    if (!doc) return
    const newSlot: AdditionalSlot = {
      id: Date.now(),
      doctorId: doc.id,
      doctorName: `Dr. ${doc.nombre} ${doc.apellido}`,
      date: addDate,
      startTime: addStartTime,
      endTime: addEndTime,
      slots: addSlots,
    }
    setAdditionalSlots((prev) => [newSlot, ...prev])
    // Reset form
    setAddSelectedDoctor('')
    setAddDate('')
    setAddStartTime('15:00')
    setAddEndTime('18:00')
    setAddSlots(10)
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
            Gestión de plantillas, generación de turnos y slots adicionales
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
        className="flex gap-2 bg-slate-100 p-1 rounded-xl w-fit overflow-x-auto"
      >
        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all relative whitespace-nowrap ${activeTab === 'schedule' ? 'text-blue-800' : 'text-slate-500 hover:text-slate-700'}`}
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
            Configurar Horarios
          </span>
        </button>
        <button
          onClick={() => setActiveTab('generate')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all relative whitespace-nowrap ${activeTab === 'generate' ? 'text-blue-800' : 'text-slate-500 hover:text-slate-700'}`}
        >
          {activeTab === 'generate' && (
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
            <ClockIcon className="w-4 h-4" />
            Generar Turnos
          </span>
        </button>
        <button
          onClick={() => setActiveTab('additional')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all relative whitespace-nowrap ${activeTab === 'additional' ? 'text-blue-800' : 'text-slate-500 hover:text-slate-700'}`}
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
        {/* TAB 1: CONFIGURAR HORARIOS */}
        {activeTab === 'schedule' && (
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
                  Datos de la Plantilla
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
                    {DOCTORS.map((d) => (
                      <option key={d.id} value={d.id}>
                        Dr. {d.nombre} {d.apellido} ({d.especialidad})
                      </option>
                    ))}
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
                    Resumen de Configuración
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
                    onClick={handleSaveSchedule}
                    className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 bg-blue-800 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
                  >
                    <CalendarPlusIcon className="w-5 h-5" />
                    Guardar Configuración
                  </button>
                </motion.div>
              </div>
            </div>

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
                  Plantillas Guardadas
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
                            No hay plantillas guardadas.
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
                                title="Eliminar plantilla"
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

        {/* TAB 2: GENERAR TURNOS */}
        {activeTab === 'generate' && (
          <motion.div
            key="generate"
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Selection Form */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                  <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                    <PlayCircleIcon className="w-5 h-5 text-blue-600" />
                    Generar Turnos desde Plantilla
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Seleccione una plantilla guardada para generar los turnos
                    diarios.
                  </p>
                </div>
                <div className="p-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Plantilla Base
                  </label>
                  <select
                    value={selectedScheduleId}
                    onChange={(e) =>
                      setSelectedScheduleId(Number(e.target.value) || '')
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">-- Seleccione una plantilla --</option>
                    {savedSchedules.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.doctorName} |{' '}
                        {new Date(s.startDate).toLocaleDateString()} al{' '}
                        {new Date(s.endDate).toLocaleDateString()} |{' '}
                        {s.totalSlots} turnos est.
                      </option>
                    ))}
                  </select>

                  {selectedScheduleForGeneration && (
                    <div className="mt-6 bg-slate-50 rounded-xl p-5 border border-slate-100">
                      <h3 className="text-sm font-semibold text-slate-800 mb-3">
                        Detalle de la Plantilla
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-500 block mb-1">
                            Médico:
                          </span>
                          <span className="font-medium text-slate-900">
                            {selectedScheduleForGeneration.doctorName}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block mb-1">
                            Período:
                          </span>
                          <span className="font-medium text-slate-900">
                            {new Date(
                              selectedScheduleForGeneration.startDate,
                            ).toLocaleDateString()}{' '}
                            -{' '}
                            {new Date(
                              selectedScheduleForGeneration.endDate,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <span className="text-slate-500 block mb-2 text-sm">
                          Días configurados:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {DAYS.filter(
                            (d) =>
                              selectedScheduleForGeneration.weekConfig[d.key]
                                .enabled,
                          ).map((d) => {
                            const conf =
                              selectedScheduleForGeneration.weekConfig[d.key]
                            return (
                              <div
                                key={d.key}
                                className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs"
                              >
                                <span className="font-semibold text-slate-700 block mb-0.5">
                                  {d.label}
                                </span>
                                <span className="text-slate-500">
                                  {conf.startTime} - {conf.endTime} (
                                  {conf.slots} turnos)
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleGenerateSlots}
                      disabled={!selectedScheduleId}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-800 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <PlayCircleIcon className="w-5 h-5" />
                      Generar Turnos Automáticos
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats Card */}
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
                className="bg-green-50 rounded-xl border border-green-100 p-6 h-fit"
              >
                <h3 className="text-sm font-semibold text-green-900 mb-4 flex items-center gap-2">
                  <FileTextIcon className="w-5 h-5 text-green-600" />
                  Estado de Generación
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-green-200/50">
                    <span className="text-sm text-green-800">
                      Bloques generados
                    </span>
                    <span className="font-semibold text-green-900">
                      {generatedSlots.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm font-medium text-green-900">
                      Total Turnos Individuales
                    </span>
                    <span className="text-3xl font-bold text-green-700">
                      {generatedSlots.reduce(
                        (acc, slot) => acc + slot.slotsCount,
                        0,
                      )}
                    </span>
                  </div>
                </div>
                {generatedSlots.length === 0 && (
                  <div className="mt-6 flex items-start gap-2 text-xs text-green-700 bg-green-100/50 p-3 rounded-lg">
                    <AlertCircleIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <p>
                      Aún no se han generado turnos. Seleccione una plantilla y
                      haga clic en generar.
                    </p>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Generated Slots Table */}
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
              <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-base font-semibold text-slate-800">
                  Bloques de Turnos Generados
                </h2>
                <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
                  {generatedSlots.length} bloques
                </span>
              </div>
              <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                <table className="w-full">
                  <thead className="sticky top-0 bg-slate-50 z-10">
                    <tr className="border-b border-slate-100">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Fecha
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Médico
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Horario
                      </th>
                      <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Turnos
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
                      {generatedSlots.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-5 py-12 text-center text-sm text-slate-400"
                          >
                            <CalendarIcon className="w-8 h-8 mx-auto mb-3 text-slate-300" />
                            No hay turnos generados.
                          </td>
                        </tr>
                      ) : (
                        // Sort by date descending for display
                        [...generatedSlots]
                          .sort(
                            (a, b) =>
                              new Date(b.date).getTime() -
                              new Date(a.date).getTime(),
                          )
                          .map((slot, i) => (
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
                                delay: Math.min(i * 0.02, 0.5),
                              }} // Cap delay for long lists
                              className="hover:bg-slate-50/50 transition-colors"
                            >
                              <td className="px-5 py-3.5 text-sm font-medium text-slate-800">
                                {new Date(
                                  `${slot.date}T12:00:00`,
                                ).toLocaleDateString()}
                                <span className="block text-xs text-slate-500 font-normal">
                                  {slot.dayName}
                                </span>
                              </td>
                              <td className="px-5 py-3.5 text-sm text-slate-600">
                                {slot.doctorName}
                              </td>
                              <td className="px-5 py-3.5 text-sm text-slate-600">
                                {slot.startTime} - {slot.endTime}
                              </td>
                              <td className="px-5 py-3.5 text-sm text-center font-semibold text-blue-700">
                                {slot.slotsCount}
                              </td>
                              <td className="px-5 py-3.5 text-center">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                  {slot.status}
                                </span>
                              </td>
                              <td className="px-5 py-3.5 text-right">
                                <button
                                  onClick={() =>
                                    handleDeleteGeneratedBatch(slot.id)
                                  }
                                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Eliminar bloque de turnos"
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

        {/* TAB 3: TURNOS ADICIONALES */}
        {activeTab === 'additional' && (
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
                  Agregar Turnos Adicionales Manuales
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
                      {DOCTORS.map((d) => (
                        <option key={d.id} value={d.id}>
                          Dr. {d.nombre} {d.apellido}
                        </option>
                      ))}
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
                  Turnos Adicionales Creados
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
                              {new Date(
                                `${slot.date}T12:00:00`,
                              ).toLocaleDateString()}
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
