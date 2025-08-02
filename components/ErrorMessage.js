"use client"

import { AlertTriangle } from "lucide-react"

const ErrorMessage = ({ error }) => {
  if (!error) return null

  return (
    <div className="absolute right-4 bg-red-900/90 border border-red-500 p-2 rounded-lg z-50 top-16">
      <div className="flex items-center space-x-2">
        <AlertTriangle size={14} className="text-red-400" />
        <span className="text-red-200 text-xs">{error}</span>
      </div>
    </div>
  )
}

export default ErrorMessage
