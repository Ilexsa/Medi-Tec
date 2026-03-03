import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PillIcon,
  PlusIcon,
  AlertTriangleIcon,
  SearchIcon,
  FilterIcon,
  EditIcon,
  TrashIcon } from
'lucide-react';
import { MedicationModal } from '../components/MedicationModal';
type Medication = {
  id: number;
  name: string;
  genericName: string;
  category: string;
  presentation: string;
  unit: string;
  concentration: string;
  notes: string;
};
type MedicationFormData = {
  name: string;
  genericName: string;
  category: string;
  presentation: string;
  unit: string;
  concentration: string;
  notes: string;
};
const CATEGORY_COLORS: Record<string, string> = {
  Analgésico: 'bg-blue-100 text-blue-700',
  Antibiótico: 'bg-green-100 text-green-700',
  Antiinflamatorio: 'bg-orange-100 text-orange-700',
  Antihipertensivo: 'bg-red-100 text-red-700',
  Antidiabético: 'bg-purple-100 text-purple-700',
  Antihistamínico: 'bg-yellow-100 text-yellow-700',
  Broncodilatador: 'bg-cyan-100 text-cyan-700',
  Cardiotónico: 'bg-pink-100 text-pink-700',
  Diurético: 'bg-teal-100 text-teal-700',
  Hormonal: 'bg-indigo-100 text-indigo-700',
  'Vitaminas y suplementos': 'bg-lime-100 text-lime-700',
  Gastroprotector: 'bg-emerald-100 text-emerald-700',
  Ansiolítico: 'bg-violet-100 text-violet-700',
  Otro: 'bg-gray-100 text-gray-700'
};
const INITIAL_MEDICATIONS: Medication[] = [
{
  id: 1,
  name: 'Amoxicilina 500mg',
  genericName: 'Amoxicilina',
  category: 'Antibiótico',
  presentation: 'Cápsula',
  unit: 'mg',
  concentration: '500',
  notes: 'Tomar con alimentos'
},
{
  id: 2,
  name: 'Ibuprofeno 400mg',
  genericName: 'Ibuprofeno',
  category: 'Antiinflamatorio',
  presentation: 'Tableta',
  unit: 'mg',
  concentration: '400',
  notes: ''
},
{
  id: 3,
  name: 'Metformina 850mg',
  genericName: 'Clorhidrato de metformina',
  category: 'Antidiabético',
  presentation: 'Tableta',
  unit: 'mg',
  concentration: '850',
  notes: 'Tomar durante las comidas'
},
{
  id: 4,
  name: 'Enalapril 10mg',
  genericName: 'Maleato de enalapril',
  category: 'Antihipertensivo',
  presentation: 'Tableta',
  unit: 'mg',
  concentration: '10',
  notes: ''
},
{
  id: 5,
  name: 'Omeprazol 20mg',
  genericName: 'Omeprazol',
  category: 'Gastroprotector',
  presentation: 'Cápsula',
  unit: 'mg',
  concentration: '20',
  notes: ''
},
{
  id: 6,
  name: 'Lorazepam 1mg',
  genericName: 'Lorazepam',
  category: 'Ansiolítico',
  presentation: 'Tableta',
  unit: 'mg',
  concentration: '1',
  notes: ''
},
{
  id: 7,
  name: 'Salbutamol',
  genericName: 'Sulfato de salbutamol',
  category: 'Broncodilatador',
  presentation: 'Inhalador',
  unit: 'mcg',
  concentration: '100',
  notes: '2 puff cada 4-6 horas'
},
{
  id: 8,
  name: 'Vitamina C',
  genericName: 'Ácido ascórbico',
  category: 'Vitaminas y suplementos',
  presentation: 'Tableta',
  unit: 'mg',
  concentration: '1000',
  notes: ''
}];

