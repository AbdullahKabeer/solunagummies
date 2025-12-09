'use client';

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/CheckoutForm';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Package, CreditCard } from 'lucide-react';

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState('');
  const { items, cartTotal } = useCart();

  useEffect(() => {
    if (items.length > 0) {
      // Create PaymentIntent as soon as the page loads
      fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret));
    }
  }, [items]);

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#000000',
      colorBackground: '#ffffff',
      colorText: '#121212',
      colorDanger: '#FF3300',
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      spacingUnit: '4px',
      borderRadius: '0px',
      fontSizeBase: '14px',
    },
    rules: {
      '.Input': {
        border: '1px solid #000000',
        boxShadow: 'none',
      },
      '.Input:focus': {
        border: '1px solid #000000',
        boxShadow: '4px 4px 0px 0px #000000',
      },
      '.Label': {
        fontWeight: '700',
        textTransform: 'uppercase',
        fontSize: '12px',
        letterSpacing: '0.05em',
      }
    }
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="min-h-screen bg-[#F2F0E9] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center text-xs font-bold uppercase tracking-widest hover:text-[#FF3300] transition-colors border border-black px-4 py-2 bg-white hover:bg-black hover:text-white">
            <ArrowLeft className="w-3 h-3 mr-2" />
            Return to Shop
          </Link>
          <div className="hidden md:block font-mono text-xs text-gray-500">
            SECURE CHECKOUT
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          {/* Payment Form - Main Column */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="mb-6 flex items-end gap-4 border-b border-black pb-4">
              <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">
                Checkout
              </h1>
              <div className="font-mono text-xs text-[#FF3300] mb-1 animate-pulse">
                /// COMPLETE YOUR ORDER
              </div>
            </div>
            
            <div className="bg-white border border-black p-6 lg:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
              {/* Decorative background grid */}
              <div className="absolute top-0 right-0 p-2">
                <CreditCard className="w-6 h-6 text-gray-200" />
              </div>

              {clientSecret && (
                <Elements options={options} stripe={stripePromise}>
                  <CheckoutForm />
                </Elements>
              )}
              {!clientSecret && items.length > 0 && (
                <div className="flex flex-col items-center justify-center py-24 space-y-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                  <p className="font-mono text-xs text-gray-500">LOADING PAYMENT...</p>
                </div>
              )}
              {items.length === 0 && (
                <div className="text-center py-12">
                  <p className="font-mono text-sm text-gray-500">Your cart is empty.</p>
                  <Link href="/" className="inline-block mt-4 text-sm font-bold uppercase tracking-wide underline hover:text-[#FF3300]">
                    Browse Products
                  </Link>
                </div>
              )}
            </div>
            
            <div className="mt-8 flex items-center gap-4 text-xs font-mono text-gray-500">
              <ShieldCheck className="w-4 h-4" />
              <span>SECURE ENCRYPTED PAYMENT</span>
            </div>
          </div>

          {/* Order Summary - Sidebar */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="sticky top-8">
              <div className="bg-[#1a1a1a] text-white p-6 lg:p-8 border border-black relative overflow-hidden">
                {/* Receipt/Manifest styling */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF3300] via-black to-[#FF3300]"></div>
                
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-tighter">Order Summary</h2>
                    <p className="font-mono text-[10px] text-gray-400 mt-1">REF: {Math.random().toString(36).substring(7).toUpperCase()}</p>
                  </div>
                  <Package className="w-6 h-6 text-[#FF3300]" />
                </div>

                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.subscription ? 'sub' : 'one'}`} className="flex justify-between items-start pb-4 border-b border-white/10 last:border-0 last:pb-0 group">
                      <div className="flex-1 pr-4">
                        <h3 className="font-bold text-sm uppercase tracking-wide group-hover:text-[#FF3300] transition-colors">{item.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-gray-300">
                            {item.subscription ? 'SUB' : 'ONE-TIME'}
                          </span>
                          <span className="text-[10px] font-mono text-gray-500">QTY: {item.quantity}</span>
                        </div>
                      </div>
                      <p className="font-mono font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t-2 border-dashed border-white/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mono text-xs text-gray-400 uppercase">Subtotal</span>
                    <span className="font-mono text-sm">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-mono text-xs text-gray-400 uppercase">Shipping</span>
                    <span className="font-mono text-xs text-[#FF3300]">CALCULATED NEXT</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <span className="font-black text-lg uppercase tracking-wider">Total</span>
                    <span className="font-black font-mono text-2xl text-[#FF3300]">${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Barcode decoration */}
                <div className="mt-8 opacity-30">
                  <div className="h-8 w-full bg-repeat-x" style={{ backgroundImage: 'linear-gradient(90deg, #fff 0%, #fff 50%, transparent 50%, transparent 100%)', backgroundSize: '4px 100%' }}></div>
                  <div className="text-center font-mono text-[10px] mt-1 tracking-[0.5em]">SOLUNA WELLNESS</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
