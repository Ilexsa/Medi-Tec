import React, { useEffect, useMemo, useState } from 'react';
import {
  createSpecialty,
  deleteSpecialty,
  getSpecialties,
  SpecialtyApi,
  SpecialtyCreateApi,
  updateSpecialty,
} from '../services/specialties';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusIcon,
  SearchIcon,
  EditIcon,
  TrashIcon,
  StethoscopeIcon
} from
  'lucide-react';
import { SpecialtyModal } from '../components/SpecialtyModal';
type Specialty = {
  id: number;
  name: string;
  description: string;
  color: string;
  icon: string;
  doctorCount: number;
};

const COLOR_CLASSES: Record<
  string,
  {
    bg: string;
    text: string;
    light: string;
  }> =
{
  indigo: {
    bg: 'bg-indigo-500',
    text: 'text-indigo-700',
    light: 'bg-indigo-50'
  },
  blue: {
    bg: 'bg-blue-500',
    text: 'text-blue-700',
    light: 'bg-blue-50'
  },
  green: {
    bg: 'bg-green-500',
    text: 'text-green-700',
    light: 'bg-green-50'
  },
  red: {
    bg: 'bg-red-500',
    text: 'text-red-700',
    light: 'bg-red-50'
  },
  orange: {
    bg: 'bg-orange-500',
    text: 'text-orange-700',
    light: 'bg-orange-50'
  },
  purple: {
    bg: 'bg-purple-500',
    text: 'text-purple-700',
    light: 'bg-purple-50'
  },
  pink: {
    bg: 'bg-pink-500',
    text: 'text-pink-700',
    light: 'bg-pink-50'
  },
  cyan: {
    bg: 'bg-cyan-500',
    text: 'text-cyan-700',
    light: 'bg-cyan-50'
  }
};
const INITIAL_SPECIALTIES: Specialty[] = [
  {
    id: 1,
    name: 'Cardiología',
    description:
      'Diagnóstico y tratamiento de enfermedades del corazón y sistema cardiovascular.',
    color: 'red',
    icon: '❤️',
    doctorCount: 3
  },
  {
    id: 2,
    name: 'Neurología',
    description: 'Trastornos del sistema nervioso central y periférico.',
    color: 'purple',
    icon: '🧠',
    doctorCount: 2
  },
  {
    id: 3,
    name: 'Pediatría',
    description: 'Atención médica integral para niños y adolescentes.',
    color: 'blue',
    icon: '👶',
    doctorCount: 4
  },
  {
    id: 4,
    name: 'Traumatología',
    description: 'Lesiones del sistema músculo-esquelético.',
    color: 'orange',
    icon: '🦴',
    doctorCount: 2
  },
  {
    id: 5,
    name: 'Oncología',
    description: 'Diagnóstico y tratamiento del cáncer.',
    color: 'green',
    icon: '🔬',
    doctorCount: 2
  },
  {
    id: 6,
    name: 'Ginecología',
    description: 'Salud del sistema reproductor femenino.',
    color: 'pink',
    icon: '🌸',
    doctorCount: 3
  }];

type SpecialtyFormData = {
  name: string;
  description: string;
  color: string;
  icon: string;
};

const COLOR_HEX_BY_KEY: Record<string, string> = {
  indigo: '#3F51B5',
  blue: '#2196F3',
  green: '#4CAF50',
  red: '#F44336',
  orange: '#FF9800',
  purple: '#9C27B0',
  pink: '#E91E63',
  cyan: '#00BCD4',
};

function hexToKey(hex?: string | null): string {
  const h = (hex || '').trim().toUpperCase();
  const entry = Object.entries(COLOR_HEX_BY_KEY).find(([, v]) => v.toUpperCase() === h);
  return entry?.[0] || 'indigo';
}

function keyToHex(key: string): string | null {
  return COLOR_HEX_BY_KEY[key] || null;
}

function emptyToNull(v: string): string | null {
  const t = (v || '').trim();
  return t ? t : null;
}

function genCodigo(nombre: string): string {
  const clean = (s: string) =>
    s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]/g, '');
  const words = nombre.trim().split(/\s+/).filter(Boolean).slice(0, 3);
  const parts = words.map((w) => clean(w).toUpperCase().slice(0, 3)).filter(Boolean);
  return parts.length ? parts.join('-') : `ESP-${Date.now()}`;
}

function mapApiToUi(s: SpecialtyApi): Specialty {
  return {
    id: s.id,
    name: s.nombre,
    description: s.descripcion || '',
    color: hexToKey(s.color),
    icon: s.icono || '🩺',
    doctorCount: 0,
    codigo: s.codigo ?? null,
    duracionPorDefecto: s.duracion_por_defecto ?? 30,
    activo: s.activo ?? true,
  } as any;
}

