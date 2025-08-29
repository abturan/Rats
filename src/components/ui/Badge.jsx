import React from 'react'
export default function Badge({ children, color }) {
  return <span className={`px-2 py-0.5 text-xs rounded-full border ${color}`}>{children}</span>
}
