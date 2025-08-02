"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { io } from "socket.io-client"
import { config } from "../../lib/teenpatticonfig"
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useTeenPattiGame = ({ userId, username, profileImageURL, isPrivate, roomIdd }) => {
  const router = useRouter();
  const [socket, setSocket] = useState(null)
  const [gameState, setGameState] = useState({
    roomId: null,
    players: [],
    roomMoney: 0,
    bootAmount: config.game.bootAmount,
    isGameOn: false,
    gameMoney: 0,
    currentTurn: null,
    turnTimeLeft: 0,
    gameMessage: "",
    winner: null,
    gameHands: {},
    loading: true,
    error: "",
    connected: false,
    chat: [],
  })

  const turnTimerRef = useRef(null)
  const socketRef = useRef(null)


  const updateGameState = useCallback((updates) => {
    setGameState((prev) => ({ ...prev, ...updates }))
  }, [])

  const fetchGameMoney = useCallback(async () => {
    try {
      const response = await fetch(`${config.siteUrl}${config.api.getGameMoney}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })
      const data = await response.json()
      if (data.success) {
        updateGameState({ gameMoney: data.gameMoney })
      } else {
        updateGameState({ error: "Failed to fetch game money" })
      }
    } catch (err) {
      updateGameState({ error: "Error fetching game money" })
      console.error("Fetch game money error:", err)
    } finally {
      updateGameState({ loading: false })
    }
  }, [userId, updateGameState])

  const updateGameMoney = useCallback(
    async (newAmount) => {
      try {
        const response = await fetch(
          `${config.siteUrl}${config.api.updateGameMoney}`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, gameMoney: newAmount }),
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (response.status === 401 || data?.forceLogout || data?.message === 'Unauthorized') {
          console.warn("User session expired or unauthorized");
          router.push("/api/users/force-logout");
          return;
        }

        if (!response.ok || !data.success) {
          console.error("Failed to update game money:", data?.message || "Unknown error");
          return;
        }

        updateGameState({ gameMoney: data.gameMoney });
      } catch (err) {
        console.error("Network or unexpected error:", err);
        router.push("/api/users/force-logout");
      }
    },
    [userId, updateGameState, router]
  );

  const handlePlayerAction = useCallback(
    (action, amount = 0) => {
      if (!socket || !gameState.roomId) return

      socket.emit("player-action", {
        roomId: gameState.roomId,
        userId,
        action,
        amount,
      })
    },
    [socket, gameState.roomId, userId],
  )

  const handleShow = useCallback(() => {
    if (!socket || !gameState.roomId) return
    socket.emit("request-show", { roomId: gameState.roomId, userId })
  }, [socket, gameState.roomId, userId])

  const handleSendChat = useCallback((message) => {
    if (!socket || !gameState.roomId || !message.trim()) return

    socket.emit("send-chat", {
      roomId: gameState.roomId,
      username,
      profileImageURL,
      content: message.trim()
    })
  }, [socket, gameState.roomId, username, profileImageURL])

  const leaveGame = useCallback(() => {
    if (!socket || !gameState.roomId) return
    socket.emit("leave-game", { userId, roomId: gameState.roomId })

  }, [socket, gameState.roomId, userId])

  // Initialize socket and fetch initial data
  useEffect(() => {
    if (userId) {
      fetchGameMoney()
    }
  }, [userId, fetchGameMoney])

  //Socket connection
  useEffect(() => {
    if (!userId || gameState.loading) return

    console.log("Connecting to game server:", config.gameServerUrl)

    const newSocket = io(config.gameServerUrl, {
      transports: ["websocket", "polling"],
      upgrade: true,
      timeout: 20000,
    })

    setSocket(newSocket)
    socketRef.current = newSocket

    // Connection event handlers
    newSocket.on("connect", () => {
      console.log("Connected to game server")
      updateGameState({ connected: true, error: "" })
    })

    newSocket.on("disconnect", () => {
      console.log("Disconnected from game server")
      updateGameState({ connected: false })
    })

    newSocket.on("connect_error", (error) => {
      console.error("Connection error:", error)
      updateGameState({
        connected: false,
        error: "Failed to connect to game server",
      })
    })

    // Game event handlers
    const handleJoinedRoom = (data) => {
      console.log("Joined room:", data.roomId)
      updateGameState({
        roomId: data.roomId,
        gameMessage: `Joined room ${data.roomId}`,
      })
    }

    const handleRoomUpdate = (data) => {
      updateGameState({
        players: data.players,
        roomMoney: data.roomMoney,
        bootAmount: data.bootAmount,
        isGameOn: data.isGameOn,
        chat: data.chat || [],
      })

      const currentPlayer = data.players.find((p) => p.userId === userId)
      if (currentPlayer && currentPlayer.gameMoney !== gameState.gameMoney) {
        updateGameMoney(currentPlayer.gameMoney)
      }

      const turnPlayer = data.players.find((p) => p.turn)
      updateGameState({ currentTurn: turnPlayer?.userId || null })
    }

    const handleGameStarted = () => {
      updateGameState({
        gameMessage: "Game started!",
        winner: null,
        gameHands: {},
      })
    }

    const handleTurnStarted = (data) => {
      const timeLeft = Math.ceil((data.turnStartTime + data.duration - Date.now()) / 1000)
      updateGameState({
        currentTurn: data.userId,
        turnTimeLeft: timeLeft,
      })

      if (turnTimerRef.current) clearInterval(turnTimerRef.current)

      turnTimerRef.current = setInterval(() => {
        setGameState((prev) => {
          const newTimeLeft = prev.turnTimeLeft - 1
          if (newTimeLeft <= 0) {
            clearInterval(turnTimerRef.current)
            return { ...prev, turnTimeLeft: 0 }
          }
          return { ...prev, turnTimeLeft: newTimeLeft }
        })
      }, 1000)
    }

    const handlePlayerFolded = (data) => {
      const player = gameState.players.find((p) => p.userId === data.userId)
      const message = data.isAuto ? "Auto-folded due to timeout" : "Folded"
      updateGameState({ gameMessage: `${player?.username || "Player"} ${message}` })
    }

    const handleGameEnded = (data) => {
      updateGameState({
        winner: data,
        gameHands: data.hands,
        gameMessage: `${data.winnerUsername} won ₹${data.winnings}!`,
        turnTimeLeft: 0,
      })
      if (turnTimerRef.current) clearInterval(turnTimerRef.current)
    }

    const handleError = (data) => {
      updateGameState({ error: data.message })
      setTimeout(() => updateGameState({ error: "" }), 3000)
    }

    // Register event listeners
    newSocket.on("joined-room", handleJoinedRoom)
    newSocket.on("room-update", handleRoomUpdate)
    newSocket.on("game-started", handleGameStarted)
    newSocket.on("turn-started", handleTurnStarted)
    newSocket.on("player-folded", handlePlayerFolded)
    newSocket.on("game-ended", handleGameEnded)
    newSocket.on("error", handleError)
    newSocket.on("room-not-found", ({ message }) => {
      toast.warning(message);
    });

    // Join room
    if (roomIdd) {
      newSocket.emit("join-room-by-id", {
        userId,
        username,
        profileImageURL,
        gameMoney: gameState.gameMoney,
        roomIdd,
      });
    } else {
      newSocket.emit("join-room", {
        userId,
        username,
        profileImageURL,
        gameMoney: gameState.gameMoney,
        isPrivate,
      });
    }

    return () => {
      if (turnTimerRef.current) clearInterval(turnTimerRef.current)
      newSocket.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, username, profileImageURL, gameState.loading])

  return {
    ...gameState,
    handlePlayerAction,
    handleShow,
    leaveGame,
    handleSendChat,
  }
}
