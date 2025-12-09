'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { DollarSign, ShoppingBag, Users, TrendingUp, Clock, Eye, RefreshCw } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    activeCarts: 0,
    liveVisitors: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const supabase = createClient();

  const fetchStats = useCallback(async () => {
    setIsRefreshing(true);
    // In a real app, these would be separate optimized queries or a materialized view
    
    // 1. Orders & Revenue
    const { data: orders } = await supabase.from('orders').select('amount, status, created_at').order('created_at', { ascending: false });
    const totalRevenue = orders?.reduce((acc, order) => acc + (order.amount || 0), 0) || 0;
    const totalOrders = orders?.length || 0;

    // 2. Customers
    const { count: customerCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });

    // 3. Active Carts (Unique users with items in cart_items)
    // This is an approximation. Ideally, check distinct user_ids in cart_items
    const { data: cartItems } = await supabase.from('cart_items').select('user_id');
    const uniqueCarts = new Set(cartItems?.map(item => item.user_id)).size;

    // 4. Live Visitors (Active sessions in last 2 mins)
    const twoMinsAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
    const { count: liveVisitors } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true })
      .gt('last_seen', twoMinsAgo);

    setStats({
      totalRevenue,
      totalOrders,
      totalCustomers: customerCount || 0,
      activeCarts: uniqueCarts,
      liveVisitors: liveVisitors || 0,
    });

    if (orders) {
      setRecentOrders(orders.slice(0, 5));
    }
    setIsRefreshing(false);
  }, [supabase]);

  useEffect(() => {
    fetchStats();

    // Auto-refresh every 30 seconds to update "Live Visitors" count
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Dashboard</h1>
          <p className="font-mono text-sm text-gray-500">Overview of your store's performance.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={fetchStats} 
            disabled={isRefreshing}
            className="p-2 bg-white border border-black hover:bg-gray-100 transition-colors disabled:opacity-50"
            title="Refresh Stats"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <div className="font-mono text-xs bg-white border border-black px-3 py-1 rounded-full flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            SYSTEM ONLINE
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`$${stats.totalRevenue.toFixed(2)}`} 
          icon={DollarSign} 
          trend="+12.5%" 
        />
        <StatCard 
          title="Total Orders" 
          value={stats.totalOrders.toString()} 
          icon={ShoppingBag} 
          trend="+5.2%" 
        />
        <StatCard 
          title="Active Customers" 
          value={stats.totalCustomers.toString()} 
          icon={Users} 
          trend="+8.1%" 
        />
        <StatCard 
          title="Active Carts" 
          value={stats.activeCarts.toString()} 
          icon={ShoppingCartIcon} 
          trend="Live" 
        />
        <StatCard 
          title="Live Visitors" 
          value={stats.liveVisitors.toString()} 
          icon={Eye} 
          trend="Now" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white border border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black uppercase tracking-tighter">Recent Orders</h2>
            <button className="text-xs font-bold uppercase underline hover:text-[#FF3300]">View All</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-black/10">
                  <th className="pb-3 font-mono text-xs text-gray-500 uppercase">Order ID</th>
                  <th className="pb-3 font-mono text-xs text-gray-500 uppercase">Date</th>
                  <th className="pb-3 font-mono text-xs text-gray-500 uppercase">Status</th>
                  <th className="pb-3 font-mono text-xs text-gray-500 uppercase text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="font-mono text-sm">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order, i) => (
                    <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                      <td className="py-4">#{order.id?.slice(0, 8).toUpperCase() || 'PENDING'}</td>
                      <td className="py-4 text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="py-4">
                        <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase ${
                          order.status === 'paid' ? 'bg-green-100 text-green-800' : 
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status || 'Pending'}
                        </span>
                      </td>
                      <td className="py-4 text-right font-bold">${order.amount?.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-400 italic">No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Feed (Mock) */}
        <div className="bg-[#1a1a1a] text-white border border-black p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Clock className="w-24 h-24" />
          </div>
          <h2 className="text-xl font-black uppercase tracking-tighter mb-6 relative z-10">Live Activity</h2>
          <div className="space-y-6 relative z-10">
            {[1, 2, 3, 4].map((_, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-2 h-2 bg-[#FF3300] rounded-full mt-1.5 animate-pulse"></div>
                <div>
                  <p className="text-sm font-bold">New visitor from New York, USA</p>
                  <p className="text-xs font-mono text-gray-500">Just now</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend }: any) {
  return (
    <div className="bg-white border border-black p-6 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-[#F2F0E9] rounded-lg border border-black/10">
          <Icon className="w-5 h-5" />
        </div>
        <span className="font-mono text-xs text-green-600 bg-green-50 px-2 py-1 rounded">{trend}</span>
      </div>
      <h3 className="font-mono text-xs text-gray-500 uppercase mb-1">{title}</h3>
      <p className="text-3xl font-black tracking-tight">{value}</p>
    </div>
  );
}

function ShoppingCartIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  )
}
