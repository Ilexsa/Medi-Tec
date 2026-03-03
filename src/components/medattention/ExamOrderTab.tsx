import React, { useState } from 'react';
import { PlusIcon, TrashIcon, PrinterIcon, SearchIcon } from 'lucide-react';
interface ExamOrder {
  id: number;
  nombre: string;
  codigo: string;
  observaciones: string;
}
const EXAM_CATALOG = [
{
  codigo: 'LAB-001',
  nombre: 'Biometría Hemática Completa'
},
{
  codigo: 'LAB-002',
  nombre: 'Glucosa en Ayunas'
},
{
  codigo: 'LAB-003',
  nombre: 'Perfil Lipídico'
},
{
  codigo: 'LAB-004',
  nombre: 'Función Renal (BUN/Creatinina)'
},
{
  codigo: 'LAB-005',
  nombre: 'Función Hepática (TGO/TGP)'
},
{
  codigo: 'IMG-001',
  nombre: 'Radiografía de Tórax'
},
{
  codigo: 'IMG-002',
  nombre: 'Ecografía Abdominal'
},
{
  codigo: 'IMG-003',
  nombre: 'Tomografía de Cráneo'
},
{
  codigo: 'CAR-001',
  nombre: 'Electrocardiograma'
},
{
  codigo: 'CAR-002',
  nombre: 'Ecocardiograma'
}];

export function ExamOrderTab() {
  const [orders, setOrders] = useState<ExamOrder[]>([]);
  const [search, setSearch] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    (typeof EXAM_CATALOG)[0] | null>(
    null);
  const filtered = EXAM_CATALOG.filter(
    (e) =>
    e.nombre.toLowerCase().includes(search.toLowerCase()) ||
    e.codigo.toLowerCase().includes(search.toLowerCase())
  );
  const addOrder = () => {
    if (!selectedItem) return;
    if (orders.find((o) => o.codigo === selectedItem.codigo)) return;
    setOrders((prev) => [
    ...prev,
    {
      id: Date.now(),
      nombre: selectedItem.nombre,
      codigo: selectedItem.codigo,
      observaciones
    }]
    );
    setSelectedItem(null);
    setSearch('');
    setObservaciones('');
  };
  const removeOrder = (id: number) =>
  setOrders((prev) => prev.filter((o) => o.id !== id));
  return (
    <div className="max-w-3xl space-y-5">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">
          Agregar Examen
        </h2>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Tipo de Examen
            </label>
            <div className="relative">
              <SearchIcon
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Buscar examen..."
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

              {showDropdown && search &&
              <div className="absolute top-full left-0 right-0 z-10 bg-white border border-slate-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
                  {filtered.map((e) =>
                <button
                  key={e.codigo}
                  onClick={() => {
                    setSelectedItem(e);
                    setSearch(e.nombre);
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-blue-50 transition-colors border-b border-slate-50 last:border-0">

                      <span className="text-xs font-mono text-blue-600 mr-2">
                        {e.codigo}
                      </span>
                      <span className="text-sm text-slate-700">{e.nombre}</span>
                    </button>
                )}
                </div>
              }
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Observaciones
            </label>
            <input
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Indicaciones especiales para el examen..."
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

          </div>
          <button
            onClick={addOrder}
            disabled={!selectedItem}
            className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-40">

            <PlusIcon size={15} /> Agregar a Orden
          </button>
        </div>
      </div>

      {orders.length > 0 &&
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-700">
              Orden de Exámenes ({orders.length})
            </h2>
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50 transition-colors">
              <PrinterIcon size={13} /> Imprimir Orden
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {orders.map((order, i) =>
          <div key={order.id} className="px-5 py-4 flex items-start gap-4">
                <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-purple-600">
                      {order.codigo}
                    </span>
                    <p className="text-sm font-semibold text-slate-800">
                      {order.nombre}
                    </p>
                  </div>
                  {order.observaciones &&
              <p className="text-xs text-slate-400 mt-0.5 italic">
                      {order.observaciones}
                    </p>
              }
                </div>
                <button
              onClick={() => removeOrder(order.id)}
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