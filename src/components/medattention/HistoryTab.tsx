import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, ClockIcon } from 'lucide-react';
interface HistoryEntry {
  id: number;
  fecha: string;
  doctor: string;
  especialidad: string;
  motivo: string;
  diagnosticos: string[];
  medicamentos: string[];
  examenes: string[];
  nota: string;
}
const MOCK_HISTORY: HistoryEntry[] = [
{
  id: 1,
  fecha: '2025-02-15',
  doctor: 'Dr. Carlos Mendoza',
  especialidad: 'Medicina General',
  motivo: 'Fiebre y malestar general',
  diagnosticos: ['J06.9 — Infección aguda de vías respiratorias superiores'],
  medicamentos: ['Amoxicilina 500mg c/8h x 7 días', 'Paracetamol 500mg c/6h'],
  examenes: ['Biometría Hemática Completa'],
  nota: 'Paciente presenta cuadro gripal de 3 días de evolución. Se indica reposo y antibioticoterapia.'
},
{
  id: 2,
  fecha: '2025-01-10',
  doctor: 'Dr. Carlos Mendoza',
  especialidad: 'Medicina General',
  motivo: 'Control de presión arterial',
  diagnosticos: ['I10 — Hipertensión esencial (primaria)'],
  medicamentos: ['Losartán 50mg c/24h'],
  examenes: ['Perfil Lipídico', 'Función Renal'],
  nota: 'Paciente con HTA conocida. TA: 145/90. Se ajusta medicación.'
},
{
  id: 3,
  fecha: '2024-11-20',
  doctor: 'Dra. Ana Torres',
  especialidad: 'Pediatría',
  motivo: 'Chequeo anual',
  diagnosticos: [],
  medicamentos: [],
  examenes: ['Biometría Hemática Completa', 'Glucosa en Ayunas'],
  nota: 'Paciente en buen estado general. Signos vitales normales. Se solicitan exámenes de rutina.'
}];

interface HistoryTabProps {
  patientName: string;
}
export function HistoryTab({ patientName }: HistoryTabProps) {
  const [expanded, setExpanded] = useState<number[]>([]);
  const toggle = (id: number) =>
  setExpanded((prev) =>
  prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
  );
  return (
    <div className="max-w-3xl">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700">
            Historial de Consultas — {patientName}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {MOCK_HISTORY.length} consultas registradas
          </p>
        </div>

        <div className="divide-y divide-slate-50">
          {MOCK_HISTORY.map((entry) =>
          <div key={entry.id}>
              <button
              onClick={() => toggle(entry.id)}
              className="w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50/50 transition-colors text-left">

                <div className="flex items-center gap-1.5 text-slate-400 w-24 flex-shrink-0">
                  <ClockIcon size={13} />
                  <span className="text-xs">{entry.fecha}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">
                    {entry.motivo}
                  </p>
                  <p className="text-xs text-slate-500">
                    {entry.doctor} — {entry.especialidad}
                  </p>
                </div>
                {entry.diagnosticos.length > 0 &&
              <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                    {entry.diagnosticos.length} dx
                  </span>
              }
                {expanded.includes(entry.id) ?
              <ChevronUpIcon
                size={16}
                className="text-slate-400 flex-shrink-0" /> :


              <ChevronDownIcon
                size={16}
                className="text-slate-400 flex-shrink-0" />

              }
              </button>

              {expanded.includes(entry.id) &&
            <div className="px-5 pb-5 bg-slate-50/50 space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                      Nota Evolutiva
                    </p>
                    <p className="text-sm text-slate-700">{entry.nota}</p>
                  </div>
                  {entry.diagnosticos.length > 0 &&
              <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                        Diagnósticos
                      </p>
                      <div className="space-y-1">
                        {entry.diagnosticos.map((d, i) =>
                  <p
                    key={i}
                    className="text-sm text-slate-700 flex items-center gap-2">

                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                            {d}
                          </p>
                  )}
                      </div>
                    </div>
              }
                  {entry.medicamentos.length > 0 &&
              <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                        Medicación
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {entry.medicamentos.map((m, i) =>
                  <span
                    key={i}
                    className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-md">

                            {m}
                          </span>
                  )}
                      </div>
                    </div>
              }
                  {entry.examenes.length > 0 &&
              <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                        Exámenes Solicitados
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {entry.examenes.map((e, i) =>
                  <span
                    key={i}
                    className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-md">

                            {e}
                          </span>
                  )}
                      </div>
                    </div>
              }
                </div>
            }
            </div>
          )}
        </div>
      </div>
    </div>);

}