function mapFormToApi(form: { name: string; description: string; color: string; icon: string }, existing?: any): SpecialtyCreateApi {
  return {
    nombre: form.name.trim(),
    codigo: existing?.codigo ?? genCodigo(form.name),
    descripcion: emptyToNull(form.description),
    duracion_por_defecto: existing?.duracionPorDefecto ?? 30,
    color: keyToHex(form.color),
    icono: emptyToNull(form.icon),
  };
}

export function Specialties() {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Specialty | null>(null);
  const filtered = specialties.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase())
  );

  const fetchSpecialties = async () => {
  setLoading(true);
  setError('');
  try {
    const list = await getSpecialties();
    setSpecialties(list.map(mapApiToUi));
  } catch (e: any) {
    setError(e?.message || 'No se pudieron cargar las especialidades');
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  void fetchSpecialties();
}, []);

const handleSave = async (data: SpecialtyFormData) => {
  setError('');
  const payload = mapFormToApi(data, editTarget);

  try {
    if (editTarget) {
      await updateSpecialty(editTarget.id, payload);
    } else {
      await createSpecialty(payload);
    }
    await fetchSpecialties(); // ✅ refetch real
    setEditTarget(null);
  } catch (e: any) {
    throw new Error(e?.message || 'No se pudo guardar la especialidad');
  }
};
  const handleEdit = (specialty: Specialty) => {
    setEditTarget(specialty);
    setModalOpen(true);
  };
const handleDelete = async (id: number) => {
  if (!window.confirm('¿Estás seguro de eliminar esta especialidad?')) return;

  setError('');
  try {
    await deleteSpecialty(id);
    await fetchSpecialties();
  } catch (e: any) {
    setError(e?.message || 'No se pudo eliminar la especialidad');
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
          <h2 className="text-xl font-bold text-slate-900">Especialidades</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {specialties.length} especialidades activas
          </p>
        </div>
        <button
          onClick={() => {
            setEditTarget(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-800 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">

          <PlusIcon className="w-4 h-4" />
          Nueva Especialidad
        </button>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        transition={{
          duration: 0.3,
          delay: 0.1
        }}
        className="relative">

        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar especialidad..."
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm" />

      </motion.div>

      {/* Grid */}
      {error && (
  <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
    {error}
  </div>
)}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ?
          <motion.div
            key="empty"
            initial={{
              opacity: 0,
              scale: 0.97
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            exit={{
              opacity: 0
            }}
            transition={{
              duration: 0.2
            }}
            className="text-center py-16 bg-white rounded-2xl border border-slate-100">

            <StethoscopeIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">
              No se encontraron especialidades
            </p>
            <p className="text-slate-400 text-sm mt-1">
              Intenta con otro término o crea una nueva.
            </p>
          </motion.div> :

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((spec, i) => {
              const colors = COLOR_CLASSES[spec.color] ?? COLOR_CLASSES.indigo;
              return (
                <motion.div
                  key={spec.id}
                  initial={{
                    opacity: 0,
                    y: 16
                  }}
                  animate={{
                    opacity: 1,
                    y: 0
                  }}
                  exit={{
                    opacity: 0,
                    y: -8,
                    scale: 0.97
                  }}
                  transition={{
                    duration: 0.3,
                    delay: i * 0.08
                  }}
                  layout
                  className="bg-white rounded-xl border border-slate-100 shadow-card p-5 group">

                  <div className="flex items-start justify-between mb-1">
                    <div
                      className={`w-12 h-12 rounded-xl ${colors.light} flex items-center justify-center text-2xl flex-shrink-0`}>

                      {spec.icon}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(spec)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        aria-label={`Editar ${spec.name}`}>

                        <EditIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(spec.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label={`Eliminar ${spec.name}`}>

                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3">
                    <h3 className="text-sm font-semibold text-slate-900">
                      {spec.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                      {spec.description || 'Sin descripción.'}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-50 grid grid-cols-2 gap-3">
                    <div className="text-center">
                      <p className="text-lg font-bold text-blue-800">
                        {spec.doctorCount}
                      </p>
                      <p className="text-xs text-slate-500">Médicos</p>
                    </div>
                    <div className="text-center">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${colors.light} ${colors.text}`}>

                        <span
                          className={`w-1.5 h-1.5 rounded-full ${colors.bg}`} />

                        Activa
                      </span>
                    </div>
                  </div>
                </motion.div>);

            })}
          </div>
        }
      </AnimatePresence>

      <SpecialtyModal
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