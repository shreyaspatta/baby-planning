"use client";
import { useState } from 'react';
import { Package, ClipboardList, BriefcaseMedical, Menu, X } from 'lucide-react';
import InventoryTracker from './components/InventoryTracker';
import AdminTracker from './components/AdminTracker';
import HospitalPrep from './components/HospitalPrep';
import AuthGuard from './components/AuthGuard';

const TABS = [
  { id: 'inventory', label: 'Inventory', Icon: Package },
  { id: 'admin', label: 'Admin', Icon: ClipboardList },
  { id: 'hospital', label: 'Hospital Bag', Icon: BriefcaseMedical },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('inventory');
  const [menuOpen, setMenuOpen] = useState(false);

  const active = TABS.find(t => t.id === activeTab);

  const selectTab = (id) => {
    setActiveTab(id);
    setMenuOpen(false);
  };

  return (
    <AuthGuard>
      <header className="topbar">
        <button className="hamburger" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <Menu size={22} />
        </button>
        <span className="topbar-brand">Baby Planner <span aria-hidden="true">🍼</span></span>
        <span className="topbar-section">{active?.label}</span>
      </header>

      {/* Slide-in drawer */}
      <div
        className={`drawer-backdrop ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />
      <aside className={`drawer ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
        <div className="drawer-header">
          <span className="drawer-brand">Menu</span>
          <button className="icon-btn" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            className={`drawer-item ${activeTab === id ? 'active' : ''}`}
            onClick={() => selectTab(id)}
            aria-current={activeTab === id ? 'page' : undefined}
          >
            <Icon size={20} strokeWidth={2.2} />
            {label}
            {activeTab === id && <span className="drawer-dot" />}
          </button>
        ))}
      </aside>

      <main className="container">
        <div className="header">
          <h1 className="title">{active?.label}</h1>
          <p className="subtitle">Let&apos;s get ready for the little one.</p>
        </div>

        {activeTab === 'inventory' && <InventoryTracker />}
        {activeTab === 'admin' && <AdminTracker />}
        {activeTab === 'hospital' && <HospitalPrep />}
      </main>
    </AuthGuard>
  );
}
