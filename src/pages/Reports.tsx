import React, { useState } from 'react';
import {
  PrinterIcon,
  FileTextIcon,
  ClipboardListIcon,
  AwardIcon,
  BookOpenIcon,
  SearchIcon,
  CalendarIcon,
  UserIcon,
  StethoscopeIcon,
  ChevronDownIcon,
  XIcon,
  EyeIcon,
  DownloadIcon,
  RefreshCwIcon } from
'lucide-react';
type ReportType =
'prescriptions' |
'examOrders' |
'certificates' |
'medicalHistory';
interface ReportRecord {
  id: number;
  type: ReportType;
  date: string;
  patient: string;
  patientId: string;
  doctor: string;
  specialty: string;
  title: string;
  content: string;
  details: string[];
  status: 'activo' | 'vencido' | 'pendiente';
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
'Sofia Ramírez Díaz'];

const MOCK_REPORTS: ReportRecord[] = [
// Prescriptions
{
  id: 1,
  type: 'prescriptions',
  date: '2024-03-15',
  patient: 'Juan Pérez López',
  patientId: '1234567890',
  doctor: 'Dr. Carlos Mendoza',
  specialty: 'Medicina General',
  title: 'Receta Médica #RX-2024-001',
  content: 'Tratamiento para hipertensión arterial',
  details: [
  'Losartán 50mg - 1 vez al día por 30 días',
  'Aspirina 100mg - 1 vez al día por 30 días',
  'Amlodipino 5mg - 1 vez al día por 30 días'],

  status: 'activo'
},
{
  id: 2,
  type: 'prescriptions',
  date: '2024-03-12',
  patient: 'María González Silva',
  patientId: '0987654321',
  doctor: 'Dra. Ana García',
  specialty: 'Cardiología',
  title: 'Receta Médica #RX-2024-002',
  content: 'Tratamiento para arritmia sinusal',
  details: [
  'Metoprolol 25mg - 2 veces al día por 60 días',
  'Warfarina 5mg - 1 vez al día por 90 días'],

  status: 'activo'
},
{
  id: 3,
  type: 'prescriptions',
  date: '2024-02-20',
  patient: 'Luis Torres Castillo',
  patientId: '9988776655',
  doctor: 'Dr. Carlos Mendoza',
  specialty: 'Medicina General',
  title: 'Receta Médica #RX-2024-003',
  content: 'Tratamiento para diabetes mellitus tipo 2',
  details: [
  'Metformina 850mg - 2 veces al día',
  'Glibenclamida 5mg - 1 vez al día'],

  status: 'vencido'
},
// Exam Orders
{
  id: 4,
  type: 'examOrders',
  date: '2024-03-15',
  patient: 'Juan Pérez López',
  patientId: '1234567890',
  doctor: 'Dr. Carlos Mendoza',
  specialty: 'Medicina General',
  title: 'Orden de Exámenes #OE-2024-001',
  content: 'Exámenes de control para hipertensión',
  details: [
  'Hemograma completo',
  'Perfil lipídico',
  'Glucosa en ayunas',
  'Creatinina sérica'],

  status: 'pendiente'
},
{
  id: 5,
  type: 'examOrders',
  date: '2024-03-12',
  patient: 'María González Silva',
  patientId: '0987654321',
  doctor: 'Dra. Ana García',
  specialty: 'Cardiología',
  title: 'Orden de Exámenes #OE-2024-002',
  content: 'Estudios cardíacos',
  details: [
  'Electrocardiograma',
  'Holter 24 horas',
  'Ecocardiograma transtorácico',
  'BNP sérico'],

  status: 'activo'
},
{
  id: 6,
  type: 'examOrders',
  date: '2024-03-10',
  patient: 'Carlos Rodríguez Mora',
  patientId: '1122334455',
  doctor: 'Dr. Luis Rodríguez',
  specialty: 'Ortopedia',
  title: 'Orden de Exámenes #OE-2024-003',
  content: 'Imágenes para lumbalgia',
  details: [
  'RMN columna lumbar',
  'Radiografía AP y lateral de columna',
  'Densitometría ósea'],

  status: 'pendiente'
},
// Certificates
{
  id: 7,
  type: 'certificates',
  date: '2024-03-14',
  patient: 'Ana Martínez Vega',
  patientId: '5566778899',
  doctor: 'Dra. María Torres',
  specialty: 'Ginecología',
  title: 'Certificado Médico #CM-2024-001',
  content: 'Certificado de control prenatal',
  details: [
  'Paciente en estado de gestación de 20 semanas',
  'Embarazo de curso normal',
  'Apta para actividades laborales de bajo riesgo',
  'Válido por 30 días'],

  status: 'activo'
},
{
  id: 8,
  type: 'certificates',
  date: '2024-03-08',
  patient: 'Juan Pérez López',
  patientId: '1234567890',
  doctor: 'Dr. Carlos Mendoza',
  specialty: 'Medicina General',
  title: 'Certificado de Reposo #CR-2024-001',
  content: 'Reposo médico por 3 días',
  details: [
  'Diagnóstico: Síndrome gripal',
  'Reposo domiciliario por 3 días',
  'Fecha: 08/03/2024 al 10/03/2024',
  'No apto para actividades laborales'],

  status: 'vencido'
},
// Medical History
{
  id: 9,
  type: 'medicalHistory',
  date: '2024-03-15',
  patient: 'Juan Pérez López',
  patientId: '1234567890',
  doctor: 'Dr. Carlos Mendoza',
  specialty: 'Medicina General',
  title: 'Historia Clínica #HC-2024-001',
  content: 'Historia clínica completa',
  details: [
  'Antecedentes: Hipertensión arterial (2020)',
  'Alergias: Penicilina',
  'Medicación actual: Losartán 50mg',
  'Última consulta: 15/03/2024'],

  status: 'activo'
},
{
  id: 10,
  type: 'medicalHistory',
  date: '2024-03-12',
  patient: 'María González Silva',
  patientId: '0987654321',
  doctor: 'Dra. Ana García',
  specialty: 'Cardiología',
  title: 'Historia Clínica #HC-2024-002',
  content: 'Historia clínica cardiológica',
  details: [
  'Antecedentes: Arritmia sinusal (2022)',
  'Sin alergias conocidas',
  'Medicación: Metoprolol 25mg',
  'Última consulta: 12/03/2024'],

  status: 'activo'
}];

