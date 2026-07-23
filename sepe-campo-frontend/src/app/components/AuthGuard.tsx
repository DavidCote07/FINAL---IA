'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const PUBLIC_PATHS = ['/auth/login', '/auth/register'];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const isPublicPage = PUBLIC_PATHS.includes(pathname);

    if (!token && !isPublicPage) {
      router.replace('/auth/login');
      return;
    }

    if (token && isPublicPage) {
      router.replace('/visitas');
    }
  }, [pathname, router]);

  return <>{children}</>;
}
