import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  SearchIcon,
  PencilIcon,
  TrashIcon,
  UserCheckIcon
} from 'lucide-react';
import { DoctorModal } from '../components/DoctorModal';
import { 
  DoctorApi, 
  getDoctors, 
  createDoctor, 
  updateDoctor, 
  deleteDoctor, 
  DoctorCreateApi, 
  DoctorUpdateApi 
} from '../services/doctors';
import { getSpecialties, SpecialtyApi } from '../services/specialties';

export function Doctors() {
  const [doctors, setDoctors] = useState<DoctorApi[]>([]);
  const [specialties, setSpecialties] = useState<SpecialtyApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<DoctorApi | null>(null);

  const filtered = doctors.filter(
    (d) =>
      `${d.nombres} ${d.apellidos}`.toLowerCase().includes(search.toLowerCase()) ||
      (d.identificacion && d.identificacion.includes(search)) ||
      (d.nombre_especialidad && d.nombre_especialidad.toLowerCase().includes(search.toLowerCase()))
  );

  const fetchInitialData = async () => {
    setLoading(true);
    setError('');
    try {
      // Obtenemos médicos y especialidades al mismo tiempo
      const [docsRes, specsRes] = await Promise.all([
        getDoctors({ page: 1, limit: 50 }),
        getSpecialties()
      ]);
      setDoctors(docsRes.data); 
      setSpecialties(specsRes);
    } catch (e: any) {
      setError(e?.message || 'No se pudieron cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  // Solo para refrescar los médicos luego de crear/editar/eliminar sin recargar especialidades
  const fetchDoctorsList = async () => {
    try {
      const res = await getDoctors({ page: 1, limit: 50 });
      setDoctors(res.data);
    } catch (e: any) {
      console.error('Error al actualizar lista de médicos:', e);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleSave = async (payload: DoctorCreateApi | DoctorUpdateApi, isEdit: boolean) => {
    try {
      if (isEdit && editingDoctor) {
        await updateDoctor(editingDoctor.id, payload as DoctorUpdateApi);
      } else {
        await createDoctor(payload as DoctorCreateApi);
      }
      setModalOpen(false);
      setEditingDoctor(null);
      fetchDoctorsList(); 
    } catch (e: any) {
      alert(e?.message || 'Ocurrió un error al guardar el médico');
    }
  };

  const handleEdit = (doctor: DoctorApi) => {
    setEditingDoctor(doctor);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Eliminar este médico de forma permanente?')) {
      try {
        await deleteDoctor(id);
        fetchDoctorsList(); 
      } catch (e: any) {
        alert(e?.message || 'Error al eliminar');
      }
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <UserCheckIcon size={22} className="text-blue-600" />
            Médicos
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {doctors.length} médicos registrados
          </p>
        </div>
        <button
          onClick={() => {
            setEditingDoctor(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-medium transition-colors">
          <PlusIcon size={16} />
          Agregar Médico
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <div className="relative max-w-sm w-full">
            <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar médico..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
             <div className="text-center py-12 text-slate-500">Cargando médicos...</div>
          ) : error ? (
             <div className="text-center py-12 text-red-500">{error}</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Médico</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Identificación</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Especialidad</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Teléfono</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Estado</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-400 text-sm">No se encontraron médicos</td>
                  </tr>
                ) : (
                  filtered.map((doctor) => (
                    <tr key={doctor.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold uppercase">
                            {doctor.nombres?.[0] || ''}{doctor.apellidos?.[0] || ''}
                          </div>
                          <span className="text-sm font-medium text-slate-800">
                            Dr. {doctor.nombres} {doctor.apellidos}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">{doctor.identificacion}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          {doctor.nombre_especialidad || 'Sin especialidad'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">{doctor.telefono}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{doctor.email}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${doctor.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {doctor.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleEdit(doctor)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                            <PencilIcon size={15} />
                          </button>
                          <button onClick={() => handleDelete(doctor.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                            <TrashIcon size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modalOpen && (
        <DoctorModal
          doctor={editingDoctor}
          specialties={specialties}
          onClose={() => {
            setModalOpen(false);
            setEditingDoctor(null);
          }}
          onSave={handleSave} 
        />
      )}
    </div>
  );
}