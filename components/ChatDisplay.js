"use client"

import { useState, useRef, useEffect } from "react"
import { Send, MessageCircle, Minus } from "lucide-react"
import Image from "next/image"

const ChatDisplay = ({ chat, handleSendChat, currentUsername }) => {
  const [message, setMessage] = useState("")
  const [isMinimized, setIsMinimized] = useState(false)
  const chatContainerRef = useRef(null)

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chat])

  const sendMessage = (e) => {
    e.preventDefault()
    if (message.trim()) {
      handleSendChat(message)
      setMessage("")
    }
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return ""
    const date = new Date(timestamp)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  return (
    <div
      className={`fixed bottom-4 right-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl border-2 border-purple-400/50 transition-all duration-300 z-50 ${
        isMinimized ? "w-16 h-16" : "w-80 h-96"
      }`}
    >
      {/* Chat Header */}
      <div
        className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-xl cursor-pointer hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="flex items-center space-x-2">
          <MessageCircle size={20} />
          {!isMinimized && <span className="font-bold">Game Chat</span>}
          {!isMinimized && chat && chat.length > 0 && (
            <div className="bg-white/20 text-white rounded-full px-2 py-1 text-xs font-bold">
              {chat.length > 99 ? "99+" : chat.length}
            </div>
          )}
        </div>
        {!isMinimized && (
          <button className="text-white hover:text-purple-200 transition-colors duration-200">
            <Minus size={18} />
          </button>
        )}
        {isMinimized && chat && chat.length > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
            {chat.length > 99 ? "99+" : chat.length}
          </div>
        )}
      </div>

      {/* Chat Content - Only show when not minimized */}
      {!isMinimized && (
        <>
          {/* Messages Container */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-3 space-y-3 h-64 bg-gradient-to-b from-slate-700/50 to-slate-800/50 backdrop-blur-sm"
          >
            {!chat || chat.length === 0 ? (
              <div className="text-center text-slate-400 text-sm mt-8 space-y-2">
                <MessageCircle size={32} className="mx-auto text-slate-600" />
                <div>No messages yet</div>
                <div className="text-xs text-slate-500">Start the conversation!</div>
              </div>
            ) : (
              chat.map((msg, index) => {
                const isCurrentUser = msg.username === currentUsername

                return (
                  <div
                    key={msg.id || index}
                    className={`flex items-start space-x-2 ${isCurrentUser ? "flex-row-reverse space-x-reverse" : ""}`}
                  >
                    {/* Profile Image */}
                    <div className="flex-shrink-0">
                      <Image
                        src={msg.profileImageURL || "/placeholder.svg"}
                        alt={msg.username}
                        width={32}
                        height={32}
                        className="rounded-full object-cover border-2 border-slate-600"
                        onError={(e) => {
                          e.target.src = "/placeholder.svg"
                        }}
                      />
                    </div>

                    {/* Message Bubble */}
                    <div className={`flex-1 max-w-xs ${isCurrentUser ? "text-right" : ""}`}>
                      {/* Username and Time */}
                      <div className={`text-xs text-slate-400 mb-1 ${isCurrentUser ? "text-right" : "text-left"}`}>
                        <span className="font-semibold text-slate-300">{msg.username}</span>
                        {msg.timestamp && <span className="ml-2 text-slate-500">{formatTime(msg.timestamp)}</span>}
                      </div>

                      {/* Message Content */}
                      <div
                        className={`inline-block px-3 py-2 rounded-lg text-sm break-words shadow-lg ${
                          isCurrentUser
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-none"
                            : "bg-slate-700 text-slate-100 rounded-bl-none border border-slate-600"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Message Input */}
          <div className="p-3 border-t border-purple-400/30 bg-slate-800/50 rounded-b-xl">
            <form onSubmit={sendMessage} className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-full text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                maxLength={200}
              />
              <button
                type="submit"
                disabled={!message.trim()}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
              >
                <Send size={16} />
              </button>
            </form>
            <div className="text-xs text-slate-500 mt-1 text-right">{message.length}/200 characters</div>
          </div>
        </>
      )}
    </div>
  )
}

export default ChatDisplay
