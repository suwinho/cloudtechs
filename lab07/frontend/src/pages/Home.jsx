import { ArrowRight, Box, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ textAlign: 'center', margin: '4rem 0' }}>
        <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(79, 70, 229, 0.1)', borderRadius: '50%', marginBottom: '1.5rem', color: 'var(--primary)' }}>
          <Box size={48} />
        </div>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Product Dashboard</h1>
        <p className="subtitle" style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
          A complete demonstration environment for managing and analyzing your product inventory.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/products" className="btn" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
            Manage Products <ArrowRight size={20} />
          </Link>
          <Link to="/stats" className="btn" style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}>
            View Statistics <BarChart2 size={20} />
          </Link>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: '4rem' }}>
        <div className="card">
          <div style={{ color: 'var(--accent)', marginBottom: '1rem' }}><Box size={32} /></div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Product Management</h3>
          <p style={{ color: 'var(--text-muted)' }}>
            Add new items to the inventory and browse through the entire catalog in real-time.
          </p>
        </div>
        <div className="card">
          <div style={{ color: 'var(--success)', marginBottom: '1rem' }}><BarChart2 size={32} /></div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Live Statistics</h3>
          <p style={{ color: 'var(--text-muted)' }}>
            Monitor system metrics including total items count and backend instance routing details.
          </p>
        </div>
      </div>
    </div>
  );
}
