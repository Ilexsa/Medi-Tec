import React, { useEffect, useState } from 'react';
import { XIcon } from 'lucide-react';
export interface Doctor {
  id: number;
  nombre: string;
  apellido: string;
  cedula: string;
  especialidad: string;
  telefono: string;
  email: string;
  horario: string;
}
interface DoctorModalProps {
  doctor: Doctor | null;
  specialties: string[];
  onClose: () => void;
  onSave: (doctor: Doctor) => void;
}
const emptyDoctor: Omit<Doctor, 'id'> = {
  nombre: '',
  apellido: '',
  cedula: '',
  especialidad: '',
  telefono: '',
  email: '',
  horario: ''
};
export function DoctorModal({
  doctor,
  specialties,
  onClose,
  onSave
}: DoctorModalProps) {
  const [form, setForm] = useState<Omit<Doctor, 'id'>>(emptyDoctor);
  const [errors, setErrors] = useState<Partial<Record<keyof Doctor, string>>>(
    {}
  );
  useEffect(() => {
    if (doctor) {
      const { id, ...rest } = doctor;
      setForm(rest);
    } else {
      setForm(emptyDoctor);
    }
    setErrors({});
  }, [doctor]);
  const validate = () => {
    const newErrors: Partial<Record<keyof Doctor, string>> = {};
    if (!form.nombre.trim()) newErrors.nombre = 'Requerido';
    if (!form.apellido.trim()) newErrors.apellido = 'Requerido';
    if (!form.cedula.trim()) newErrors.cedula = 'Requerido';
    if (!form.especialidad) newErrors.especialidad = 'Requerido';
    if (!form.telefono.trim()) newErrors.telefono = 'Requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      id: doctor?.id ?? Date.now(),
      ...form
    });
  };
  const inp = (key: keyof typeof form, label: string, type = 'text') =>
  <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">
        {label}
      </label>
      <input
      type={type}
      value={form[key]}
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
            {doctor ? 'Editar Médico' : 'Nuevo Médico'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors">

            <XIcon size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {inp('nombre', 'Nombre *')}
            {inp('apellido', 'Apellido *')}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {inp('cedula', 'Cédula *')}
            {inp('telefono', 'Teléfono *')}
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Especialidad *
            </label>
            <select
              value={form.especialidad}
              onChange={(e) =>
              setForm({
                ...form,
                especialidad: e.target.value
              })
              }
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.especialidad ? 'border-red-400' : 'border-slate-200'}`}>

              <option value="">Seleccionar especialidad...</option>
              {specialties.map((s) =>
              <option key={s} value={s}>
                  {s}
                </option>
              )}
            </select>
            {errors.especialidad &&
            <p className="text-red-500 text-xs mt-0.5">
                {errors.especialidad}
              </p>
            }
          </div>
          {inp('email', 'Email', 'email')}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Horario / Descripción
            </label>
            <input
              type="text"
              value={form.horario}
              onChange={(e) =>
              setForm({
                ...form,
                horario: e.target.value
              })
              }
              placeholder="Ej: Lunes a Viernes 08:00-17:00"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

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

              {doctor ? 'Guardar Cambios' : 'Crear Médico'}
            </button>
          </div>
        </form>
      </div>
    </div>);

}