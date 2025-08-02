"use client"

import { Eye, Shuffle, Clock, Timer } from "lucide-react"
import Image from "next/image"
import CardComponent from "./CardComponent"

const PlayerCard = ({
  player,
  position,
  isCurrentPlayer,
  isCurrentTurn,
  turnTimeLeft,
  winner,
  gameHands,
  imageErrors,
  onImageError,
}) => {
  const isMobile = window.innerWidth <= 768
  const isPlaying = player.playing

  const getTimerProgress = (timeLeft) => {
    const totalTime = 60
    const progress = (timeLeft / totalTime) * 100
    return Math.max(0, Math.min(100, progress))
  }

  const getTimerColor = (progress) => {
    if (progress > 66) return "#10b981"
    if (progress > 33) return "#f59e0b"
    return "#ef4444"
  }

  const timerProgress = isCurrentTurn ? getTimerProgress(turnTimeLeft) : 0
  const timerColor = getTimerColor(timerProgress)

  return (
    <div
      style={{
        position: "absolute",
        left: `calc(50% + ${position.x}px)`,
        top: `calc(50% + ${position.y}px)`,
        transform: "translate(-50%, -50%)",
        zIndex: 20,
      }}
    >
      <div className={`player-container flex items-center ${isMobile ? "gap-2" : "gap-4"}`}>
        {/* Player Info */}
        <div
          className={`player-info bg-gradient-to-br from-slate-800/95 to-slate-900/95 ${
            isMobile ? "p-2" : "p-4"
          } rounded-xl border-2 flex flex-col items-center transition-all duration-500 ${
            isCurrentPlayer
              ? "border-emerald-400 shadow-lg shadow-emerald-400/30"
              : isCurrentTurn
                ? "border-yellow-400 shadow-lg shadow-yellow-400/30"
                : "border-slate-600"
          }`}
          style={{
            minWidth: isMobile ? "100px" : "140px",
            maxWidth: isMobile ? "120px" : "160px",
          }}
        >
          {/* Profile Image */}
          <Image
            src={player.profileImageURL || "/placeholder.svg"}
            alt={player.username}
            width={isMobile ? 36 : 48}
            height={isMobile ? 36 : 48}
            className={`rounded-full ${isMobile ? "mb-1" : "mb-2"} border-2 object-cover ${
              isCurrentPlayer ? "border-emerald-400" : isCurrentTurn ? "border-yellow-400" : "border-slate-500"
            }`}
            priority={isCurrentPlayer}
          />

          {/* Player Name */}
          <span className={`text-white font-semibold ${isMobile ? "text-xs" : "text-sm"} text-center truncate w-full`}>
            {isMobile && player.username.length > 10 ? player.username.substring(0, 10) + "..." : player.username}
          </span>

          {/* Money */}
          <span className={`text-emerald-400 font-bold ${isMobile ? "text-xs" : "text-sm"}`}>
            ₹{player.gameMoney.toLocaleString()}
          </span>

          {/* Status and Timer */}
          <div className={`flex flex-col items-center gap-1 ${isMobile ? "mt-1" : "mt-2"}`}>
            {/* Status Button */}
            <button
              className={`${isMobile ? "px-2 py-1 text-xs" : "px-4 py-1 text-sm"} rounded-full font-semibold flex items-center gap-1 ${
                isPlaying
                  ? player.seen
                    ? "bg-blue-600 text-white"
                    : "bg-purple-600 text-white"
                  : "bg-gray-600 text-gray-200"
              }`}
            >
              {isPlaying ? (
                player.seen ? (
                  <>
                    <Eye size={isMobile ? 10 : 12} />
                    <span>Seen</span>
                  </>
                ) : (
                  <>
                    <Shuffle size={isMobile ? 10 : 12} />
                    <span>Blind</span>
                  </>
                )
              ) : (
                <>
                  <Clock size={isMobile ? 10 : 12} />
                  <span>Wait</span>
                </>
              )}
            </button>

            {/* Timer */}
            {isCurrentTurn && turnTimeLeft > 0 && (
              <button
                className={`${isMobile ? "px-2 py-1 text-xs" : "px-3 py-1 text-sm"} rounded-full text-white font-bold flex items-center gap-1`}
                style={{ backgroundColor: timerColor }}
              >
                <Timer size={isMobile ? 10 : 12} />
                <span>{turnTimeLeft}s</span>
              </button>
            )}
          </div>
        </div>

        {/* Cards */}
        <div className={`player-cards flex ${isMobile ? "gap-1" : "gap-2"}`}>
          {[0, 1, 2].map((i) => {
            const card = player.hand && player.hand[i] ? player.hand[i] : "?"
            const isVisible = isCurrentPlayer || (winner && gameHands && gameHands[player.userId])
            const size = isCurrentTurn ? "large" : "normal"

            return (
              <CardComponent
                key={i}
                card={card}
                isVisible={isVisible}
                size={size}
                imageErrors={imageErrors}
                onImageError={onImageError}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default PlayerCard
