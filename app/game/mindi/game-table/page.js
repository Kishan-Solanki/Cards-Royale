'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import MindiGameTable from './MindiGameTable';

function GameTableContent() {
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

export default function TeenPattiPage() {
  return (
    <Suspense fallback={<div className="text-white text-center mt-10">Loading...</div>}>
      <GameTableContent />
    </Suspense>
  );
}
