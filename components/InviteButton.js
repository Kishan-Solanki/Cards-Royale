
"use client"

import { UserPlus } from "lucide-react"

const InviteButton = ({ onInviteClick }) => {
  return (
    <button
      onClick={onInviteClick}
      className="absolute z-40 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl flex items-center space-x-2 transition-all duration-300 shadow-lg bottom-4 left-4 px-4 py-3"
    >
      <UserPlus size={16} />
      <span>Invite Friends</span>
    </button>
  )
}

export default InviteButton
