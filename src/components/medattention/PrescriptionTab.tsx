import React, { useState } from 'react';
import { PlusIcon, TrashIcon, PrinterIcon, SearchIcon } from 'lucide-react';
interface PrescriptionItem {
  id: number;
  medicamento: string;
  dosis: string;
  frecuencia: string;
  duracion: string;
  via: string;
  indicaciones: string;
}
const MEDICATIONS = [
'Amoxicilina 500mg',
'Ibuprofeno 400mg',
'Paracetamol 500mg',
'Omeprazol 20mg',
'Metformina 850mg',
'Losartán 50mg',
'Atorvastatina 20mg',
'Azitromicina 500mg',
'Diclofenaco 50mg',
'Ranitidina 150mg',
'Ciprofloxacino 500mg',
'Prednisona 5mg'];

const VIAS = [
'Oral',
'Intramuscular',
'Intravenosa',
'Tópica',
'Sublingual',
'Inhalatoria'];

const empty = {
  medicamento: '',
  dosis: '',
  frecuencia: '',
  duracion: '',
  via: 'Oral',
  indicaciones: ''
};
export function PrescriptionTab() {
  const [items, setItems] = useState<PrescriptionItem[]>([]);
  const [form, setForm] = useState(empty);
  const [medSearch, setMedSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const filteredMeds = MEDICATIONS.filter((m) =>
  m.toLowerCase().includes(medSearch.toLowerCase())
  );
  const addItem = () => {
    if (!form.medicamento || !form.dosis) return;
    setItems((prev) => [
    ...prev,
    {
      ...form,
      id: Date.now()
    }]
    );
    setForm(empty);
    setMedSearch('');
  };
  const removeItem = (id: number) =>
  setItems((prev) => prev.filter((i) => i.id !== id));
  return (
    <div className="max-w-3xl space-y-5">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">
          Agregar Medicamento
        </h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Medicamento *
            </label>
            <div className="relative">
              <SearchIcon
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={medSearch || form.medicamento}
                onChange={(e) => {
                  setMedSearch(e.target.value);
                  setForm({
                    ...form,
                    medicamento: ''
                  });
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Buscar medicamento..."
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

              {showDropdown && medSearch &&
              <div className="absolute top-full left-0 right-0 z-10 bg-white border border-slate-200 rounded-lg shadow-lg mt-1 max-h-40 overflow-y-auto">
                  {filteredMeds.map((m) =>
                <button
                  key={m}
                  onClick={() => {
                    setForm({
                      ...form,
                      medicamento: m
                    });
                    setMedSearch('');
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition-colors">

                      {m}
                    </button>
                )}
                </div>
              }
            </div>
            {form.medicamento &&
            <p className="text-xs text-blue-600 mt-1">✓ {form.medicamento}</p>
            }
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Dosis *
            </label>
            <input
              value={form.dosis}
              onChange={(e) =>
              setForm({
                ...form,
                dosis: e.target.value
              })
              }
              placeholder="Ej: 1 tableta"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Frecuencia
            </label>
            <input
              value={form.frecuencia}
              onChange={(e) =>
              setForm({
                ...form,
                frecuencia: e.target.value
              })
              }
              placeholder="Ej: Cada 8 horas"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Duración
            </label>
            <input
              value={form.duracion}
              onChange={(e) =>
              setForm({
                ...form,
                duracion: e.target.value
              })
              }
              placeholder="Ej: 7 días"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Vía de Administración
            </label>
            <select
              value={form.via}
              onChange={(e) =>
              setForm({
                ...form,
                via: e.target.value
              })
              }
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

              {VIAS.map((v) =>
              <option key={v}>{v}</option>
              )}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Indicaciones especiales
            </label>
            <input
              value={form.indicaciones}
              onChange={(e) =>
              setForm({
                ...form,
                indicaciones: e.target.value
              })
              }
              placeholder="Ej: Tomar con alimentos"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

          </div>
        </div>
        <button
          onClick={addItem}
          disabled={!form.medicamento || !form.dosis}
          className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-40">

          <PlusIcon size={15} /> Agregar a Receta
        </button>
      </div>

      {items.length > 0 &&
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-700">
              Receta Médica ({items.length} medicamentos)
            </h2>
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50 transition-colors">
              <PrinterIcon size={13} /> Imprimir Receta
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {items.map((item, i) =>
          <div key={item.id} className="px-5 py-4 flex items-start gap-4">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">
                    {item.medicamento}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
                    <span className="text-xs text-slate-500">
                      Dosis: <strong>{item.dosis}</strong>
                    </span>
                    {item.frecuencia &&
                <span className="text-xs text-slate-500">
                        Frecuencia: <strong>{item.frecuencia}</strong>
                      </span>
                }
                    {item.duracion &&
                <span className="text-xs text-slate-500">
                        Duración: <strong>{item.duracion}</strong>
                      </span>
                }
                    <span className="text-xs text-slate-500">
                      Vía: <strong>{item.via}</strong>
                    </span>
                  </div>
                  {item.indicaciones &&
              <p className="text-xs text-slate-400 mt-0.5 italic">
                      {item.indicaciones}
                    </p>
              }
                </div>
                <button
              onClick={() => removeItem(item.id)}
              className="text-slate-300 hover:text-red-500 transition-colors">

                  <TrashIcon size={14} />
                </button>
              </div>
          )}
          </div>
        </div>
      }
    </div>);

}