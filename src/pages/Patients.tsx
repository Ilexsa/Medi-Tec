import React, { useEffect, useMemo, useState } from 'react';
import {
  PlusIcon,
  SearchIcon,
  PencilIcon,
  Trash2Icon,
  FilterIcon,
  UsersIcon } from
'lucide-react';
import { PatientModal, Patient } from '../components/PatientModal';
import { motion } from 'framer-motion';
import {
  createPatient as apiCreatePatient,
  deletePatient as apiDeletePatient,
  getPatients,
  PatientApi,
  PatientCreateApi,
  updatePatient as apiUpdatePatient
} from '../services/patients';

const statusStyles: Record<string, string> = {
  Activo: 'bg-green-100 text-green-800',
  Inactivo: 'bg-red-100 text-red-800'
};

function toUiGenero(genero?: string | null): string {
  const g = (genero || '').toLowerCase();
  if (g === 'male' || g === 'masculino') return 'Masculino';
  if (g === 'female' || g === 'femenino') return 'Femenino';
  if (g) return 'Otro';
  return '';
}

function toUiEstado(estado?: string | null): string {
  const e = (estado || '').toLowerCase();
  if (e === 'active' || e === 'activo') return 'Activo';
  if (e === 'inactive' || e === 'inactivo') return 'Inactivo';
  return 'Activo';
}

function toApiGenero(genero: string): string {
  const g = (genero || '').toLowerCase();
  if (g.includes('masculino')) return 'male';
  if (g.includes('memenino')) return 'female';
  if (g) return 'other';
  return 'other';
}

function toApiEstado(estado?: string | null): string {
  const e = (estado || '').toLowerCase();
  if (e === 'inactivo' || e === 'inactive') return 'inactive';
  return 'active';
}

function dateToYMD(date: string): string {
  if (!date) return '';
  // sirve si llega "YYYY-MM-DD" o "YYYY-MM-DDTHH:mm:ssZ"
  return date.slice(0, 10);
}
function emptyToNull(v: string): string | null {
  const t = (v || '').trim();
  return t ? t : null;
}

function mapPatientToCreateApi(p: Patient): PatientCreateApi {
  return {
    identificacion: p.cedula,
    tipo_identificacion: p.tipoIdentificacion || 'cedula',
    nombres: p.nombre,
    apellidos: p.apellido,
    fecha_nacimiento: dateToYMD(p.fechaNacimiento),
    genero: toApiGenero(p.genero),
    email: emptyToNull(p.email),
    telefono: emptyToNull(p.telefono),
    celular: emptyToNull(p.celular),
    direccion: emptyToNull(p.direccion),
    ciudad: emptyToNull(p.ciudad),
    tipo_sangre: emptyToNull(p.tipoSangre),
    alergias: emptyToNull(p.alergias),
    condiciones_cronicas: emptyToNull(p.condicionesCronicas),
    contacto_emergencia_nombre: emptyToNull(p.contactoEmergenciaNombre),
    contacto_emergencia_telefono: emptyToNull(p.contactoEmergenciaTelefono),
    contacto_emergencia_relacion: emptyToNull(p.contactoEmergenciaRelacion),
    aseguradora: emptyToNull(p.aseguradora),
    numero_seguro: emptyToNull(p.numeroSeguro),
    estado: toApiEstado(p.estado)
  };
}

function dateOnly(iso?: string | null): string {
  if (!iso) return '';
  return iso.slice(0, 10);
}



