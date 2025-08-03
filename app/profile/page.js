import { cookies } from 'next/headers';
import ProfileClient from './ProfileClient';
import { verifyJwtToken } from '@/lib/jwt';

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  let user = null;
  if (!token) {
    redirect('/login');
  }
  const decoded = await verifyJwtToken(token);
    if(!decoded.verified){
      redirect('/verifyemail')
    }
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/users/get-data`,
      {
        method: 'GET',
        headers: {
          Cookie: `token=${token}`,
        },
        cache: 'no-store',
      }
    );

    user = await res.json();

    if (res.status === 401 || user?.forceLogout || user?.error) {
      redirect('/api/users/force-logout');
    }
  } catch (err) {
    console.error('Fetch error:', err);
    redirect('/api/users/force-logout');
  }
  
  return <ProfileClient user={user} />;
}
