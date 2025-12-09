'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, Zap, Brain, Star } from 'lucide-react';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signup(name, email, password);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F2F0E9]">
      {/* Left Panel - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-24 relative border-r border-black">
        <div className="absolute top-8 left-8">
          <Link href="/" className="text-2xl font-black tracking-tighter uppercase hover:text-[#FF3300] transition-colors">SOLUNA</Link>
        </div>

        <div className="max-w-md w-full mx-auto">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-black rounded-full text-[10px] font-mono uppercase tracking-widest mb-6 bg-white">
              <span className="w-2 h-2 bg-[#FF3300] rounded-full"></span>
              New Account
            </div>
            <h1 className="text-5xl font-black uppercase tracking-tighter mb-4 leading-[0.9]">
              Create<br />Account
            </h1>
            <p className="font-mono text-sm text-gray-500">Join us to unlock your daily potential and manage orders.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider flex justify-between">
                Full Name
                <span className="text-[#FF3300]">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-white border border-black p-4 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all placeholder:text-gray-300"
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider flex justify-between">
                Email Address
                <span className="text-[#FF3300]">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white border border-black p-4 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all placeholder:text-gray-300"
                placeholder="name@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider flex justify-between">
                Set Password
                <span className="text-[#FF3300]">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white border border-black p-4 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all placeholder:text-gray-300"
                placeholder="••••••••"
              />
              <p className="text-[10px] font-mono text-gray-400 text-right">MINIMUM 8 CHARACTERS REQUIRED</p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-5 font-bold uppercase tracking-wider hover:bg-[#FF3300] transition-all flex items-center justify-center gap-3 disabled:opacity-50 group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                {isLoading ? 'Creating Account...' : 'Create Account'}
                {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </span>
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-black/10 flex justify-between items-center">
            <div className="text-xs font-mono text-gray-500">
              ALREADY HAVE AN ACCOUNT?
            </div>
            <Link href="/login" className="text-sm font-bold uppercase tracking-wide hover:text-[#FF3300] transition-colors border-b-2 border-black hover:border-[#FF3300]">
              Sign In
            </Link>
          </div>
        </div>
        
        {/* Decorative Corner Marks */}
        <div className="absolute bottom-8 left-8 w-4 h-4 border-b border-l border-black"></div>
        <div className="absolute top-8 right-8 w-4 h-4 border-t border-r border-black lg:hidden"></div>
      </div>

      {/* Right Panel - Visual */}
      <div className="hidden lg:flex w-1/2 bg-[#FF3300] text-black relative overflow-hidden flex-col justify-between p-12">
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-10" style={{ 
          backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', 
          backgroundSize: '40px 40px' 
        }}></div>

        <div className="relative z-10 flex justify-end">
          <div className="text-right font-mono text-xs text-black/60">
            <div>FOCUS & ENERGY</div>
            <div>DAILY WELLNESS</div>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <div className="w-16 h-16 bg-black flex items-center justify-center mb-8 border border-black/20">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-6 leading-tight">
            Elevate<br/>Your Mind
          </h2>
          <div className="space-y-4 font-mono text-sm text-black/70">
            <div className="flex items-center gap-3">
              <Brain className="w-4 h-4 text-black" />
              <span>Easy Subscription Management</span>
            </div>
            <div className="flex items-center gap-3">
              <Star className="w-4 h-4 text-black" />
              <span>Member-Only Benefits</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 font-mono text-[10px] text-black/60 uppercase tracking-widest">
          /// Soluna Wellness © 2025
        </div>
      </div>
    </div>
  );
}
