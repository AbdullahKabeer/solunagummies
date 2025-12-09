'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ShoppingCart, Clock, User } from 'lucide-react';

interface CartGroup {
  id: string; // user_id or session_id
  type: 'user' | 'guest';
  items: any[];
  updated_at: string;
  total: number;
  isActive: boolean;
}

export default function ActiveCartsPage() {
  const [carts, setCarts] = useState<CartGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchCarts = async () => {
      setIsLoading(true);
      // Fetch all cart items
      const { data: cartItems, error } = await supabase
        .from('cart_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error(error);
        setIsLoading(false);
        return;
      }

      // Group by user_id or session_id
      const grouped = cartItems.reduce((acc: any, item: any) => {
        const key = item.user_id || item.session_id || 'unknown';
        const type = item.user_id ? 'user' : 'guest';
        
        // Determine if active (updated in last 15 mins)
        const lastActive = new Date(item.updated_at || item.created_at);
        const now = new Date();
        const diffMins = (now.getTime() - lastActive.getTime()) / 1000 / 60;
        const isActive = diffMins < 15;

        if (!acc[key]) {
          acc[key] = {
            id: key,
            type,
            items: [],
            updated_at: item.updated_at || item.created_at,
            total: 0,
            isActive, // Track active status
          };
        } else {
          // Update timestamp if this item is newer
          const currentLatest = new Date(acc[key].updated_at);
          if (lastActive > currentLatest) {
            acc[key].updated_at = item.updated_at || item.created_at;
            acc[key].isActive = isActive;
          }
        }
        
        acc[key].items.push(item);
        acc[key].total += (item.price || 0) * item.quantity;
        return acc;
      }, {});

      // Convert to array
      const cartArray: CartGroup[] = Object.values(grouped);
      setCarts(cartArray);
      setIsLoading(false);
    };

    fetchCarts();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Active Carts</h1>
          <p className="font-mono text-sm text-gray-500">Monitor live shopping sessions and abandoned carts.</p>
        </div>
        <div className="font-mono text-xs bg-black text-white px-3 py-1 rounded-full">
          {carts.length} LIVE SESSIONS
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <p className="col-span-full text-center py-12 text-gray-500">Scanning active sessions...</p>
        ) : carts.length > 0 ? (
          carts.map((cart) => (
            <div key={cart.id} className="bg-white border border-black p-6 relative overflow-hidden group hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${cart.type === 'user' ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'}`}>
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm uppercase">
                      {cart.type === 'user' ? `User ${cart.id.slice(0, 6)}...` : 'Guest Visitor'}
                    </h3>
                    <p className="text-[10px] font-mono text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Last active: {new Date(cart.updated_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className={`${cart.isActive ? 'bg-[#FF3300]' : 'bg-gray-400'} text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider`}>
                  {cart.isActive ? 'In Progress' : 'Abandoned'}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {cart.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-sm border-b border-gray-100 pb-2 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-gray-400 text-xs">x{item.quantity}</span>
                      <span className="font-bold">{item.name || 'Product'}</span>
                      {item.subscription && (
                        <span className="text-[10px] bg-gray-100 px-1 rounded">SUB</span>
                      )}
                    </div>
                    <span className="font-mono">${((item.price || 0) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-black/10">
                <span className="font-mono text-xs text-gray-500 uppercase">Cart Total</span>
                <span className="font-black text-xl">
                  ${cart.total.toFixed(2)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-24 bg-white border border-black border-dashed">
            <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-mono">No active carts at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
