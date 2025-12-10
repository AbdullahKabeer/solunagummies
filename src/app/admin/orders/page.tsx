'use client';

import { useEffect, useState, Fragment } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Search, Filter, MoreHorizontal, CheckCircle, Truck, AlertCircle, ChevronDown, ChevronUp, Package, MapPin } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        profiles:user_id (email, full_name),
        order_items (*)
      `)
      .order('created_at', { ascending: false });

    if (error) console.error(error);
    else setOrders(data || []);
    setIsLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      fetchOrders();
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Orders</h1>
          <p className="font-mono text-sm text-gray-500">Manage and fulfill customer orders.</p>
        </div>
        <button className="bg-black text-white px-6 py-3 font-bold uppercase tracking-wider hover:bg-[#FF3300] transition-colors text-sm">
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search orders..." 
            className="w-full pl-10 pr-4 py-3 border border-black font-mono text-sm focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
        <button className="px-4 py-3 border border-black bg-white flex items-center gap-2 font-bold uppercase text-sm hover:bg-gray-50">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-black bg-gray-50">
                <th className="p-4 font-mono text-xs text-gray-500 uppercase">Order ID</th>
                <th className="p-4 font-mono text-xs text-gray-500 uppercase">Customer</th>
                <th className="p-4 font-mono text-xs text-gray-500 uppercase">Date</th>
                <th className="p-4 font-mono text-xs text-gray-500 uppercase">Status</th>
                <th className="p-4 font-mono text-xs text-gray-500 uppercase">Total</th>
                <th className="p-4 font-mono text-xs text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-mono text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center">Loading orders...</td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <Fragment key={order.id}>
                    <tr 
                      className={`border-b border-gray-100 last:border-0 hover:bg-gray-50 group cursor-pointer ${expandedOrderId === order.id ? 'bg-gray-50' : ''}`}
                      onClick={() => toggleExpand(order.id)}
                    >
                      <td className="p-4 font-bold">
                        <div className="flex items-center gap-2">
                          {expandedOrderId === order.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          #{order.id.slice(0, 8).toUpperCase()}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold">{order.profiles?.full_name || 'Guest'}</div>
                        <div className="text-xs text-gray-500">{order.profiles?.email || order.shipping_details?.email || 'No email'}</div>
                      </td>
                      <td className="p-4 text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                          order.status === 'fulfilled' ? 'bg-green-50 text-green-700 border-green-200' : 
                          order.status === 'paid' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                          'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }`}>
                          {order.status === 'fulfilled' && <CheckCircle className="w-3 h-3" />}
                          {order.status === 'paid' && <Truck className="w-3 h-3" />}
                          {order.status === 'pending' && <AlertCircle className="w-3 h-3" />}
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 font-bold">${order.amount?.toFixed(2)}</td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                          {order.status !== 'fulfilled' && (
                            <button 
                              onClick={() => updateStatus(order.id, 'fulfilled')}
                              className="text-[10px] bg-black text-white px-3 py-1 uppercase font-bold hover:bg-[#FF3300]"
                            >
                              Mark Fulfilled
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {expandedOrderId === order.id && (
                      <tr className="bg-gray-50 border-b border-black">
                        <td colSpan={6} className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Order Items */}
                            <div>
                              <h4 className="text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Package className="w-4 h-4" /> Order Items
                              </h4>
                              <div className="space-y-3 bg-white p-4 border border-gray-200">
                                {order.order_items?.map((item: any, i: number) => (
                                  <div key={i} className="flex justify-between items-center text-sm border-b border-gray-100 pb-2 last:border-0">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 bg-gray-100 flex items-center justify-center text-xs font-bold">
                                        {item.quantity}x
                                      </div>
                                      <div>
                                        <div className="font-bold">{item.name}</div>
                                        {item.subscription && (
                                          <span className="text-[10px] bg-black text-white px-1.5 py-0.5 rounded uppercase">Subscription</span>
                                        )}
                                      </div>
                                    </div>
                                    <div className="font-mono">${item.price?.toFixed(2)}</div>
                                  </div>
                                ))}
                                <div className="flex justify-between items-center pt-2 font-bold border-t border-black">
                                  <span>Total</span>
                                  <span>${order.amount?.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>

                            {/* Shipping Details */}
                            <div>
                              <h4 className="text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                                <MapPin className="w-4 h-4" /> Shipping Address
                              </h4>
                              <div className="bg-white p-4 border border-gray-200 text-sm font-mono space-y-1">
                                {order.shipping_details?.address ? (
                                  <>
                                    <div className="font-bold">{order.shipping_details.name}</div>
                                    <div>{order.shipping_details.address.line1}</div>
                                    {order.shipping_details.address.line2 && <div>{order.shipping_details.address.line2}</div>}
                                    <div>
                                      {order.shipping_details.address.city}, {order.shipping_details.address.state} {order.shipping_details.address.postal_code}
                                    </div>
                                    <div>{order.shipping_details.address.country}</div>
                                  </>
                                ) : (
                                  <div className="text-gray-400 italic">No shipping details available</div>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-400 italic">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
