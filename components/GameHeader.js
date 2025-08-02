"use client"

import { LogOut } from "lucide-react"

const GameHeader = ({ gameMoney, isLeaving, onLeaveGame }) => {
  return (
    <div className="flex justify-between items-center relative z-30 flex-shrink-0 p-3 md:p-4">
      <div>
        <h1 className="font-black bg-gradient-to-r from-rose-400 to-emerald-400 bg-clip-text text-transparent text-xl">
          Teen Patti
        </h1>
      </div>
      <div className="flex items-center space-x-3">
        <div className="text-right">
          <div className="text-emerald-400 font-black text-lg">₹{gameMoney.toLocaleString()}</div>
          <div className="text-slate-400 text-xs">Your Balance</div>
        </div>
        <button
          onClick={onLeaveGame}
          disabled={isLeaving}
          className={`bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold rounded-lg flex items-center space-x-2 transition-all duration-300 px-3 py-2 text-sm md:px-4 md:py-3 md:text-base ${
            isLeaving ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <LogOut size={14} />
          <span>{isLeaving ? "Leaving..." : "Leave"}</span>
        </button>
      </div>
    </div>
  )
}

export default GameHeader
