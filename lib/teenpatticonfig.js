export const config = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  gameServerUrl: process.env.NEXT_PUBLIC_GAME_SERVER_URL || "http://localhost:3001",
  gameServerUri: process.env.NEXT_PUBLIC_GAME_SERVER_URI || "http://localhost:3002",

  // API endpoints
  api: {
    getGameMoney: "/api/game/getgameMoney",
    updateGameMoney: "/api/game/updategameMoney",
  },

  // Game settings
  game: {
    turnDuration: 60000, // 60 seconds
    maxPlayers: 5,
    minBet: 500,
    maxBet: 5000,
    bootAmount: 500,
  },

  // Card settings
  cards: {
    suits: ["hakam", "dil", "chokat", "fuli"],
    ranks: Array.from({ length: 13 }, (_, i) => i + 1), // [1,2,3...13]
    backImage: "/cards/back.png",
  },
}
