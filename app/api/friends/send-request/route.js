import { NextResponse } from 'next/server';
import User from '@/model/userModel';
import {connect} from '@/lib/dbconfig';

export async function POST(req) {
  try {
    await connect();

    const { fromUserId, toUsername } = await req.json();

    if (!toUsername) {
      return NextResponse.json({ error: 'Missing toUsername' }, { status: 400 });
    }

    // Find the target user (receiver)
    const toUser = await User.findOne({ username: toUsername });

    if (!toUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent sending request to self
    if (toUser._id.toString() === fromUserId) {
      return NextResponse.json({ error: 'Cannot send request to yourself' }, { status: 400 });
    }

    // Check if already friends
    if (toUser.Friends.includes(fromUserId)) {
      return NextResponse.json({ error: 'Already friends' }, { status: 400 });
    }

    // Check if request already sent
    if (toUser.FriendRequests.includes(fromUserId)) {
      return NextResponse.json({ error: 'Request already sent' }, { status: 400 });
    }

    // Add friend request
    toUser.FriendRequests.push(fromUserId);
    await toUser.save();

    return NextResponse.json({ message: 'Friend request sent successfully' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
