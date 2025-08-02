import { connect } from '@/lib/dbconfig';

await connect(); 

import User from '@/model/userModel'; 
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const user = await User.findById(userId).populate('Friends', 'username profileImageURL gameMoney');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ friends: user.Friends });
  } catch (err) {
    console.error('get-friends error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
