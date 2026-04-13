import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Tag, DollarSign, Package, AlertCircle } from 'lucide-react';

// In Docker (Nginx), API is under /api/. In local dev (port 5173), hit backend directly.

export default function Products() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form state
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchItems = async () => {
    try {
      setLoading(true);
      // Let's assume the dev uses Nginx that routes /api to backend, or direct to backend if run locally
      const apiUrl = window.location.port === '5173' ? 'http://localhost:3000/items' : '/api/items';
      const response = await axios.get(apiUrl);
      setItems(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching items:', err);
      // Fallback for local testing if running without Nginx docker setup temporarily
      try {
        const fallbackRes = await axios.get('http://localhost:3000/items');
        setItems(fallbackRes.data);
        setError(null);
      } catch (e) {
        setError('Failed to fetch products. Is the backend running?');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price) return;

    try {
      setSubmitting(true);
      const apiUrl = window.location.port === '5173' ? 'http://localhost:3000/items' : '/api/items';
      await axios.post(apiUrl, { name, price: Number(price) });
      
      // Reset form and refresh list
      setName('');
      setPrice('');
      await fetchItems();
    } catch (err) {
      console.error('Error adding item:', err);
      // Fallback for local testing
      try {
         await axios.post('http://localhost:3000/items', { name, price: Number(price) });
         setName('');
         setPrice('');
         await fetchItems();
      } catch(e) {
         alert('Failed to add product.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Products</h1>
        <p className="subtitle">Manage your product inventory</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Add Product Form */}
        <div className="card" style={{ position: 'sticky', top: '100px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={20} color="var(--primary)" /> Add New Product
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Product Name</label>
              <div style={{ position: 'relative' }}>
                <Tag size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  id="name" 
                  placeholder="e.g., Wireless Headphones"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                  required
                />
              </div>
            </div>
            
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="price">Price ($)</label>
              <div style={{ position: 'relative' }}>
                <DollarSign size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="number" 
                  id="price" 
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                  required
                />
              </div>
            </div>
            
            <button type="submit" className="btn" style={{ width: '100%' }} disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Product'}
            </button>
          </form>
        </div>

        {/* Product List */}
        <div className="card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Package size={20} color="var(--accent)" /> Inventory
            </div>
            <span className="badge">{items.length} items</span>
          </h2>
          
          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1rem', borderRadius: '8px', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
              Loading products...
            </div>
          ) : items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)', background: 'rgba(15, 23, 42, 0.3)', borderRadius: '8px', border: '1px dashed var(--border-color)' }}>
              No products found. Add one to get started!
            </div>
          ) : (
            <div className="item-list">
              {items.map(item => (
                <div key={item.id} className="item-row">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', background: 'rgba(79, 70, 229, 0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                      <Package size={20} />
                    </div>
                    <div>
                      <div className="item-name">{item.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: {item.id}</div>
                    </div>
                  </div>
                  <div className="item-price">${Number(item.price).toFixed(2)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
