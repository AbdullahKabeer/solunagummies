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
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const { cartTotal, clearCart } = useCart();

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

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case 'succeeded':
          setMessage('Payment succeeded!');
          clearCart();
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
  }, [stripe, clearCart]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${window.location.origin}/checkout?success=true`,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer
    // will be redirected to an intermediate site first to authorize the
    // payment, then redirected to the `return_url`.
    if (error.type === 'card_error' || error.type === 'validation_error') {
      setMessage(error.message || 'An unexpected error occurred.');
    } else {
      setMessage('An unexpected error occurred.');
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
          id="link-authentication-element"
          onChange={(e) => setEmail(e.value.email)}
        />
      </div>

      {/* 2. Shipping Address */}
      <div>
        <h3 className="text-lg font-bold uppercase tracking-wide mb-4">Shipping Address</h3>
        <AddressElement
          options={{
            mode: 'shipping',
            fields: {
              phone: 'always',
            },
            validation: {
              phone: {
                required: 'never',
              },
            },
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
