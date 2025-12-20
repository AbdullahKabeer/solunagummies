'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Package, RefreshCw, MapPin, LogOut, User as UserIcon, ArrowRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/Skeleton";

export default function AccountPage() {
  const { user, logout, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  
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
            const { data: customerByEmail } = await supabase
                .from('customers')
                .select('*')
                .eq('email', user.email)
                .limit(1)
                .maybeSingle();

            if (customerByEmail) {
                setCustomer(customerByEmail);
                currentCustomerId = customerByEmail.id;
                
                await supabase
                    .from('customers')
                    .update({ auth_user_id: user.id })
                    .eq('id', customerByEmail.id);
            } else {
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

  const subscriptionItems = orders.flatMap(order => 
    order.order_items.filter((item: any) => item.sku?.includes('S') || item.subscription)
      .map((item: any) => ({ ...item, order_date: order.created_at, status: 'Active' }))
  );

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
        const { error: updateError } = await supabase
            .from('addresses')
            .update(addressData)
            .eq('id', address.id);
        error = updateError;
    } else {
        const { error: insertError } = await supabase
            .from('addresses')
            .insert(addressData);
        error = insertError;
    }

    if (!error) {
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

  if (isAuthLoading) {
      return (
          <div className="min-h-screen bg-[#F2F0E9] flex flex-col">
              <Header />
              <main className="flex-1 pt-32 pb-12 px-4 sm:px-6 lg:px-8 flex justify-center">
                  <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              </main>
              <Footer />
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-[#F2F0E9] flex flex-col">
      <Header />
      
      <main className="flex-1 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black pb-8">
            <div>
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9]">
                My Account
              </h1>
              <p className="text-lg font-mono mt-4 text-gray-600">
                Welcome back, <span className="font-bold text-black">{user?.name}</span>
              </p>
            </div>
            <button 
              onClick={logout} 
              className="group flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:text-[#FF3300] transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
              <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </button>
          </div>

          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="w-full flex flex-col sm:flex-row bg-transparent p-0 gap-4 mb-12 border-b border-transparent sm:border-black/10 pb-0 sm:pb-4">
              <TabsTrigger 
                value="orders" 
                className="flex-1 justify-center bg-white border border-black shadow-[4px_4px_0px_0px_#000] data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:translate-x-[2px] data-[state=active]:translate-y-[2px] data-[state=active]:shadow-none transition-all py-4 text-sm font-bold uppercase tracking-wider rounded-none"
              >
                Order History
              </TabsTrigger>
              <TabsTrigger 
                value="subscriptions" 
                className="flex-1 justify-center bg-white border border-black shadow-[4px_4px_0px_0px_#000] data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:translate-x-[2px] data-[state=active]:translate-y-[2px] data-[state=active]:shadow-none transition-all py-4 text-sm font-bold uppercase tracking-wider rounded-none"
              >
                Subscriptions
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="flex-1 justify-center bg-white border border-black shadow-[4px_4px_0px_0px_#000] data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:translate-x-[2px] data-[state=active]:translate-y-[2px] data-[state=active]:shadow-none transition-all py-4 text-sm font-bold uppercase tracking-wider rounded-none"
              >
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="space-y-8">
              {isLoadingData ? (
                <div className="space-y-6">
                    {[1, 2].map((i) => (
                        <div key={i} className="bg-white border border-black p-6 shadow-[4px_4px_0px_0px_#000]">
                            <Skeleton className="h-8 w-1/3 mb-4 bg-gray-200 rounded-none" />
                            <Skeleton className="h-24 w-full bg-gray-100 rounded-none" />
                        </div>
                    ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="bg-white border border-black p-12 text-center shadow-[8px_8px_0px_0px_#000]">
                    <div className="w-20 h-20 bg-[#F2F0E9] border border-black rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package className="w-8 h-8 text-black" />
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tight mb-2">No orders yet</h3>
                    <p className="font-mono text-gray-500 mb-8 max-w-md mx-auto">
                        Looks like you haven't placed any orders yet. Start your journey to better focus today.
                    </p>
                    <Button asChild className="bg-[#FF3300] text-white px-8 py-6 font-mono text-sm uppercase tracking-wider border border-black hover:bg-[#e62e00] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_0px_#000] rounded-none transition-all">
                      <a href="/">Start Shopping</a>
                    </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-white border border-black shadow-[4px_4px_0px_0px_#000] group hover:shadow-[6px_6px_0px_0px_#000] transition-all">
                      <div className="p-6 border-b border-black bg-gray-50 flex flex-wrap gap-6 justify-between items-center">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-12 gap-y-4">
                            <div>
                                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Date</div>
                                <div className="font-mono text-sm font-bold">{new Date(order.created_at).toLocaleDateString()}</div>
                            </div>
                            <div>
                                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Total</div>
                                <div className="font-mono text-sm font-bold">${order.amount.toFixed(2)}</div>
                            </div>
                            <div>
                                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Order #</div>
                                <div className="font-mono text-sm">{order.id.slice(0, 8)}</div>
                            </div>
                            <div>
                                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Status</div>
                                <span className={`inline-flex items-center px-2 py-1 border border-black text-[10px] font-bold uppercase tracking-wider ${
                                    order.status === 'paid' ? 'bg-[#ccff00] text-black' : 'bg-gray-200 text-gray-800'
                                }`}>
                                    {order.status}
                                </span>
                            </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="space-y-6">
                          {order.order_items.map((item: any) => (
                            <div key={item.id} className="flex items-center justify-between">
                              <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-[#F2F0E9] border border-black flex items-center justify-center font-mono font-bold text-lg">
                                  {item.quantity}x
                                </div>
                                <div>
                                  <h4 className="font-bold uppercase tracking-tight text-lg">{item.name}</h4>
                                  <p className="text-xs font-mono text-gray-500 mt-1">{item.sku}</p>
                                </div>
                              </div>
                              <div className="font-mono font-bold text-lg">
                                ${item.price.toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="subscriptions" className="space-y-8">
              {isLoadingData ? (
                 <div className="bg-white border border-black p-6 shadow-[4px_4px_0px_0px_#000]">
                    <Skeleton className="h-24 w-full bg-gray-100 rounded-none" />
                 </div>
              ) : subscriptionItems.length === 0 ? (
                <div className="bg-white border border-black p-12 text-center shadow-[8px_8px_0px_0px_#000]">
                    <div className="w-20 h-20 bg-[#F2F0E9] border border-black rounded-full flex items-center justify-center mx-auto mb-6">
                        <RefreshCw className="w-8 h-8 text-black" />
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tight mb-2">No active subscriptions</h3>
                    <p className="font-mono text-gray-500 mb-8 max-w-md mx-auto">
                        Subscribe to your favorite products and save 15% on every order.
                    </p>
                    <Button asChild className="bg-[#FF3300] text-white px-8 py-6 font-mono text-sm uppercase tracking-wider border border-black hover:bg-[#e62e00] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_0px_#000] rounded-none transition-all">
                      <a href="/#purchase">Subscribe & Save</a>
                    </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {subscriptionItems.map((item: any, idx: number) => (
                    <div key={idx} className="bg-white border border-black shadow-[4px_4px_0px_0px_#000] p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-[#ccff00] border border-black flex items-center justify-center">
                            <RefreshCw className="w-6 h-6 text-black" />
                          </div>
                          <div>
                            <h3 className="font-black uppercase text-xl tracking-tight">{item.name}</h3>
                            <p className="text-xs font-mono text-gray-500 mt-1">Started: {new Date(item.order_date).toLocaleDateString()}</p>
                            <div className="mt-3 inline-flex items-center px-3 py-1 border border-black bg-black text-white text-[10px] font-bold uppercase tracking-wider">
                              Active
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" className="border-black font-bold uppercase tracking-wider hover:bg-black hover:text-white rounded-none h-12 px-6">
                            Manage
                        </Button>
                    </div>
                  ))}
                  <div className="bg-blue-50 border border-black p-4 flex gap-4 items-start">
                    <div className="flex-shrink-0 mt-1">
                        <RefreshCw className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="font-mono text-xs text-blue-900 leading-relaxed">
                        To pause or cancel your subscription, please contact support or use the "Manage" button above.
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="settings" className="space-y-8">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="bg-white border border-black shadow-[4px_4px_0px_0px_#000]">
                  <div className="p-6 border-b border-black bg-gray-50">
                    <h3 className="font-black uppercase tracking-tight text-xl flex items-center gap-3">
                        <UserIcon className="w-5 h-5" />
                        Profile Info
                    </h3>
                  </div>
                  <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">Full Name</label>
                        <div className="font-mono text-sm border border-black p-3 bg-[#F2F0E9]">{user?.name}</div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">Email Address</label>
                        <div className="font-mono text-sm border border-black p-3 bg-[#F2F0E9]">{user?.email}</div>
                    </div>
                    {customer && (
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">Phone Number</label>
                            <div className="font-mono text-sm border border-black p-3 bg-[#F2F0E9]">{customer.phone || 'Not provided'}</div>
                        </div>
                    )}
                  </div>
                </div>

                <div className="bg-white border border-black shadow-[4px_4px_0px_0px_#000]">
                  <div className="p-6 border-b border-black bg-gray-50 flex items-center justify-between">
                    <h3 className="font-black uppercase tracking-tight text-xl flex items-center gap-3">
                        <MapPin className="w-5 h-5" />
                        Shipping
                    </h3>
                    <button 
                        onClick={() => setIsEditingAddress(!isEditingAddress)}
                        className="text-xs font-bold uppercase underline hover:text-[#FF3300]"
                    >
                        {isEditingAddress ? 'Cancel' : 'Edit'}
                    </button>
                  </div>
                  <div className="p-6">
                    {isEditingAddress ? (
                        <form onSubmit={handleSaveAddress} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-wider">Full Name</label>
                                <input 
                                    type="text" 
                                    value={addressForm.name}
                                    onChange={(e) => setAddressForm({...addressForm, name: e.target.value})}
                                    className="w-full border border-black p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3300] rounded-none"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-wider">Address Line 1</label>
                                <input 
                                    type="text" 
                                    value={addressForm.line1}
                                    onChange={(e) => setAddressForm({...addressForm, line1: e.target.value})}
                                    className="w-full border border-black p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3300] rounded-none"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-wider">Address Line 2</label>
                                <input 
                                    type="text" 
                                    value={addressForm.line2}
                                    onChange={(e) => setAddressForm({...addressForm, line2: e.target.value})}
                                    className="w-full border border-black p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3300] rounded-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-wider">City</label>
                                    <input 
                                        type="text" 
                                        value={addressForm.city}
                                        onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                                        className="w-full border border-black p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3300] rounded-none"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-wider">State</label>
                                    <input 
                                        type="text" 
                                        value={addressForm.state}
                                        onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                                        className="w-full border border-black p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3300] rounded-none"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-wider">Postal Code</label>
                                    <input 
                                        type="text" 
                                        value={addressForm.postal_code}
                                        onChange={(e) => setAddressForm({...addressForm, postal_code: e.target.value})}
                                        className="w-full border border-black p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3300] rounded-none"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-wider">Country</label>
                                    <input 
                                        type="text" 
                                        value={addressForm.country}
                                        onChange={(e) => setAddressForm({...addressForm, country: e.target.value})}
                                        className="w-full border border-black p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3300] rounded-none"
                                        required
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full bg-black text-white font-bold uppercase tracking-wider py-6 rounded-none hover:bg-[#FF3300] transition-colors">
                                Save Address
                            </Button>
                        </form>
                    ) : (
                        shippingAddress ? (
                        <div className="font-mono text-sm space-y-2">
                            <p className="font-bold">{shippingAddress.name}</p>
                            <p>{shippingAddress.address?.line1}</p>
                            {shippingAddress.address?.line2 && <p>{shippingAddress.address.line2}</p>}
                            <p>{shippingAddress.address?.city}, {shippingAddress.address?.state} {shippingAddress.address?.postal_code}</p>
                            <p>{shippingAddress.address?.country}</p>
                        </div>
                        ) : (
                        <div className="text-center py-8 border-2 border-dashed border-gray-300">
                            <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                            <p className="text-sm font-mono text-gray-500">No shipping address saved yet.</p>
                            <Button variant="link" onClick={() => setIsEditingAddress(true)} className="mt-2 font-bold uppercase text-black">
                                Add Address
                            </Button>
                        </div>
                        )
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
