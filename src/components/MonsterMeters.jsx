import React from 'react'
export default function MonsterMeters({ kcc }){
  const Bar = ({ label, value, max=10 }) => (
    <div className="mb-2">
      <div className="flex justify-between text-[11px] text-zinc-400"><span>{label}</span><span>{value}/{max}</span></div>
      <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-600" style={{ width: `${Math.min(100, (value/max)*100)}%` }} />
      </div>
    </div>
  )
  return (
    <div>
      <Bar label="Tehdit" value={kcc.threat} />
      <Bar label="Minyon" value={kcc.minions} max={8} />
      <div className="grid grid-cols-2 gap-2 mt-2">
        <Bar label="Biyolojik" value={kcc.feeding.bio} max={3} />
        <Bar label="Teknolojik" value={kcc.feeding.tech} max={3} />
        <Bar label="Kimyasal" value={kcc.feeding.chem} max={3} />
        <Bar label="Ezoterik" value={kcc.feeding.occult} max={3} />
      </div>
    </div>
  )
}
