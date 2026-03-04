import React, { useEffect, useState } from 'react';
import { XIcon } from 'lucide-react';
import { DoctorApi, DoctorCreateApi, DoctorUpdateApi } from '../services/doctors';
import { SpecialtyApi } from '../services/specialties';

interface DoctorModalProps {
  doctor: DoctorApi | null;
  specialties: SpecialtyApi[];
  onClose: () => void;
  onSave: (payload: DoctorCreateApi | DoctorUpdateApi, isEdit: boolean) => Promise<void>;
}

export function DoctorModal({ doctor, specialties, onClose, onSave }: DoctorModalProps) {
  const [form, setForm] = useState<any>({
    nombres: '',
    apellidos: '',
    identificacion: '',
    email: '',
    telefono: '',
    especialidad_id: '',
    numero_licencia: '',
    titulo_profesional: '',
    acepta_nuevos_pacientes: true,
    activo: true,
    crear_usuario: false,
    usuario_id: '',
    usuario_email: '',
    usuario_password: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (doctor) {
      setForm({
        nombres: doctor.nombres || '',
        apellidos: doctor.apellidos || '',
        identificacion: doctor.identificacion || '',
        email: doctor.email || '',
        telefono: doctor.telefono || '',
        especialidad_id: doctor.especialidad_id || '',
        numero_licencia: doctor.numero_licencia || '',
        titulo_profesional: doctor.titulo_profesional || '',
        acepta_nuevos_pacientes: doctor.acepta_nuevos_pacientes ?? true,
        activo: doctor.activo ?? true,
        crear_usuario: false, 
        usuario_id: doctor.usuario_id || ''
      });
    }
  }, [doctor]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.nombres.trim()) newErrors.nombres = 'Requerido';
    if (!form.apellidos.trim()) newErrors.apellidos = 'Requerido';
    if (!form.identificacion.trim()) newErrors.identificacion = 'Requerido';
    if (!form.especialidad_id) newErrors.especialidad_id = 'Requerido';
    
    if (form.crear_usuario && !doctor) {
      if (!form.usuario_email) newErrors.usuario_email = 'Email requerido para usuario';
      if (!form.usuario_password) newErrors.usuario_password = 'Password requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    
    const payload: any = {
      nombres: form.nombres,
      apellidos: form.apellidos,
      identificacion: form.identificacion,
      email: form.email || null,
      telefono: form.telefono || null,
      especialidad_id: Number(form.especialidad_id),
      numero_licencia: form.numero_licencia || null,
      titulo_profesional: form.titulo_profesional || null,
      acepta_nuevos_pacientes: form.acepta_nuevos_pacientes,
      activo: form.activo,
      usuario_id: form.usuario_id ? Number(form.usuario_id) : null
    };

    if (!doctor) { 
      payload.crear_usuario = form.crear_usuario;
      if (form.crear_usuario) {
        payload.usuario_email = form.usuario_email;
        payload.usuario_password = form.usuario_password;
      }
    }

    try {
      await onSave(payload, !!doctor);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inp = (key: string, label: string, type = 'text') => (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
      <input
        type={type}
        value={form[key] || ''}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[key] ? 'border-red-400' : 'border-slate-200'}`} 
      />
      {errors[key] && <p className="text-red-500 text-xs mt-0.5">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">
            {doctor ? 'Editar Médico' : 'Nuevo Médico'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <XIcon size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {inp('nombres', 'Nombres *')}
            {inp('apellidos', 'Apellidos *')}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {inp('identificacion', 'Identificación *')}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Especialidad *</label>
              <select
                value={form.especialidad_id}
                onChange={(e) => setForm({ ...form, especialidad_id: e.target.value })}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.especialidad_id ? 'border-red-400' : 'border-slate-200'}`}
              >
                <option value="">Seleccionar...</option>
                {specialties.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.icono ? `${s.icono} ` : ''}{s.nombre} {s.codigo ? `(${s.codigo})` : ''}
                  </option>
                ))}
              </select>
              {errors.especialidad_id && <p className="text-red-500 text-xs mt-0.5">{errors.especialidad_id}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {inp('telefono', 'Teléfono')}
            {inp('email', 'Email', 'email')}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {inp('numero_licencia', 'Núm. Licencia')}
            {inp('titulo_profesional', 'Título Profesional')}
          </div>

          <div className="grid grid-cols-2 gap-4">
             {inp('usuario_id', 'ID de Usuario existente (opcional)', 'number')}
             
             {!doctor && (
                <div className="flex flex-col justify-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                    <input 
                      type="checkbox" 
                      checked={form.crear_usuario} 
                      onChange={(e) => setForm({...form, crear_usuario: e.target.checked})}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    Crear cuenta de usuario nueva
                  </label>
                </div>
             )}
          </div>

          {!doctor && form.crear_usuario && (
             <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 grid grid-cols-2 gap-4">
                {inp('usuario_email', 'Email del nuevo usuario', 'email')}
                {inp('usuario_password', 'Contraseña', 'password')}
             </div>
          )}

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600">
              <input 
                type="checkbox" 
                checked={form.activo} 
                onChange={(e) => setForm({...form, activo: e.target.checked})}
                className="rounded border-slate-300"
              />
              Activo en el sistema
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600">
              <input 
                type="checkbox" 
                checked={form.acepta_nuevos_pacientes} 
                onChange={(e) => setForm({...form, acepta_nuevos_pacientes: e.target.checked})}
                className="rounded border-slate-300"
              />
              Acepta nuevos pacientes
            </label>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {isSubmitting ? 'Guardando...' : (doctor ? 'Guardar Cambios' : 'Crear Médico')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}