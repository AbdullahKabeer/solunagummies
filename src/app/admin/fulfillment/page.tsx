'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Truck, Package, CheckCircle, Clock, MapPin, Search, 
  ExternalLink, Copy, AlertCircle, ChevronDown, ChevronUp,
  Printer, Box
} from 'lucide-react';

export default function FulfillmentCRM() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('unfulfilled'); // unfulfilled, shipped, all
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [trackingInput, setTrackingInput] = useState('');
  const [carrierInput, setCarrierInput] = useState('USPS');
  const supabase = createClient();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*),
        customer:customers(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  const updateOrderStatus = async (orderId: string, status: string, tracking?: string, carrier?: string) => {
    const updates: any = { status };
    if (tracking) updates.tracking_number = tracking;
    if (carrier) updates.carrier = carrier;
    if (status === 'shipped') updates.shipped_at = new Date().toISOString();

    const { error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', orderId);

    if (error) {
      alert('Failed to update order');
    } else {
      fetchOrders();
      setSelectedOrder(null);
      setTrackingInput('');
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'unfulfilled') return order.status === 'paid' || order.status === 'processing';
    if (filter === 'shipped') return order.status === 'shipped';
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'shipped': return 'bg-green-100 text-green-800 border-green-200';
      case 'delivered': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Truck className="h-6 w-6 text-blue-600" />
              Fulfillment CRM
            </h1>
            <p className="text-sm text-gray-500 mt-1">Manage shipments, print labels, and track deliveries.</p>
          </div>
          
          <div className="flex gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
            {['unfulfilled', 'shipped', 'all'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all capitalize
                  ${filter === f 
                    ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' 
                    : 'text-gray-600 hover:bg-gray-50'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Order List */}
          <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-12rem)]">
            <div className="p-4 border-b border-gray-200 bg-gray-50/50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search orders..." 
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="overflow-y-auto flex-1 divide-y divide-gray-100">
              {loading ? (
                <div className="p-8 text-center text-gray-400 text-sm">Loading orders...</div>
              ) : filteredOrders.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">No orders found</div>
              ) : (
                filteredOrders.map(order => (
                  <div 
                    key={order.id}
                    onClick={() => setSelectedOrder(order.id)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors border-l-4
                      ${selectedOrder === order.id ? 'bg-blue-50/50 border-blue-500' : 'border-transparent'}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-mono text-xs font-medium text-gray-500">#{order.order_number || order.id.slice(0,8)}</span>
                      <span className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="font-medium text-gray-900 mb-1">
                      {order.customer?.first_name} {order.customer?.last_name}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-wide font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <span className="text-xs text-gray-500">{order.order_items?.length} items</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Order Details / Workspace */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-12rem)]">
            {selectedOrder ? (
              (() => {
                const order = orders.find(o => o.id === selectedOrder);
                if (!order) return null;
                
                return (
                  <div className="flex flex-col h-full">
                    {/* Toolbar */}
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
                      <div className="flex items-center gap-3">
                        <h2 className="font-bold text-lg text-gray-900">Order #{order.order_number || order.id.slice(0,8)}</h2>
                        <span className={`text-xs px-2 py-1 rounded-md border uppercase font-bold ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg border border-gray-200 bg-white" title="Print Packing Slip">
                          <Printer className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                      {/* Shipping Address */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <MapPin className="h-3 w-3" /> Shipping Destination
                          </h3>
                          <div className="text-sm text-gray-900 space-y-1">
                            <p className="font-medium">{order.shipping_details?.name || `${order.customer?.first_name} ${order.customer?.last_name}`}</p>
                            <p>{order.shipping_details?.address?.line1}</p>
                            {order.shipping_details?.address?.line2 && <p>{order.shipping_details?.address?.line2}</p>}
                            <p>{order.shipping_details?.address?.city}, {order.shipping_details?.address?.state} {order.shipping_details?.address?.postal_code}</p>
                            <p>{order.shipping_details?.address?.country}</p>
                          </div>
                        </div>

                        {/* Fulfillment Actions */}
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                          <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Box className="h-3 w-3" /> Fulfillment Actions
                          </h3>
                          
                          {order.status === 'shipped' ? (
                            <div className="space-y-3">
                              <div className="bg-white p-3 rounded border border-blue-100">
                                <div className="text-xs text-gray-500 mb-1">Tracking Number ({order.carrier || 'Carrier'})</div>
                                <div className="font-mono font-medium text-blue-600 flex items-center gap-2">
                                  {order.tracking_number}
                                  <Copy className="h-3 w-3 cursor-pointer text-gray-400 hover:text-gray-600" />
                                </div>
                              </div>
                              <button 
                                onClick={() => window.open(`https://www.google.com/search?q=${order.tracking_number}`, '_blank')}
                                className="w-full py-2 bg-white border border-blue-200 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-50 flex items-center justify-center gap-2"
                              >
                                <ExternalLink className="h-4 w-4" /> Track Shipment
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div>
                                <label className="text-xs font-medium text-blue-800 mb-1 block">Carrier</label>
                                <select 
                                  value={carrierInput}
                                  onChange={(e) => setCarrierInput(e.target.value)}
                                  className="w-full p-2 text-sm border border-blue-200 rounded bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                  <option value="USPS">USPS</option>
                                  <option value="UPS">UPS</option>
                                  <option value="FedEx">FedEx</option>
                                  <option value="DHL">DHL</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-xs font-medium text-blue-800 mb-1 block">Tracking Number</label>
                                <input 
                                  type="text" 
                                  value={trackingInput}
                                  onChange={(e) => setTrackingInput(e.target.value)}
                                  placeholder="Scan or enter tracking #"
                                  className="w-full p-2 text-sm border border-blue-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                              <button 
                                onClick={() => updateOrderStatus(order.id, 'shipped', trackingInput, carrierInput)}
                                disabled={!trackingInput}
                                className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                              >
                                <Truck className="h-4 w-4" /> Mark as Shipped
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Order Items */}
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <Package className="h-4 w-4 text-gray-500" /> Items to Fulfill
                        </h3>
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                          <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                              <tr>
                                <th className="px-4 py-3 font-medium text-gray-500">Product</th>
                                <th className="px-4 py-3 font-medium text-gray-500 text-center">Qty</th>
                                <th className="px-4 py-3 font-medium text-gray-500 text-right">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {order.order_items?.map((item: any) => (
                                <tr key={item.id} className="bg-white">
                                  <td className="px-4 py-3">
                                    <div className="font-medium text-gray-900">{item.product_name || 'Product Name'}</div>
                                    <div className="text-xs text-gray-500">SKU: {item.sku || 'N/A'}</div>
                                  </td>
                                  <td className="px-4 py-3 text-center font-mono">{item.quantity}</td>
                                  <td className="px-4 py-3 text-right">
                                    {order.status === 'shipped' ? (
                                      <span className="inline-flex items-center gap-1 text-green-600 text-xs font-medium">
                                        <CheckCircle className="h-3 w-3" /> Fulfilled
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 text-yellow-600 text-xs font-medium">
                                        <Clock className="h-3 w-3" /> Pending
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Package className="h-12 w-12 mb-4 opacity-20" />
                <p>Select an order to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
