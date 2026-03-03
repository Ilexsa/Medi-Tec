import React, { useState } from 'react';
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
const samplePatients: Patient[] = [
{
  id: 1,
  nombre: 'María Elena',
  apellido: 'González',
  cedula: '28.456.789',
  fechaNacimiento: '1980-03-15',
  genero: 'Femenino',
  telefono: '0991234567',
  email: 'maria@email.com',
  direccion: 'Av. Principal 123',
  notas: '',
  especialidad: 'Cardiología',
  estado: 'Activo'
},
{
  id: 2,
  nombre: 'Carlos Alberto',
  apellido: 'Rodríguez',
  cedula: '31.234.567',
  fechaNacimiento: '1963-07-22',
  genero: 'Masculino',
  telefono: '0997654321',
  email: 'carlos@email.com',
  direccion: 'Calle 5 de Junio 456',
  notas: '',
  especialidad: 'Neurología',
  estado: 'Internado'
},
{
  id: 3,
  nombre: 'Ana Lucía',
  apellido: 'Fernández',
  cedula: '35.678.901',
  fechaNacimiento: '1997-11-08',
  genero: 'Femenino',
  telefono: '0993344556',
  email: 'ana@email.com',
  direccion: 'Urb. Las Palmas 789',
  notas: '',
  especialidad: 'Pediatría',
  estado: 'Activo'
},
{
  id: 4,
  nombre: 'Luis Ernesto',
  apellido: 'Pérez',
  cedula: '22.345.678',
  fechaNacimiento: '1954-02-14',
  genero: 'Masculino',
  telefono: '0994455667',
  email: 'luis@email.com',
  direccion: 'Barrio Centro 321',
  notas: '',
  especialidad: 'Medicina General',
  estado: 'Alta'
},
{
  id: 5,
  nombre: 'Sofía Valentina',
  apellido: 'Díaz',
  cedula: '40.123.456',
  fechaNacimiento: '2006-09-30',
  genero: 'Femenino',
  telefono: '0995566778',
  email: 'sofia@email.com',
  direccion: 'Av. Libertad 654',
  notas: '',
  especialidad: 'Pediatría',
  estado: 'Urgente'
}];

const statusStyles: Record<string, string> = {
  Activo: 'bg-green-100 text-green-800',
  Internado: 'bg-yellow-100 text-yellow-800',
  Alta: 'bg-red-100 text-red-800',
  Urgente: 'bg-blue-100 text-blue-800'
};
function calcEdad(fechaNacimiento: string): number {
  if (!fechaNacimiento) return 0;
  return new Date().getFullYear() - new Date(fechaNacimiento).getFullYear();
}
export function Patients() {
  const [patients, setPatients] = useState<Patient[]>(samplePatients);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editPatient, setEditPatient] = useState<Patient | null>(null);
  const filtered = patients.filter((p) => {
    const fullName = `${p.nombre} ${p.apellido}`;
    const matchSearch =
    fullName.toLowerCase().includes(search.toLowerCase()) ||
    p.cedula.includes(search);
    const matchStatus = statusFilter ? p.estado === statusFilter : true;
    return matchSearch && matchStatus;
  });
  const handleDelete = (id: number) => {
    setPatients((prev) => prev.filter((p) => p.id !== id));
  };
  const handleSave = (data: Patient) => {
    if (editPatient) {
      setPatients((prev) =>
      prev.map((p) =>
      p.id === editPatient.id ?
      {
        ...data,
        id: editPatient.id
      } :
      p
      )
      );
    } else {
      setPatients((prev) => [
      {
        ...data,
        id: Date.now()
      },
      ...prev]
      );
    }
    setEditPatient(null);
    setIsModalOpen(false);
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
            {patients.length} pacientes registrados
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
                <option value="Internado">Internado</option>
                <option value="Alta">Alta</option>
                <option value="Urgente">Urgente</option>
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
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3.5 hidden lg:table-cell">
                  Especialidad
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3.5">
                  Estado
                </th>
                <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3.5">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ?
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
                      {calcEdad(patient.fechaNacimiento)} años
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell">
                      {patient.especialidad ?
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          {patient.especialidad}
                        </span> :

                  <span className="text-xs text-slate-400">—</span>
                  }
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[patient.estado ?? 'Activo']}`}>

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