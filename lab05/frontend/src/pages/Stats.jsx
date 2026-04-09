import { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, Server, Hash, AlertCircle, RefreshCw, Clock, Zap } from 'lucide-react';

export default function Stats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      setRefreshing(true);
      const apiUrl = window.location.port === '5173' ? 'http://localhost:3000/stats' : '/stats';
      const response = await axios.get(apiUrl);
      setStats(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching stats:', err);
      // Fallback for local testing
      try {
        const fallbackRes = await axios.get('http://localhost:3000/stats');
        setStats(fallbackRes.data);
        setError(null);
      } catch (e) {
        setError('Failed to fetch statistics. Backend unavailable.');
      }
    } finally {
      setLoading(false);
      setTimeout(() => setRefreshing(false), 500); // Visual feedback
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1>Statistics</h1>
          <p className="subtitle">System metrics and backend information</p>
        </div>
        <button 
          onClick={fetchStats} 
          className="btn" 
          style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
          disabled={loading || refreshing}
        >
          <RefreshCw size={18} className={refreshing ? 'spinner' : ''} /> 
          Refresh
        </button>
      </div>

      {error ? (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1rem', borderRadius: '8px', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <AlertCircle size={18} /> {error}
        </div>
      ) : loading && !stats ? (
        <div className="grid-2">
          <div className="card" style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'var(--text-muted)' }}>Loading...</span>
          </div>
          <div className="card" style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'var(--text-muted)' }}>Loading...</span>
          </div>
        </div>
      ) : (
        <div className="grid-2">
          {/* Total Products Stat */}
          <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1, color: 'var(--primary)' }}>
              <Hash size={120} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: '48px', height: '48px', background: 'rgba(79, 70, 229, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <Activity size={24} />
              </div>
              <h2 style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: '500' }}>Total Products</h2>
            </div>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--text-main)', marginTop: '0.5rem' }}>
              {stats?.totalItems || 0}
            </div>
          </div>

          {/* Backend Instance ID Stat */}
          <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1, color: 'var(--success)' }}>
              <Server size={120} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: '48px', height: '48px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}>
                <Server size={24} />
              </div>
              <h2 style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: '500' }}>Served By Instance</h2>
            </div>
            
            <div style={{ marginTop: '0.5rem' }}>
              <div style={{ 
                background: 'rgba(15, 23, 42, 0.8)', 
                padding: '1rem', 
                borderRadius: '8px', 
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                color: 'var(--accent)',
                border: '1px solid var(--border-color)',
                wordBreak: 'break-all'
              }}>
                {stats?.instanceId || 'Unknown'}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
                This unique ID helps identify which backend container processed the request when running behind a load balancer.
              </p>
            </div>
          </div>

          {/* Uptime Stat */}
          <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1, color: '#38bdf8' }}>
              <Clock size={120} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: '48px', height: '48px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                <Clock size={24} />
              </div>
              <h2 style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: '500' }}>Uptime</h2>
            </div>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--text-main)', marginTop: '0.5rem' }}>
              {stats?.uptime ? `${Math.floor(stats.uptime)}s` : '0s'}
            </div>
          </div>

          {/* Requests Stat */}
          <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1, color: '#ec4899' }}>
              <Zap size={120} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: '48px', height: '48px', background: 'rgba(236, 72, 153, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ec4899' }}>
                <Zap size={24} />
              </div>
              <h2 style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: '500' }}>Requests Handled</h2>
            </div>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--text-main)', marginTop: '0.5rem' }}>
              {stats?.requests || 0}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
