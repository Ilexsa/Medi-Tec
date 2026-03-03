import React, { useState } from 'react';
import {
  PlusIcon,
  SearchIcon,
  PencilIcon,
  TrashIcon,
  UserCheckIcon } from
'lucide-react';
import { DoctorModal, Doctor } from '../components/DoctorModal';
const initialDoctors: Doctor[] = [
{
  id: 1,
  nombre: 'Carlos',
  apellido: 'Mendoza',
  cedula: '1234567890',
  especialidad: 'Medicina General',
  telefono: '0991234567',
  email: 'cmendoza@medisys.com',
  horario: 'Lun-Vie 08:00-17:00'
},
{
  id: 2,
  nombre: 'Ana',
  apellido: 'Torres',
  cedula: '0987654321',
  especialidad: 'Pediatría',
  telefono: '0997654321',
  email: 'atorres@medisys.com',
  horario: 'Lun-Jue 09:00-16:00'
},
{
  id: 3,
  nombre: 'Roberto',
  apellido: 'Vega',
  cedula: '1122334455',
  especialidad: 'Odontología',
  telefono: '0993344556',
  email: 'rvega@medisys.com',
  horario: 'Mar-Sáb 08:00-14:00'
}];

const SPECIALTIES = [
'Medicina General',
'Pediatría',
'Odontología',
'Cardiología',
'Ginecología',
'Traumatología',
'Dermatología',
'Neurología'];

export function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const filtered = doctors.filter(
    (d) =>
    `${d.nombre} ${d.apellido}`.
    toLowerCase().
    includes(search.toLowerCase()) ||
    d.cedula.includes(search) ||
    d.especialidad.toLowerCase().includes(search.toLowerCase())
  );
  const handleSave = (doctor: Doctor) => {
    setDoctors((prev) =>
    prev.find((d) => d.id === doctor.id) ?
    prev.map((d) => d.id === doctor.id ? doctor : d) :
    [...prev, doctor]
    );
    setModalOpen(false);
    setEditingDoctor(null);
  };
  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setModalOpen(true);
  };
  const handleDelete = (id: number) => {
    if (confirm('¿Eliminar este médico?')) {
      setDoctors((prev) => prev.filter((d) => d.id !== id));
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
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-sm">
            <SearchIcon
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Buscar médico..."
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
                  Médico
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Cédula
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Especialidad
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Teléfono
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Email
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Horario
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ?
              <tr>
                  <td
                  colSpan={7}
                  className="text-center py-12 text-slate-400 text-sm">

                    No se encontraron médicos
                  </td>
                </tr> :

              filtered.map((doctor) =>
              <tr
                key={doctor.id}
                className="hover:bg-slate-50/50 transition-colors">

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold">
                          {doctor.nombre[0]}
                          {doctor.apellido[0]}
                        </div>
                        <span className="text-sm font-medium text-slate-800">
                          Dr. {doctor.nombre} {doctor.apellido}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {doctor.cedula}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {doctor.especialidad}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {doctor.telefono}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {doctor.email}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {doctor.horario}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                      onClick={() => handleEdit(doctor)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar">

                          <PencilIcon size={15} />
                        </button>
                        <button
                      onClick={() => handleDelete(doctor.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar">

                          <TrashIcon size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
              )
              }
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen &&
      <DoctorModal
        doctor={editingDoctor}
        specialties={SPECIALTIES}
        onClose={() => {
          setModalOpen(false);
          setEditingDoctor(null);
        }}
        onSave={handleSave} />

      }
    </div>);

}