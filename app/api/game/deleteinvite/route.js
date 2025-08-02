import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connect } from '@/lib/dbconfig';
import User from '@/model/userModel';

export async function POST(req) {
  try {
    await connect();

    const { userId, roomId } = await req.json();

    if (!userId || !roomId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, message: 'Missing or invalid userId/roomId' },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Remove the invite with matching roomId
    user.gameInvites = user.gameInvites.filter(invite => invite.roomId !== roomId);
    await user.save();

    return NextResponse.json(
      { success: true, message: 'Invite rejected and removed' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error rejecting invite:', error);
    return NextResponse.json(
      { success: false, message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}
