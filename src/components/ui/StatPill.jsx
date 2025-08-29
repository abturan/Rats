import React from 'react'
export default function StatPill({ label, value }) {
  return <div className="text-xs px-2 py-1 rounded-full bg-white/10 border border-white/10">{label}: <b>{value}</b></div>
}
