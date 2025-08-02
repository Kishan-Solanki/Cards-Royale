import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connect } from '@/lib/dbconfig';
import User from '@/model/userModel';

export async function POST(req) {
  try {
    await connect();

    const { username, userId } = await req.json();
  
    // Validate input
    if (!username || !userId) {
      return NextResponse.json(
        { success: false, message: 'Missing username or user ID' },
        { status: 400 }
      );
    }

    // Check if userId is valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid user ID format' },
        { status: 400 }
      );
    }

    // Check if username is already taken by someone else
    const existingUser = await User.findOne({
      username,
      _id: { $ne: userId },
    });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Username already taken' },
        { status: 409 }
      );
    }

    // Update the username
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username },
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
        message: 'Username updated successfully',
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error changing username:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong. Please try again.',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
