import React, { useState } from 'react';
import { SaveIcon, HeartIcon } from 'lucide-react';
interface Vitals {
  sistolica: string;
  diastolica: string;
  frecuenciaCardiaca: string;
  temperatura: string;
  peso: string;
  talla: string;
  saturacionO2: string;
  frecuenciaRespiratoria: string;
}
export function VitalsTab() {
  const [vitals, setVitals] = useState<Vitals>({
    sistolica: '',
    diastolica: '',
    frecuenciaCardiaca: '',
    temperatura: '',
    peso: '',
    talla: '',
    saturacionO2: '',
    frecuenciaRespiratoria: ''
  });
  const [saved, setSaved] = useState(false);
  const imc =
  vitals.peso && vitals.talla ?
  (
  parseFloat(vitals.peso) / Math.pow(parseFloat(vitals.talla) / 100, 2)).
  toFixed(1) :
  '—';
  const imcCategory = () => {
    const v = parseFloat(imc);
    if (isNaN(v)) return '';
    if (v < 18.5) return 'Bajo peso';
    if (v < 25) return 'Normal';
    if (v < 30) return 'Sobrepeso';
    return 'Obesidad';
  };
  const set = (key: keyof Vitals, val: string) => {
    setVitals((p) => ({
      ...p,
      [key]: val
    }));
    setSaved(false);
  };
  const inp = (
  key: keyof Vitals,
  label: string,
  unit: string,
  placeholder = '') =>

  <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
        type="number"
        value={vitals[key]}
        onChange={(e) => set(key, e.target.value)}
        placeholder={placeholder}
        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12" />

        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
          {unit}
        </span>
      </div>
    </div>;

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-slate-700 mb-5 flex items-center gap-2">
          <HeartIcon size={16} className="text-red-500" />
          Signos Vitales
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Presión Arterial
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={vitals.sistolica}
                onChange={(e) => set('sistolica', e.target.value)}
                placeholder="120"
                className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

              <span className="text-slate-400 text-sm">/</span>
              <input
                type="number"
                value={vitals.diastolica}
                onChange={(e) => set('diastolica', e.target.value)}
                placeholder="80"
                className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

              <span className="text-xs text-slate-400">mmHg</span>
            </div>
          </div>
          {inp('frecuenciaCardiaca', 'Frecuencia Cardíaca', 'lpm', '72')}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {inp('temperatura', 'Temperatura', '°C', '36.5')}
          {inp('saturacionO2', 'Saturación O₂', '%', '98')}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          {inp('peso', 'Peso', 'kg', '70')}
          {inp('talla', 'Talla', 'cm', '170')}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              IMC (auto)
            </label>
            <div className="border border-slate-100 bg-slate-50 rounded-lg px-3 py-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-800">
                {imc}
              </span>
              {imcCategory() &&
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${imcCategory() === 'Normal' ? 'bg-green-100 text-green-700' : imcCategory() === 'Sobrepeso' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-600'}`}>

                  {imcCategory()}
                </span>
              }
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {inp(
            'frecuenciaRespiratoria',
            'Frecuencia Respiratoria',
            'rpm',
            '16'
          )}
        </div>

        <button
          onClick={() => setSaved(true)}
          className="flex items-center gap-2 px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-medium transition-colors">

          <SaveIcon size={15} />
          {saved ? '✓ Guardado' : 'Guardar Signos Vitales'}
        </button>
      </div>
    </div>);

}