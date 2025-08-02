'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function MindiGameTable({ userId, username, profileImageURL }) {
  const [players, setPlayers] = useState([]);
  const [roomId, setRoomId] = useState('');
  const [socket, setSocket] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!userId || !username || !profileImageURL) return;

    const s = io(process.env.NEXT_PUBLIC_GAME_SERVER_URI, {
      transports: ['websocket'],
    });

    s.emit('join-room', { userId, username, profileImageURL });

    s.on('joined-room', (data) => {
      setRoomId(data.roomId);
      setPlayers(data.players);
    });

    s.on('room-update', (data) => {
      setPlayers(data.players);
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [userId, username, profileImageURL]);

  const handleLeaveRoom = () => {
    if (socket?.connected) {
      socket.emit('leave-game', { userId, roomId });
      socket.disconnect();
    }
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-800 text-white p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <p className="text-xl">
            Room ID: <span className="font-mono">{roomId}</span>
          </p>
          <button
            onClick={handleLeaveRoom}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white"
          >
            Leave Room
          </button>
        </div>

        {players.length <= 1 ? (
          <div className="text-center mt-10">
            <p className="text-2xl font-semibold mb-4">Waiting for other players...</p>
            <div className="animate-pulse text-lg">Loading...</div>
          </div>
        ) : (
          <>
            <div className="flex justify-center mb-8">
              {players
                .filter((p) => p.userId === userId)
                .map((p) => (
                  <div
                    key={p.userId}
                    className="flex flex-col items-center p-4 rounded-xl border-2 border-yellow-400 bg-white/10"
                  >
                    <Image
                      src={p.profileImageURL}
                      alt={p.username}
                      width={100}
                      height={100}
                      className="rounded-full ring-4 ring-yellow-400"
                    />
                    <p className="mt-2 font-semibold text-yellow-300">{p.username} (You)</p>
                  </div>
                ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {players
                .filter((p) => p.userId !== userId)
                .map((p) => (
                  <div
                    key={p.userId}
                    className="flex flex-col items-center p-4 rounded-xl border border-white bg-white/10"
                  >
                    <Image
                      src={p.profileImageURL}
                      alt={p.username}
                      width={80}
                      height={80}
                      className="rounded-full"
                    />
                    <p className="mt-2 text-white">{p.username}</p>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
