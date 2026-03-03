import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpenIcon, CheckCircleIcon, ArrowRightIcon } from 'lucide-react';
interface Doctor {
  id: number;
  nombre: string;
  apellido: string;
  especialidad: string;
}
interface Patient {
  id: number;
  nombre: string;
  apellido: string;
  cedula: string;
}
interface Slot {
  time: string;
  available: boolean;
}
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

const PATIENTS: Patient[] = [
{
  id: 1,
  nombre: 'Juan',
  apellido: 'Pérez',
  cedula: '1234567890'
},
{
  id: 2,
  nombre: 'María',
  apellido: 'García',
  cedula: '0987654321'
},
{
  id: 3,
  nombre: 'Luis',
  apellido: 'Rodríguez',
  cedula: '1122334455'
}];

const SLOTS: Slot[] = [
{
  time: '08:00',
  available: true
},
{
  time: '08:30',
  available: false
},
{
  time: '09:00',
  available: true
},
{
  time: '09:30',
  available: true
},
{
  time: '10:00',
  available: false
},
{
  time: '10:30',
  available: true
},
{
  time: '11:00',
  available: true
},
{
  time: '11:30',
  available: true
},
{
  time: '14:00',
  available: true
},
{
  time: '14:30',
  available: false
},
{
  time: '15:00',
  available: true
},
{
  time: '15:30',
  available: true
}];

