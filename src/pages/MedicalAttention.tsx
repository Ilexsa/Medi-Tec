import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, SaveIcon, PrinterIcon } from 'lucide-react';

import { getAppointment, CitaApi } from '../services/appointments';
import { getPatient, PatientApi } from '../services/patients';
import { getDoctor, DoctorApi } from '../services/doctors';
import { startConsultationFromAppointment, ConsultaApi } from '../services/consultations';

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

  const [cita, setCita] = useState<CitaApi | null>(null);
  const [patient, setPatient] = useState<PatientApi | null>(null);
  const [doctor, setDoctor] = useState<DoctorApi | null>(null);
  const [consulta, setConsulta] = useState<ConsultaApi | null>(null);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEverything = async () => {
      if (!id) return;
      try {
        const appointmentData = await getAppointment(Number(id));
        setCita((appointmentData as any).data ?? appointmentData);

        const [patData, metaCons] = await Promise.all([
          getPatient(appointmentData.paciente_id),
          startConsultationFromAppointment({ cita_id: appointmentData.id })
        ]);

        setPatient((patData as any).data ?? patData);
        setConsulta((metaCons as any).data ?? metaCons);

        try {
           const docData = await getDoctor(appointmentData.medico_id);
           setDoctor((docData as any).data ?? docData);
        } catch {
           // Si falla traer doctor silenciamos
        }
      } catch(e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    void fetchEverything();
  }, [id]);

  if (loading) {
     return <div className="p-8 text-center text-slate-500">Cargando datos de la atención...</div>;
  }

  if (!patient || !cita) {
     return <div className="p-8 text-center text-slate-500">No se pudo cargar la atención.</div>;
  }

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
              {patient.nombres?.[0] || 'P'}
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-800">
                {patient.nombres} {patient.apellidos}
              </h1>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span>CI: {patient.identificacion}</span>
                <span>•</span>
                <span>{patient.email ? patient.email : 'Sin email'}</span>
                <span>•</span>
                <span>Dr(a). {doctor ? `${doctor.nombres} ${doctor.apellidos}` : cita.medico_id}</span>
                <span>•</span>
                <span className="text-blue-600 font-medium">
                  {doctor?.nombre_especialidad || 'Especialidad General'}
                </span>
                <span>•</span>
                <span>
                  {cita.fecha_hora?.split('T')[1]?.substring(0,5) || '--:--'} — {cita.motivo || 'Sin motivo'}
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
        {activeTab === 'consult' && <ConsultTab consultaId={consulta?.id} />}
        {activeTab === 'prescription' && <PrescriptionTab />}
        {activeTab === 'exams' && <ExamOrderTab />}
        {activeTab === 'certificate' && <CertificateTab />}
        {activeTab === 'odontogram' &&
          <OdontogramTab specialty={doctor?.nombre_especialidad || 'General'} />
        }
        {activeTab === 'history' && <HistoryTab patientName={`${patient.nombres} ${patient.apellidos}`} patientId={patient.id} />}
      </div>
    </div>);

}