const TAB_CONFIG = {
  prescriptions: {
    label: 'Recetas',
    icon: FileTextIcon,
    color: 'blue',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-700'
  },
  examOrders: {
    label: 'Órdenes de Examen',
    icon: ClipboardListIcon,
    color: 'green',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    badgeBg: 'bg-green-100',
    badgeText: 'text-green-700'
  },
  certificates: {
    label: 'Certificados',
    icon: AwardIcon,
    color: 'purple',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-700'
  },
  medicalHistory: {
    label: 'Historiales Médicos',
    icon: BookOpenIcon,
    color: 'orange',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-200',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    badgeBg: 'bg-orange-100',
    badgeText: 'text-orange-700'
  }
};
const STATUS_CONFIG = {
  activo: {
    label: 'Activo',
    class: 'bg-green-100 text-green-700'
  },
  vencido: {
    label: 'Vencido',
    class: 'bg-red-100 text-red-700'
  },
  pendiente: {
    label: 'Pendiente',
    class: 'bg-yellow-100 text-yellow-700'
  }
};
interface PrintModalProps {
  record: ReportRecord;
  onClose: () => void;
}
function PrintPreviewModal({ record, onClose }: PrintModalProps) {
  const config = TAB_CONFIG[record.type];
  const Icon = config.icon;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 ${config.iconBg} rounded-xl flex items-center justify-center`}>

              <Icon className={`w-4 h-4 ${config.iconColor}`} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Vista Previa de Impresión
              </h2>
              <p className="text-xs text-gray-500">{record.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">

            <XIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Print Preview */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Document */}
          <div className="border-2 border-gray-200 rounded-xl p-6 bg-white shadow-inner">
            {/* Letterhead */}
            <div className="text-center border-b-2 border-gray-800 pb-4 mb-5">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">MC</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  CLÍNICA MÉDICA
                </h3>
              </div>
              <p className="text-xs text-gray-500">
                Sistema de Gestión Médica · Tel: (02) 123-4567
              </p>
              <p className="text-xs text-gray-500">
                Av. Principal 123, Ciudad · info@clinica.com
              </p>
            </div>

            {/* Document Title */}
            <div
              className={`${config.bgColor} ${config.borderColor} border rounded-lg px-4 py-2 text-center mb-5`}>

              <p
                className={`text-sm font-bold ${config.textColor} uppercase tracking-wide`}>

                {record.title}
              </p>
            </div>

            {/* Patient & Doctor Info */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <p className="text-xs text-gray-500 font-medium mb-0.5">
                  PACIENTE
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {record.patient}
                </p>
                <p className="text-xs text-gray-500">CI: {record.patientId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-0.5">
                  MÉDICO
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {record.doctor}
                </p>
                <p className="text-xs text-gray-500">{record.specialty}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-0.5">
                  FECHA
                </p>
                <p className="text-sm text-gray-800">
                  {new Date(record.date).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-0.5">
                  ESTADO
                </p>
                <span
                  className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_CONFIG[record.status].class}`}>

                  {STATUS_CONFIG[record.status].label}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="mb-5">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2">
                DESCRIPCIÓN
              </p>
              <p className="text-sm text-gray-700 font-medium mb-3">
                {record.content}
              </p>
              <div className="space-y-2">
                {record.details.map((detail, i) =>
                <div key={i} className="flex items-start gap-2">
                    <span className="text-xs font-bold text-gray-500 mt-0.5 min-w-[1.2rem]">
                      {i + 1}.
                    </span>
                    <p className="text-sm text-gray-700">{detail}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Signature Area */}
            <div className="border-t border-gray-200 pt-4 mt-6">
              <div className="flex justify-between items-end">
                <div className="text-center">
                  <div className="w-32 border-b border-gray-400 mb-1" />
                  <p className="text-xs text-gray-500">Firma del Médico</p>
                  <p className="text-xs font-medium text-gray-700">
                    {record.doctor}
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-24 border-b border-gray-400 mb-1" />
                  <p className="text-xs text-gray-500">Sello</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">

            Cancelar
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => {
                alert('Descargando PDF...');
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">

              <DownloadIcon className="w-4 h-4" />
              Descargar PDF
            </button>
            <button
              onClick={() => {
                window.print();
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">

              <PrinterIcon className="w-4 h-4" />
              Imprimir
            </button>
          </div>
        </div>
      </div>
    </div>);

}
export function Reports() {
  const [activeTab, setActiveTab] = useState<ReportType>('prescriptions');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDoctor, setFilterDoctor] = useState('');
  const [filterPatient, setFilterPatient] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [printRecord, setPrintRecord] = useState<ReportRecord | null>(null);
  const tabRecords = MOCK_REPORTS.filter((r) => r.type === activeTab);
  const filtered = tabRecords.filter((record) => {
    const matchSearch =
    !searchQuery ||
    record.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.patientId.includes(searchQuery) ||
    record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDoctor = !filterDoctor || record.doctor === filterDoctor;
    const matchPatient = !filterPatient || record.patient === filterPatient;
    const matchStatus = !filterStatus || record.status === filterStatus;
    const matchDateFrom = !filterDateFrom || record.date >= filterDateFrom;
    const matchDateTo = !filterDateTo || record.date <= filterDateTo;
    return (
      matchSearch &&
      matchDoctor &&
      matchPatient &&
      matchStatus &&
      matchDateFrom &&
      matchDateTo);

  });
  const clearFilters = () => {
    setFilterDoctor('');
    setFilterPatient('');
    setFilterDateFrom('');
    setFilterDateTo('');
    setFilterStatus('');
    setSearchQuery('');
  };
  const activeFiltersCount = [
  filterDoctor,
  filterPatient,
  filterDateFrom,
  filterDateTo,
  filterStatus].
  filter(Boolean).length;
  const tabs: ReportType[] = [
  'prescriptions',
  'examOrders',
  'certificates',
  'medicalHistory'];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Reportería y Reimpresión
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Consulta y reimprime documentos médicos generados
          </p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
          <RefreshCwIcon className="w-4 h-4 text-blue-500" />
          <span className="text-sm text-blue-600 font-medium">
            Módulo de Reimpresión
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {tabs.map((tab) => {
          const config = TAB_CONFIG[tab];
          const Icon = config.icon;
          const count = MOCK_REPORTS.filter((r) => r.type === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${activeTab === tab ? `${config.bgColor} ${config.borderColor} shadow-sm` : 'bg-white border-gray-200 hover:border-gray-300'}`}>

              <div
                className={`w-8 h-8 ${activeTab === tab ? config.iconBg : 'bg-gray-100'} rounded-lg flex items-center justify-center mb-2`}>

                <Icon
                  className={`w-4 h-4 ${activeTab === tab ? config.iconColor : 'text-gray-500'}`} />

              </div>
              <p
                className={`text-xl font-bold ${activeTab === tab ? config.textColor : 'text-gray-900'}`}>

                {count}
              </p>
              <p
                className={`text-xs font-medium ${activeTab === tab ? config.textColor : 'text-gray-500'}`}>

                {config.label}
              </p>
            </button>);

        })}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {tabs.map((tab) => {
          const config = TAB_CONFIG[tab];
          const Icon = config.icon;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>

              <Icon className="w-4 h-4" />
              <span className="hidden md:inline">{config.label}</span>
            </button>);

        })}
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Buscar en ${TAB_CONFIG[activeTab].label.toLowerCase()}...`}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${showFilters || activeFiltersCount > 0 ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}>

            <SearchIcon className="w-4 h-4" />
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

        {showFilters &&
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-3 border-t border-gray-100">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5 flex items-center gap-1">
                <StethoscopeIcon className="w-3.5 h-3.5 text-blue-500" />
                Médico
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

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Estado
              </label>
              <div className="relative">
                <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white">

                  <option value="">Todos los estados</option>
                  <option value="activo">Activo</option>
                  <option value="vencido">Vencido</option>
                  <option value="pendiente">Pendiente</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

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

      {/* Records Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            {(() => {
              const config = TAB_CONFIG[activeTab];
              const Icon = config.icon;
              return (
                <>
                  <div
                    className={`w-7 h-7 ${config.iconBg} rounded-lg flex items-center justify-center`}>

                    <Icon className={`w-3.5 h-3.5 ${config.iconColor}`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {config.label}
                  </h3>
                </>);

            })()}
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {filtered.length} registros
            </span>
          </div>
        </div>

        {filtered.length === 0 ?
        <div className="p-12 text-center">
            <PrinterIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">
              No se encontraron documentos
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Ajusta los filtros de búsqueda
            </p>
          </div> :

        <div className="divide-y divide-gray-50">
            {filtered.map((record) => {
            const config = TAB_CONFIG[record.type];
            const Icon = config.icon;
            return (
              <div
                key={record.id}
                className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">

                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div
                    className={`w-9 h-9 ${config.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>

                      <Icon className={`w-4 h-4 ${config.iconColor}`} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-gray-900 truncate">
                          {record.title}
                        </span>
                        <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_CONFIG[record.status].class}`}>

                          {STATUS_CONFIG[record.status].label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <UserIcon className="w-3 h-3" />
                          {record.patient}
                        </span>
                        <span className="text-xs text-gray-400">·</span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <StethoscopeIcon className="w-3 h-3" />
                          {record.doctor}
                        </span>
                        <span className="text-xs text-gray-400">·</span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <CalendarIcon className="w-3 h-3" />
                          {new Date(record.date).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">
                        {record.content}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                    <button
                    onClick={() => setPrintRecord(record)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">

                      <EyeIcon className="w-3.5 h-3.5" />
                      Vista Previa
                    </button>
                    <button
                    onClick={() => setPrintRecord(record)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">

                      <PrinterIcon className="w-3.5 h-3.5" />
                      Reimprimir
                    </button>
                  </div>
                </div>);

          })}
          </div>
        }
      </div>

      {/* Print Preview Modal */}
      {printRecord &&
      <PrintPreviewModal
        record={printRecord}
        onClose={() => setPrintRecord(null)} />

      }
    </div>);

}