export function BookAppointment() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [reason, setReason] = useState('');
  const [booked, setBooked] = useState(false);
  const canProceed = () => {
    if (step === 1) return !!selectedDoctor;
    if (step === 2) return !!selectedDate && !!selectedSlot;
    if (step === 3) return !!selectedPatient;
    return false;
  };
  const handleConfirm = () => {
    setBooked(true);
  };
  if (booked) {
    return (
      <div className="p-6 max-w-lg mx-auto">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircleIcon size={32} className="text-green-600" />
          </div>
          <h2 className="text-lg font-semibold text-slate-800 mb-2">
            ¡Turno Reservado!
          </h2>
          <p className="text-sm text-slate-500 mb-1">
            Paciente:{' '}
            <strong>
              {selectedPatient?.nombre} {selectedPatient?.apellido}
            </strong>
          </p>
          <p className="text-sm text-slate-500 mb-1">
            Médico:{' '}
            <strong>
              Dr. {selectedDoctor?.nombre} {selectedDoctor?.apellido}
            </strong>
          </p>
          <p className="text-sm text-slate-500 mb-6">
            Fecha y hora:{' '}
            <strong>
              {selectedDate} — {selectedSlot}
            </strong>
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() =>
              navigate('/billing', {
                state: {
                  patient: selectedPatient,
                  doctor: selectedDoctor,
                  date: selectedDate,
                  slot: selectedSlot
                }
              })
              }
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-medium transition-colors">

              Proceder a Facturación
              <ArrowRightIcon size={16} />
            </button>
            <button
              onClick={() => {
                setBooked(false);
                setStep(1);
                setSelectedDoctor(null);
                setSelectedDate('');
                setSelectedSlot(null);
                setSelectedPatient(null);
                setReason('');
              }}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">

              Reservar Otro Turno
            </button>
          </div>
        </div>
      </div>);

  }
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
          <BookOpenIcon size={22} className="text-blue-600" />
          Reservar Turno
        </h1>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 mb-6">
        {['Médico', 'Fecha y Hora', 'Paciente', 'Confirmar'].map((label, i) =>
        <div key={i} className="flex items-center gap-2">
            <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${step === i + 1 ? 'bg-blue-700 text-white' : step > i + 1 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>

              <span>{i + 1}</span>
              <span>{label}</span>
            </div>
            {i < 3 && <div className="w-4 h-px bg-slate-200" />}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        {/* Step 1: Doctor */}
        {step === 1 &&
        <div>
            <h2 className="text-sm font-semibold text-slate-700 mb-4">
              Seleccionar Médico
            </h2>
            <div className="grid gap-3">
              {DOCTORS.map((doc) =>
            <button
              key={doc.id}
              onClick={() => setSelectedDoctor(doc)}
              className={`flex items-center gap-4 p-4 rounded-lg border-2 text-left transition-all ${selectedDoctor?.id === doc.id ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-slate-200'}`}>

                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                    {doc.nombre[0]}
                    {doc.apellido[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      Dr. {doc.nombre} {doc.apellido}
                    </p>
                    <p className="text-xs text-slate-500">{doc.especialidad}</p>
                  </div>
                  {selectedDoctor?.id === doc.id &&
              <CheckCircleIcon
                size={18}
                className="ml-auto text-blue-600" />

              }
                </button>
            )}
            </div>
          </div>
        }

        {/* Step 2: Date & Slot */}
        {step === 2 &&
        <div>
            <h2 className="text-sm font-semibold text-slate-700 mb-4">
              Seleccionar Fecha y Turno
            </h2>
            <div className="mb-4">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Fecha
              </label>
              <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

            </div>
            {selectedDate &&
          <div>
                <p className="text-xs font-medium text-slate-600 mb-2">
                  Turnos disponibles
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {SLOTS.map((slot) =>
              <button
                key={slot.time}
                disabled={!slot.available}
                onClick={() => setSelectedSlot(slot.time)}
                className={`py-2 rounded-lg text-sm font-medium transition-all ${!slot.available ? 'bg-slate-50 text-slate-300 cursor-not-allowed' : selectedSlot === slot.time ? 'bg-blue-700 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}>

                      {slot.time}
                    </button>
              )}
                </div>
              </div>
          }
          </div>
        }

        {/* Step 3: Patient */}
        {step === 3 &&
        <div>
            <h2 className="text-sm font-semibold text-slate-700 mb-4">
              Seleccionar Paciente
            </h2>
            <div className="grid gap-3">
              {PATIENTS.map((p) =>
            <button
              key={p.id}
              onClick={() => setSelectedPatient(p)}
              className={`flex items-center gap-4 p-4 rounded-lg border-2 text-left transition-all ${selectedPatient?.id === p.id ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-slate-200'}`}>

                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm">
                    {p.nombre[0]}
                    {p.apellido[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {p.nombre} {p.apellido}
                    </p>
                    <p className="text-xs text-slate-500">CI: {p.cedula}</p>
                  </div>
                  {selectedPatient?.id === p.id &&
              <CheckCircleIcon
                size={18}
                className="ml-auto text-blue-600" />

              }
                </button>
            )}
            </div>
            <div className="mt-4">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Motivo de consulta
              </label>
              <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              placeholder="Describe el motivo..."
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />

            </div>
          </div>
        }

        {/* Step 4: Confirm */}
        {step === 4 &&
        <div>
            <h2 className="text-sm font-semibold text-slate-700 mb-4">
              Confirmar Reserva
            </h2>
            <div className="space-y-3 bg-slate-50 rounded-lg p-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Médico</span>
                <span className="font-medium text-slate-800">
                  Dr. {selectedDoctor?.nombre} {selectedDoctor?.apellido}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Especialidad</span>
                <span className="font-medium text-slate-800">
                  {selectedDoctor?.especialidad}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Fecha</span>
                <span className="font-medium text-slate-800">
                  {selectedDate}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Hora</span>
                <span className="font-medium text-slate-800">
                  {selectedSlot}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Paciente</span>
                <span className="font-medium text-slate-800">
                  {selectedPatient?.nombre} {selectedPatient?.apellido}
                </span>
              </div>
              {reason &&
            <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Motivo</span>
                  <span className="font-medium text-slate-800 text-right max-w-xs">
                    {reason}
                  </span>
                </div>
            }
            </div>
          </div>
        }

        {/* Navigation */}
        <div className="flex justify-between mt-6 pt-4 border-t border-slate-100">
          <button
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 1}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">

            Anterior
          </button>
          {step < 4 ?
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canProceed()}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed">

              Siguiente
            </button> :

          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">

              Confirmar Reserva
            </button>
          }
        </div>
      </div>
    </div>);

}