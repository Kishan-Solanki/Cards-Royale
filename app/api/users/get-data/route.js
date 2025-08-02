import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connect } from '@/lib/dbconfig';
import User from '@/model/userModel';
import { verifyJwtToken } from '@/lib/jwt';

await connect();

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyJwtToken(token);
    if (!decoded || !decoded.id) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.currentToken !== token) {
      return NextResponse.json({
        error: 'Session expired. Please login again.',
        forceLogout: true,
      }, { status: 401 });
    }

    return NextResponse.json({
      id: user._id,
      email: user.email,
      username: user.username,
      profileImageURL: user.profileImageURL,
      gameMoney: user.gameMoney,
      isVerified: user.isVerified,
    });
  } catch (error) {
    console.error('Error getting user details:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
