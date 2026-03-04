import React, { useEffect, useState } from 'react';
import { XIcon } from 'lucide-react';
export interface Patient {
  id: number;
  tipoIdentificacion: string;
  nombre: string;
  apellido: string;
  cedula: string;
  fechaNacimiento: string;
  genero: string;
  telefono: string;
  celular: string;
  email: string;
  direccion: string;
  ciudad: string;
  tipoSangre: string;
  alergias: string;
  condicionesCronicas: string;
  contactoEmergenciaNombre: string;
  contactoEmergenciaTelefono: string;
  contactoEmergenciaRelacion: string;
  aseguradora: string;
  numeroSeguro: string;
  urlFotoPerfil: string;
  notas: string;
  estado?: string;
  edad?: number;
}
interface PatientModalProps {
  patient: Patient | null;
  onClose: () => void;
  onSave: (patient: Patient) => void | Promise<void>;
}

const emptyPatient: Omit<Patient, 'id'> = {
  tipoIdentificacion: 'cedula',
  nombre: '',
  apellido: '',
  cedula: '',
  fechaNacimiento: '',
  genero: '',
  telefono: '',
  celular: '',
  email: '',
  direccion: '',
  ciudad: '',
  tipoSangre: '',
  alergias: '',
  condicionesCronicas: '',
  contactoEmergenciaNombre: '',
  contactoEmergenciaTelefono: '',
  contactoEmergenciaRelacion: '',
  aseguradora: '',
  numeroSeguro: '',
  urlFotoPerfil: '',
  notas: '',
  estado: 'Activo'
};
export function PatientModal({ patient, onClose, onSave }: PatientModalProps) {
  const [form, setForm] = useState<Omit<Patient, 'id'>>(emptyPatient);
  const [errors, setErrors] = useState<Partial<Record<keyof Patient, string>>>(
    {}
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
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
    setSaveError('');
    setIsSaving(false);
  }, [patient]);
  const validate = () => {
    const newErrors: Partial<Record<keyof Patient, string>> = {};
    if (!form.tipoIdentificacion) newErrors.tipoIdentificacion = 'Requerido';
    if (!form.nombre.trim()) newErrors.nombre = 'Requerido';
    if (!form.apellido.trim()) newErrors.apellido = 'Requerido';
    if (!form.cedula.trim()) newErrors.cedula = 'Requerido';
    if (!form.fechaNacimiento) newErrors.fechaNacimiento = 'Requerido';
    if (!form.genero) newErrors.genero = 'Requerido';
    if (!form.telefono.trim()) newErrors.telefono = 'Requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    setSaveError('');
    try {
      await onSave({
        id: patient?.id ?? Date.now(),
        ...form
      });
      onClose();
    } catch (err: any) {
      setSaveError(err?.message || 'No se pudo guardar el paciente');
    } finally {
      setIsSaving(false);
    }
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
          {saveError && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
              {saveError}
            </div>
          )}
          {/* Nombre / Apellido */}
          <div className="grid grid-cols-2 gap-4">
            {inp('nombre', 'Nombre *', 'text', true)}
            {inp('apellido', 'Apellido *', 'text', true)}
          </div>

          {/* Tipo identificación / Identificación */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Tipo de identificación *
              </label>
              <select
                value={form.tipoIdentificacion}
                onChange={(e) =>
                  setForm({
                    ...form,
                    tipoIdentificacion: e.target.value
                  })
                }
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.tipoIdentificacion ? 'border-red-400' : 'border-slate-200'
                  }`}
              >
                <option value="cedula">Cédula</option>
                <option value="pasaporte">Pasaporte</option>
                <option value="ruc">RUC</option>
                <option value="otro">Otro</option>
              </select>
              {errors.tipoIdentificacion && (
                <p className="text-red-500 text-xs mt-0.5">
                  {errors.tipoIdentificacion}
                </p>
              )}
            </div>
            {inp('cedula', 'Identificación *', 'text', true)}
          </div>

          {/* Fecha nacimiento / Género */}
          <div className="grid grid-cols-2 gap-4">
            {inp('fechaNacimiento', 'Fecha de Nacimiento *', 'date', true)}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Género *
              </label>
              <select
                name="genero"
                value={form.genero ?? 'other'}
                onChange={(e) => setForm((p) => ({ ...p, genero: e.target.value as any }))}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.genero ? 'border-red-400' : 'border-slate-200'
                  }`}
              >
                <option value="">Seleccionar...</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
              {errors.genero && (
                <p className="text-red-500 text-xs mt-0.5">{errors.genero}</p>
              )}
            </div>
          </div>

          {/* Teléfono / Celular */}
          <div className="grid grid-cols-2 gap-4">
            {inp('telefono', 'Teléfono *', 'tel', true)}
            {inp('celular', 'Celular', 'tel')}
          </div>

          {/* Especialidad 
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
          </div>*/}

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
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>

          {/* Email */}
          {inp('email', 'Email', 'email')}

          {/* Dirección */}
          {inp('direccion', 'Dirección')}

          {/* Ciudad / Tipo sangre */}
          <div className="grid grid-cols-2 gap-4">
            {inp('ciudad', 'Ciudad')}
                       <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Tipo de sangre *
              </label>
              <select
                value={form.tipoSangre}
                onChange={(e) =>
                  setForm({
                    ...form,
                    tipoSangre: e.target.value
                  })
                }
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.tipoSangre ? 'border-red-400' : 'border-slate-200'
                  }`}
              >
                <option value="">Seleccionar...</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="DESCONOCIDO">Desconocido</option>
              </select>
              {errors.tipoSangre && (
                <p className="text-red-500 text-xs mt-0.5">
                  {errors.tipoSangre}
                </p>
              )}
            </div>
          </div>

          {/* Alergias / Condiciones crónicas */}
          <div className="grid grid-cols-2 gap-4">
            {inp('alergias', 'Alergias')}
            {inp('condicionesCronicas', 'Condiciones crónicas')}
          </div>

          {/* Contacto emergencia */}
          <div className="pt-2">
            <p className="text-xs font-semibold text-slate-500 mb-2">
              Contacto de emergencia (opcional)
            </p>
            <div className="grid grid-cols-2 gap-4">
              {inp('contactoEmergenciaNombre', 'Nombre')}
              {inp('contactoEmergenciaTelefono', 'Teléfono', 'tel')}
            </div>
            <div className="mt-4">{inp('contactoEmergenciaRelacion', 'Relación')}</div>
          </div>

          {/* Seguro */}
          <div className="grid grid-cols-2 gap-4">
            {inp('aseguradora', 'Aseguradora')}
            {inp('numeroSeguro', 'Número de seguro / póliza')}
          </div>

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
              disabled={isSaving}
              className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">

              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-medium transition-colors">

              {isSaving ? 'Guardando...' : patient ? 'Guardar Cambios' : 'Crear Paciente'}
            </button>
          </div>
        </form>
      </div >
    </div >);

}