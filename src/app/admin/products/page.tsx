'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Edit, Trash2, Save, X, Search } from 'lucide-react';

type Product = {
  id: string;
  name: string;
  sku: string;
  price: number;
  compare_at_price: number | null;
  category: string;
  description: string;
  active: boolean;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null); // ID of product being edited
  const [isCreating, setIsCreating] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [searchTerm, setSearchTerm] = useState('');
  
  const supabase = createClient();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setProducts(data);
    setLoading(false);
  };

  const handleEdit = (product: Product) => {
    setIsEditing(product.id);
    setEditForm(product);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setIsEditing(null);
    setEditForm({
      name: '',
      sku: '',
      price: 0,
      compare_at_price: 0,
      category: 'onetime',
      description: '',
      active: true
    });
  };

  const handleCancel = () => {
    setIsEditing(null);
    setIsCreating(false);
    setEditForm({});
  };

  const handleSave = async () => {
    if (isCreating) {
      const { data, error } = await supabase
        .from('products')
        .insert([editForm])
        .select()
        .single();
      
      if (error) {
        alert('Error creating product: ' + error.message);
      } else {
        setProducts([data, ...products]);
        setIsCreating(false);
        setEditForm({});
      }
    } else if (isEditing) {
      const { error } = await supabase
        .from('products')
        .update(editForm)
        .eq('id', isEditing);

      if (error) {
        alert('Error updating product: ' + error.message);
      } else {
        setProducts(products.map(p => p.id === isEditing ? { ...p, ...editForm } as Product : p));
        setIsEditing(null);
        setEditForm({});
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Error deleting product: ' + error.message);
    } else {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">Manage your product catalog, SKUs, and pricing.</p>
        </div>
        <button 
          onClick={handleCreate}
          className="bg-black text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Search products by name or SKU..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
        />
      </div>

      {/* Edit/Create Form Modal (Inline for simplicity or Overlay) */}
      {(isEditing || isCreating) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{isCreating ? 'New Product' : 'Edit Product'}</h2>
              <button onClick={handleCancel} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">Product Name</label>
                <input 
                  type="text" 
                  value={editForm.name || ''} 
                  onChange={e => setEditForm({...editForm, name: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">SKU</label>
                <input 
                  type="text" 
                  value={editForm.sku || ''} 
                  onChange={e => setEditForm({...editForm, sku: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                <select 
                  value={editForm.category || 'onetime'} 
                  onChange={e => setEditForm({...editForm, category: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-lg"
                >
                  <option value="onetime">One-time</option>
                  <option value="subscription">Subscription</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Price ($)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={editForm.price || 0} 
                  onChange={e => setEditForm({...editForm, price: parseFloat(e.target.value)})}
                  className="w-full p-3 border border-gray-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Compare At Price ($)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={editForm.compare_at_price || 0} 
                  onChange={e => setEditForm({...editForm, compare_at_price: parseFloat(e.target.value)})}
                  className="w-full p-3 border border-gray-200 rounded-lg"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea 
                  value={editForm.description || ''} 
                  onChange={e => setEditForm({...editForm, description: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-lg h-32"
                />
              </div>

              <div className="col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={editForm.active ?? true} 
                    onChange={e => setEditForm({...editForm, active: e.target.checked})}
                    className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                  />
                  <span className="font-medium text-gray-900">Active Product</span>
                </label>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button onClick={handleCancel} className="px-6 py-3 rounded-lg font-bold text-gray-500 hover:bg-gray-100">
                Cancel
              </button>
              <button onClick={handleSave} className="px-6 py-3 rounded-lg font-bold bg-black text-white hover:bg-gray-800 flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">SKU</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={6} className="p-8 text-center text-gray-500">Loading products...</td></tr>
            ) : filteredProducts.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-gray-500">No products found.</td></tr>
            ) : (
              filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{product.name}</div>
                    <div className="text-xs text-gray-500 truncate max-w-[200px]">{product.description}</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-gray-600">{product.sku}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.category === 'subscription' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">${product.price.toFixed(2)}</div>
                    {product.compare_at_price && (
                      <div className="text-xs text-gray-400 line-through">${product.compare_at_price.toFixed(2)}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.active ? 'Active' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(product)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
