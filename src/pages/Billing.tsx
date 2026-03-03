import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  CreditCardIcon,
  PlusIcon,
  TrashIcon,
  PrinterIcon,
  XCircleIcon,
  SearchIcon } from
'lucide-react';
interface LineItem {
  id: number;
  nombre: string;
  cantidad: number;
  precio: number;
}
interface Invoice {
  id: number;
  numero: string;
  fecha: string;
  paciente: string;
  medico: string;
  total: number;
  estado: 'Pendiente' | 'Pagada' | 'Anulada';
}
const CATALOG = [
{
  id: 1,
  nombre: 'Consulta Medicina General',
  precio: 25.0
},
{
  id: 2,
  nombre: 'Consulta Especialista',
  precio: 45.0
},
{
  id: 3,
  nombre: 'Biometría Hemática',
  precio: 12.0
},
{
  id: 4,
  nombre: 'Radiografía de Tórax',
  precio: 30.0
},
{
  id: 5,
  nombre: 'Curación Simple',
  precio: 15.0
},
{
  id: 6,
  nombre: 'Amoxicilina 500mg',
  precio: 8.5
}];

const PATIENTS = ['Juan Pérez', 'María García', 'Luis Rodríguez', 'Carmen Díaz'];
const DOCTORS = ['Dr. Carlos Mendoza', 'Dra. Ana Torres', 'Dr. Roberto Vega'];
const initialInvoices: Invoice[] = [
{
  id: 1,
  numero: 'FAC-0001',
  fecha: '2025-03-01',
  paciente: 'Juan Pérez',
  medico: 'Dr. Carlos Mendoza',
  total: 37.0,
  estado: 'Pagada'
},
{
  id: 2,
  numero: 'FAC-0002',
  fecha: '2025-03-01',
  paciente: 'María García',
  medico: 'Dra. Ana Torres',
  total: 57.0,
  estado: 'Pendiente'
},
{
  id: 3,
  numero: 'FAC-0003',
  fecha: '2025-02-28',
  paciente: 'Luis Rodríguez',
  medico: 'Dr. Carlos Mendoza',
  total: 25.0,
  estado: 'Pagada'
}];

