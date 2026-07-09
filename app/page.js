"use client";
import { useState } from 'react';
import InventoryTracker from './components/InventoryTracker';
import AdminTracker from './components/AdminTracker';
import HospitalPrep from './components/HospitalPrep';
import AuthGuard from './components/AuthGuard';

export default function Home() {
  const [activeTab, setActiveTab] = useState('inventory');

  return (
    <AuthGuard>
      <main className="container">
        <div className="header">
          <h1 className="title">Baby Planner</h1>
          <p className="subtitle">Let's get ready for the little one.</p>
        </div>
        
        {activeTab === 'inventory' && <InventoryTracker />}
        {activeTab === 'admin' && <AdminTracker />}
        {activeTab === 'hospital' && <HospitalPrep />}
        
      </main>

      <nav className="bottom-nav">
        <div 
          className={`nav-item ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          <span style={{ fontSize: '1.25rem' }}>📦</span>
          <span>Inventory</span>
        </div>
        <div 
          className={`nav-item ${activeTab === 'admin' ? 'active' : ''}`}
          onClick={() => setActiveTab('admin')}
        >
          <span style={{ fontSize: '1.25rem' }}>📋</span>
          <span>Admin</span>
        </div>
        <div 
          className={`nav-item ${activeTab === 'hospital' ? 'active' : ''}`}
          onClick={() => setActiveTab('hospital')}
        >
          <span style={{ fontSize: '1.25rem' }}>🏥</span>
          <span>Hospital Bag</span>
        </div>
      </nav>
    </AuthGuard>
  );
}
