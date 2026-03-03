import React, { useState } from 'react';
import {
  SearchIcon,
  FilterIcon,
  CalendarIcon,
  UserIcon,
  StethoscopeIcon,
  FileTextIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  EyeIcon,
  XIcon } from
'lucide-react';
interface HistoryRecord {
  id: number;
  date: string;
  patient: string;
  patientId: string;
  doctor: string;
  specialty: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  vitals: {
    bp: string;
    hr: string;
    temp: string;
    weight: string;
    height: string;
  };
  prescriptions: string[];
  examOrders: string[];
}
const MOCK_DOCTORS = [
'Dr. Carlos Mendoza',
'Dra. Ana García',
'Dr. Luis Rodríguez',
'Dra. María Torres',
'Dr. José Martínez'];

const MOCK_PATIENTS = [
'Juan Pérez López',
'María González Silva',
'Carlos Rodríguez Mora',
'Ana Martínez Vega',
'Luis Torres Castillo',
'Sofia Ramírez Díaz',
'Pedro Sánchez Ruiz'];

const MOCK_HISTORY: HistoryRecord[] = [
{
  id: 1,
  date: '2024-03-15',
  patient: 'Juan Pérez López',
  patientId: '1234567890',
  doctor: 'Dr. Carlos Mendoza',
  specialty: 'Medicina General',
  diagnosis: 'Hipertensión arterial leve',
  treatment: 'Cambios en estilo de vida, dieta baja en sodio',
  notes:
  'Paciente refiere cefalea frecuente. Se recomienda control en 2 semanas.',
  vitals: {
    bp: '140/90',
    hr: '78',
    temp: '36.5',
    weight: '82',
    height: '175'
  },
  prescriptions: [
  'Losartán 50mg - 1 vez al día',
  'Aspirina 100mg - 1 vez al día'],

  examOrders: ['Hemograma completo', 'Perfil lipídico']
},
{
  id: 2,
  date: '2024-03-12',
  patient: 'María González Silva',
  patientId: '0987654321',
  doctor: 'Dra. Ana García',
  specialty: 'Cardiología',
  diagnosis: 'Arritmia sinusal',
  treatment: 'Monitoreo cardíaco continuo',
  notes: 'Se solicita Holter 24h. Próxima cita en 1 mes.',
  vitals: {
    bp: '120/80',
    hr: '92',
    temp: '36.8',
    weight: '65',
    height: '162'
  },
  prescriptions: ['Metoprolol 25mg - 2 veces al día'],
  examOrders: ['Electrocardiograma', 'Holter 24h', 'Ecocardiograma']
},
{
  id: 3,
  date: '2024-03-10',
  patient: 'Carlos Rodríguez Mora',
  patientId: '1122334455',
  doctor: 'Dr. Luis Rodríguez',
  specialty: 'Ortopedia',
  diagnosis: 'Lumbalgia crónica',
  treatment: 'Fisioterapia, analgésicos',
  notes:
  'Paciente con dolor lumbar de 3 meses de evolución. RMN de columna solicitada.',
  vitals: {
    bp: '118/76',
    hr: '72',
    temp: '36.6',
    weight: '90',
    height: '180'
  },
  prescriptions: ['Ibuprofeno 400mg - 3 veces al día', 'Relajante muscular'],
  examOrders: ['RMN columna lumbar', 'Radiografía columna']
},
{
  id: 4,
  date: '2024-03-08',
  patient: 'Ana Martínez Vega',
  patientId: '5566778899',
  doctor: 'Dra. María Torres',
  specialty: 'Ginecología',
  diagnosis: 'Control prenatal - 20 semanas',
  treatment: 'Suplementos vitamínicos, control mensual',
  notes:
  'Embarazo de curso normal. Ecografía morfológica realizada con resultados normales.',
  vitals: {
    bp: '110/70',
    hr: '80',
    temp: '36.4',
    weight: '68',
    height: '158'
  },
  prescriptions: ['Ácido fólico 5mg', 'Hierro 300mg', 'Calcio 500mg'],
  examOrders: ['Glucosa en ayunas', 'Hemograma', 'Urocultivo']
},
{
  id: 5,
  date: '2024-03-05',
  patient: 'Luis Torres Castillo',
  patientId: '9988776655',
  doctor: 'Dr. Carlos Mendoza',
  specialty: 'Medicina General',
  diagnosis: 'Diabetes mellitus tipo 2',
  treatment: 'Metformina, dieta diabética',
  notes: 'HbA1c elevada. Se ajusta dosis de metformina. Control en 3 meses.',
  vitals: {
    bp: '130/85',
    hr: '76',
    temp: '36.7',
    weight: '95',
    height: '172'
  },
  prescriptions: ['Metformina 850mg - 2 veces al día', 'Glibenclamida 5mg'],
  examOrders: ['HbA1c', 'Perfil renal', 'Microalbuminuria']
},
{
  id: 6,
  date: '2024-03-01',
  patient: 'Sofia Ramírez Díaz',
  patientId: '4433221100',
  doctor: 'Dra. Ana García',
  specialty: 'Cardiología',
  diagnosis: 'Insuficiencia cardíaca compensada',
  treatment: 'Diuréticos, restricción hídrica',
  notes: 'Paciente estable. Fracción de eyección 45%. Control mensual.',
  vitals: {
    bp: '125/82',
    hr: '88',
    temp: '36.5',
    weight: '72',
    height: '160'
  },
  prescriptions: ['Furosemida 40mg', 'Enalapril 10mg', 'Carvedilol 6.25mg'],
  examOrders: ['Ecocardiograma', 'BNP', 'Electrolitos']
}];

