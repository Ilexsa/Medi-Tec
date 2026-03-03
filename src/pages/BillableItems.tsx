import React, { useState } from 'react';
import {
  PlusIcon,
  SearchIcon,
  PencilIcon,
  TrashIcon,
  ReceiptIcon,
  XIcon } from
'lucide-react';
interface BillableItem {
  id: number;
  codigo: string;
  nombre: string;
  categoria: 'Consulta' | 'Examen' | 'Procedimiento' | 'Medicamento';
  precio: number;
  descripcion: string;
  estado: 'Activo' | 'Inactivo';
}
const initialItems: BillableItem[] = [
{
  id: 1,
  codigo: 'CONS-001',
  nombre: 'Consulta Medicina General',
  categoria: 'Consulta',
  precio: 25.0,
  descripcion: 'Consulta médica general',
  estado: 'Activo'
},
{
  id: 2,
  codigo: 'CONS-002',
  nombre: 'Consulta Especialista',
  categoria: 'Consulta',
  precio: 45.0,
  descripcion: 'Consulta con especialista',
  estado: 'Activo'
},
{
  id: 3,
  codigo: 'EXAM-001',
  nombre: 'Biometría Hemática',
  categoria: 'Examen',
  precio: 12.0,
  descripcion: 'Examen de sangre completo',
  estado: 'Activo'
},
{
  id: 4,
  codigo: 'EXAM-002',
  nombre: 'Radiografía de Tórax',
  categoria: 'Examen',
  precio: 30.0,
  descripcion: 'Imagen radiológica',
  estado: 'Activo'
},
{
  id: 5,
  codigo: 'PROC-001',
  nombre: 'Curación Simple',
  categoria: 'Procedimiento',
  precio: 15.0,
  descripcion: 'Curación de herida simple',
  estado: 'Activo'
},
{
  id: 6,
  codigo: 'MED-001',
  nombre: 'Amoxicilina 500mg',
  categoria: 'Medicamento',
  precio: 8.5,
  descripcion: 'Antibiótico',
  estado: 'Activo'
}];

