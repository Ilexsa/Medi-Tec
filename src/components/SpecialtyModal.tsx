import React, { useEffect, useState } from 'react';

import { XIcon } from 'lucide-react';
type SpecialtyFormData = {
  name: string;
  description: string;
  color: string;
  icon: string;
};
type SpecialtyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: SpecialtyFormData) => void | Promise<void>;
  initialData?: Partial<SpecialtyFormData>;
  mode?: 'create' | 'edit';
};
const COLOR_OPTIONS = [
  {
    label: 'Índigo',
    value: 'indigo',
    bg: 'bg-indigo-500'
  },
  {
    label: 'Azul',
    value: 'blue',
    bg: 'bg-blue-500'
  },
  {
    label: 'Verde',
    value: 'green',
    bg: 'bg-green-500'
  },
  {
    label: 'Rojo',
    value: 'red',
    bg: 'bg-red-500'
  },
  {
    label: 'Naranja',
    value: 'orange',
    bg: 'bg-orange-500'
  },
  {
    label: 'Morado',
    value: 'purple',
    bg: 'bg-purple-500'
  },
  {
    label: 'Rosa',
    value: 'pink',
    bg: 'bg-pink-500'
  },
  {
    label: 'Cian',
    value: 'cyan',
    bg: 'bg-cyan-500'
  }];

const ICON_OPTIONS = [
  {
    label: 'Corazón',
    value: '❤️'
  },
  {
    label: 'Cerebro',
    value: '🧠'
  },
  {
    label: 'Hueso',
    value: '🦴'
  },
  {
    label: 'Ojo',
    value: '👁️'
  },
  {
    label: 'Diente',
    value: '🦷'
  },
  {
    label: 'Bebé',
    value: '👶'
  },
  {
    label: 'Piel',
    value: '🩺'
  },
  {
    label: 'Pulmón',
    value: '🫁'
  }];

const DEFAULT_FORM: SpecialtyFormData = {
  name: '',
  description: '',
  color: 'indigo',
  icon: '🩺'
};
export function SpecialtyModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode = 'create'
}: SpecialtyModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [form, setForm] = useState<SpecialtyFormData>(DEFAULT_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof SpecialtyFormData, string>>>(
      {});
  useEffect(() => {
    if (isOpen) {
      setSaveError('');
      setIsSaving(false);
      setForm(
        initialData ?
          {
            ...DEFAULT_FORM,
            ...initialData
          } :
          DEFAULT_FORM
      );
      setErrors({});
    }
  }, [isOpen, initialData]);
  if (!isOpen) return null;
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof SpecialtyFormData, string>> = {};
    if (!form.name.trim()) newErrors.name = 'El nombre es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSaving(true);
    setSaveError('');
    try {
      await onSave(form);
      onClose();
    } catch (e: any) {
      setSaveError(e?.message || 'No se pudo guardar la especialidad');
    } finally {
      setIsSaving(false);
    }
  };
  const handleChange = (field: keyof SpecialtyFormData, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
    if (errors[field])
      setErrors((prev) => ({
        ...prev,
        [field]: undefined
      }));
  };
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="specialty-modal-title">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2
            id="specialty-modal-title"
            className="font-bold text-xl text-gray-900">

            {mode === 'edit' ? 'Editar Especialidad' : 'Nueva Especialidad'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors rounded-lg p-1 hover:bg-gray-100"
            aria-label="Cerrar modal">

            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
                {saveError && (
        <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
          {saveError}
        </div>
      )}
          {/* Name */}
          <div>
            <label
              htmlFor="specialty-name"
              className="block text-sm font-medium text-gray-700 mb-1">

              Nombre de la especialidad <span className="text-red-500">*</span>
            </label>
            <input
              id="specialty-name"
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Ej: Cardiología, Pediatría..."
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300'}`} />

            {errors.name &&
              <p className="mt-1 text-xs text-red-500">{errors.name}</p>
            }
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="specialty-description"
              className="block text-sm font-medium text-gray-700 mb-1">

              Descripción
            </label>
            <textarea
              id="specialty-description"
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Descripción breve de la especialidad..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-colors" />

          </div>

          {/* Icon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ícono
            </label>
            <div className="flex flex-wrap gap-2">
              {ICON_OPTIONS.map((opt) =>
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleChange('icon', opt.value)}
                  title={opt.label}
                  className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all border-2 ${form.icon === opt.value ? 'border-indigo-500 bg-indigo-50 scale-110' : 'border-gray-200 hover:border-gray-300 bg-gray-50'}`}>

                  {opt.value}
                </button>
              )}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color de identificación
            </label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((opt) =>
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleChange('color', opt.value)}
                  title={opt.label}
                  className={`w-8 h-8 rounded-full ${opt.bg} transition-all ${form.color === opt.value ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-105 opacity-80 hover:opacity-100'}`}
                  aria-label={opt.label} />

              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 justify-end px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">

            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${isSaving ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
          >
            {isSaving ? 'Guardando...' : mode === 'edit' ? 'Guardar cambios' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>);

}