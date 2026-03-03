import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, SaveIcon, PrinterIcon } from 'lucide-react';
import { VitalsTab } from '../components/medattention/VitalsTab';
import { ConsultTab } from '../components/medattention/ConsultTab';
import { PrescriptionTab } from '../components/medattention/PrescriptionTab';
import { ExamOrderTab } from '../components/medattention/ExamOrderTab';
import { CertificateTab } from '../components/medattention/CertificateTab';
import { OdontogramTab } from '../components/medattention/OdontogramTab';
import { HistoryTab } from '../components/medattention/HistoryTab';
const TABS = [
{
  id: 'vitals',
  label: 'Signos Vitales'
},
{
  id: 'consult',
  label: 'Consulta'
},
{
  id: 'prescription',
  label: 'Receta Médica'
},
{
  id: 'exams',
  label: 'Orden de Examen'
},
{
  id: 'certificate',
  label: 'Certificado'
},
{
  id: 'odontogram',
  label: 'Odontograma'
},
{
  id: 'history',
  label: 'Historial'
}];

export function MedicalAttention() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('vitals');
  // Mock patient data based on consult id
  const patient = {
    nombre: 'María García',
    apellido: '',
    edad: 34,
    cedula: '0987654321',
    doctor: 'Dr. Carlos Mendoza',
    especialidad: 'Medicina General',
    hora: '08:30',
    motivo: 'Dolor de cabeza'
  };
  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center gap-4 mb-3">
          <button
            onClick={() => navigate('/medical-consult')}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors">

            <ArrowLeftIcon size={16} />
            Volver a Consultas
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
              {patient.nombre[0]}
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-800">
                {patient.nombre} {patient.apellido}
              </h1>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span>CI: {patient.cedula}</span>
                <span>•</span>
                <span>{patient.edad} años</span>
                <span>•</span>
                <span>{patient.doctor}</span>
                <span>•</span>
                <span className="text-blue-600 font-medium">
                  {patient.especialidad}
                </span>
                <span>•</span>
                <span>
                  {patient.hora} — {patient.motivo}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50 transition-colors">
              <PrinterIcon size={13} /> Imprimir
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-medium transition-colors">
              <SaveIcon size={13} /> Guardar Todo
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-6">
        <div className="flex gap-0 overflow-x-auto">
          {TABS.map((tab) =>
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${activeTab === tab.id ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>

              {tab.label}
            </button>
          )}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'vitals' && <VitalsTab />}
        {activeTab === 'consult' && <ConsultTab />}
        {activeTab === 'prescription' && <PrescriptionTab />}
        {activeTab === 'exams' && <ExamOrderTab />}
        {activeTab === 'certificate' && <CertificateTab />}
        {activeTab === 'odontogram' &&
        <OdontogramTab specialty={patient.especialidad} />
        }
        {activeTab === 'history' && <HistoryTab patientName={patient.nombre} />}
      </div>
    </div>);

}