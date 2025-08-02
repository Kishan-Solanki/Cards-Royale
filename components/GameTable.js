"use client"

import { Coins, Gamepad2, DollarSign } from "lucide-react"
import PlayerCard from "./PlayerCard"

const GameTable = ({
  players,
  userId,
  roomMoney,
  bootAmount,
  isGameOn,
  gameMessage,
  currentBet,
  currentTurn,
  turnTimeLeft,
  winner,
  gameHands,
  imageErrors,
  onImageError,
}) => {
  const getOvalPosition = (index, total) => {
    const isMobile = window.innerWidth <= 768
    const positions = {
      2: [
        { x: isMobile ? -180 : -350, y: 0 },
        { x: isMobile ? 180 : 350, y: 0 },
      ],
      3: [
        { x: 0, y: isMobile ? -180 : -250 },
        { x: isMobile ? -180 : -350, y: isMobile ? 120 : 150 },
        { x: isMobile ? 180 : 350, y: isMobile ? 120 : 150 },
      ],
      4: [
        { x: 0, y: isMobile ? -180 : -250 },
        { x: isMobile ? 220 : 400, y: 0 },
        { x: isMobile ? -220 : -400, y: 0 },
        { x: 0, y: isMobile ? 180 : 250 },
      ],
      5: [
        { x: 0, y: isMobile ? -180 : -250 },
        { x: isMobile ? -180 : -350, y: isMobile ? -100 : -150 },
        { x: isMobile ? 180 : 350, y: isMobile ? -100 : -150 },
        { x: isMobile ? 220 : 400, y: isMobile ? 80 : 100 },
        { x: isMobile ? -220 : -400, y: isMobile ? 80 : 100 },
      ],
      6: [
        { x: isMobile ? -180 : -350, y: isMobile ? -100 : -150 },
        { x: isMobile ? 180 : 350, y: isMobile ? -100 : -150 },
        { x: isMobile ? 220 : 400, y: isMobile ? 80 : 100 },
        { x: isMobile ? 180 : 350, y: isMobile ? 180 : 250 },
        { x: isMobile ? -180 : -350, y: isMobile ? 180 : 250 },
        { x: isMobile ? -220 : -400, y: isMobile ? 80 : 100 },
      ],
    }

    const defaultPositions = positions[total] || positions[6]
    return defaultPositions[index] || { x: 0, y: 0 }
  }

  return (
    <div className="flex-1 flex items-center justify-center relative z-10 min-h-0">
      <div className="table-area relative">
        {/* Players positioned around the table */}
        {players.map((player, index) => {
          const { x, y } = getOvalPosition(index, players.length)
          return (
            <PlayerCard
              key={`${player.userId}-${index}`}
              player={player}
              position={{ x, y }}
              isCurrentPlayer={player.userId === userId}
              isCurrentTurn={isGameOn && currentTurn === player.userId && player.playing}
              turnTimeLeft={turnTimeLeft}
              winner={winner}
              gameHands={gameHands}
              imageErrors={imageErrors}
              onImageError={onImageError}
            />
          )
        })}

        {/* Center Pot and Bet */}
        <div
          className="absolute z-30 flex flex-col items-center justify-center"
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm border-2 border-emerald-400 rounded-xl text-center shadow-2xl p-5">
            <div className="space-y-1">
              <div className="text-emerald-300 font-bold flex items-center justify-center space-x-1 text-sm">
                <Coins size={16} />
                <span>POT</span>
              </div>
              <div className="font-black text-emerald-400 text-2xl">₹{roomMoney.toLocaleString()}</div>
              <div className="text-slate-300 text-xs">Boot: ₹{bootAmount}</div>
              <div
                className={`flex items-center justify-center space-x-1 px-2 py-1 font-bold rounded-full text-xs ${
                  isGameOn ? "bg-emerald-600/50 text-emerald-200" : "bg-rose-600/50 text-rose-200"
                }`}
              >
                <Gamepad2 size={8} />
                <span>{isGameOn ? "Running" : "Waiting"}</span>
              </div>
              {gameMessage && (
                <div className="bg-yellow-900/50 border border-yellow-400 p-1 rounded text-yellow-200 font-bold text-xs">
                  {gameMessage}
                </div>
              )}
            </div>
          </div>
          {/* Current Bet */}
          {isGameOn && (
            <div className="bg-gradient-to-br from-rose-800/95 to-rose-900/95 backdrop-blur-sm border-2 border-rose-400 rounded-xl text-center shadow-2xl mt-3 p-2">
              <div className="space-y-1">
                <div className="text-rose-200 font-bold flex items-center justify-center space-x-1 text-sm">
                  <DollarSign size={12} />
                  <span>BET</span>
                </div>
                <div className="font-black text-rose-300 text-lg">₹{currentBet.toLocaleString()}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .table-area {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 50px;
          background: radial-gradient(ellipse at 50% 50%, rgba(40,40,50,0.7) 70%, transparent 100%);
        }
        
        @media (min-width: 769px) {
          .table-area {
            width: 1400px;
            height: 900px;
            border-radius: 200px;
          }
        }
      `}</style>
    </div>
  )
}

export default GameTable