const categoriaColors: Record<string, string> = {
  Consulta: 'bg-blue-100 text-blue-700',
  Examen: 'bg-purple-100 text-purple-700',
  Procedimiento: 'bg-orange-100 text-orange-700',
  Medicamento: 'bg-green-100 text-green-700'
};
const empty: Omit<BillableItem, 'id'> = {
  codigo: '',
  nombre: '',
  categoria: 'Consulta',
  precio: 0,
  descripcion: '',
  estado: 'Activo'
};
export function BillableItems() {
  const [items, setItems] = useState<BillableItem[]>(initialItems);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<BillableItem | null>(null);
  const [form, setForm] = useState<Omit<BillableItem, 'id'>>(empty);
  const [errors, setErrors] = useState<
    Partial<Record<keyof BillableItem, string>>>(
    {});
  const filtered = items.filter(
    (i) =>
    i.nombre.toLowerCase().includes(search.toLowerCase()) ||
    i.codigo.toLowerCase().includes(search.toLowerCase()) ||
    i.categoria.toLowerCase().includes(search.toLowerCase())
  );
  const openModal = (item?: BillableItem) => {
    if (item) {
      setEditing(item);
      setForm({
        codigo: item.codigo,
        nombre: item.nombre,
        categoria: item.categoria,
        precio: item.precio,
        descripcion: item.descripcion,
        estado: item.estado
      });
    } else {
      setEditing(null);
      setForm(empty);
    }
    setErrors({});
    setModalOpen(true);
  };
  const validate = () => {
    const e: Partial<Record<keyof BillableItem, string>> = {};
    if (!form.codigo.trim()) e.codigo = 'Requerido';
    if (!form.nombre.trim()) e.nombre = 'Requerido';
    if (form.precio <= 0) e.precio = 'Debe ser mayor a 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const handleSave = () => {
    if (!validate()) return;
    if (editing) {
      setItems((prev) =>
      prev.map((i) =>
      i.id === editing.id ?
      {
        ...form,
        id: editing.id
      } :
      i
      )
      );
    } else {
      setItems((prev) => [
      ...prev,
      {
        ...form,
        id: Date.now()
      }]
      );
    }
    setModalOpen(false);
  };
  const handleDelete = (id: number) => {
    if (confirm('¿Eliminar este ítem?'))
    setItems((prev) => prev.filter((i) => i.id !== id));
  };
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <ReceiptIcon size={22} className="text-blue-600" />
            Items Facturables
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Catálogo de servicios y productos con precios
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-medium transition-colors">

          <PlusIcon size={16} />
          Nuevo Ítem
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-sm">
            <SearchIcon
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Buscar por nombre, código, categoría..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Código
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Nombre
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Categoría
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Precio
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Estado
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((item) =>
              <tr
                key={item.id}
                className="hover:bg-slate-50/50 transition-colors">

                  <td className="px-4 py-3 text-xs font-mono text-slate-500">
                    {item.codigo}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-slate-800">
                      {item.nombre}
                    </p>
                    {item.descripcion &&
                  <p className="text-xs text-slate-400">
                        {item.descripcion}
                      </p>
                  }
                  </td>
                  <td className="px-4 py-3">
                    <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoriaColors[item.categoria]}`}>

                      {item.categoria}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-slate-800">
                    ${item.precio.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.estado === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>

                      {item.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                      onClick={() => openModal(item)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">

                        <PencilIcon size={15} />
                      </button>
                      <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">

                        <TrashIcon size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen &&
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-800">
                {editing ? 'Editar Ítem' : 'Nuevo Ítem Facturable'}
              </h2>
              <button
              onClick={() => setModalOpen(false)}
              className="text-slate-400 hover:text-slate-600">

                <XIcon size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Código *
                  </label>
                  <input
                  value={form.codigo}
                  onChange={(e) =>
                  setForm({
                    ...form,
                    codigo: e.target.value
                  })
                  }
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.codigo ? 'border-red-400' : 'border-slate-200'}`} />

                  {errors.codigo &&
                <p className="text-red-500 text-xs mt-0.5">
                      {errors.codigo}
                    </p>
                }
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Categoría
                  </label>
                  <select
                  value={form.categoria}
                  onChange={(e) =>
                  setForm({
                    ...form,
                    categoria: e.target.value as BillableItem['categoria']
                  })
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

                    <option>Consulta</option>
                    <option>Examen</option>
                    <option>Procedimiento</option>
                    <option>Medicamento</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Nombre del Servicio *
                </label>
                <input
                value={form.nombre}
                onChange={(e) =>
                setForm({
                  ...form,
                  nombre: e.target.value
                })
                }
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.nombre ? 'border-red-400' : 'border-slate-200'}`} />

                {errors.nombre &&
              <p className="text-red-500 text-xs mt-0.5">{errors.nombre}</p>
              }
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Precio *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                      $
                    </span>
                    <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.precio}
                    onChange={(e) =>
                    setForm({
                      ...form,
                      precio: parseFloat(e.target.value) || 0
                    })
                    }
                    className={`w-full border rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.precio ? 'border-red-400' : 'border-slate-200'}`} />

                  </div>
                  {errors.precio &&
                <p className="text-red-500 text-xs mt-0.5">
                      {errors.precio}
                    </p>
                }
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Estado
                  </label>
                  <select
                  value={form.estado}
                  onChange={(e) =>
                  setForm({
                    ...form,
                    estado: e.target.value as 'Activo' | 'Inactivo'
                  })
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

                    <option>Activo</option>
                    <option>Inactivo</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Descripción
                </label>
                <textarea
                value={form.descripcion}
                onChange={(e) =>
                setForm({
                  ...form,
                  descripcion: e.target.value
                })
                }
                rows={2}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />

              </div>
              <div className="flex gap-3 pt-2">
                <button
                onClick={() => setModalOpen(false)}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">

                  Cancelar
                </button>
                <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-medium transition-colors">

                  {editing ? 'Guardar Cambios' : 'Crear Ítem'}
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>);

}