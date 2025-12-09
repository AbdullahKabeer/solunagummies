'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { createClient } from '@/lib/supabase/client';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  subscription?: boolean;
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
  const supabase = createClient();

  // Load cart
  useEffect(() => {
    if (isAuthLoading) return;

    const loadCart = async () => {
      if (user) {
        // Load from Supabase
        const { data, error } = await supabase
          .from('cart_items')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error loading cart from Supabase:', error.message);
          if (error.code === '42P01') {
            console.error('Missing table: cart_items. Please run the SQL schema in supabase/schema.sql');
          }
          return;
        }

        const mappedItems: CartItem[] = data.map((item: any) => ({
          id: item.id,
          productId: item.product_id,
          name: item.name,
          price: Number(item.price),
          quantity: item.quantity,
          image: item.image,
          subscription: item.subscription,
        }));

        setItems(mappedItems);
      } else {
        // Load from Local Storage
        const savedCart = localStorage.getItem('soluna_cart');
        if (savedCart) {
          try {
            setItems(JSON.parse(savedCart));
          } catch (e) {
            console.error('Failed to parse cart from local storage', e);
          }
        } else {
            setItems([]);
        }
      }
    };

    loadCart();
  }, [user, isAuthLoading, supabase]);

  // Save to Local Storage (only if guest)
  useEffect(() => {
    if (!user && !isAuthLoading) {
      localStorage.setItem('soluna_cart', JSON.stringify(items));
    }
  }, [items, user, isAuthLoading]);

  const addToCart = async (newItem: Omit<CartItem, 'id'>) => {
    if (user) {
      // Check if item exists
      const existingItem = items.find(
        (item) => item.productId === newItem.productId && item.subscription === newItem.subscription
      );

      if (existingItem) {
        await updateQuantity(existingItem.id, existingItem.quantity + newItem.quantity);
      } else {
        const { data, error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: newItem.productId,
            name: newItem.name,
            price: newItem.price,
            quantity: newItem.quantity,
            image: newItem.image,
            subscription: newItem.subscription,
          })
          .select()
          .single();

        if (error) {
          console.error('Error adding to cart:', error);
          return;
        }

        setItems((prev) => [...prev, { ...newItem, id: data.id }]);
      }
    } else {
      // Local Storage Logic
      setItems((prevItems) => {
        const existingItemIndex = prevItems.findIndex(
          (item) => item.productId === newItem.productId && item.subscription === newItem.subscription
        );

        if (existingItemIndex > -1) {
          const newItems = [...prevItems];
          newItems[existingItemIndex].quantity += newItem.quantity;
          return newItems;
        } else {
          return [...prevItems, { ...newItem, id: crypto.randomUUID() }];
        }
      });
    }
    setIsCartOpen(true);
  };

  const removeFromCart = async (id: string) => {
    if (user) {
      const { error } = await supabase.from('cart_items').delete().eq('id', id);
      if (error) {
        console.error('Error removing from cart:', error);
        return;
      }
    }
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return;

    if (user) {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', id);

      if (error) {
        console.error('Error updating quantity:', error);
        return;
      }
    }

    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = async () => {
    if (user) {
      const { error } = await supabase.from('cart_items').delete().eq('user_id', user.id);
      if (error) {
        console.error('Error clearing cart:', error);
        return;
      }
    }
    setItems([]);
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