function mapApiToPatient(p: PatientApi): Patient {
  return {
    id: p.id,
    tipoIdentificacion: p.tipo_identificacion || 'cedula',
    nombre: p.nombres,
    apellido: p.apellidos,
    cedula: p.identificacion,
    fechaNacimiento: dateOnly(p.fecha_nacimiento),
    genero: toUiGenero(p.genero),
    telefono: p.telefono || '',
    celular: p.celular || '',
    email: p.email || '',
    direccion: p.direccion || '',
    ciudad: p.ciudad || '',
    tipoSangre: p.tipo_sangre || '',
    alergias: p.alergias || '',
    condicionesCronicas: p.condiciones_cronicas || '',
    contactoEmergenciaNombre: p.contacto_emergencia_nombre || '',
    contactoEmergenciaTelefono: p.contacto_emergencia_telefono || '',
    contactoEmergenciaRelacion: p.contacto_emergencia_relacion || '',
    aseguradora: p.aseguradora || '',
    numeroSeguro: p.numero_seguro || '',
    urlFotoPerfil: p.url_foto_perfil || '',
    notas: '',
    estado: toUiEstado(p.estado),
    edad: p.edad
  };
}
function calcEdad(fechaNacimiento: string): number {
  if (!fechaNacimiento) return 0;
  return new Date().getFullYear() - new Date(fechaNacimiento).getFullYear();
}
export function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editPatient, setEditPatient] = useState<Patient | null>(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError('');
      try {
        const apiPatients = await getPatients();
        setPatients(apiPatients.map(mapApiToPatient));
      } catch (e: any) {
        setError(e?.message || 'No se pudieron cargar los pacientes');
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, []);

  const fetchPatients = async () => {
    const run = async () => {
      setLoading(true);
      setError('');
      try {
        const apiPatients = await getPatients();
        setPatients(apiPatients.map(mapApiToPatient));
      } catch (e: any) {
        setError(e?.message || 'No se pudieron cargar los pacientes');
      } finally {
        setLoading(false);
      }
    };
    void run();
};

  const filtered = useMemo(() => {
    return patients.filter((p) => {
      const fullName = `${p.nombre} ${p.apellido}`;
      const matchSearch =
        fullName.toLowerCase().includes(search.toLowerCase()) ||
        (p.cedula || '').includes(search) ||
        (p.email || '').toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter ? p.estado === statusFilter : true;
      return matchSearch && matchStatus;
    });
  }, [patients, search, statusFilter]);
  const handleDelete = async (id: number) => {
    setError('');
    try {
      await apiDeletePatient(id);
      setPatients((prev) => prev.filter((p) => p.id !== id));
    } catch (e: any) {
      setError(e?.message || 'No se pudo eliminar el paciente');
    }
  };

const handleSave = async (data: Patient) => {
  setError('');
  const payload = mapPatientToCreateApi(data);

  try {
    if (editPatient) {
      await apiUpdatePatient(editPatient.id, payload);

      // ✅ REFRESH REAL (porque el PUT no devuelve paciente)
      await fetchPatients();
    } else {
      const created = await apiCreatePatient(payload);
      const uiCreated = mapApiToPatient(created);
      setPatients((prev) => [uiCreated, ...prev]);

      // (Opcional) si tu POST tampoco devuelve paciente real, mejor:
      // await refetchPatients();
    }

    setEditPatient(null);
    setIsModalOpen(false);
  } catch (e: any) {
    throw new Error(e?.message || 'No se pudo guardar el paciente');
  }
};
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <UsersIcon size={22} className="text-blue-600" />
            Pacientes
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {loading ? 'Cargando...' : `${patients.length} pacientes registrados`}
          </p>
        </div>
        <button
          onClick={() => {
            setEditPatient(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-medium transition-colors">

          <PlusIcon size={16} />
          Agregar Paciente
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {error &&
        <div className="p-4 border-b border-red-100 bg-red-50 text-sm text-red-600">
            {error}
          </div>
        }
        <div className="p-4 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2 flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5">
              <SearchIcon className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre o cédula..."
                className="bg-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none flex-1" />

            </div>
            <div className="flex items-center gap-2">
              <FilterIcon className="w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">

                <option value="">Todos los estados</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3.5">
                  #
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3.5">
                  Nombre
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3.5 hidden sm:table-cell">
                  Cédula
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3.5 hidden md:table-cell">
                  Edad
                </th>
                 {/* Este es un comentario en JSX 
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3.5 hidden lg:table-cell">
                  Especialidad
                </th>
                */}
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3.5">
                  Estado
                </th>
                <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3.5">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ?
              <tr>
                  <td
                  colSpan={7}
                  className="px-5 py-12 text-center text-sm text-slate-400">

                    Cargando pacientes...
                  </td>
                </tr> :

              filtered.length === 0 ?
              <tr>
                  <td
                  colSpan={7}
                  className="px-5 py-12 text-center text-sm text-slate-400">

                    No se encontraron pacientes
                  </td>
                </tr> :

              filtered.map((patient, i) =>
              <motion.tr
                key={patient.id}
                initial={{
                  opacity: 0
                }}
                animate={{
                  opacity: 1
                }}
                transition={{
                  duration: 0.2,
                  delay: i * 0.04
                }}
                className="hover:bg-slate-50/60 transition-colors group">

                    <td className="px-5 py-3.5 text-sm text-slate-400 font-mono">
                      {String(i + 1).padStart(2, '0')}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold flex-shrink-0">
                          {patient.nombre.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-slate-800">
                          {patient.nombre} {patient.apellido}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-500 font-mono hidden sm:table-cell">
                      {patient.cedula}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-600 hidden md:table-cell">
                      {(patient.edad ?? calcEdad(patient.fechaNacimiento))} años
                    </td>
                    {/*<td className="px-5 py-3.5 hidden lg:table-cell">
                      {patient.especialidad ?
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          {patient.especialidad}
                        </span> :

                  <span className="text-xs text-slate-400">—</span>
                  }
                    </td>*/}
                    <td className="px-5 py-3.5">
                      <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[patient.estado ?? 'Activo'] || statusStyles.Activo}`}>

                        {patient.estado ?? 'Activo'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                      onClick={() => {
                        setEditPatient(patient);
                        setIsModalOpen(true);
                      }}
                      title="Editar paciente"
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">

                          <PencilIcon className="w-3.5 h-3.5" />
                        </button>
                        <button
                      onClick={() => handleDelete(patient.id)}
                      title="Eliminar paciente"
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">

                          <Trash2Icon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
              )
              }
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen &&
      <PatientModal
        patient={editPatient}
        onClose={() => {
          setIsModalOpen(false);
          setEditPatient(null);
        }}
        onSave={handleSave} />

      }
    </div>);

}