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
      return NextResponse.json({ error: 'Cannot accept your own request' }, { status: 400 });
    }

    const accepter = await User.findById(accepterId);
    const requester = await User.findById(requesterId);

    if (!accepter || !requester) {
      return NextResponse.json({ error: 'One or both users not found' }, { status: 404 });
    }

    // Check if request exists
    if (!accepter.FriendRequests.includes(requesterId)) {
      return NextResponse.json({ error: 'Friend request not found' }, { status: 400 });
    }

    // Add each other to Friends list if not already
    if (!accepter.Friends.includes(requesterId)) {
      accepter.Friends.push(requesterId);
    }

    if (!requester.Friends.includes(accepterId)) {
      requester.Friends.push(accepterId);
    }

    // Remove requesterId from accepter's FriendRequests
    accepter.FriendRequests = accepter.FriendRequests.filter(
      (id) => id.toString() !== requesterId
    );

    // Save both users
    await accepter.save();
    await requester.save();

    return NextResponse.json({ message: 'Friend request accepted successfully' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
