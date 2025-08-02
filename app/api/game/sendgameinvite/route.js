import { NextResponse } from "next/server"
import mongoose from "mongoose"
import { connect } from "@/lib/dbconfig"
import User from "@/model/userModel"

export async function POST(req) {
  try {
    await connect()

    const { userId, inviterId, roomId, gameType } = await req.json()

    // Validate inputs
    if (
      !userId ||
      !inviterId ||
      !roomId ||
      !gameType ||
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(inviterId)
    ) {
      return NextResponse.json(
        { success: false, message: "Missing or invalid userId/inviterId/roomId/gameType" },
        { status: 400 },
      )
    }

    // Check if target user exists
    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ success: false, message: "User to receive invite not found" }, { status: 404 })
    }

    // Create the invite object
    const invite = {
      inviter: new mongoose.Types.ObjectId(inviterId),
      roomId,
      gameType,
      createdAt: new Date(),
    }

    // Push the invite to user's gameInvites
    user.gameInvites.push(invite)
    await user.save()

    return NextResponse.json({ success: true, message: "Game invite sent successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error sending game invite:", error)
    return NextResponse.json({ success: false, message: "Server error", error: error.message }, { status: 500 })
  }
}
