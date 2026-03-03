import React, { useEffect, useState } from 'react';
import { XIcon } from 'lucide-react';
export interface Patient {
  id: number;
  nombre: string;
  apellido: string;
  cedula: string;
  fechaNacimiento: string;
  genero: string;
  telefono: string;
  email: string;
  direccion: string;
  notas: string;
  especialidad?: string;
  estado?: string;
}
interface PatientModalProps {
  patient: Patient | null;
  onClose: () => void;
  onSave: (patient: Patient) => void;
}
const SPECIALTIES = [
'Medicina General',
'Pediatría',
'Cardiología',
'Neurología',
'Ginecología',
'Traumatología',
'Dermatología',
'Oncología',
'Oftalmología',
'Odontología',
'Psiquiatría',
'Urología',
'Endocrinología',
'Gastroenterología',
'Neumología',
'Nefrología',
'Reumatología',
'Hematología',
'Infectología',
'Cirugía General'];

const emptyPatient: Omit<Patient, 'id'> = {
  nombre: '',
  apellido: '',
  cedula: '',
  fechaNacimiento: '',
  genero: '',
  telefono: '',
  email: '',
  direccion: '',
  notas: '',
  especialidad: '',
  estado: 'Activo'
};
export function PatientModal({ patient, onClose, onSave }: PatientModalProps) {
  const [form, setForm] = useState<Omit<Patient, 'id'>>(emptyPatient);
  const [errors, setErrors] = useState<Partial<Record<keyof Patient, string>>>(
    {}
  );
  useEffect(() => {
    if (patient) {
      const { id, ...rest } = patient;
      setForm({
        ...emptyPatient,
        ...rest
      });
    } else {
      setForm(emptyPatient);
    }
    setErrors({});
  }, [patient]);
  const validate = () => {
    const newErrors: Partial<Record<keyof Patient, string>> = {};
    if (!form.nombre.trim()) newErrors.nombre = 'Requerido';
    if (!form.apellido.trim()) newErrors.apellido = 'Requerido';
    if (!form.cedula.trim()) newErrors.cedula = 'Requerido';
    if (!form.fechaNacimiento) newErrors.fechaNacimiento = 'Requerido';
    if (!form.genero) newErrors.genero = 'Requerido';
    if (!form.telefono.trim()) newErrors.telefono = 'Requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      id: patient?.id ?? Date.now(),
      ...form
    });
    onClose();
  };
  const inp = (
  key: keyof typeof form,
  label: string,
  type = 'text',
  required = false) =>

  <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">
        {label}
      </label>
      <input
      type={type}
      value={form[key] as string}
      onChange={(e) =>
      setForm({
        ...form,
        [key]: e.target.value
      })
      }
      className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[key] ? 'border-red-400' : 'border-slate-200'}`} />

      {errors[key] &&
    <p className="text-red-500 text-xs mt-0.5">{errors[key]}</p>
    }
    </div>;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">
            {patient ? 'Editar Paciente' : 'Nuevo Paciente'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors">

            <XIcon size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Nombre / Apellido */}
          <div className="grid grid-cols-2 gap-4">
            {inp('nombre', 'Nombre *', 'text', true)}
            {inp('apellido', 'Apellido *', 'text', true)}
          </div>

          {/* Cédula / Fecha nacimiento */}
          <div className="grid grid-cols-2 gap-4">
            {inp('cedula', 'Cédula / DNI *', 'text', true)}
            {inp('fechaNacimiento', 'Fecha de Nacimiento *', 'date', true)}
          </div>

          {/* Género / Teléfono */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Género *
              </label>
              <select
                value={form.genero}
                onChange={(e) =>
                setForm({
                  ...form,
                  genero: e.target.value
                })
                }
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.genero ? 'border-red-400' : 'border-slate-200'}`}>

                <option value="">Seleccionar...</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
              {errors.genero &&
              <p className="text-red-500 text-xs mt-0.5">{errors.genero}</p>
              }
            </div>
            {inp('telefono', 'Teléfono *', 'tel', true)}
          </div>

          {/* Especialidad */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Especialidad
            </label>
            <select
              value={form.especialidad ?? ''}
              onChange={(e) =>
              setForm({
                ...form,
                especialidad: e.target.value
              })
              }
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

              <option value="">Sin especialidad asignada</option>
              {SPECIALTIES.map((s) =>
              <option key={s} value={s}>
                  {s}
                </option>
              )}
            </select>
          </div>

          {/* Estado */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Estado
            </label>
            <select
              value={form.estado ?? 'Activo'}
              onChange={(e) =>
              setForm({
                ...form,
                estado: e.target.value
              })
              }
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

              <option value="Activo">Activo</option>
              <option value="Internado">Internado</option>
              <option value="Alta">Alta</option>
              <option value="Urgente">Urgente</option>
            </select>
          </div>

          {/* Email */}
          {inp('email', 'Email', 'email')}

          {/* Dirección */}
          {inp('direccion', 'Dirección')}

          {/* Notas */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Notas
            </label>
            <textarea
              value={form.notas}
              onChange={(e) =>
              setForm({
                ...form,
                notas: e.target.value
              })
              }
              rows={2}
              placeholder="Observaciones adicionales..."
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />

          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">

              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-medium transition-colors">

              {patient ? 'Guardar Cambios' : 'Crear Paciente'}
            </button>
          </div>
        </form>
      </div>
    </div>);

}