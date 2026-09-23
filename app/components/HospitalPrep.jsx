"use client";
import { useState } from 'react';
import { Trash2, Check, Plus, X } from 'lucide-react';
import useUpstashCollection from '../hooks/useUpstashCollection';

const CATEGORIES = ['General', 'Special Care'];

const INITIAL_BAG = [
  // Documents (Crucial for Belgium/Leuven)
  { id: 1, item: "Identity cards (both parents)", category: "General", packed: false },
  { id: 2, item: "Kind en Gezin pregnancy booklet (Zwangerschapsboekje)", category: "General", packed: false },
  { id: 3, item: "Blood group card & Hospitalisation insurance docs", category: "General", packed: false },
  { id: 4, item: "Marriage certificate / Erkenning document", category: "General", packed: false },
  
  // For Mama
  { id: 5, item: "Comfortable oversized t-shirt / nightgown for delivery", category: "General", packed: false },
  { id: 6, item: "Nursing bras, breast pads, and comfortable underwear", category: "General", packed: false },
  { id: 7, item: "Bathrobe, warm socks, and slippers", category: "General", packed: false },
  { id: 8, item: "Toiletries (toothbrush, lip balm, hair ties)", category: "General", packed: false },
  
  // For Partner
  { id: 9, item: "Comfortable clothes & own toiletries", category: "General", packed: false },
  { id: 10, item: "Extra-long phone charger", category: "General", packed: false },
  { id: 11, item: "Snacks, drinks, and coins for parking/wheelchair", category: "General", packed: false },

  // For Baby
  { id: 12, item: "Maxi-Cosi (Car seat) for going home", category: "General", packed: false },
  { id: 13, item: "First outfit (body, socks, hat - pre-washed!)", category: "General", packed: false },
  
  // Special Care (if needed)
  { id: 14, item: "Button-down shirts for skin-to-skin (Kangaroo care)", category: "Special Care", packed: false },
  { id: 15, item: "Breast Pump Rental info (e.g. Goed Thuiszorgwinkel)", category: "Special Care", packed: false },
  { id: 16, item: "Cooler bag / ice packs for transporting breastmilk", category: "Special Care", packed: false },
  { id: 17, item: "Notebook and pen for doctor rounds", category: "Special Care", packed: false },
];

export default function HospitalPrep() {
  const { items, add, update, remove } = useUpstashCollection('hospital', INITIAL_BAG);
  const [newItem, setNewItem] = useState({ item: '', category: 'General' });
  const [showAdd, setShowAdd] = useState(false);

  const handleTogglePacked = (id) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    update(id, { packed: !item.packed });
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItem.item.trim()) return;
    add({ item: newItem.item, category: newItem.category, packed: false });
    setNewItem({ item: '', category: 'General' });
    setShowAdd(false);
  };

  const handleDeleteItem = (id) => remove(id);

  const packedCount = items.filter(i => i.packed).length;
  const progress = Math.round((packedCount / items.length) * 100) || 0;

  const generalItems = items.filter(i => i.category === 'General');
  const specialCareItems = items.filter(i => i.category === 'Special Care');

  const renderList = (listItems) => (
    listItems.map(item => (
      <div key={item.id} className="check-row">
        <div
          className={`check-box ${item.packed ? 'on' : ''}`}
          onClick={() => handleTogglePacked(item.id)}
          role="checkbox"
          aria-checked={item.packed}
          aria-label={item.item}
        >
          {item.packed && <Check size={14} strokeWidth={3} />}
        </div>
        <span
          onClick={() => handleTogglePacked(item.id)}
          style={{
            flex: 1,
            cursor: 'pointer',
            fontSize: '0.98rem',
            color: item.packed ? 'var(--text-secondary)' : 'var(--text-primary)',
            textDecoration: item.packed ? 'line-through' : 'none',
            fontWeight: item.packed ? 400 : 550,
          }}
        >
          {item.item}
        </span>
        <button className="icon-btn" onClick={() => handleDeleteItem(item.id)} aria-label="Delete item" title="Delete item" style={{ flex: '0 0 auto' }}>
          <Trash2 size={16} />
        </button>
      </div>
    ))
  );

  return (
    <div style={{ paddingBottom: '2rem' }}>
      {/* Progress */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ fontWeight: 700 }}>{packedCount} of {items.length} packed</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-strong)' }}>{progress}%</span>
        </div>
        <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem' }}>
        <button className="btn" onClick={() => setShowAdd(v => !v)}>
          {showAdd ? <><X size={16} /> Close</> : <><Plus size={16} /> Add item</>}
        </button>
      </div>

      {/* Collapsible add form */}
      {showAdd && (
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem', animation: 'popIn 0.2s ease both' }}>
          <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input className="input-field" placeholder="Add an itemâ€¦" value={newItem.item} onChange={e => setNewItem({ ...newItem, item: e.target.value })} autoFocus required />
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {CATEGORIES.map(c => (
                <button type="button" key={c} className={`chip ${newItem.category === c ? 'active' : ''}`} onClick={() => setNewItem({ ...newItem, category: c })}>{c}</button>
              ))}
            </div>
            <button type="submit" className="btn"><Plus size={16} /> Add to bag</button>
          </form>
        </div>
      )}

      {/* Lists */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
        <h3 className="title" style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: 'var(--accent-strong)' }}>General</h3>
        {renderList(generalItems)}
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 className="title" style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--pink)' }}>Special Care <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>(if needed)</span></h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
          The hospital usually provides medical clothing initially. Focus on skin-to-skin and expressing milk.
        </p>
        {renderList(specialCareItems)}
      </div>
    </div>
  );
}
