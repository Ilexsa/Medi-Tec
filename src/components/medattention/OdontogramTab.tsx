import React, { useState } from 'react';
import { InfoIcon } from 'lucide-react';
interface ToothCondition {
  [toothId: string]: string;
}
const CONDITIONS = [
{
  label: 'Sano',
  color: 'bg-green-100 text-green-700',
  dot: 'bg-green-500'
},
{
  label: 'Caries',
  color: 'bg-red-100 text-red-700',
  dot: 'bg-red-500'
},
{
  label: 'Extracción',
  color: 'bg-slate-200 text-slate-600',
  dot: 'bg-slate-500'
},
{
  label: 'Corona',
  color: 'bg-yellow-100 text-yellow-700',
  dot: 'bg-yellow-500'
},
{
  label: 'Implante',
  color: 'bg-blue-100 text-blue-700',
  dot: 'bg-blue-500'
},
{
  label: 'Obturación',
  color: 'bg-purple-100 text-purple-700',
  dot: 'bg-purple-500'
}];

const UPPER_TEETH = [
18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];

const LOWER_TEETH = [
48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

const conditionDot: Record<string, string> = {
  Sano: 'bg-green-500',
  Caries: 'bg-red-500',
  Extracción: 'bg-slate-500',
  Corona: 'bg-yellow-500',
  Implante: 'bg-blue-500',
  Obturación: 'bg-purple-500'
};
interface OdontogramTabProps {
  specialty: string;
}
export function OdontogramTab({ specialty }: OdontogramTabProps) {
  const [conditions, setConditions] = useState<ToothCondition>({});
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [selectedCondition, setSelectedCondition] = useState('Caries');
  const isOdontology = specialty === 'Odontología';
  const markTooth = (tooth: number) => {
    if (!isOdontology) return;
    setConditions((prev) => ({
      ...prev,
      [tooth]: selectedCondition
    }));
    setSelectedTooth(tooth);
  };
  const ToothButton = ({ tooth }: {tooth: number;}) => {
    const cond = conditions[tooth];
    const dot = cond ? conditionDot[cond] : null;
    return (
      <button
        onClick={() => markTooth(tooth)}
        disabled={!isOdontology}
        className={`relative w-9 h-9 rounded-lg border-2 text-xs font-bold transition-all
          ${selectedTooth === tooth ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'}
          ${!isOdontology ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
        `}>

        {tooth}
        {dot &&
        <span
          className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${dot} border border-white`} />

        }
      </button>);

  };
  return (
    <div className="max-w-3xl">
      {!isOdontology &&
      <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-5">
          <InfoIcon size={18} className="text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-700">
            <strong>
              Módulo disponible solo para especialidad Odontología.
            </strong>{' '}
            La consulta actual es de {specialty}.
          </p>
        </div>
      }

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-slate-700 mb-5">
          Odontograma — Notación FDI
        </h2>

        {/* Condition selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CONDITIONS.map((c) =>
          <button
            key={c.label}
            onClick={() => setSelectedCondition(c.label)}
            disabled={!isOdontology}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${selectedCondition === c.label ? 'border-blue-500 ring-1 ring-blue-500' : 'border-transparent'} ${c.color} disabled:opacity-50`}>

              <span className={`w-2 h-2 rounded-full ${c.dot}`} />
              {c.label}
            </button>
          )}
        </div>

        {/* Upper teeth */}
        <div className="mb-2">
          <p className="text-xs text-slate-400 mb-2 text-center">Superior</p>
          <div className="flex justify-center gap-1 flex-wrap">
            {UPPER_TEETH.map((t) =>
            <ToothButton key={t} tooth={t} />
            )}
          </div>
        </div>

        <div className="border-t border-dashed border-slate-200 my-4" />

        {/* Lower teeth */}
        <div>
          <div className="flex justify-center gap-1 flex-wrap">
            {LOWER_TEETH.map((t) =>
            <ToothButton key={t} tooth={t} />
            )}
          </div>
          <p className="text-xs text-slate-400 mt-2 text-center">Inferior</p>
        </div>

        {/* Summary */}
        {Object.keys(conditions).length > 0 &&
        <div className="mt-5 pt-4 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-600 mb-2">
              Hallazgos registrados:
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(conditions).map(([tooth, cond]) =>
            <span
              key={tooth}
              className="text-xs px-2 py-1 bg-slate-100 rounded-md text-slate-600">

                  Diente {tooth}: <strong>{cond}</strong>
                </span>
            )}
            </div>
          </div>
        }
      </div>
    </div>);

}