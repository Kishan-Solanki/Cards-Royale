"use client"

import { Eye, Shuffle, DollarSign, X, Trophy, Zap, AlertTriangle, Plus, Minus, Check } from "lucide-react"

const ActionButtons = ({
  isGameOn,
  currentTurn,
  userId,
  showBetInput,
  setShowBetInput,
  actionType,
  canAffordCurrentBet,
  onPlayerAction,
  onBetAction,
  onShow,
  players,
  betAmount,
  setBetAmount,
  currentBet,
  getMaxBetAmount,
  confirmBet,
}) => {
  if (!isGameOn || currentTurn !== userId) return null

  return (
    <div className="absolute left-1/2 transform -translate-x-1/2 z-40 flex-shrink-0 bottom-4">
      <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm border-2 border-rose-400 rounded-xl shadow-2xl p-3">
        <div className="space-y-3">
          <div className="text-white font-bold text-center flex items-center justify-center space-x-2 text-sm">
            <Zap size={14} className="text-rose-400" />
            <span>Your Turn</span>
          </div>

          {!showBetInput ? (
            <div className="space-y-2">
              {!canAffordCurrentBet() && (
                <div className="bg-red-900/50 border border-red-500 p-1 text-center rounded">
                  <div className="text-red-200 flex items-center justify-center space-x-1 text-xs">
                    <AlertTriangle size={8} />
                    <span>Insufficient funds</span>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => onPlayerAction("see")}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center space-x-1 transition-all duration-300 px-3 py-2 text-xs"
                >
                  <Eye size={12} />
                  <span>See</span>
                </button>
                <button
                  onClick={() => onBetAction("blind")}
                  disabled={!canAffordCurrentBet()}
                  className={`bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg flex items-center space-x-1 transition-all duration-300 px-3 py-2 text-xs ${
                    !canAffordCurrentBet() ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <Shuffle size={12} />
                  <span>Blind</span>
                </button>
                <button
                  onClick={() => onBetAction("chaal")}
                  disabled={!canAffordCurrentBet()}
                  className={`bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center space-x-1 transition-all duration-300 px-3 py-2 text-xs ${
                    !canAffordCurrentBet() ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <DollarSign size={12} />
                  <span>Chaal</span>
                </button>
                <button
                  onClick={() => onPlayerAction("fold")}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg flex items-center space-x-1 transition-all duration-300 px-3 py-2 text-xs"
                >
                  <X size={12} />
                  <span>Fold</span>
                </button>
                {players.filter((p) => p.playing).length === 2 && (
                  <button
                    onClick={onShow}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-lg flex items-center space-x-1 transition-all duration-300 px-3 py-2 text-xs"
                  >
                    <Trophy size={12} />
                    <span>Show</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-white font-bold text-center text-xs">Choose bet for {actionType}:</div>
              <div className="space-y-2">
                <button
                  onClick={() => setBetAmount(currentBet)}
                  className={`w-full font-bold rounded-lg transition-all duration-300 px-3 py-2 text-xs ${
                    betAmount === currentBet
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  Call: ₹{currentBet.toLocaleString()}
                </button>

                <div className="space-y-1">
                  <div className="text-white text-xs">Adjust:</div>
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => {
                        const newAmount = Math.max(currentBet, betAmount - 100)
                        setBetAmount(newAmount)
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold rounded flex items-center justify-center transition-all duration-300 w-8 h-8"
                      disabled={betAmount <= currentBet}
                    >
                      <Minus size={12} />
                    </button>
                    <div className="text-center">
                      <div className="font-bold text-emerald-400 text-sm">₹{betAmount.toLocaleString()}</div>
                    </div>
                    <button
                      onClick={() => {
                        const newAmount = Math.min(getMaxBetAmount(), betAmount + 100)
                        setBetAmount(newAmount)
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded flex items-center justify-center transition-all duration-300 w-8 h-8"
                      disabled={betAmount >= getMaxBetAmount()}
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <div className="flex justify-between text-slate-400 text-xs">
                    <span>Min: ₹{currentBet.toLocaleString()}</span>
                    <span>Max: ₹{getMaxBetAmount().toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={confirmBet}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center justify-center space-x-1 transition-all duration-300 px-3 py-2 text-xs"
                  >
                    <Check size={12} />
                    <span>Confirm</span>
                  </button>
                  <button
                    onClick={() => setShowBetInput(false)}
                    className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-bold rounded-lg flex items-center justify-center space-x-1 transition-all duration-300 px-3 py-2 text-xs"
                  >
                    <X size={12} />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ActionButtons
