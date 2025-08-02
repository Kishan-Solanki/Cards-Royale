import { connect } from '@/lib/dbconfig';
import User from '@/model/userModel';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signJwtToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

connect();

export async function POST(req) {
  try {
    const { email, password, forceLogout } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    if (user.currentToken && user.currentToken !== 'default') {
      if (!forceLogout) {
        return NextResponse.json({
          error: 'User already logged in from another device',
          requireForceLogout: true,
          success: false,
        }, { status: 403 });
      }
    }

    const token = signJwtToken({ id: user._id , verified: user.isVerified});

    await User.updateOne({ _id: user._id }, { currentToken: token });

    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return NextResponse.json({
      message: 'Login successful',
      success: true,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        profileImageURL: user.profileImageURL,
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
