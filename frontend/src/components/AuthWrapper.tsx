import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from './ui/navbar';

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // check if the user has a jwt token (logged in)
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      // if token exists, allow the render of the real page
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    // loading screen (we can add something better here later)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
