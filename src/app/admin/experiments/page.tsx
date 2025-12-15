'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Plus, Play, Pause, CheckCircle, AlertCircle } from 'lucide-react';

export default function ExperimentsPage() {
  const [experiments, setExperiments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchExperiments();
  }, []);

  const fetchExperiments = async () => {
    const { data, error } = await supabase
      .from('ab_tests')
      .select('*, ab_variants(count)')
      .order('created_at', { ascending: false });
    
    if (data) setExperiments(data);
    setLoading(false);
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    await supabase.from('ab_tests').update({ status: newStatus }).eq('id', id);
    fetchExperiments();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">A/B Experiments</h1>
          <p className="text-gray-500 mt-1">Manage and track your split tests.</p>
        </div>
        <Link 
          href="/admin/experiments/create" 
          className="bg-black text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-800 transition-colors"
        >
          <Plus size={18} />
          New Experiment
        </Link>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Variants</th>
                <th className="px-6 py-4">Start Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {experiments.map((exp) => (
                <tr key={exp.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{exp.name}</div>
                    <div className="text-xs text-gray-500">{exp.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                      exp.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' :
                      exp.status === 'paused' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                      'bg-gray-50 text-gray-600 border-gray-200'
                    }`}>
                      {exp.status === 'active' && <Play size={10} fill="currentColor" />}
                      {exp.status === 'paused' && <Pause size={10} fill="currentColor" />}
                      {exp.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {/* Note: count is returned as an array of objects by Supabase if not careful, but with count aggregation it might be different. 
                        Actually Supabase .select('*, ab_variants(count)') returns ab_variants as [{count: N}] usually. 
                        Let's handle it safely. */}
                    {Array.isArray(exp.ab_variants) ? exp.ab_variants[0]?.count : 0} Variants
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-mono text-xs">
                    {exp.start_date ? new Date(exp.start_date).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => toggleStatus(exp.id, exp.status)}
                      className="text-xs font-bold underline mr-4 hover:text-blue-600"
                    >
                      {exp.status === 'active' ? 'Pause' : 'Resume'}
                    </button>
                    <Link href={`/admin/experiments/${exp.id}`} className="text-xs font-bold underline hover:text-blue-600">
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {experiments.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              No experiments found. Create one to get started.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
