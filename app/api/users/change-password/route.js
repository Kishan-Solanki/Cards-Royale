import { connect } from '@/lib/dbconfig';
import User from '@/model/userModel';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

connect();

export async function POST(req) {
  try {
    const { email, newPassword, forgotPasswordCode } = await req.json();

    if (!email || !newPassword || !forgotPasswordCode) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields',
      }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found',
      }, { status: 404 });
    }

    // Check if the reset code matches
    if (
      user.forgotPasswordCode !== forgotPasswordCode ||
      !user.forgotPasswordExpiry ||
      user.forgotPasswordExpiry < Date.now()
    ) {
      return NextResponse.json({
        success: false,
        message: 'Invalid or expired password reset link',
      }, { status: 400 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and remove reset code and expiry
    user.password = hashedPassword;
    user.forgotPasswordCode = undefined;
    user.forgotPasswordExpiry = undefined;

    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Error in change-password API:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    }, { status: 500 });
  }
}
