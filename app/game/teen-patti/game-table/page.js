'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import TeenPattiGameTable from './TeenPattiGameTable';

function TeenPattiPageContent() {
  const searchParams = useSearchParams();

  const userId = searchParams.get('id');
  const username = searchParams.get('username');
  const profileImageURL = decodeURIComponent(searchParams.get('profileImageURL') || '');
  const roomId = searchParams.get('roomId');
  const isPrivate=searchParams.get('isPrivate');
  if (!userId || !username || !profileImageURL) {
    return <div className="text-black text-center mt-10">Missing player info</div>;
  }

  return (
    <TeenPattiGameTable
      userId={userId}
      username={username}
      profileImageURL={profileImageURL}
      isPrivate={isPrivate}
      roomIdd={roomId}
    />
  );
}

export default function TeenPattiPage() {
  return (
    <Suspense fallback={<div className="text-black text-center mt-10">Loading...</div>}>
      <TeenPattiPageContent />
    </Suspense>
  );
}
