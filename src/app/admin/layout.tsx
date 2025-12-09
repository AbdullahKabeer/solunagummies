'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Users, ShoppingCart, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingRole, setIsCheckingRole] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const checkAdminRole = async () => {
      if (isAuthLoading) return;

      if (!user) {
        router.push('/login');
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error || profile?.role !== 'admin') {
          console.log('User is not admin, redirecting...');
          router.push('/');
        } else {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error('Error checking admin role:', error);
        router.push('/');
      } finally {
        setIsCheckingRole(false);
      }
    };

    checkAdminRole();
  }, [user, isAuthLoading, router, supabase]);

  if (isAuthLoading || isCheckingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F2F0E9]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect
  }

  const navItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Active Carts', href: '/admin/carts', icon: ShoppingCart },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-[#F2F0E9]">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white flex flex-col fixed h-full z-50">
        <div className="p-8 border-b border-white/10">
          <Link href="/" className="text-2xl font-black tracking-tighter uppercase hover:text-[#FF3300] transition-colors">
            SOLUNA<span className="text-[#FF3300] text-xs align-top ml-1">ADMIN</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-mono text-sm uppercase tracking-wide ${
                  isActive 
                    ? 'bg-[#FF3300] text-black font-bold' 
                    : 'text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={() => logout()}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all font-mono text-sm uppercase tracking-wide"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 lg:p-12">
        {children}
      </main>
    </div>
  );
}
