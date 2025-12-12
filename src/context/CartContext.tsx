'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { useSession } from './SessionContext';
import { createClient } from '@/lib/supabase/client';
import { createClient as createVanillaClient } from '@supabase/supabase-js';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  subscription?: boolean;
  sku?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user, isLoading: isAuthLoading } = useAuth();
  const { sessionId, visitorId } = useSession();
  
  // Initialize Supabase client with session/visitor header
  const supabase = useMemo(() => {
    if (user) {
      return createClient();
    }
    
    if (visitorId) {
      console.log('Creating vanilla Supabase client for guest with visitor:', visitorId);
      return createVanillaClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
        {
          global: {
            headers: { 
              'x-session-id': sessionId,
              'x-visitor-id': visitorId 
            }
          }
        }
      );
    }
    
    return createClient();
  }, [user, sessionId, visitorId]);

  // Load cart
  useEffect(() => {
    if (isAuthLoading || !visitorId) return;

    const loadCart = async () => {

      let query = supabase.from('cart_items').select('*').order('created_at', { ascending: true });

      if (user) {
        query = query.eq('user_id', user.id);
      } else {
        // Prioritize Visitor ID for persistence
        query = query.eq('visitor_id', visitorId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error loading cart:', error.message);
        return;
      }

      if (data) {
        const mappedItems: CartItem[] = data.map((item: any) => ({
          id: item.id,
          productId: item.product_id,
          name: item.name,
          price: Number(item.price),
          quantity: item.quantity,
          image: item.image,
          subscription: item.subscription,
          sku: item.sku,
        }));
        setItems(mappedItems);
      }
    };

    loadCart();
  }, [user, isAuthLoading, visitorId, supabase]);

  // Save to Local Storage (Backup only, we rely on DB now)
  useEffect(() => {
    localStorage.setItem('soluna_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = async (newItem: Omit<CartItem, 'id'>) => {
    if (!visitorId) return;

    // Check for existing item to merge
    const existingItem = items.find(item => 
      item.productId === newItem.productId && 
      item.subscription === newItem.subscription &&
      item.sku === newItem.sku
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + newItem.quantity;
      await updateQuantity(existingItem.id, newQuantity);
      return;
    }
    
    // Optimistic UI update
    const tempId = crypto.randomUUID();
    const optimisticItem = { ...newItem, id: tempId };
    setItems(prev => [...prev, optimisticItem]);

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .insert({
          user_id: user?.id || null,
          session_id: sessionId,
          visitor_id: visitorId, // Add visitor_id
          product_id: newItem.productId,
          name: newItem.name,
          price: newItem.price,
          quantity: newItem.quantity,
          image: newItem.image,
          subscription: newItem.subscription,
          sku: newItem.sku,
        })
        .select()
        .single();

      if (error) throw error;

      // Replace temp item with real one
      setItems(prev => prev.map(item => item.id === tempId ? { ...newItem, id: data.id } : item));
    } catch (error: any) {
      console.error('Error adding to cart:', JSON.stringify(error, null, 2));
      console.error('Full error object:', error);
      // Revert optimistic update
      setItems(prev => prev.filter(item => item.id !== tempId));
    }
  };

  const removeFromCart = async (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    
    try {
      await supabase.from('cart_items').delete().eq('id', id);
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) {
      await removeFromCart(id);
      return;
    }

    setItems(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));

    try {
      await supabase.from('cart_items').update({ quantity }).eq('id', id);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const clearCart = async () => {
    setItems([]);
    try {
      let query = supabase.from('cart_items').delete();
      
      if (user) {
        query = query.eq('user_id', user.id);
      } else {
        query = query.eq('session_id', sessionId);
      }
      
      await query;
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
