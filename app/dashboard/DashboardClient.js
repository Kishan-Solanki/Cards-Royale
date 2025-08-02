'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, UserPlus, Brain, Spade, Crown, Gamepad2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function DashboardClient({ user }) {
  const [showFriends, setShowFriends] = useState(false);
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [usernameToAdd, setUsernameToAdd] = useState('');
  const [gameInvites, setGameInvites] = useState([]);
  const [cardPositions, setCardPositions] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  const toggleFriends = () => setShowFriends(prev => !prev);

  const cardImages = [
    '/cards/hakam-1.png', '/cards/chokat-13.png', '/cards/dil-12.png', '/cards/fuli-11.png',
    '/cards/hakam-2.png', '/cards/chokat-7.png', '/cards/dil-10.png', '/cards/fuli-5.png',
    '/cards/chokat-1.png', '/cards/hakam-13.png', '/cards/fuli-12.png', '/cards/dil-11.png',
    '/cards/dil-2.png', '/cards/fuli-7.png', '/cards/hakam-10.png', '/cards/chokat-5.png'
  ];

  useEffect(() => {
    setIsClient(true);
    const generateRandomPosition = () => ({ top: Math.random() * window.innerHeight });
    const positions = cardImages.map(() => generateRandomPosition());
    setCardPositions(positions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [friendsRes, requestsRes, invitesRes] = await Promise.all([
          axios.post('/api/friends/get-friends', { userId: user.id }),
          axios.post('/api/friends/get-friends-requests', { userId: user.id }),
          axios.post('/api/game/getgameinvites', { userId: user.id }),
        ]);
        setFriends(friendsRes.data.friends || []);
        setFriendRequests(requestsRes.data.friendRequests || []);
        setGameInvites(invitesRes.data.gameInvites || []);
      } catch (error) {
        toast.error('Failed to fetch friends/requests/invites');
      }
    };
    if (showFriends) fetchData();
  }, [showFriends, user.id]);

  const handleAccept = async (requesterId) => {
    try {
      await axios.post('/api/friends/accept-request', {
        accepterId: user.id,
        requesterId,
      });
      setFriendRequests(prev => prev.filter(r => r._id !== requesterId));
      setFriends(prev => [...prev, { _id: requesterId, username: 'New Friend' }]);
      toast.success('Friend request accepted');
    } catch (err) {
      toast.error('Could not accept the friend request');
    }
  };

  const handleReject = async (requesterId) => {
    try {
      await axios.post('/api/friends/reject-request', {
        accepterId: user.id,
        requesterId,
      });
      setFriendRequests(prev => prev.filter(r => r._id !== requesterId));
      toast.success('Friend request rejected');
    } catch (err) {
      toast.error('Could not reject the friend request');
    }
  };

  const handleRejectInvite = async (roomId) => {
    try {
      await axios.post('/api/game/deleteinvite', {
        userId: user.id,
        roomId,
      });
      toast.success('Invite rejected');
      const res = await axios.post('/api/game/getgameinvites', { userId: user.id });
      setGameInvites(res.data.gameInvites || []);
    } catch (err) {
      toast.error('Failed to reject invite');
    }
  };
  const handleAcceptInvite = async (invite) => {
    const { gameType, roomId } = invite;

    const gameRouteMap = {
      'Teen Patti': '/game/teen-patti/game-table',
      'Mindi': '/game/mindi/game-table',
      'Rummy': '/game/rummy/game-table',
    };

    const path = gameRouteMap[gameType];

    if (typeof path !== 'string') {
      toast.error('Unknown game type selected');
      return;
    }

    try {
      await axios.post('/api/game/deleteinvite', {
        userId: user.id,
        roomId,
      });

      // ✅ This must be a string
      router.push(`${path}?id=${user.id}&username=${encodeURIComponent(user.username)}&profileImageURL=${encodeURIComponent(user.profileImageURL)}&roomId=${roomId}`);
    } catch (error) {
      toast.error('Failed to accept invite. Please try again.');
    }
  };



  const handleSendRequest = async () => {
    try {
      await axios.post('/api/friends/send-request', {
        fromUserId: user.id,
        toUsername: usernameToAdd,
      });
      setUsernameToAdd('');
      toast.success('Friend request sent');
    } catch (err) {
      if (err.response?.data?.error === 'User not found') {
        toast.error('Username not found');
      }
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-[#0e0e0e] via-[#141414] to-[#0e0e0e] text-white px-6 py-4 overflow-hidden">

      {/* Floating cards */}
      {isClient && cardPositions.length === cardImages.length &&
        cardImages.map((src, index) => {
          const goingRight = Math.random() > 0.5;
          const top = cardPositions[index].top;
          const leftStart = goingRight ? -100 : window.innerWidth + 100;
          const leftEnd = goingRight ? window.innerWidth + 100 : -100;

          return (
            <motion.img
              key={index}
              src={src}
              alt="floating card"
              className="absolute w-16 opacity-10 pointer-events-none z-0"
              initial={{ x: leftStart, y: top, rotate: 0 }}
              animate={{ x: leftEnd, rotate: 360 }}
              transition={{
                duration: 25 + (index % 5) * 4,
                repeat: Infinity,
                ease: 'linear',
                delay: index * 2,
              }}
              style={{ top }}
            />
          );
        })}

      {/* Navbar */}
      <div className="flex items-center justify-between bg-[#1e1e2e] p-4 rounded-xl shadow-md z-10 relative">
        <Link href="/profile" className="flex items-center gap-4">
          <Image
            src={user.profileImageURL}
            alt="Profile"
            width={48}
            height={48}
            className="rounded-full border-2 border-purple-500 object-cover cursor-pointer"
          />
          <div>
            <h2 className="text-lg font-semibold hover:underline cursor-pointer">
              {user.username}
            </h2>
            <p className="text-sm text-gray-400">
              🪙 {user?.gameMoney?.toLocaleString('en-US') || '0'}
            </p>
          </div>
        </Link>

        <div className="flex gap-3">
          <Link
            href="/profile"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full font-semibold flex items-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Profile
          </Link>

          <button
            onClick={toggleFriends}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-full font-semibold flex items-center gap-2"
          >
            <Users className="w-5 h-5" />
            Friends
          </button>
        </div>
      </div>

      {/* Friends Panel */}
      {showFriends && (
        <div className="mt-6 bg-[#1e1e2e] p-6 rounded-xl shadow-md space-y-6 z-10 relative">
          <h3 className="text-xl font-bold border-b border-gray-700 pb-2">Friends Panel</h3>

          {/* Friends */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              Your Friends
            </h4>
            {friends.length === 0 ? (
              <p className="text-sm text-gray-400">No friends yet.</p>
            ) : (
              <motion.ul
                layout
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
              >
                {friends.map((friend) => (
                  <motion.li
                    key={friend._id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-4 bg-[#2e2e3d] p-4 rounded-xl shadow-lg hover:shadow-purple-700/20 border border-gray-700 transition-all duration-300"
                  >
                    <Image
                      src={friend.profileImageURL || '/default-avatar.png'}
                      alt={friend.username}
                      width={48}
                      height={48}
                      className="rounded-full object-cover border-2 border-purple-500"
                    />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <Gamepad2 className="w-4 h-4 text-yellow-400" />
                        <p className="text-sm font-semibold text-white">{friend.username}</p>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        🪙 {friend.gameMoney?.toLocaleString('en-US') || 0}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </div>

          {/* Friend Requests */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-green-400" />
              Friend Requests
            </h4>
            {friendRequests.length === 0 ? (
              <p className="text-sm text-gray-400">No friend requests yet.</p>
            ) : (
              <motion.ul
                layout
                className="grid sm:grid-cols-2 gap-4"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
              >
                {friendRequests.map((request) => (
                  <motion.li
                    key={request._id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between bg-[#2e2e3d] p-4 rounded-xl border border-gray-700 shadow hover:shadow-green-700/20 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <Image
                        src={request.profileImageURL || '/default-avatar.png'}
                        alt={request.username}
                        width={48}
                        height={48}
                        className="rounded-full object-cover border-2 border-green-500"
                      />
                      <div>
                        <p className="text-sm font-semibold">{request.username}</p>
                        <p className="text-xs text-gray-400">🪙 {request.gameMoney?.toLocaleString('en-US') || 0}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleAccept(request._id)}
                        className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-xs font-semibold"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(request._id)}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs font-semibold"
                      >
                        Reject
                      </button>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </div>

          {/* Game Invites */}
          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-pink-400" />
              Game Invites
            </h4>
            {gameInvites.length === 0 ? (
              <p className="text-sm text-gray-400">No game invites yet.</p>
            ) : (
              <motion.ul
                layout
                className="grid sm:grid-cols-2 gap-4"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
              >
                {gameInvites.map((invite) => (
                  <motion.li
                    key={invite._id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between bg-[#2e2e3d] p-4 rounded-xl border border-gray-700 shadow hover:shadow-pink-700/20 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <Image
                        src={invite.inviter?.profileImageURL || '/default-avatar.png'}
                        alt={invite.inviter?.username}
                        width={48}
                        height={48}
                        className="rounded-full object-cover border-2 border-pink-500"
                      />
                      <div>
                        <p className="text-sm font-semibold">{invite.inviter?.username}</p>
                        <p className="text-xs text-gray-400">🪙 {invite.inviter?.gameMoney?.toLocaleString('en-US') || 0}</p>
                        <p className="text-xs text-pink-400 font-semibold mt-1">🎮 {invite.gameType}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleAcceptInvite(invite)}
                        className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-xs font-semibold"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRejectInvite(invite.roomId)}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs font-semibold"
                      >
                        Reject
                      </button>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </div>


          {/* Add a Friend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-[#2e2e3d] border border-blue-800/40 rounded-2xl p-6 shadow-lg shadow-blue-500/10 mt-8"
          >
            <div className="flex items-center mb-4 gap-2">
              <UserPlus className="w-5 h-5 text-blue-400" />
              <h4 className="text-lg font-semibold tracking-wide text-white">Add a Friend</h4>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-center sm:items-stretch">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Enter username"
                  className="px-4 py-2 rounded-lg w-full bg-[#1e1e2e] border border-gray-700 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  value={usernameToAdd}
                  onChange={(e) => setUsernameToAdd(e.target.value)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 0.2, scale: 1 }}
                  transition={{ duration: 1, repeat: Infinity, repeatType: "mirror" }}
                  className="absolute top-2 right-3 pointer-events-none"
                >
                  <svg
                    className="w-4 h-4 text-blue-400 animate-ping"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="12" />
                  </svg>
                </motion.div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSendRequest}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-full text-sm transition-all"
              >
                <UserPlus className="w-4 h-4" />
                Add
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Game Cards */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 z-10 relative">
        {[
          {
            title: 'Teen Patti',
            icon: <Crown className="w-14 h-14 text-yellow-400" />,
            desc: 'A thrilling 3-card game loved across India. Play with strategy, bluff, and luck!',
            path: '/game/teen-patti'
          },
          {
            title: 'Mindi',
            icon: <Brain className="w-14 h-14 text-pink-500" />,
            desc: 'Also known as “Dehla Pakad”, a strategic trick-taking game played in teams.',
            path: '/game/mindi'
          },
          {
            title: 'Rummy',
            icon: <Spade className="w-14 h-14 text-purple-500" />,
            desc: 'Form sequences and sets with your cards before anyone else does.',
            path: '/game/rummy'
          }
        ].map((game, index) => (
          <Link
            key={index}
            href={{
              pathname: game.path,
              query: {
                id: user.id,
                username: user.username,
                profileImageURL: encodeURIComponent(user.profileImageURL),
              },
            }}
            className="block"
          >
            <motion.div
              animate={{ scale: [1, 1.03, 1] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: index * 0.2,
              }}
              whileHover={{ scale: 1.08 }}
              className="bg-[#1e1e2e] p-8 rounded-3xl text-center shadow-2xl border border-purple-800 transform transition-all hover:shadow-purple-500/30 cursor-pointer"
            >
              <div className="flex justify-center mb-6">{game.icon}</div>
              <h3 className="text-3xl font-extrabold mb-3 tracking-wide">{game.title}</h3>
              <p className="text-base text-gray-400">{game.desc}</p>
            </motion.div>
          </Link>
        ))}
      </div>

    </div>
  );
}
