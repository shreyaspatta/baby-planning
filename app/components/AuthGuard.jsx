"use client";
import { useState, useEffect } from 'react';

export default function AuthGuard({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Simple local storage check for the prototype
    // (In a full app, this would be a secure httpOnly cookie or NextAuth session)
    const authStatus = localStorage.getItem('preemie-auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    // Use a hardcoded shared PIN for the prototype (e.g., '1234')
    // Later we can move this to an environment variable or a secure backend check
    if (pin === '1234') { 
      localStorage.setItem('preemie-auth', 'true');
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect PIN. Please try again.');
    }
  };

  if (!isMounted) return null;

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div className="glass-panel" style={{ padding: '2rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h2 className="title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Welcome Back</h2>
        <p className="subtitle" style={{ marginBottom: '2rem' }}>Please enter your shared PIN to access the tracker.</p>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="password"
            className="input-field"
            placeholder="Enter PIN (Hint: 1234)"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            style={{ textAlign: 'center', fontSize: '1.25rem', letterSpacing: '0.5rem' }}
          />
          {error && <p style={{ color: '#e53e3e', fontSize: '0.875rem' }}>{error}</p>}
          <button type="submit" className="btn" style={{ width: '100%' }}>Access App</button>
        </form>
      </div>
    </div>
  );
}
