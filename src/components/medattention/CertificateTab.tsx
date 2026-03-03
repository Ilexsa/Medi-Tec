import React, { useState } from 'react';
import { PrinterIcon, FileTextIcon } from 'lucide-react';
type CertType = 'Reposo' | 'Asistencia' | 'Aptitud';
export function CertificateTab() {
  const [certType, setCertType] = useState<CertType>('Reposo');
  const [diasReposo, setDiasReposo] = useState('');
  const [fechaInicio, setFechaInicio] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [diagnostico, setDiagnostico] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [generated, setGenerated] = useState(false);
  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-slate-700 mb-5 flex items-center gap-2">
          <FileTextIcon size={16} className="text-blue-600" />
          Certificado Médico
        </h2>

        {/* Type selector */}
        <div className="flex gap-2 mb-5">
          {(['Reposo', 'Asistencia', 'Aptitud'] as CertType[]).map((type) =>
          <button
            key={type}
            onClick={() => {
              setCertType(type);
              setGenerated(false);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${certType === type ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>

              {type}
            </button>
          )}
        </div>

        <div className="space-y-4">
          {certType === 'Reposo' &&
          <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Días de Reposo
                </label>
                <input
                type="number"
                min="1"
                value={diasReposo}
                onChange={(e) => setDiasReposo(e.target.value)}
                placeholder="Ej: 3"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Fecha de Inicio
                </label>
                <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

              </div>
            </div>
          }

          {certType === 'Asistencia' &&
          <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Fecha de Atención
              </label>
              <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full max-w-xs border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

            </div>
          }

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Diagnóstico
            </label>
            <input
              value={diagnostico}
              onChange={(e) => setDiagnostico(e.target.value)}
              placeholder="Diagnóstico para el certificado..."
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Observaciones
            </label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows={3}
              placeholder="Observaciones adicionales..."
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />

          </div>
        </div>

        {/* Preview */}
        {generated &&
        <div className="mt-5 p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">
              Vista Previa del Certificado
            </p>
            <div className="text-sm text-slate-700 space-y-1">
              <p>
                <strong>Tipo:</strong> Certificado de {certType}
              </p>
              {certType === 'Reposo' &&
            <p>
                  <strong>Reposo:</strong> {diasReposo} días a partir del{' '}
                  {fechaInicio}
                </p>
            }
              {certType === 'Asistencia' &&
            <p>
                  <strong>Fecha de atención:</strong> {fechaInicio}
                </p>
            }
              {diagnostico &&
            <p>
                  <strong>Diagnóstico:</strong> {diagnostico}
                </p>
            }
              {observaciones &&
            <p>
                  <strong>Observaciones:</strong> {observaciones}
                </p>
            }
              <p className="pt-2 text-slate-400 text-xs">
                Firmado por: Dr. Carlos Mendoza — Medicina General
              </p>
            </div>
          </div>
        }

        <div className="flex gap-3 mt-5">
          <button
            onClick={() => setGenerated(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-medium transition-colors">

            Generar Certificado
          </button>
          {generated &&
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
              <PrinterIcon size={14} /> Imprimir
            </button>
          }
        </div>
      </div>
    </div>);

}