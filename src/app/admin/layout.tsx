'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Truck, 
  Users, 
  BarChart3, 
  RefreshCw, 
  LogOut,
  Menu,
  X,
  Package
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading: authLoading, logout } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
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

  const handleSoftReload = () => {
    window.location.reload();
  };

  if (authLoading || checkingRole) {
    return <div className="min-h-screen flex items-center justify-center font-mono uppercase">Loading Admin...</div>;
  }

  if (!isAdmin) return null;

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/fulfillment', label: 'Fulfillment', icon: Truck },
    { href: '/admin/customers', label: 'Customers', icon: Users },
    { href: '/admin/reports', label: 'Reports', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex">
      {/* Mobile Menu Button */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out
        lg:translate-x-0 lg:static lg:h-screen lg:sticky lg:top-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-gray-100">
            <strong className="text-xl tracking-tight block">SOLUNA ADMIN</strong>
            <span className="text-xs text-gray-500 font-mono uppercase">Management Console</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-black text-white' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-black'}`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t border-gray-100 space-y-2">
            <button 
              onClick={handleSoftReload}
              className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-600 hover:text-black w-full rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw size={18} />
              Reload Data
            </button>
            <button 
              onClick={() => logout()}
              className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 w-full rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>
    </div>
  );
}
