import { NextResponse } from 'next/server';
import User from '@/model/userModel';
import {connect} from '@/lib/dbconfig';

export async function POST(req) {
  try {
    await connect();

    const { accepterId, requesterId } = await req.json();

    if (!accepterId || !requesterId) {
      return NextResponse.json({ error: 'Missing accepterId or requesterId' }, { status: 400 });
    }

    if (accepterId === requesterId) {
      return NextResponse.json({ error: 'Cannot reject your own request' }, { status: 400 });
    }

    const accepter = await User.findById(accepterId);
    if (!accepter) {
      return NextResponse.json({ error: 'Accepter not found' }, { status: 404 });
    }

    // Check if request exists
    if (!accepter.FriendRequests.includes(requesterId)) {
      return NextResponse.json({ error: 'Friend request not found' }, { status: 400 });
    }

    // Remove requesterId from accepter's FriendRequests
    accepter.FriendRequests = accepter.FriendRequests.filter(
      (id) => id.toString() !== requesterId
    );

    await accepter.save();

    return NextResponse.json({ message: 'Friend request rejected successfully' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
