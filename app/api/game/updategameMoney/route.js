import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { cookies } from 'next/headers';
import { connect } from '@/lib/dbconfig';
import User from '@/model/userModel';
import { verifyJwtToken } from '@/lib/jwt';

export async function POST(req) {
  try {
    await connect();

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = await verifyJwtToken(token);
    if (!decoded || !decoded.id) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    if (user.currentToken !== token) {
      return NextResponse.json(
        {
          success: false,
          message: 'Session expired. Please login again.',
          forceLogout: true,
        },
        { status: 401 }
      );
    }

    const { userId, gameMoney } = await req.json();

    // Extra validation to ensure user is only modifying their own data
    if (userId !== decoded.id) {
      return NextResponse.json(
        { success: false, message: 'Permission denied' },
        { status: 403 }
      );
    }

    if (!userId || typeof gameMoney !== 'number') {
      return NextResponse.json(
        { success: false, message: 'userId and gameMoney are required' },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid user ID format' },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { gameMoney },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Game money updated',
        gameMoney: updatedUser.gameMoney,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating game money:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
