import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connect } from '@/lib/dbconfig';
import User from '@/model/userModel';

export async function POST(req) {
  try {
    await connect();

    const { userId } = await req.json();

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid or missing user ID' },
        { status: 400 }
      );
    }

    const user = await User.findById(userId).select('gameMoney');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, gameMoney: user.gameMoney },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching gameMoney:', error);
    return NextResponse.json(
      { success: false, message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}
