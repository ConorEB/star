'use client';

import ErrorPanel from '@/components/errorPanel';

interface ErrorPageProps {
  error: string;
}

export default function ErrorPage({ error }: ErrorPageProps) {
  return <ErrorPanel error={error} />;
}
