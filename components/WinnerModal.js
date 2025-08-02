"use client"

import { Trophy, Crown, Star, Sparkles } from "lucide-react"
import CardComponent from "./CardComponent"

const WinnerModal = ({ winner, gameHands, players, imageErrors, onImageError }) => {
  if (!winner) return null

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 backdrop-blur-xl p-4">
      <div className="relative w-full max-h-[90vh] max-w-5xl">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-emerald-400/20 to-blue-400/20 animate-pulse"></div>
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            >
              {i % 4 === 0 ? (
                <Sparkles size={8 + Math.random() * 6} className="text-yellow-400" />
              ) : i % 4 === 1 ? (
                <Star size={6 + Math.random() * 4} className="text-rose-400" />
              ) : i % 4 === 2 ? (
                <Trophy size={6 + Math.random() * 4} className="text-emerald-400" />
              ) : (
                <Crown size={8 + Math.random() * 6} className="text-yellow-300" />
              )}
            </div>
          ))}
        </div>

        {/* Main winner content */}
        <div className="relative bg-gradient-to-br from-emerald-900/98 via-teal-800/98 to-cyan-700/98 border-4 border-yellow-400 rounded-3xl shadow-2xl backdrop-blur-sm p-6">
          {/* Winner announcement */}
          <div className="text-center mb-4 space-y-4">
            <div className="animate-bounce">
              <Trophy size={60} className="mx-auto text-yellow-400 drop-shadow-2xl animate-pulse" />
            </div>

            <div className="space-y-3">
              <div className="font-black bg-gradient-to-r from-yellow-400 via-yellow-300 to-amber-300 bg-clip-text text-transparent drop-shadow-2xl animate-pulse text-4xl">
                🎉 {winner.winnerUsername} 🎉
              </div>
              <div className="text-emerald-100 font-bold text-2xl">WINS THE GAME!</div>

              <div className="flex justify-center items-center space-x-4 flex-wrap">
                <div className="bg-gradient-to-r from-green-600/80 to-emerald-600/80 border-2 border-green-400 rounded-xl shadow-xl px-6 py-3">
                  <div className="text-green-100 font-black text-xl">Won ₹{winner.winnings?.toLocaleString()}</div>
                </div>
                {winner.handType && (
                  <div className="bg-gradient-to-r from-yellow-600/80 to-amber-600/80 border-2 border-yellow-400 rounded-xl shadow-xl px-6 py-3">
                    <div className="text-yellow-100 font-black flex items-center space-x-2 text-lg">
                      <Crown size={20} className="text-yellow-300" />
                      <span>{winner.handType}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Winner's Hand Display */}
          {gameHands && gameHands[winner.winnerUserId] && gameHands[winner.winnerUserId].length > 0 && (
            <div className="text-center mb-4">
              <div className="font-black text-yellow-300 flex items-center justify-center space-x-2 text-lg mb-3">
                <Trophy size={16} className="animate-bounce" />
                <span>WINNING HAND</span>
                <Trophy size={16} className="animate-bounce" />
              </div>
              <div className="flex justify-center mb-4 space-x-2">
                {gameHands[winner.winnerUserId].map((card, index) => (
                  <CardComponent
                    key={index}
                    card={card}
                    isVisible={true}
                    size="winner"
                    imageErrors={imageErrors}
                    onImageError={onImageError}
                  />
                ))}
              </div>
            </div>
          )}

          {/* All Players' Final Hands */}
          <div className="border-t-2 border-yellow-400/30 pt-4">
            <div className="font-black text-center text-emerald-100 flex items-center justify-center space-x-2 text-xl mb-4">
              <Sparkles size={18} className="animate-pulse" />
              <span>FINAL HANDS</span>
              <Sparkles size={18} className="animate-pulse" />
            </div>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
              {players.map((player) => {
                const hand = gameHands && gameHands[player.userId]
                const isWinnerPlayer = winner && player.userId === winner.winnerUserId
                return (
                  <div
                    key={player.userId}
                    className={`p-2 rounded-xl border-2 transition-all duration-500 ${
                      isWinnerPlayer
                        ? "bg-gradient-to-br from-yellow-500/40 to-amber-500/40 border-yellow-300 shadow-lg shadow-yellow-400/50"
                        : "bg-gradient-to-br from-slate-700/60 to-gray-700/60 border-slate-400"
                    }`}
                    style={{ overflow: "visible", minHeight: "100px" }}
                  >
                    <div className="text-center mb-2">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        {isWinnerPlayer && <Crown size={10} className="text-yellow-400" />}
                        <div
                          className={`font-bold truncate text-xs ${
                            isWinnerPlayer ? "text-yellow-100" : "text-slate-200"
                          }`}
                        >
                          {player?.username}
                        </div>
                        {isWinnerPlayer && <Crown size={10} className="text-yellow-400" />}
                      </div>
                      {isWinnerPlayer && (
                        <div className="text-yellow-300 bg-yellow-600/30 px-2 py-1 rounded-full text-xs">WINNER</div>
                      )}
                    </div>
                    <div className="flex justify-center space-x-1" style={{ overflow: "visible" }}>
                      {[0, 1, 2].map((i) => (
                        <CardComponent
                          key={i}
                          card={hand && hand[i] ? hand[i] : "?"}
                          isVisible={winner && (isWinnerPlayer || (hand && hand[i] && hand[i] !== "?"))}
                          size="small"
                          imageErrors={imageErrors}
                          onImageError={onImageError}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-8px) rotate(120deg); }
            66% { transform: translateY(4px) rotate(240deg); }
          }
          
          .animate-float {
            animation: float 4s ease-in-out infinite;
          }
        `}</style>
      </div>
    </div>
  )
}

export default WinnerModal
