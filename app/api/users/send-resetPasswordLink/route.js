import { NextResponse } from 'next/server';
import { connect } from '@/lib/dbconfig';
import User from '@/model/userModel';
import { sendForgotPasswordEmail } from '@/helpers/mailer';
import crypto from 'crypto';

connect();

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ success: false, message: 'Email not found' }, { status: 404 });
    }

    // Generate a secure random token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiry = Date.now() + 1000 * 60 * 60; // 1 hour from now

    user.forgotPasswordCode = resetToken;
    user.forgotPasswordExpiry = expiry;
    await user.save();

    const resetLink = `${process.env.NEXT_PUBLIC_SITE_URL}/change-password/${resetToken}`;

    await sendForgotPasswordEmail(user.email, user.username, resetLink);

    return NextResponse.json({
      success: true,
      message: 'Reset password link sent to your email',
    });

  } catch (error) {
    console.error('Error in send-resetPasswordLink route:', error);
    return NextResponse.json({
      success: false,
      message: 'Something went wrong while sending reset link',
    }, { status: 500 });
  }
}
