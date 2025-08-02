"use client"

import { Users, X, UserPlus } from "lucide-react"
import Image from "next/image"

const InviteDialog = ({
  showInviteDialog,
  setShowInviteDialog,
  roomId,
  loadingFriends,
  friends,
  invitingFriends,
  onInviteFriend,
}) => {
  if (!showInviteDialog) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-600 rounded-2xl p-6 w-full max-h-[80vh] overflow-hidden max-w-md">
        {/* Dialog Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <Users size={20} className="text-blue-400" />
            <h2 className="text-xl font-bold text-white">Invite Friends</h2>
          </div>
          <button
            onClick={() => setShowInviteDialog(false)}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors duration-200"
          >
            <X size={20} className="text-slate-400 hover:text-white" />
          </button>
        </div>

        {/* Room Info */}
        {roomId && (
          <div className="mb-4 p-3 bg-slate-700/50 rounded-lg">
            <div className="text-slate-300 text-sm">Inviting to Room:</div>
            <div className="text-white font-bold">{roomId}</div>
          </div>
        )}

        {/* Friends List */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {loadingFriends ? (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto rounded-full mb-2"></div>
              <div className="text-slate-400 text-sm">Loading friends...</div>
            </div>
          ) : friends.length === 0 ? (
            <div className="text-center py-8">
              <Users size={48} className="mx-auto text-slate-600 mb-2" />
              <div className="text-slate-400 text-sm">No friends found</div>
            </div>
          ) : (
            friends.map((friend) => {
              const isInviting = invitingFriends.has(friend._id)
              return (
                <div
                  key={friend._id}
                  className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <Image
                      src={friend.profileImageURL || "/placeholder.svg"}
                      alt={friend.username}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <div className="text-white font-semibold">{friend.username}</div>
                      <div className="text-slate-400 text-xs">🪙{friend.gameMoney}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => onInviteFriend(friend._id)}
                    disabled={isInviting}
                    className={`px-3 py-1 text-sm font-bold rounded-lg transition-colors duration-200 flex items-center space-x-1 ${
                      isInviting
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {isInviting ? (
                      <>
                        <div className="animate-spin h-3 w-3 border border-gray-400 border-t-transparent rounded-full"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus size={12} />
                        <span>Invite</span>
                      </>
                    )}
                  </button>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default InviteDialog
