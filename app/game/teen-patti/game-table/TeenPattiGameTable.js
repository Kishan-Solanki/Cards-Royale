"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTeenPattiGame } from "../../../hooks/useTeenPattiGame"
import { toast } from "sonner"

// Import all components
import GameHeader from "../../../../components/GameHeader"
import ErrorMessage from "../../../../components/ErrorMessage"
import InviteButton from "../../../../components/InviteButton"
import GameTable from "../../../../components/GameTable"
import ActionButtons from "../../../../components/ActionButtons"
import WinnerModal from "../../../../components/WinnerModal"
import InviteDialog from "../../../../components/InviteDialog"
import ChatDisplay from "../../../../components/ChatDisplay"

const TeenPattiGameTable = ({ userId, username, profileImageURL, isPrivate, roomIdd }) => {
  const router = useRouter()
  const [betAmount, setBetAmount] = useState(500)
  const [showBetInput, setShowBetInput] = useState(false)
  const [actionType, setActionType] = useState("")
  const [imageErrors, setImageErrors] = useState(new Set())
  const [isLeaving, setIsLeaving] = useState(false)
  const [currentBet, setCurrentBet] = useState(500)
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [friends, setFriends] = useState([])
  const [loadingFriends, setLoadingFriends] = useState(false)
  const [invitingFriends, setInvitingFriends] = useState(new Set())

  const {
    players,
    roomMoney,
    bootAmount,
    isGameOn,
    gameMoney,
    currentTurn,
    turnTimeLeft,
    gameMessage,
    winner,
    gameHands,
    loading,
    error,
    handlePlayerAction,
    handleShow,
    leaveGame,
    roomId,
    chat,
    handleSendChat,
  } = useTeenPattiGame({ userId, username, profileImageURL, isPrivate, roomIdd })

  // Calculate current bet as the maximum bet made by any player
  useEffect(() => {
    if (players && players.length > 0 && isGameOn) {
      const activePlayers = players.filter((p) => p.playing)
      if (activePlayers.length > 0) {
        let maxBet = bootAmount
        const totalBoot = activePlayers.length * bootAmount
        if (roomMoney > totalBoot) {
          const extraMoney = roomMoney - totalBoot
          maxBet = bootAmount + Math.floor(extraMoney / activePlayers.length)
        }
        const newCurrentBet = Math.min(5000, maxBet)
        setCurrentBet(newCurrentBet)
        setBetAmount(newCurrentBet)
      } else {
        setCurrentBet(bootAmount)
        setBetAmount(bootAmount)
      }
    } else {
      setCurrentBet(bootAmount)
      setBetAmount(bootAmount)
    }
  }, [players, roomMoney, bootAmount, isGameOn])

  // Fetch friends list
  const fetchFriends = async () => {
    setLoadingFriends(true)
    try {
      const response = await fetch("/api/friends/get-friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })
      const data = await response.json()
      if (data) {
        setFriends(data.friends || [])
      } else {
        toast.error("Failed to load friends")
      }
    } catch (error) {
      console.error("Error fetching friends:", error)
      toast.error("Error loading friends")
    } finally {
      setLoadingFriends(false)
    }
  }

  const handleInviteClick = () => {
    setShowInviteDialog(true)
    fetchFriends()
  }

  const handleInviteFriend = async (friendId) => {
    if (!roomId) {
      toast.error("No active room to invite to")
      return
    }

    setInvitingFriends((prev) => new Set([...prev, friendId]))

    try {
      const response = await fetch("/api/game/sendgameinvite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: friendId,
          inviterId: userId,
          roomId: roomId,
          gameType: "Teen Patti",
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Invite sent successfully!")
      } else {
        toast.error(data.message || "Failed to send invite")
      }
    } catch (error) {
      console.error("Error sending invite:", error)
      toast.error("Error sending invite")
    } finally {
      setInvitingFriends((prev) => {
        const newSet = new Set(prev)
        newSet.delete(friendId)
        return newSet
      })
    }
  }

  const handleImageError = (src) => {
    setImageErrors((prev) => new Set([...prev, src]))
  }

  const handleBetAction = (action) => {
    if (action === "blind" || action === "chaal") {
      const currentPlayer = players.find((p) => p.userId === userId)
      if (currentPlayer && currentPlayer.gameMoney < currentBet) {
        handlePlayerAction("fold")
        return
      }
      setActionType(action)
      setShowBetInput(true)
    } else {
      handlePlayerAction(action)
    }
  }

  const confirmBet = () => {
    handlePlayerAction(actionType, betAmount)
    setShowBetInput(false)
    setActionType("")
    if (betAmount > currentBet) {
      setCurrentBet(betAmount)
    }
  }

  const handleLeaveGame = async () => {
    setIsLeaving(true)
    try {
      await leaveGame()
      router.push("/dashboard")
    } catch (error) {
      console.error("Error leaving game:", error)
      setIsLeaving(false)
    }
  }

  const canAffordCurrentBet = () => {
    const currentPlayer = players.find((p) => p.userId === userId)
    return currentPlayer && currentPlayer.gameMoney >= currentBet
  }

  const getMaxBetAmount = () => {
    const currentPlayer = players.find((p) => p.userId === userId)
    const playerMoney = currentPlayer ? currentPlayer.gameMoney : 0
    return Math.min(5000, playerMoney)
  }

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin h-16 w-16 border-4 border-rose-500 border-t-transparent mx-auto rounded-full"></div>
          <div className="text-white text-xl font-bold">Loading Teen Patti...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex flex-col relative overflow-hidden">
      {/* Header */}
      <GameHeader gameMoney={gameMoney} isLeaving={isLeaving} onLeaveGame={handleLeaveGame} />

      {/* Error Message */}
      <ErrorMessage error={error} />

      {/* Invite Button */}
      <InviteButton onInviteClick={handleInviteClick} />

      {/* Winner Modal */}
      <WinnerModal
        winner={winner}
        gameHands={gameHands}
        players={players}
        imageErrors={imageErrors}
        onImageError={handleImageError}
      />

      {/* Invite Dialog */}
      <InviteDialog
        showInviteDialog={showInviteDialog}
        setShowInviteDialog={setShowInviteDialog}
        roomId={roomId}
        loadingFriends={loadingFriends}
        friends={friends}
        invitingFriends={invitingFriends}
        onInviteFriend={handleInviteFriend}
      />

      {/* Chat Component */}
      <ChatDisplay chat={chat} handleSendChat={handleSendChat} currentUsername={username} />

      {/* Main Game Table */}
      <GameTable
        players={players}
        userId={userId}
        roomMoney={roomMoney}
        bootAmount={bootAmount}
        isGameOn={isGameOn}
        gameMessage={gameMessage}
        currentBet={currentBet}
        currentTurn={currentTurn}
        turnTimeLeft={turnTimeLeft}
        winner={winner}
        gameHands={gameHands}
        imageErrors={imageErrors}
        onImageError={handleImageError}
      />

      {/* Action Buttons */}
      <ActionButtons
        isGameOn={isGameOn}
        currentTurn={currentTurn}
        userId={userId}
        showBetInput={showBetInput}
        setShowBetInput={setShowBetInput}
        actionType={actionType}
        canAffordCurrentBet={canAffordCurrentBet}
        onPlayerAction={handlePlayerAction}
        onBetAction={handleBetAction}
        onShow={handleShow}
        players={players}
        betAmount={betAmount}
        setBetAmount={setBetAmount}
        currentBet={currentBet}
        getMaxBetAmount={getMaxBetAmount}
        confirmBet={confirmBet}
      />
    </div>
  )
}

export default TeenPattiGameTable
