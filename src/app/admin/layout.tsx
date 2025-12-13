'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAdmin = async () => {
      if (!authLoading) {
        if (!user) {
          router.push('/login');
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profile?.role === 'admin') {
          setIsAdmin(true);
        } else {
          router.push('/');
        }
        setCheckingRole(false);
      }
    };

    checkAdmin();
  }, [user, authLoading, router, supabase]);

  if (authLoading || checkingRole) {
    return <div className="min-h-screen flex items-center justify-center font-mono uppercase">Loading Admin...</div>;
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <strong className="text-lg tracking-tight">SOLUNA ADMIN</strong>
          <div className="h-4 w-px bg-gray-300"></div>
          <Link href="/admin" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Dashboard</Link>
          <Link href="/admin/orders" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Orders</Link>
          <Link href="/admin/fulfillment" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            Fulfillment
          </Link>
          <Link href="/admin/customers" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Customers</Link>
        </div>
        <Link href="/" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">Back to Site &rarr;</Link>
      </nav>
      <main>
        {children}
      </main>
    </div>
  );
}
