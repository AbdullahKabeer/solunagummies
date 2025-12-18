'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Check, X, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useAuth } from '@/context/AuthContext';

export default function OrderSuccessModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [orderId, setOrderId] = useState('');
  const supabase = createClient();
  const { track } = useAnalytics();
  const { user } = useAuth();
  
  const [showAccountCreation, setShowAccountCreation] = useState(false);
  const [orderEmail, setOrderEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [accountError, setAccountError] = useState('');

  useEffect(() => {
    const success = searchParams.get('order_success');
    const id = searchParams.get('order_id');

    if (success === 'true' && id) {
      setIsOpen(true);
      setOrderId(id);

      // Fetch order details for tracking and account creation
      const trackPurchase = async () => {
        const { data: order } = await supabase
          .from('orders')
          .select('amount, order_items(quantity, sku), shipping_details')
          .eq('id', id)
          .single();
        
        if (order) {
           const itemCount = order.order_items.reduce((acc: number, item: any) => acc + item.quantity, 0);
           track('purchase', {
             transaction_id: id,
             value: order.amount,
             currency: 'USD',
             item_count: itemCount
           });

           // Check if we should prompt for account creation
           // We prompt if user is not logged in, and especially if they bought a subscription (SKU contains 'S')
           // But generally good to capture all.
           const email = order.shipping_details?.email;
           if (email) {
             setOrderEmail(email);
             // Check if subscription
             const hasSubscription = order.order_items.some((item: any) => item.sku?.includes('S'));
             
             // If not logged in, show account creation
             // We can also check if the email is already registered in auth (but we can't easily without trying to sign up or admin api)
             // So we just show it if no current session.
             if (!user) {
                setShowAccountCreation(true);
             }
           }
        }
      };
      trackPurchase();

      // Clean up URL without refresh
      window.history.replaceState(null, '', '/');
    }
  }, [searchParams]);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingAccount(true);
    setAccountError('');

    try {
        const { error } = await supabase.auth.signUp({
            email: orderEmail,
            password: password,
            options: {
                data: {
                    phone: phone,
                    birthdate: birthdate,
                    gender: gender
                }
            }
        });

        if (error) throw error;

        // Success
        alert('Account created successfully! Please check your email to confirm.');
        setShowAccountCreation(false);

    } catch (err: any) {
        setAccountError(err.message);
    } finally {
        setIsCreatingAccount(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-[#F2F0E9] w-full max-w-md border border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="bg-black text-white p-4 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#FF3300] rounded-full animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-widest">Order Confirmed</span>
              </div>
              <button onClick={handleClose} className="hover:text-[#FF3300] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 text-center overflow-y-auto">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-black">
                <Check className="w-8 h-8 text-white" strokeWidth={3} />
              </div>

              <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">
                Thank You!
              </h2>
              <p className="font-mono text-sm text-gray-600 mb-8">
                Your order has been successfully placed. We've sent a confirmation email with details.
              </p>

              {showAccountCreation && (
                <div className="mb-8 pt-6 border-t border-black text-left">
                  <h3 className="font-bold uppercase mb-2">Create Account</h3>
                  <p className="text-xs text-gray-600 mb-4">
                    Create an account to track your order and manage your subscription.
                  </p>
                  <form onSubmit={handleCreateAccount} className="space-y-3">
                    <div>
                        <label className="block text-[10px] font-bold uppercase mb-1">Email</label>
                        <input type="email" value={orderEmail} disabled className="w-full bg-gray-100 border border-black p-2 text-sm opacity-60 cursor-not-allowed" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase mb-1">Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-black p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF3300]"
                            placeholder="Create a password"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase mb-1">Phone (Optional)</label>
                        <input 
                            type="tel" 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full border border-black p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF3300]"
                            placeholder="+1 (555) 000-0000"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold uppercase mb-1">Birthdate (Optional)</label>
                            <input 
                                type="date" 
                                value={birthdate} 
                                onChange={(e) => setBirthdate(e.target.value)}
                                className="w-full border border-black p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF3300]"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase mb-1">Gender (Optional)</label>
                            <select 
                                value={gender} 
                                onChange={(e) => setGender(e.target.value)}
                                className="w-full border border-black p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF3300] bg-white"
                            >
                                <option value="">Select...</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                                <option value="prefer_not_to_say">Prefer not to say</option>
                            </select>
                        </div>
                    </div>
                    
                    {accountError && (
                        <div className="text-red-500 text-xs font-mono">{accountError}</div>
                    )}

                    <button 
                        type="submit" 
                        disabled={isCreatingAccount}
                        className="w-full bg-black text-white font-bold uppercase py-3 hover:bg-[#FF3300] transition-colors disabled:opacity-50 text-xs tracking-widest"
                    >
                        {isCreatingAccount ? 'Creating...' : 'Create Account'}
                    </button>
                  </form>
                </div>
              )}

              {/* Order ID Box */}
              <div className="bg-white border border-black p-4 mb-8 relative group cursor-pointer" onClick={() => navigator.clipboard.writeText(orderId)}>
                <p className="text-[10px] font-bold uppercase text-gray-400 mb-1">Order ID</p>
                <div className="flex items-center justify-center gap-2">
                  <code className="font-mono text-lg font-bold">{orderId}</code>
                  <Copy className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
                </div>
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-xs font-bold bg-black text-white px-2 py-1">COPY</span>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full bg-black text-white py-4 font-bold uppercase tracking-wider hover:bg-[#FF3300] transition-colors"
              >
                Continue Shopping
              </button>
            </div>

            {/* Decorative Footer */}
            <div className="h-2 bg-[url('/noise.png')] opacity-20" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
