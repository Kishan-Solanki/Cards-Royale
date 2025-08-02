import { NextResponse } from 'next/server';
import User from '@/model/userModel';      
import { connect } from '@/lib/dbconfig';
await connect();
export async function POST(req) {
    try {
        const { userId } = await req.json();
        if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

        const user = await User.findById(userId).populate('FriendRequests', 'username profileImageURL gameMoney');
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        return NextResponse.json({ friendRequests: user.FriendRequests });
    } catch (err) {
        console.error("get-friend-requests error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
