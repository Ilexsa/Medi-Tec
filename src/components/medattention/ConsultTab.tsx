import React, { useState } from 'react';
import { SaveIcon, PlusIcon, XIcon, SearchIcon } from 'lucide-react';
interface Diagnosis {
  code: string;
  description: string;
  type: 'Principal' | 'Secundario';
}
const CIE10_MOCK = [
{
  code: 'J00',
  description: 'Rinofaringitis aguda (resfriado común)'
},
{
  code: 'J06.9',
  description: 'Infección aguda de las vías respiratorias superiores'
},
{
  code: 'K29.7',
  description: 'Gastritis, no especificada'
},
{
  code: 'M54.5',
  description: 'Lumbago no especificado'
},
{
  code: 'R51',
  description: 'Cefalea'
},
{
  code: 'I10',
  description: 'Hipertensión esencial (primaria)'
},
{
  code: 'E11.9',
  description: 'Diabetes mellitus tipo 2 sin complicaciones'
},
{
  code: 'J18.9',
  description: 'Neumonía, no especificada'
},
{
  code: 'A09',
  description: 'Diarrea y gastroenteritis de presunto origen infeccioso'
},
{
  code: 'N39.0',
  description: 'Infección de vías urinarias, sitio no especificado'
}];

export function ConsultTab() {
  const [motivo, setMotivo] = useState('');
  const [nota, setNota] = useState('');
  const [examenFisico, setExamenFisico] = useState('');
  const [recomendaciones, setRecomendaciones] = useState('');
  const [diagSearch, setDiagSearch] = useState('');
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [saved, setSaved] = useState(false);
  const filteredCIE = CIE10_MOCK.filter(
    (d) =>
    d.code.toLowerCase().includes(diagSearch.toLowerCase()) ||
    d.description.toLowerCase().includes(diagSearch.toLowerCase())
  ).slice(0, 6);
  const addDiagnosis = (item: (typeof CIE10_MOCK)[0]) => {
    if (diagnoses.length >= 3) return;
    if (diagnoses.find((d) => d.code === item.code)) return;
    const type: Diagnosis['type'] =
    diagnoses.length === 0 ? 'Principal' : 'Secundario';
    setDiagnoses((prev) => [
    ...prev,
    {
      code: item.code,
      description: item.description,
      type
    }]
    );
    setDiagSearch('');
  };
  const removeDiagnosis = (code: string) =>
  setDiagnoses((prev) => prev.filter((d) => d.code !== code));
  const ta = (
  label: string,
  value: string,
  onChange: (v: string) => void,
  rows = 3) =>

  <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">
        {label}
      </label>
      <textarea
      value={value}
      onChange={(e) => {
        onChange(e.target.value);
        setSaved(false);
      }}
      rows={rows}
      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />

    </div>;

  return (
    <div className="max-w-3xl space-y-5">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h2 className="text-sm font-semibold text-slate-700">
          Datos de la Consulta
        </h2>
        {ta('Motivo de Consulta', motivo, setMotivo, 2)}
        {ta('Nota Evolutiva / Anamnesis', nota, setNota, 4)}
        {ta('Examen Físico', examenFisico, setExamenFisico, 3)}
        {ta('Recomendaciones', recomendaciones, setRecomendaciones, 2)}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-700">
            Diagnósticos CIE-10
          </h2>
          <span className="text-xs text-slate-400">
            {diagnoses.length}/3 diagnósticos
          </span>
        </div>

        {/* Added diagnoses */}
        {diagnoses.length > 0 &&
        <div className="space-y-2 mb-4">
            {diagnoses.map((d) =>
          <div
            key={d.code}
            className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">

                <span className="text-xs font-mono font-bold text-blue-700 w-14">
                  {d.code}
                </span>
                <span className="flex-1 text-sm text-slate-700">
                  {d.description}
                </span>
                <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${d.type === 'Principal' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>

                  {d.type}
                </span>
                <button
              onClick={() => removeDiagnosis(d.code)}
              className="text-slate-400 hover:text-red-500 transition-colors">

                  <XIcon size={14} />
                </button>
              </div>
          )}
          </div>
        }

        {/* CIE10 search */}
        {diagnoses.length < 3 &&
        <div>
            <div className="relative mb-2">
              <SearchIcon
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
              type="text"
              placeholder="Buscar por código o descripción CIE-10..."
              value={diagSearch}
              onChange={(e) => setDiagSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

            </div>
            {diagSearch &&
          <div className="border border-slate-200 rounded-lg overflow-hidden">
                {filteredCIE.length === 0 ?
            <p className="px-4 py-3 text-sm text-slate-400">
                    Sin resultados
                  </p> :

            filteredCIE.map((item) =>
            <button
              key={item.code}
              onClick={() => addDiagnosis(item)}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors text-left border-b border-slate-50 last:border-0">

                      <span className="text-xs font-mono font-bold text-blue-600 w-14">
                        {item.code}
                      </span>
                      <span className="text-sm text-slate-700">
                        {item.description}
                      </span>
                      <PlusIcon size={14} className="ml-auto text-slate-400" />
                    </button>
            )
            }
              </div>
          }
          </div>
        }
      </div>

      <button
        onClick={() => setSaved(true)}
        className="flex items-center gap-2 px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-medium transition-colors">

        <SaveIcon size={15} />
        {saved ? '✓ Guardado' : 'Guardar Consulta'}
      </button>
    </div>);

}