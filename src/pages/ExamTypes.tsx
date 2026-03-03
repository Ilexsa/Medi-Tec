import React, { useState } from 'react';
import {
  PlusIcon,
  SearchIcon,
  PencilIcon,
  TrashIcon,
  FlaskConicalIcon,
  XIcon } from
'lucide-react';
interface ExamType {
  id: number;
  codigo: string;
  nombre: string;
  categoria: 'Laboratorio' | 'Imagen' | 'Cardiología' | 'Otro';
  descripcion: string;
  estado: 'Activo' | 'Inactivo';
}
const initialExams: ExamType[] = [
{
  id: 1,
  codigo: 'LAB-001',
  nombre: 'Biometría Hemática Completa',
  categoria: 'Laboratorio',
  descripcion: 'Conteo completo de células sanguíneas',
  estado: 'Activo'
},
{
  id: 2,
  codigo: 'LAB-002',
  nombre: 'Glucosa en Ayunas',
  categoria: 'Laboratorio',
  descripcion: 'Nivel de glucosa en sangre',
  estado: 'Activo'
},
{
  id: 3,
  codigo: 'LAB-003',
  nombre: 'Perfil Lipídico',
  categoria: 'Laboratorio',
  descripcion: 'Colesterol total, HDL, LDL, triglicéridos',
  estado: 'Activo'
},
{
  id: 4,
  codigo: 'IMG-001',
  nombre: 'Radiografía de Tórax',
  categoria: 'Imagen',
  descripcion: 'Imagen radiológica del tórax AP y lateral',
  estado: 'Activo'
},
{
  id: 5,
  codigo: 'IMG-002',
  nombre: 'Ecografía Abdominal',
  categoria: 'Imagen',
  descripcion: 'Ultrasonido de órganos abdominales',
  estado: 'Activo'
},
{
  id: 6,
  codigo: 'CAR-001',
  nombre: 'Electrocardiograma',
  categoria: 'Cardiología',
  descripcion: 'Registro eléctrico del corazón',
  estado: 'Activo'
},
{
  id: 7,
  codigo: 'CAR-002',
  nombre: 'Ecocardiograma',
  categoria: 'Cardiología',
  descripcion: 'Ultrasonido cardíaco',
  estado: 'Activo'
}];

const catColors: Record<string, string> = {
  Laboratorio: 'bg-purple-100 text-purple-700',
  Imagen: 'bg-blue-100 text-blue-700',
  Cardiología: 'bg-red-100 text-red-700',
  Otro: 'bg-slate-100 text-slate-600'
};
const empty: Omit<ExamType, 'id'> = {
  codigo: '',
  nombre: '',
  categoria: 'Laboratorio',
  descripcion: '',
  estado: 'Activo'
};
export function ExamTypes() {
  const [exams, setExams] = useState<ExamType[]>(initialExams);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ExamType | null>(null);
  const [form, setForm] = useState<Omit<ExamType, 'id'>>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof ExamType, string>>>(
    {}
  );
  const filtered = exams.filter(
    (e) =>
    e.nombre.toLowerCase().includes(search.toLowerCase()) ||
    e.codigo.toLowerCase().includes(search.toLowerCase()) ||
    e.categoria.toLowerCase().includes(search.toLowerCase())
  );
  const openModal = (exam?: ExamType) => {
    if (exam) {
      setEditing(exam);
      setForm({
        codigo: exam.codigo,
        nombre: exam.nombre,
        categoria: exam.categoria,
        descripcion: exam.descripcion,
        estado: exam.estado
      });
    } else {
      setEditing(null);
      setForm(empty);
    }
    setErrors({});
    setModalOpen(true);
  };
  const validate = () => {
    const e: Partial<Record<keyof ExamType, string>> = {};
    if (!form.codigo.trim()) e.codigo = 'Requerido';
    if (!form.nombre.trim()) e.nombre = 'Requerido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const handleSave = () => {
    if (!validate()) return;
    if (editing) {
      setExams((prev) =>
      prev.map((e) =>
      e.id === editing.id ?
      {
        ...form,
        id: editing.id
      } :
      e
      )
      );
    } else {
      setExams((prev) => [
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
    if (confirm('¿Eliminar este tipo de examen?'))
    setExams((prev) => prev.filter((e) => e.id !== id));
  };
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <FlaskConicalIcon size={22} className="text-blue-600" />
            Tipos de Exámenes
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Catálogo de exámenes y estudios disponibles
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-medium transition-colors">

          <PlusIcon size={16} /> Nuevo Examen
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
              placeholder="Buscar examen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                  Código
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                  Nombre
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                  Categoría
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                  Descripción
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                  Estado
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((exam) =>
              <tr
                key={exam.id}
                className="hover:bg-slate-50/50 transition-colors">

                  <td className="px-4 py-3 text-xs font-mono text-slate-500">
                    {exam.codigo}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">
                    {exam.nombre}
                  </td>
                  <td className="px-4 py-3">
                    <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${catColors[exam.categoria]}`}>

                      {exam.categoria}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500 max-w-xs truncate">
                    {exam.descripcion}
                  </td>
                  <td className="px-4 py-3">
                    <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${exam.estado === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>

                      {exam.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                      onClick={() => openModal(exam)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">

                        <PencilIcon size={15} />
                      </button>
                      <button
                      onClick={() => handleDelete(exam.id)}
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
                {editing ? 'Editar Examen' : 'Nuevo Tipo de Examen'}
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
                    categoria: e.target.value as ExamType['categoria']
                  })
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

                    <option>Laboratorio</option>
                    <option>Imagen</option>
                    <option>Cardiología</option>
                    <option>Otro</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Nombre del Examen *
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
              <div className="flex gap-3 pt-2">
                <button
                onClick={() => setModalOpen(false)}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">

                  Cancelar
                </button>
                <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-medium transition-colors">

                  {editing ? 'Guardar Cambios' : 'Crear Examen'}
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>);

}