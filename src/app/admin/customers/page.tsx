'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Search, Mail, Calendar } from 'lucide-react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) console.error(error);
      else setCustomers(data || []);
      setIsLoading(false);
    };

    fetchCustomers();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Customers</h1>
          <p className="font-mono text-sm text-gray-500">View and manage your customer base.</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search customers by name or email..." 
          className="w-full pl-10 pr-4 py-3 border border-black font-mono text-sm focus:outline-none focus:ring-1 focus:ring-black"
        />
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p className="col-span-full text-center py-12 text-gray-500">Loading customers...</p>
        ) : customers.length > 0 ? (
          customers.map((customer) => (
            <div key={customer.id} className="bg-white border border-black p-6 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-[#F2F0E9] rounded-full flex items-center justify-center font-black text-xl border border-black/10 group-hover:bg-[#FF3300] group-hover:text-white transition-colors">
                  {customer.full_name?.[0]?.toUpperCase() || '?'}
                </div>
                <span className="font-mono text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-500 uppercase">
                  {customer.role || 'Customer'}
                </span>
              </div>
              
              <h3 className="font-bold text-lg mb-1">{customer.full_name || 'Unknown User'}</h3>
              
              <div className="space-y-2 mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{customer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date(customer.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="font-mono text-xs text-gray-400">ID: {customer.id.slice(0, 8)}...</span>
                <button className="text-xs font-bold uppercase underline hover:text-[#FF3300]">View History</button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-white border border-black border-dashed">
            <p className="text-gray-500 font-mono">No customers found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
