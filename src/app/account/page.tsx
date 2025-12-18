'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Package, RefreshCw, MapPin, LogOut, ChevronRight, ExternalLink } from 'lucide-react';

export default function AccountPage() {
  const { user, logout, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  
  const [activeTab, setActiveTab] = useState<'orders' | 'subscriptions' | 'settings'>('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [customer, setCustomer] = useState<any>(null);
  const [address, setAddress] = useState<any>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    name: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: ''
  });

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login');
    }
  }, [user, isAuthLoading, router]);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        setIsLoadingData(true);
        
        // Fetch Orders
        const { data: ordersData } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (ordersData) setOrders(ordersData);

        // Fetch Customer Profile
        // Try to find by auth_user_id first
        const { data: customerData } = await supabase
          .from('customers')
          .select('*')
          .eq('auth_user_id', user.id)
          .maybeSingle();
        
        let currentCustomerId = null;

        if (customerData) {
            setCustomer(customerData);
            currentCustomerId = customerData.id;
        } else if (user.email) {
            // Fallback: try to find by email
            const { data: customerByEmail } = await supabase
                .from('customers')
                .select('*')
                .eq('email', user.email)
                .limit(1)
                .maybeSingle();

            if (customerByEmail) {
                setCustomer(customerByEmail);
                currentCustomerId = customerByEmail.id;
                
                // Link this customer to the auth user
                await supabase
                    .from('customers')
                    .update({ auth_user_id: user.id })
                    .eq('id', customerByEmail.id);
            } else {
                // Create new customer record if none exists
                const { data: newCustomer } = await supabase
                    .from('customers')
                    .insert({
                        auth_user_id: user.id,
                        email: user.email,
                        first_name: user.name?.split(' ')[0] || '',
                        last_name: user.name?.split(' ').slice(1).join(' ') || '',
                        accepts_marketing: false
                    })
                    .select()
                    .single();
                
                if (newCustomer) {
                    setCustomer(newCustomer);
                    currentCustomerId = newCustomer.id;
                }
            }
        }

        // Fetch Address
        if (currentCustomerId) {
            const { data: addressData } = await supabase
                .from('addresses')
                .select('*')
                .eq('customer_id', currentCustomerId)
                .eq('is_default', true)
                .single();
            
            if (addressData) setAddress(addressData);
        }

        setIsLoadingData(false);
      };

      fetchData();
    }
  }, [user, supabase]);

  // Filter for subscriptions (items with 'S' in SKU or subscription flag)
  const subscriptionItems = orders.flatMap(order => 
    order.order_items.filter((item: any) => item.sku?.includes('S') || item.subscription)
      .map((item: any) => ({ ...item, order_date: order.created_at, status: 'Active' })) // Mock status
  );

  // Get shipping address from address table or most recent order
  const shippingAddress = useMemo(() => address ? {
      name: `${address.first_name} ${address.last_name}`,
      address: {
          line1: address.address1,
          line2: address.address2,
          city: address.city,
          state: address.province,
          postal_code: address.zip,
          country: address.country
      }
  } : orders[0]?.shipping_details, [address, orders]);

  useEffect(() => {
    if (shippingAddress) {
        setAddressForm({
            name: shippingAddress.name || '',
            line1: shippingAddress.address?.line1 || '',
            line2: shippingAddress.address?.line2 || '',
            city: shippingAddress.address?.city || '',
            state: shippingAddress.address?.state || '',
            postal_code: shippingAddress.address?.postal_code || '',
            country: shippingAddress.address?.country || ''
        });
    }
  }, [shippingAddress]);

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customer) return;

    const addressData = {
        customer_id: customer.id,
        first_name: addressForm.name.split(' ')[0] || '',
        last_name: addressForm.name.split(' ').slice(1).join(' ') || '',
        address1: addressForm.line1,
        address2: addressForm.line2,
        city: addressForm.city,
        province: addressForm.state,
        zip: addressForm.postal_code,
        country: addressForm.country,
        is_default: true
    };

    let error;
    
    if (address) {
        // Update existing
        const { error: updateError } = await supabase
            .from('addresses')
            .update(addressData)
            .eq('id', address.id);
        error = updateError;
    } else {
        // Insert new
        const { error: insertError } = await supabase
            .from('addresses')
            .insert(addressData);
        error = insertError;
    }

    if (!error) {
        // Refresh address data
        const { data: updatedAddress } = await supabase
            .from('addresses')
            .select('*')
            .eq('customer_id', customer.id)
            .eq('is_default', true)
            .single();
            
        if (updatedAddress) setAddress(updatedAddress);
        setIsEditingAddress(false);
    } else {
        alert('Failed to update address. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F0E9] flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">My Account</h1>
            <p className="font-mono text-sm text-gray-600">Welcome back, {user?.name}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-3">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-bold uppercase tracking-wider border border-black transition-all ${
                    activeTab === 'orders' 
                      ? 'bg-black text-white' 
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <Package className="w-4 h-4 mr-3" />
                  Orders
                </button>
                <button
                  onClick={() => setActiveTab('subscriptions')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-bold uppercase tracking-wider border border-black border-t-0 transition-all ${
                    activeTab === 'subscriptions' 
                      ? 'bg-black text-white' 
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <RefreshCw className="w-4 h-4 mr-3" />
                  Subscriptions
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-bold uppercase tracking-wider border border-black border-t-0 transition-all ${
                    activeTab === 'settings' 
                      ? 'bg-black text-white' 
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <MapPin className="w-4 h-4 mr-3" />
                  Shipping & Profile
                </button>
                <button
                  onClick={logout}
                  className="w-full flex items-center px-4 py-3 text-sm font-bold uppercase tracking-wider border border-black border-t-0 bg-white hover:bg-red-50 text-red-600 transition-all mt-8"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign Out
                </button>
              </nav>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-9">
              {isLoadingData ? (
                <div className="flex justify-center py-12">
                    <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  {/* ORDERS TAB */}
                  {activeTab === 'orders' && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-black uppercase tracking-tighter">Order History</h2>
                      {orders.length === 0 ? (
                        <div className="bg-white border border-black p-8 text-center">
                          <p className="font-mono text-sm text-gray-500 mb-4">No orders found.</p>
                          <a href="/" className="inline-block bg-black text-white px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-[#FF3300] transition-colors">
                            Start Shopping
                          </a>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {orders.map((order) => (
                            <div key={order.id} className="bg-white border border-black p-6">
                              <div className="flex flex-wrap justify-between items-start gap-4 mb-6 pb-6 border-b border-gray-100">
                                <div>
                                  <div className="text-[10px] font-bold uppercase text-gray-500 mb-1">Order ID</div>
                                  <div className="font-mono text-sm">{order.id.slice(0, 8)}...</div>
                                </div>
                                <div>
                                  <div className="text-[10px] font-bold uppercase text-gray-500 mb-1">Date</div>
                                  <div className="font-mono text-sm">{new Date(order.created_at).toLocaleDateString()}</div>
                                </div>
                                <div>
                                  <div className="text-[10px] font-bold uppercase text-gray-500 mb-1">Status</div>
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                                    order.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {order.status}
                                  </span>
                                </div>
                                <div>
                                  <div className="text-[10px] font-bold uppercase text-gray-500 mb-1">Total</div>
                                  <div className="font-mono text-sm">${order.amount.toFixed(2)}</div>
                                </div>
                              </div>
                              
                              <div className="space-y-3">
                                {order.order_items.map((item: any) => (
                                  <div key={item.id} className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                      <div className="w-12 h-12 bg-gray-100 border border-black flex items-center justify-center text-xs font-bold">
                                        {item.quantity}x
                                      </div>
                                      <div>
                                        <div className="font-bold text-sm uppercase">{item.name}</div>
                                        <div className="text-xs text-gray-500 font-mono">{item.sku}</div>
                                      </div>
                                    </div>
                                    <div className="font-mono text-sm">${item.price.toFixed(2)}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* SUBSCRIPTIONS TAB */}
                  {activeTab === 'subscriptions' && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-black uppercase tracking-tighter">My Subscriptions</h2>
                      {subscriptionItems.length === 0 ? (
                        <div className="bg-white border border-black p-8 text-center">
                          <p className="font-mono text-sm text-gray-500 mb-4">You don't have any active subscriptions.</p>
                          <a href="/#purchase" className="inline-block bg-black text-white px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-[#FF3300] transition-colors">
                            Subscribe & Save
                          </a>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {subscriptionItems.map((item: any, idx: number) => (
                            <div key={idx} className="bg-white border border-black p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                              <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-[#F2F0E9] border border-black flex items-center justify-center">
                                  <RefreshCw className="w-6 h-6 text-gray-400" />
                                </div>
                                <div>
                                  <h3 className="font-bold uppercase text-lg">{item.name}</h3>
                                  <p className="text-xs font-mono text-gray-500">Started: {new Date(item.order_date).toLocaleDateString()}</p>
                                  <div className="mt-2 inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-[10px] font-bold uppercase rounded-full">
                                    Active
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-3 w-full md:w-auto">
                                <button className="flex-1 md:flex-none px-4 py-2 border border-black text-xs font-bold uppercase hover:bg-black hover:text-white transition-colors">
                                  Manage
                                </button>
                              </div>
                            </div>
                          ))}
                          <div className="bg-blue-50 border border-blue-200 p-4 text-xs font-mono text-blue-800">
                            To pause or cancel your subscription, please contact support or use the "Manage" button above (Coming Soon).
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* SETTINGS TAB */}
                  {activeTab === 'settings' && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-black uppercase tracking-tighter">Shipping & Profile</h2>
                      
                      <div className="bg-white border border-black p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold uppercase flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Default Shipping Address
                            </h3>
                            <button 
                                onClick={() => setIsEditingAddress(!isEditingAddress)}
                                className="text-xs font-bold uppercase underline hover:text-[#FF3300]"
                            >
                                {isEditingAddress ? 'Cancel' : 'Edit'}
                            </button>
                        </div>
                        
                        {isEditingAddress ? (
                            <form onSubmit={handleSaveAddress} className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase mb-1">Full Name</label>
                                    <input 
                                        type="text" 
                                        value={addressForm.name}
                                        onChange={(e) => setAddressForm({...addressForm, name: e.target.value})}
                                        className="w-full border border-black p-2 text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase mb-1">Address Line 1</label>
                                    <input 
                                        type="text" 
                                        value={addressForm.line1}
                                        onChange={(e) => setAddressForm({...addressForm, line1: e.target.value})}
                                        className="w-full border border-black p-2 text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase mb-1">Address Line 2</label>
                                    <input 
                                        type="text" 
                                        value={addressForm.line2}
                                        onChange={(e) => setAddressForm({...addressForm, line2: e.target.value})}
                                        className="w-full border border-black p-2 text-sm"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase mb-1">City</label>
                                        <input 
                                            type="text" 
                                            value={addressForm.city}
                                            onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                                            className="w-full border border-black p-2 text-sm"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase mb-1">State</label>
                                        <input 
                                            type="text" 
                                            value={addressForm.state}
                                            onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                                            className="w-full border border-black p-2 text-sm"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase mb-1">Postal Code</label>
                                        <input 
                                            type="text" 
                                            value={addressForm.postal_code}
                                            onChange={(e) => setAddressForm({...addressForm, postal_code: e.target.value})}
                                            className="w-full border border-black p-2 text-sm"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase mb-1">Country</label>
                                        <input 
                                            type="text" 
                                            value={addressForm.country}
                                            onChange={(e) => setAddressForm({...addressForm, country: e.target.value})}
                                            className="w-full border border-black p-2 text-sm"
                                            required
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="bg-black text-white px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-[#FF3300] transition-colors">
                                    Save Address
                                </button>
                            </form>
                        ) : (
                            shippingAddress ? (
                            <div className="font-mono text-sm space-y-1 text-gray-600">
                                <p className="font-bold text-black">{shippingAddress.name}</p>
                                <p>{shippingAddress.address?.line1}</p>
                                {shippingAddress.address?.line2 && <p>{shippingAddress.address.line2}</p>}
                                <p>{shippingAddress.address?.city}, {shippingAddress.address?.state} {shippingAddress.address?.postal_code}</p>
                                <p>{shippingAddress.address?.country}</p>
                            </div>
                            ) : (
                            <p className="font-mono text-sm text-gray-500">No shipping address saved yet.</p>
                            )
                        )}
                      </div>

                      <div className="bg-white border border-black p-6">
                        <h3 className="font-bold uppercase mb-4 flex items-center gap-2">
                          <UserIcon className="w-4 h-4" />
                          Profile Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-bold uppercase mb-1 text-gray-500">Full Name</label>
                                <div className="font-mono text-sm border-b border-gray-200 pb-2">{user?.name}</div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase mb-1 text-gray-500">Email</label>
                                <div className="font-mono text-sm border-b border-gray-200 pb-2">{user?.email}</div>
                            </div>
                            {customer && (
                                <>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase mb-1 text-gray-500">Phone</label>
                                        <div className="font-mono text-sm border-b border-gray-200 pb-2">{customer.phone || '-'}</div>
                                    </div>
                                </>
                            )}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function UserIcon({ className }: { className?: string }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
        </svg>
    )
}
