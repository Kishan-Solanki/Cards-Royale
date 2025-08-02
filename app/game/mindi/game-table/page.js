'use client';

import { useSearchParams } from 'next/navigation';
import MindiGameTable from './MindiGameTable';

export default function TeenPattiPage() {
  const searchParams = useSearchParams();

  const userId = searchParams.get('id');
  const username = searchParams.get('username');
  const profileImageURL = decodeURIComponent(searchParams.get('profileImageURL') || '');

  if (!userId || !username || !profileImageURL) {
    return <div className="text-white text-center mt-10">Missing player info</div>;
  }

  return (
    <MindiGameTable
      userId={userId}
      username={username}
      profileImageURL={profileImageURL}
    />
  );
}
