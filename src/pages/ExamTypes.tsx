import React, { useState, useEffect, useMemo } from 'react';
import {
  PlusIcon,
  SearchIcon,
  PencilIcon,
  TrashIcon,
  FlaskConicalIcon,
  XIcon } from
'lucide-react';
import { CatalogoItem, listExams, createExam, updateExam, deleteExam } from '../services/catalogs';

const catColors: Record<string, string> = {
  Laboratorio: 'bg-purple-100 text-purple-700',
  Imagen: 'bg-blue-100 text-blue-700',
  Cardiología: 'bg-red-100 text-red-700',
  Otro: 'bg-slate-100 text-slate-600'
};

const empty: Partial<CatalogoItem> = {
  codigo: '',
  nombre: '',
  tipo: 'Laboratorio',
  descripcion: '',
  activo: true
};

export function ExamTypes() {
  const [exams, setExams] = useState<CatalogoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');
  
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CatalogoItem | null>(null);
  const [form, setForm] = useState<Partial<CatalogoItem>>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof CatalogoItem, string>>>({});

  const fetchExams = async () => {
    setLoading(true);
    setErrorText('');
    try {
      const res = await listExams();
      setExams((res as any).data ?? res ?? []);
    } catch(e: any) {
      setErrorText(e?.message || 'Error al obtener exámenes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchExams();
  }, []);
  const filtered = useMemo(() => {
    return exams.filter(
      (e) =>
      e.nombre.toLowerCase().includes(search.toLowerCase()) ||
      (e.codigo || '').toLowerCase().includes(search.toLowerCase()) ||
      (e.tipo || '').toLowerCase().includes(search.toLowerCase())
    );
  }, [exams, search]);

  const openModal = (exam?: CatalogoItem) => {
    if (exam) {
      setEditing(exam);
      setForm({ ...exam });
    } else {
      setEditing(null);
      setForm(empty);
    }
    setErrors({});
    setModalOpen(true);
  };
  const validate = () => {
    const e: Partial<Record<keyof CatalogoItem, string>> = {};
    if (!form.codigo?.trim()) e.codigo = 'Requerido';
    if (!form.nombre?.trim()) e.nombre = 'Requerido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const handleSave = async () => {
    if (!validate()) return;
    try {
      if (editing) {
          await updateExam(editing.id, form);
      } else {
          await createExam(form);
      }
      await fetchExams();
      setModalOpen(false);
    } catch(e: any) {
        alert(e?.message || 'Error al guardar');
    }
  };
  const handleDelete = async (id: number) => {
    if (confirm('¿Eliminar este tipo de examen?')) {
        try {
            await deleteExam(id);
            await fetchExams();
        } catch(e: any) {
            alert(e?.message || 'Error al eliminar');
        }
    }
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

      {errorText && (
        <div className="mb-4 flex items-center p-4 bg-red-50 border border-red-100 rounded-xl">
           <p className="text-sm text-red-800">{errorText}</p>
        </div>
      )}

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
              {loading ? (
                <tr><td colSpan={6} className="text-center py-6 text-slate-500">Cargando...</td></tr>
              ) : filtered.map((exam) =>
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
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${catColors[exam.tipo || 'Otro'] || catColors.Otro}`}>
                      {exam.tipo || 'Otro'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500 max-w-xs truncate">
                    {exam.descripcion}
                  </td>
                  <td className="px-4 py-3">
                    <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${exam.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {exam.activo ? 'Activo' : 'Inactivo'}
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
                  value={form.codigo || ''}
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
                  value={form.tipo || 'Laboratorio'}
                  onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="Laboratorio">Laboratorio</option>
                    <option value="Imagen">Imagen</option>
                    <option value="Cardiología">Cardiología</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Nombre del Examen *
                </label>
                <input
                value={form.nombre || ''}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
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
                value={form.descripcion || ''}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                rows={2}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />

              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Estado
                </label>
                <select
                value={form.activo ? 'Activo' : 'Inactivo'}
                onChange={(e) => setForm({ ...form, activo: e.target.value === 'Activo' })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
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