const estadoColors: Record<string, string> = {
  Pendiente: 'bg-amber-100 text-amber-700',
  Pagada: 'bg-green-100 text-green-700',
  Anulada: 'bg-red-100 text-red-600'
};
export function Billing() {
  const location = useLocation();
  const preloaded = location.state as {
    patient?: {
      nombre: string;
      apellido: string;
    };
    doctor?: {
      nombre: string;
      apellido: string;
    };
  } | null;
  const [patient, setPatient] = useState(
    preloaded?.patient ?
    `${preloaded.patient.nombre} ${preloaded.patient.apellido}` :
    ''
  );
  const [doctor, setDoctor] = useState(
    preloaded?.doctor ?
    `Dr. ${preloaded.doctor.nombre} ${preloaded.doctor.apellido}` :
    ''
  );
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [selectedCatalog, setSelectedCatalog] = useState('');
  const [notes, setNotes] = useState('');
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [search, setSearch] = useState('');
  const [taxRate] = useState(0.12);
  const subtotal = lineItems.reduce((acc, i) => acc + i.cantidad * i.precio, 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  const addItem = () => {
    const cat = CATALOG.find((c) => c.id === Number(selectedCatalog));
    if (!cat) return;
    const existing = lineItems.find((i) => i.id === cat.id);
    if (existing) {
      setLineItems((prev) =>
      prev.map((i) =>
      i.id === cat.id ?
      {
        ...i,
        cantidad: i.cantidad + 1
      } :
      i
      )
      );
    } else {
      setLineItems((prev) => [
      ...prev,
      {
        id: cat.id,
        nombre: cat.nombre,
        cantidad: 1,
        precio: cat.precio
      }]
      );
    }
    setSelectedCatalog('');
  };
  const removeItem = (id: number) =>
  setLineItems((prev) => prev.filter((i) => i.id !== id));
  const updateQty = (id: number, qty: number) => {
    if (qty < 1) return removeItem(id);
    setLineItems((prev) =>
    prev.map((i) =>
    i.id === id ?
    {
      ...i,
      cantidad: qty
    } :
    i
    )
    );
  };
  const emitInvoice = () => {
    if (!patient || lineItems.length === 0) return;
    const newInv: Invoice = {
      id: Date.now(),
      numero: `FAC-${String(invoices.length + 1).padStart(4, '0')}`,
      fecha: new Date().toISOString().split('T')[0],
      paciente: patient,
      medico: doctor || 'Sin asignar',
      total,
      estado: 'Pendiente'
    };
    setInvoices((prev) => [newInv, ...prev]);
    setLineItems([]);
    setPatient('');
    setDoctor('');
    setNotes('');
  };
  const filteredInvoices = invoices.filter(
    (i) =>
    i.paciente.toLowerCase().includes(search.toLowerCase()) ||
    i.numero.toLowerCase().includes(search.toLowerCase()) ||
    i.medico.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
          <CreditCardIcon size={22} className="text-blue-600" />
          Facturación
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Emisión y gestión de facturas
        </p>
      </div>

      {/* New Invoice */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">
          Nueva Factura
        </h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Paciente *
            </label>
            <select
              value={patient}
              onChange={(e) => setPatient(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

              <option value="">Seleccionar paciente...</option>
              {PATIENTS.map((p) =>
              <option key={p} value={p}>
                  {p}
                </option>
              )}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Médico
            </label>
            <select
              value={doctor}
              onChange={(e) => setDoctor(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

              <option value="">Seleccionar médico...</option>
              {DOCTORS.map((d) =>
              <option key={d} value={d}>
                  {d}
                </option>
              )}
            </select>
          </div>
        </div>

        {/* Add items */}
        <div className="flex gap-3 mb-4">
          <select
            value={selectedCatalog}
            onChange={(e) => setSelectedCatalog(e.target.value)}
            className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

            <option value="">Seleccionar servicio del catálogo...</option>
            {CATALOG.map((c) =>
            <option key={c.id} value={c.id}>
                {c.nombre} — ${c.precio.toFixed(2)}
              </option>
            )}
          </select>
          <button
            onClick={addItem}
            disabled={!selectedCatalog}
            className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-40">

            <PlusIcon size={15} /> Agregar
          </button>
        </div>

        {/* Line items */}
        {lineItems.length > 0 &&
        <div className="border border-slate-100 rounded-lg overflow-hidden mb-4">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500 uppercase">
                    Servicio
                  </th>
                  <th className="text-center px-4 py-2 text-xs font-semibold text-slate-500 uppercase">
                    Cant.
                  </th>
                  <th className="text-right px-4 py-2 text-xs font-semibold text-slate-500 uppercase">
                    P. Unit.
                  </th>
                  <th className="text-right px-4 py-2 text-xs font-semibold text-slate-500 uppercase">
                    Subtotal
                  </th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {lineItems.map((item) =>
              <tr key={item.id}>
                    <td className="px-4 py-2.5 text-sm text-slate-800">
                      {item.nombre}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <input
                    type="number"
                    min={1}
                    value={item.cantidad}
                    onChange={(e) =>
                    updateQty(item.id, parseInt(e.target.value))
                    }
                    className="w-16 text-center border border-slate-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

                    </td>
                    <td className="px-4 py-2.5 text-right text-sm text-slate-600">
                      ${item.precio.toFixed(2)}
                    </td>
                    <td className="px-4 py-2.5 text-right text-sm font-medium text-slate-800">
                      ${(item.cantidad * item.precio).toFixed(2)}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <button
                    onClick={() => removeItem(item.id)}
                    className="text-slate-300 hover:text-red-500 transition-colors">

                        <TrashIcon size={14} />
                      </button>
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
            <div className="bg-slate-50 px-4 py-3 space-y-1 border-t border-slate-100">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>IVA (12%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-800 pt-1 border-t border-slate-200">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        }

        <div className="mb-4">
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Notas
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />

        </div>

        <div className="flex justify-end">
          <button
            onClick={emitInvoice}
            disabled={!patient || lineItems.length === 0}
            className="flex items-center gap-2 px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-40">

            <PrinterIcon size={15} /> Emitir Factura
          </button>
        </div>
      </div>

      {/* Invoice history */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700">
            Facturas Emitidas
          </h2>
          <div className="relative">
            <SearchIcon
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-4 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />

          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                  #Factura
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                  Fecha
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                  Paciente
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                  Médico
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                  Total
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
              {filteredInvoices.map((inv) =>
              <tr
                key={inv.id}
                className="hover:bg-slate-50/50 transition-colors">

                  <td className="px-4 py-3 text-xs font-mono text-blue-600 font-medium">
                    {inv.numero}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {inv.fecha}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">
                    {inv.paciente}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {inv.medico}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-bold text-slate-800">
                    ${inv.total.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${estadoColors[inv.estado]}`}>

                      {inv.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Imprimir">

                        <PrinterIcon size={14} />
                      </button>
                      <button
                      onClick={() =>
                      setInvoices((prev) =>
                      prev.map((i) =>
                      i.id === inv.id ?
                      {
                        ...i,
                        estado: 'Anulada'
                      } :
                      i
                      )
                      )
                      }
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Anular">

                        <XCircleIcon size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>);

}