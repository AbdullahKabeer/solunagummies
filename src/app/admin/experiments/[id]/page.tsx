'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Code, Copy, CheckCircle } from 'lucide-react';

export default function ExperimentDetailsPage() {
  const { id } = useParams();
  const [experiment, setExperiment] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      // Fetch experiment details
      const { data: exp } = await supabase
        .from('ab_tests')
        .select('*, ab_variants(*)')
        .eq('id', id)
        .single();
      
      setExperiment(exp);

      // Fetch basic stats (count of assignments per variant)
      if (exp) {
        const { data: assignments } = await supabase
          .from('ab_assignments')
          .select('variant_id')
          .eq('test_id', id);
        
        const counts: Record<string, number> = {};
        assignments?.forEach((a: any) => {
          counts[a.variant_id] = (counts[a.variant_id] || 0) + 1;
        });
        setStats(counts);
      }
    };

    fetchData();
  }, [id]);

  const copyCode = () => {
    const code = `
// 1. Import the hook
import { useABTest } from '@/context/ABTestContext';

// 2. Use inside your component
const { getVariant } = useABTest();
const variant = getVariant('${experiment.name}');

// 3. Implement logic
if (variant?.name === '${experiment.ab_variants[1]?.name || 'variant_a'}') {
  return <NewFeature />;
}
return <DefaultFeature />;
    `.trim();
    
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!experiment) return <div>Loading...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <Link href="/admin/experiments" className="flex items-center gap-2 text-gray-500 hover:text-black mb-6">
        <ArrowLeft size={16} />
        Back to Experiments
      </Link>

      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{experiment.name}</h1>
          <p className="text-gray-500 mt-1">{experiment.description}</p>
        </div>
        <div className="px-3 py-1 bg-gray-100 rounded-full text-sm font-bold uppercase">
          {experiment.status}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats */}
        <div className="lg:col-span-2 space-y-6">
            <h2 className="font-bold text-xl">Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {experiment.ab_variants.map((variant: any) => (
                <div key={variant.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-lg">{variant.name}</h3>
                        <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                            {variant.weight}%
                        </span>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-4">
                        <div className="text-3xl font-bold text-[#FF3300]">
                            {stats?.[variant.id] || 0}
                        </div>
                        <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                            Visitors Assigned
                        </div>
                    </div>
                    
                    {variant.metadata && Object.keys(variant.metadata).length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="text-xs font-bold text-gray-400 uppercase mb-1">Metadata</div>
                            <pre className="text-[10px] bg-gray-50 p-2 rounded overflow-x-auto">
                                {JSON.stringify(variant.metadata, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
                ))}
            </div>
        </div>

        {/* Right Column: Implementation Guide */}
        <div className="lg:col-span-1">
            <div className="bg-[#1a1a1a] text-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center gap-2 mb-4 text-gray-400">
                    <Code size={20} />
                    <h3 className="font-bold text-sm uppercase tracking-wider">Implementation Guide</h3>
                </div>
                
                <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                    Copy this snippet into your React component to start using this experiment.
                </p>

                <div className="relative bg-black rounded-lg p-4 font-mono text-xs text-gray-300 overflow-x-auto border border-gray-800">
                    <button 
                        onClick={copyCode}
                        className="absolute top-2 right-2 p-2 hover:bg-gray-800 rounded transition-colors"
                    >
                        {copied ? <CheckCircle size={14} className="text-green-500" /> : <Copy size={14} />}
                    </button>
                    <pre className="whitespace-pre-wrap">
{`// 1. Import hook
import { useABTest } from '@/context/ABTestContext';

// 2. Get variant
const { getVariant } = useABTest();
const variant = getVariant('${experiment.name}');

// 3. Use it
if (variant?.name === '${experiment.ab_variants[1]?.name || 'variant_a'}') {
  // Show variant
} else {
  // Show control
}`}
                    </pre>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