export function History() {
  const [searchPatient, setSearchPatient] = useState('');
  const [filterDoctor, setFilterDoctor] = useState('');
  const [filterPatient, setFilterPatient] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(
    null
  );
  const [showFilters, setShowFilters] = useState(false);
  const filtered = MOCK_HISTORY.filter((record) => {
    const matchSearch =
    !searchPatient ||
    record.patient.toLowerCase().includes(searchPatient.toLowerCase()) ||
    record.patientId.includes(searchPatient) ||
    record.diagnosis.toLowerCase().includes(searchPatient.toLowerCase());
    const matchDoctor = !filterDoctor || record.doctor === filterDoctor;
    const matchPatient = !filterPatient || record.patient === filterPatient;
    const matchSpecialty =
    !filterSpecialty || record.specialty === filterSpecialty;
    const matchDateFrom = !filterDateFrom || record.date >= filterDateFrom;
    const matchDateTo = !filterDateTo || record.date <= filterDateTo;
    return (
      matchSearch &&
      matchDoctor &&
      matchPatient &&
      matchSpecialty &&
      matchDateFrom &&
      matchDateTo);

  });
  const clearFilters = () => {
    setFilterDoctor('');
    setFilterPatient('');
    setFilterDateFrom('');
    setFilterDateTo('');
    setFilterSpecialty('');
    setSearchPatient('');
  };
  const activeFiltersCount = [
  filterDoctor,
  filterPatient,
  filterDateFrom,
  filterDateTo,
  filterSpecialty].
  filter(Boolean).length;
  const specialties = [...new Set(MOCK_HISTORY.map((r) => r.specialty))];
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Historial Médico</h1>
          <p className="text-sm text-gray-500 mt-1">
            Consulta el historial clínico de todos los pacientes
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-blue-50 px-3 py-2 rounded-lg">
          <FileTextIcon className="w-4 h-4 text-blue-500" />
          <span className="font-medium text-blue-700">{filtered.length}</span>
          <span className="text-blue-600">registros</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchPatient}
              onChange={(e) => setSearchPatient(e.target.value)}
              placeholder="Buscar por paciente, cédula o diagnóstico..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${showFilters || activeFiltersCount > 0 ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}>

            <FilterIcon className="w-4 h-4" />
            Filtros
            {activeFiltersCount > 0 &&
            <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            }
          </button>
          {activeFiltersCount > 0 &&
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors">

              <XIcon className="w-3.5 h-3.5" />
              Limpiar
            </button>
          }
        </div>

        {/* Expanded Filters */}
        {showFilters &&
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-3 border-t border-gray-100">
            {/* Filter by Doctor */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5 flex items-center gap-1">
                <StethoscopeIcon className="w-3.5 h-3.5 text-blue-500" />
                Médico Tratante
              </label>
              <div className="relative">
                <select
                value={filterDoctor}
                onChange={(e) => setFilterDoctor(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white">

                  <option value="">Todos los médicos</option>
                  {MOCK_DOCTORS.map((doc) =>
                <option key={doc} value={doc}>
                      {doc}
                    </option>
                )}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Filter by Patient */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5 flex items-center gap-1">
                <UserIcon className="w-3.5 h-3.5 text-blue-500" />
                Paciente
              </label>
              <div className="relative">
                <select
                value={filterPatient}
                onChange={(e) => setFilterPatient(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white">

                  <option value="">Todos los pacientes</option>
                  {MOCK_PATIENTS.map((p) =>
                <option key={p} value={p}>
                      {p}
                    </option>
                )}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Filter by Specialty */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5 flex items-center gap-1">
                <FileTextIcon className="w-3.5 h-3.5 text-blue-500" />
                Especialidad
              </label>
              <div className="relative">
                <select
                value={filterSpecialty}
                onChange={(e) => setFilterSpecialty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white">

                  <option value="">Todas las especialidades</option>
                  {specialties.map((s) =>
                <option key={s} value={s}>
                      {s}
                    </option>
                )}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Date From */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5 flex items-center gap-1">
                <CalendarIcon className="w-3.5 h-3.5 text-blue-500" />
                Fecha Desde
              </label>
              <input
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

            </div>

            {/* Date To */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5 flex items-center gap-1">
                <CalendarIcon className="w-3.5 h-3.5 text-blue-500" />
                Fecha Hasta
              </label>
              <input
              type="date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

            </div>
          </div>
        }
      </div>

      {/* Active Filter Chips */}
      {activeFiltersCount > 0 &&
      <div className="flex flex-wrap gap-2">
          {filterDoctor &&
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
              <StethoscopeIcon className="w-3 h-3" />
              {filterDoctor}
              <button
            onClick={() => setFilterDoctor('')}
            className="hover:text-blue-900">

                <XIcon className="w-3 h-3" />
              </button>
            </span>
        }
          {filterPatient &&
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
              <UserIcon className="w-3 h-3" />
              {filterPatient}
              <button
            onClick={() => setFilterPatient('')}
            className="hover:text-green-900">

                <XIcon className="w-3 h-3" />
              </button>
            </span>
        }
          {filterSpecialty &&
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
              {filterSpecialty}
              <button
            onClick={() => setFilterSpecialty('')}
            className="hover:text-purple-900">

                <XIcon className="w-3 h-3" />
              </button>
            </span>
        }
          {filterDateFrom &&
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
              Desde: {filterDateFrom}
              <button
            onClick={() => setFilterDateFrom('')}
            className="hover:text-orange-900">

                <XIcon className="w-3 h-3" />
              </button>
            </span>
        }
          {filterDateTo &&
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
              Hasta: {filterDateTo}
              <button
            onClick={() => setFilterDateTo('')}
            className="hover:text-orange-900">

                <XIcon className="w-3 h-3" />
              </button>
            </span>
        }
        </div>
      }

      {/* Records List */}
      <div className="space-y-3">
        {filtered.length === 0 ?
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <FileTextIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">
              No se encontraron registros
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Intenta ajustar los filtros de búsqueda
            </p>
          </div> :

        filtered.map((record) =>
        <div
          key={record.id}
          className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

              {/* Record Header */}
              <div
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() =>
            setExpandedId(expandedId === record.id ? null : record.id)
            }>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileTextIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900 text-sm">
                        {record.patient}
                      </span>
                      <span className="text-xs text-gray-400">·</span>
                      <span className="text-xs text-gray-500">
                        CI: {record.patientId}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <StethoscopeIcon className="w-3 h-3" />
                        {record.doctor}
                      </span>
                      <span className="text-xs text-gray-400">·</span>
                      <span className="text-xs text-blue-600 font-medium">
                        {record.specialty}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-medium text-gray-700">
                      {record.diagnosis}
                    </p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 justify-end mt-0.5">
                      <CalendarIcon className="w-3 h-3" />
                      {new Date(record.date).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedRecord(record);
                  }}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Ver detalle completo">

                      <EyeIcon className="w-4 h-4" />
                    </button>
                    {expandedId === record.id ?
                <ChevronUpIcon className="w-4 h-4 text-gray-400" /> :

                <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                }
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedId === record.id &&
          <div className="border-t border-gray-100 p-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Vitals */}
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Signos Vitales
                      </h4>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">
                            Presión Arterial
                          </span>
                          <span className="font-medium text-gray-800">
                            {record.vitals.bp} mmHg
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">
                            Frecuencia Cardíaca
                          </span>
                          <span className="font-medium text-gray-800">
                            {record.vitals.hr} bpm
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Temperatura</span>
                          <span className="font-medium text-gray-800">
                            {record.vitals.temp} °C
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Peso / Talla</span>
                          <span className="font-medium text-gray-800">
                            {record.vitals.weight}kg / {record.vitals.height}cm
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Prescriptions */}
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Recetas
                      </h4>
                      {record.prescriptions.length > 0 ?
                <ul className="space-y-1">
                          {record.prescriptions.map((rx, i) =>
                  <li
                    key={i}
                    className="text-xs text-gray-700 flex items-start gap-1.5">

                              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                              {rx}
                            </li>
                  )}
                        </ul> :

                <p className="text-xs text-gray-400">Sin recetas</p>
                }
                    </div>

                    {/* Exam Orders */}
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Órdenes de Examen
                      </h4>
                      {record.examOrders.length > 0 ?
                <ul className="space-y-1">
                          {record.examOrders.map((exam, i) =>
                  <li
                    key={i}
                    className="text-xs text-gray-700 flex items-start gap-1.5">

                              <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
                              {exam}
                            </li>
                  )}
                        </ul> :

                <p className="text-xs text-gray-400">Sin órdenes</p>
                }
                    </div>

                    {/* Diagnosis & Notes */}
                    <div className="bg-white rounded-lg p-3 border border-gray-200 md:col-span-2 lg:col-span-3">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Diagnóstico y Notas
                      </h4>
                      <p className="text-xs font-medium text-gray-800 mb-1">
                        {record.diagnosis}
                      </p>
                      <p className="text-xs text-gray-600">{record.notes}</p>
                    </div>
                  </div>
                </div>
          }
            </div>
        )
        }
      </div>

      {/* Detail Modal */}
      {selectedRecord &&
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Detalle del Historial
                </h2>
                <p className="text-xs text-gray-500">
                  {selectedRecord.patient} ·{' '}
                  {new Date(selectedRecord.date).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
                </p>
              </div>
              <button
              onClick={() => setSelectedRecord(null)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">

                <XIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* Patient & Doctor Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-xs text-blue-500 font-medium mb-1">
                    Paciente
                  </p>
                  <p className="font-semibold text-gray-900 text-sm">
                    {selectedRecord.patient}
                  </p>
                  <p className="text-xs text-gray-500">
                    CI: {selectedRecord.patientId}
                  </p>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-xs text-green-500 font-medium mb-1">
                    Médico Tratante
                  </p>
                  <p className="font-semibold text-gray-900 text-sm">
                    {selectedRecord.doctor}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedRecord.specialty}
                  </p>
                </div>
              </div>

              {/* Diagnosis */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Diagnóstico
                </h3>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-sm font-medium text-gray-800">
                    {selectedRecord.diagnosis}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedRecord.treatment}
                  </p>
                </div>
              </div>

              {/* Notes */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Notas Clínicas
                </h3>
                <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                  <p className="text-sm text-gray-700">
                    {selectedRecord.notes}
                  </p>
                </div>
              </div>

              {/* Vitals */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Signos Vitales
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-red-50 rounded-lg p-3 text-center border border-red-100">
                    <p className="text-xs text-red-500 font-medium">Presión</p>
                    <p className="font-bold text-gray-900 text-sm">
                      {selectedRecord.vitals.bp}
                    </p>
                    <p className="text-xs text-gray-400">mmHg</p>
                  </div>
                  <div className="bg-pink-50 rounded-lg p-3 text-center border border-pink-100">
                    <p className="text-xs text-pink-500 font-medium">
                      Frec. Cardíaca
                    </p>
                    <p className="font-bold text-gray-900 text-sm">
                      {selectedRecord.vitals.hr}
                    </p>
                    <p className="text-xs text-gray-400">bpm</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3 text-center border border-orange-100">
                    <p className="text-xs text-orange-500 font-medium">
                      Temperatura
                    </p>
                    <p className="font-bold text-gray-900 text-sm">
                      {selectedRecord.vitals.temp}
                    </p>
                    <p className="text-xs text-gray-400">°C</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-100">
                    <p className="text-xs text-blue-500 font-medium">Peso</p>
                    <p className="font-bold text-gray-900 text-sm">
                      {selectedRecord.vitals.weight}
                    </p>
                    <p className="text-xs text-gray-400">kg</p>
                  </div>
                </div>
              </div>

              {/* Prescriptions & Exams */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Recetas Médicas
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 space-y-1.5">
                    {selectedRecord.prescriptions.map((rx, i) =>
                  <div key={i} className="flex items-start gap-2 text-sm">
                        <span className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                        <span className="text-gray-700">{rx}</span>
                      </div>
                  )}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Órdenes de Examen
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 space-y-1.5">
                    {selectedRecord.examOrders.map((exam, i) =>
                  <div key={i} className="flex items-start gap-2 text-sm">
                        <span className="w-2 h-2 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
                        <span className="text-gray-700">{exam}</span>
                      </div>
                  )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <button
              onClick={() => setSelectedRecord(null)}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">

                Cerrar
              </button>
              <button
              onClick={() => window.print()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">

                Imprimir
              </button>
            </div>
          </div>
        </div>
      }
    </div>);

}