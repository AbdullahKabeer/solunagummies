'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function CreateExperimentPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [variants, setVariants] = useState([
    { name: 'control', weight: 50, metadata: '{}' },
    { name: 'variant_a', weight: 50, metadata: '{}' }
  ]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleAddVariant = () => {
    setVariants([...variants, { name: `variant_${String.fromCharCode(97 + variants.length)}`, weight: 50, metadata: '{}' }]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index: number, field: string, value: any) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create Test
      const { data: test, error: testError } = await supabase
        .from('ab_tests')
        .insert({
          name,
          description,
          status: 'draft',
          start_date: new Date().toISOString()
        })
        .select()
        .single();

      if (testError) throw testError;

      // 2. Create Variants
      const variantsToInsert = variants.map(v => ({
        test_id: test.id,
        name: v.name,
        weight: Number(v.weight),
        metadata: JSON.parse(v.metadata || '{}')
      }));

      const { error: variantsError } = await supabase
        .from('ab_variants')
        .insert(variantsToInsert);

      if (variantsError) throw variantsError;

      router.push('/admin/experiments');
    } catch (error) {
      console.error('Error creating experiment:', error);
      alert('Failed to create experiment. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link href="/admin/experiments" className="flex items-center gap-2 text-gray-500 hover:text-black mb-6">
        <ArrowLeft size={16} />
        Back to Experiments
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Experiment</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Experiment Name (ID)</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. homepage_hero_v2"
              className="w-full p-3 border border-gray-200 rounded-lg font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">This will be used in your code to reference the test.</p>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What are we testing?"
              className="w-full p-3 border border-gray-200 rounded-lg"
              rows={3}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Variants</h2>
            <button 
              type="button"
              onClick={handleAddVariant}
              className="text-sm font-bold text-[#FF3300] flex items-center gap-1"
            >
              <Plus size={14} /> Add Variant
            </button>
          </div>

          <div className="space-y-4">
            {variants.map((variant, index) => (
              <div key={index} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex-1 space-y-3">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-gray-500 mb-1">Name</label>
                      <input 
                        type="text" 
                        required
                        value={variant.name}
                        onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded bg-white text-sm"
                      />
                    </div>
                    <div className="w-24">
                      <label className="block text-xs font-bold text-gray-500 mb-1">Weight</label>
                      <input 
                        type="number" 
                        required
                        value={variant.weight}
                        onChange={(e) => handleVariantChange(index, 'weight', e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded bg-white text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Variables (JSON)</label>
                    <p className="text-[10px] text-gray-400 mb-1">Define overrides like: {`{"hero_headline_1": "New Text"}`}</p>
                    <textarea 
                      value={variant.metadata}
                      onChange={(e) => handleVariantChange(index, 'metadata', e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded bg-white font-mono text-xs h-20"
                      placeholder='{"key": "value"}'
                    />
                  </div>
                </div>
                {variants.length > 2 && (
                  <button 
                    type="button"
                    onClick={() => handleRemoveVariant(index)}
                    className="text-gray-400 hover:text-red-500 mt-8"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Experiment'}
          </button>
        </div>
      </form>
    </div>
  );
}