export function Medications() {
  const [medications, setMedications] =
  useState<Medication[]>(INITIAL_MEDICATIONS);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Medication | null>(null);
  const categories = Array.from(
    new Set(medications.map((m) => m.category))
  ).sort();
  const filtered = medications.filter((m) => {
    const matchesSearch =
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.genericName.toLowerCase().includes(search.toLowerCase()) ||
    m.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !categoryFilter || m.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });
  const handleSave = (data: MedicationFormData) => {
    if (editTarget) {
      setMedications((prev) =>
      prev.map((m) =>
      m.id === editTarget.id ?
      {
        ...m,
        ...data
      } :
      m
      )
      );
    } else {
      setMedications((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...data
      }]
      );
    }
    setEditTarget(null);
  };
  const handleEdit = (med: Medication) => {
    setEditTarget(med);
    setModalOpen(true);
  };
  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este medicamento?')) {
      setMedications((prev) => prev.filter((m) => m.id !== id));
    }
  };
  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <motion.div
        initial={{
          opacity: 0,
          y: -12
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.35
        }}
        className="flex items-center justify-between">

        <div>
          <h2 className="text-xl font-bold text-slate-900">Medicamentos</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Control de inventario farmacéutico
          </p>
        </div>
        <button
          onClick={() => {
            setEditTarget(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-800 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">

          <PlusIcon className="w-4 h-4" />
          Agregar Medicamento
        </button>
      </motion.div>

      {/* Alert */}
      <motion.div
        initial={{
          opacity: 0,
          x: -12
        }}
        animate={{
          opacity: 1,
          x: 0
        }}
        transition={{
          duration: 0.35,
          delay: 0.08
        }}
        className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl">

        <AlertTriangleIcon className="w-5 h-5 text-amber-600 flex-shrink-0" />
        <p className="text-sm text-amber-800">
          <span className="font-semibold">
            {medications.length} medicamentos
          </span>{' '}
          registrados en el catálogo farmacéutico.
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        transition={{
          duration: 0.3,
          delay: 0.15
        }}
        className="flex flex-col sm:flex-row gap-3">

        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, genérico o categoría..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm" />

        </div>
        <div className="relative">
          <FilterIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="pl-10 pr-8 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm appearance-none cursor-pointer">

            <option value="">Todas las categorías</option>
            {categories.map((cat) =>
            <option key={cat} value={cat}>
                {cat}
              </option>
            )}
          </select>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{
          opacity: 0,
          y: 12
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.35,
          delay: 0.2
        }}
        className="bg-white rounded-xl border border-slate-100 shadow-card overflow-hidden">

        <div className="flex items-center gap-3 p-5 border-b border-slate-100">
          <PillIcon className="w-5 h-5 text-blue-700" />
          <h3 className="text-sm font-semibold text-slate-900">
            Inventario de Medicamentos
          </h3>
          <span className="ml-auto text-xs text-slate-400">
            {filtered.length} de {medications.length}
          </span>
        </div>

        <AnimatePresence mode="wait">
          {filtered.length === 0 ?
          <motion.div
            key="empty"
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            exit={{
              opacity: 0
            }}
            className="text-center py-12">

              <PillIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">
                No se encontraron medicamentos
              </p>
            </motion.div> :

          <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-50 bg-slate-50/50">
                    <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3.5">
                      Medicamento
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3.5 hidden md:table-cell">
                      Nombre Genérico
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3.5 hidden md:table-cell">
                      Categoría
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3.5">
                      Presentación
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3.5">
                      Concentración
                    </th>
                    <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3.5">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((med, i) =>
                <motion.tr
                  key={med.id}
                  initial={{
                    opacity: 0
                  }}
                  animate={{
                    opacity: 1
                  }}
                  exit={{
                    opacity: 0
                  }}
                  transition={{
                    delay: i * 0.06
                  }}
                  className="hover:bg-slate-50/50 transition-colors group">

                      <td className="px-5 py-3.5">
                        <p className="text-sm font-medium text-slate-800">
                          {med.name}
                        </p>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-500 hidden md:table-cell">
                        {med.genericName || '—'}
                      </td>
                      <td className="px-5 py-3.5 hidden md:table-cell">
                        <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[med.category] ?? 'bg-gray-100 text-gray-700'}`}>

                          {med.category}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">
                        {med.presentation}
                      </td>
                      <td className="px-5 py-3.5 text-sm font-mono text-slate-700">
                        {med.concentration ?
                    `${med.concentration} ${med.unit}` :
                    '—'}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                        onClick={() => handleEdit(med)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        aria-label={`Editar ${med.name}`}>

                            <EditIcon className="w-4 h-4" />
                          </button>
                          <button
                        onClick={() => handleDelete(med.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label={`Eliminar ${med.name}`}>

                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                )}
                </tbody>
              </table>
            </div>
          }
        </AnimatePresence>
      </motion.div>

      <MedicationModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditTarget(null);
        }}
        onSave={handleSave}
        initialData={editTarget ?? undefined}
        mode={editTarget ? 'edit' : 'create'} />

    </div>);

}