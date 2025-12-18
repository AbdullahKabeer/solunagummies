'use client';

import React, { useEffect, useState } from 'react';
import {
  PaymentElement,
  LinkAuthenticationElement,
  AddressElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { useCart } from '@/context/CartContext';
import { useSession } from '@/context/SessionContext';
import { useAuth } from '@/context/AuthContext';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClient();
  
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [shippingDetails, setShippingDetails] = useState<any>(null);
  const [savedAddress, setSavedAddress] = useState<any>(null);
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const { cartTotal, clearCart, items } = useCart();
  const { sessionId } = useSession();

  // Auto-fill email and fetch shipping details if logged in
  useEffect(() => {
    if (user) {
      setEmail(user.email);
      
      const fetchCustomerDetails = async () => {
        // First get customer ID
        let { data: customer } = await supabase
          .from('customers')
          .select('id')
          .eq('auth_user_id', user.id)
          .maybeSingle();
        
        // Fallback to email if not found by auth_id
        if (!customer && user.email) {
             const { data: customerByEmail } = await supabase
                .from('customers')
                .select('id')
                .eq('email', user.email)
                .maybeSingle();
             customer = customerByEmail;
        }
        
        if (customer) {
            // Then get default address
            const { data: address } = await supabase
                .from('addresses')
                .select('*')
                .eq('customer_id', customer.id)
                .eq('is_default', true)
                .maybeSingle();
            
            if (address) {
                const formattedAddress = {
                    name: `${address.first_name} ${address.last_name}`,
                    phone: address.phone,
                    address: {
                        line1: address.address1,
                        line2: address.address2,
                        city: address.city,
                        state: address.province,
                        postal_code: address.zip,
                        country: address.country
                    }
                };
                setSavedAddress(formattedAddress);
                setShippingDetails(formattedAddress);
            }
        }
      };
      fetchCustomerDetails();
    }
  }, [user, supabase]);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(async ({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case 'succeeded':
          setMessage('Payment succeeded!');
          
          // Handle redirect return: Create order if items exist
          if (items.length > 0) {
            try {
              const response = await fetch('/api/orders/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  paymentIntentId: paymentIntent.id,
                  amount: paymentIntent.amount,
                  email: paymentIntent.receipt_email, // Should be in PI
                  items: items,
                  sessionId: sessionId,
                  shippingDetails: paymentIntent.shipping, // Should be in PI
                }),
              });

              if (response.ok) {
                const data = await response.json();
                clearCart();
                router.push(`/?order_success=true&order_id=${data.orderId}`);
              } else {
                // Fallback if order creation fails but payment succeeded
                clearCart();
                router.push('/?order_success=true&order_id=unknown');
              }
            } catch (err) {
              console.error('Error creating order after redirect:', err);
              clearCart();
              router.push('/?order_success=true&order_id=unknown');
            }
          } else {
            // Cart already cleared or empty
            router.push('/');
          }
          break;
        case 'processing':
          setMessage('Your payment is processing.');
          break;
        case 'requires_payment_method':
          setMessage('Your payment was not successful, please try again.');
          break;
        default:
          setMessage('Something went wrong.');
          break;
      }
    });
  }, [stripe, clearCart, items, sessionId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${window.location.origin}/checkout?success=true`,
      },
      redirect: 'if_required',
    });

    if (error) {
      if (error.type === 'card_error' || error.type === 'validation_error') {
        setMessage(error.message || 'An unexpected error occurred.');
      } else {
        setMessage('An unexpected error occurred.');
      }
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Payment succeeded, create order in database
      try {
        const response = await fetch('/api/orders/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount,
            email: email,
            items: items, // Send cart items
            sessionId: sessionId,
            shippingDetails: shippingDetails,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          clearCart();
          router.push(`/?order_success=true&order_id=${data.orderId}`);
        } else {
          console.error('Failed to create order');
          // Still redirect to success but maybe log the error?
          // Or show an error message? 
          // Ideally we want the user to know payment worked even if order creation failed (edge case)
          router.push('/?order_success=true&order_id=unknown');
        }
      } catch (err) {
        console.error('Error creating order:', err);
        router.push('/?order_success=true&order_id=unknown');
      }
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs" as const,
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-8">
      
      {/* 1. Email Address */}
      <div>
        <h3 className="text-lg font-bold uppercase tracking-wide mb-4">Contact Information</h3>
        <LinkAuthenticationElement
          key={user?.email || 'guest-email'}
          id="link-authentication-element"
          onChange={(e) => setEmail(e.value.email)}
          options={{ defaultValues: { email } }}
        />
      </div>

      {/* 2. Shipping Address */}
      <div>
        <h3 className="text-lg font-bold uppercase tracking-wide mb-4">Shipping Address</h3>
        <AddressElement
          key={savedAddress ? 'saved-address' : 'guest-address'}
          options={{
            mode: 'shipping',
            defaultValues: savedAddress ? {
                name: savedAddress.name,
                phone: savedAddress.phone,
                address: {
                    line1: savedAddress.address?.line1,
                    line2: savedAddress.address?.line2,
                    city: savedAddress.address?.city,
                    state: savedAddress.address?.state,
                    postal_code: savedAddress.address?.postal_code,
                    country: savedAddress.address?.country,
                }
            } : undefined,
            fields: {
              phone: 'always',
            },
            validation: {
              phone: {
                required: 'never',
              },
            },
          }}
          onChange={(e) => {
            if (e.complete) {
              setShippingDetails(e.value);
            }
          }}
        />
      </div>

      {/* 3. Delivery Options (Mock) */}
      <div>
        <h3 className="text-lg font-bold uppercase tracking-wide mb-4">Delivery Method</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-4 border border-black bg-[#F5F5F0] cursor-pointer">
            <div className="flex items-center gap-3">
              <input type="radio" name="delivery" defaultChecked className="accent-black w-4 h-4" />
              <span className="font-bold text-sm">Standard Shipping</span>
            </div>
            <span className="font-mono text-sm">Free</span>
          </label>
          <label className="flex items-center justify-between p-4 border border-gray-200 bg-white cursor-pointer opacity-60">
            <div className="flex items-center gap-3">
              <input type="radio" name="delivery" disabled className="accent-black w-4 h-4" />
              <span className="font-bold text-sm">Express Shipping</span>
            </div>
            <span className="font-mono text-sm">$15.00</span>
          </label>
        </div>
      </div>

      {/* 4. Payment Method */}
      <div>
        <h3 className="text-lg font-bold uppercase tracking-wide mb-4">Payment Details</h3>
        <PaymentElement id="payment-element" options={paymentElementOptions} />
      </div>

      {/* 5. Promo Code */}
      <div className="border-t border-b border-gray-200 py-4">
        <button 
          type="button" 
          onClick={() => setIsPromoOpen(!isPromoOpen)} 
          className="flex items-center justify-between w-full text-sm font-bold uppercase tracking-wide hover:text-[#FF3300] transition-colors"
        >
          <span>Have a promo code?</span>
          {isPromoOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {isPromoOpen && (
          <div className="mt-4 flex gap-2">
            <input 
              type="text" 
              className="flex-1 border border-black/20 p-3 font-mono text-sm focus:outline-none focus:border-black" 
              placeholder="ENTER CODE" 
            />
            <button 
              type="button" 
              className="bg-gray-200 px-6 py-3 font-bold text-sm uppercase tracking-wider hover:bg-gray-300 transition-colors"
            >
              Apply
            </button>
          </div>
        )}
      </div>

      {/* 6. Submit Button */}
      <button 
        disabled={isLoading || !stripe || !elements} 
        id="submit"
        className="w-full bg-black text-white py-4 font-bold uppercase tracking-wider hover:bg-[#FF3300] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span id="button-text">
          {isLoading ? "Processing..." : `Pay $${cartTotal.toFixed(2)}`}
        </span>
      </button>
      {message && <div id="payment-message" className="text-red-500 text-sm text-center font-mono">{message}</div>}
    </form>
  );
}
