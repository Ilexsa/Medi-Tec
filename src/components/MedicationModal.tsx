import React, { useEffect, useState } from 'react';
import { XIcon } from 'lucide-react';
type MedicationFormData = {
  name: string;
  genericName: string;
  category: string;
  presentation: string;
  unit: string;
  concentration: string;
  notes: string;
};
type MedicationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: MedicationFormData) => void;
  initialData?: Partial<MedicationFormData>;
  mode?: 'create' | 'edit';
};
const CATEGORIES = [
'Analgésico',
'Antibiótico',
'Antiinflamatorio',
'Antihipertensivo',
'Antidiabético',
'Antihistamínico',
'Broncodilatador',
'Cardiotónico',
'Diurético',
'Hormonal',
'Vitaminas y suplementos',
'Otro'];

const PRESENTATIONS = [
'Tableta',
'Cápsula',
'Jarabe',
'Suspensión',
'Inyectable',
'Crema / Ungüento',
'Gotas',
'Parche transdérmico',
'Supositorio',
'Inhalador',
'Solución oral',
'Otro'];

const UNITS = ['mg', 'g', 'mcg', 'mL', 'UI', '%', 'mEq'];
const DEFAULT_FORM: MedicationFormData = {
  name: '',
  genericName: '',
  category: '',
  presentation: '',
  unit: 'mg',
  concentration: '',
  notes: ''
};
export function MedicationModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode = 'create'
}: MedicationModalProps) {
  const [form, setForm] = useState<MedicationFormData>(DEFAULT_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof MedicationFormData, string>>>(
    {});
  useEffect(() => {
    if (isOpen) {
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
    const newErrors: Partial<Record<keyof MedicationFormData, string>> = {};
    if (!form.name.trim()) newErrors.name = 'El nombre comercial es requerido';
    if (!form.category) newErrors.category = 'Selecciona una categoría';
    if (!form.presentation)
    newErrors.presentation = 'Selecciona una presentación';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = () => {
    if (validate()) {
      onSave(form);
      onClose();
    }
  };
  const handleChange = (field: keyof MedicationFormData, value: string) => {
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
      aria-labelledby="medication-modal-title">

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
          <h2
            id="medication-modal-title"
            className="font-bold text-xl text-gray-900">

            {mode === 'edit' ? 'Editar Medicamento' : 'Nuevo Medicamento'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors rounded-lg p-1 hover:bg-gray-100"
            aria-label="Cerrar modal">

            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Commercial Name */}
          <div>
            <label
              htmlFor="med-name"
              className="block text-sm font-medium text-gray-700 mb-1">

              Nombre comercial <span className="text-red-500">*</span>
            </label>
            <input
              id="med-name"
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Ej: Paracetamol, Amoxicilina..."
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300'}`} />

            {errors.name &&
            <p className="mt-1 text-xs text-red-500">{errors.name}</p>
            }
          </div>

          {/* Generic Name */}
          <div>
            <label
              htmlFor="med-generic"
              className="block text-sm font-medium text-gray-700 mb-1">

              Nombre genérico
            </label>
            <input
              id="med-generic"
              type="text"
              value={form.genericName}
              onChange={(e) => handleChange('genericName', e.target.value)}
              placeholder="Principio activo..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors" />

          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="med-category"
              className="block text-sm font-medium text-gray-700 mb-1">

              Categoría <span className="text-red-500">*</span>
            </label>
            <select
              id="med-category"
              value={form.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors bg-white ${errors.category ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}>

              <option value="">Seleccionar categoría...</option>
              {CATEGORIES.map((cat) =>
              <option key={cat} value={cat}>
                  {cat}
                </option>
              )}
            </select>
            {errors.category &&
            <p className="mt-1 text-xs text-red-500">{errors.category}</p>
            }
          </div>

          {/* Presentation */}
          <div>
            <label
              htmlFor="med-presentation"
              className="block text-sm font-medium text-gray-700 mb-1">

              Presentación <span className="text-red-500">*</span>
            </label>
            <select
              id="med-presentation"
              value={form.presentation}
              onChange={(e) => handleChange('presentation', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors bg-white ${errors.presentation ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}>

              <option value="">Seleccionar presentación...</option>
              {PRESENTATIONS.map((pres) =>
              <option key={pres} value={pres}>
                  {pres}
                </option>
              )}
            </select>
            {errors.presentation &&
            <p className="mt-1 text-xs text-red-500">{errors.presentation}</p>
            }
          </div>

          {/* Concentration + Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="med-concentration"
                className="block text-sm font-medium text-gray-700 mb-1">

                Concentración
              </label>
              <input
                id="med-concentration"
                type="text"
                value={form.concentration}
                onChange={(e) => handleChange('concentration', e.target.value)}
                placeholder="Ej: 500, 250..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors" />

            </div>
            <div>
              <label
                htmlFor="med-unit"
                className="block text-sm font-medium text-gray-700 mb-1">

                Unidad
              </label>
              <select
                id="med-unit"
                value={form.unit}
                onChange={(e) => handleChange('unit', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors bg-white">

                {UNITS.map((u) =>
                <option key={u} value={u}>
                    {u}
                  </option>
                )}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label
              htmlFor="med-notes"
              className="block text-sm font-medium text-gray-700 mb-1">

              Notas adicionales
            </label>
            <textarea
              id="med-notes"
              value={form.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Indicaciones especiales, contraindicaciones..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-colors" />

          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 justify-end px-6 py-4 border-t border-gray-100 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">

            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">

            {mode === 'edit' ? 'Guardar cambios' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>);

}