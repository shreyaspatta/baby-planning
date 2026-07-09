"use client";
import { useState } from 'react';

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
  const [items, setItems] = useState(INITIAL_BAG);
  const [newItem, setNewItem] = useState({ item: '', category: 'General' });

  const handleTogglePacked = (id) => {
    setItems(items.map(i => {
      if (i.id === id) {
        return { ...i, packed: !i.packed };
      }
      return i;
    }));
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItem.item.trim()) return;
    setItems([...items, { id: Date.now(), item: newItem.item, category: newItem.category, packed: false }]);
    setNewItem({ item: '', category: 'General' });
  };

  const packedCount = items.filter(i => i.packed).length;
  const progress = Math.round((packedCount / items.length) * 100) || 0;

  const generalItems = items.filter(i => i.category === 'General');
  const specialCareItems = items.filter(i => i.category === 'Special Care');

  const renderList = (listItems) => (
    listItems.map(item => (
      <div 
        key={item.id} 
        onClick={() => handleTogglePacked(item.id)}
        style={{ 
          padding: '1rem 0.5rem', 
          borderBottom: '1px solid rgba(0,0,0,0.05)', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        <div style={{ 
          width: '24px', 
          height: '24px', 
          borderRadius: '6px', 
          border: item.packed ? 'none' : '2px solid #cbd5e1',
          backgroundColor: item.packed ? 'var(--accent-color)' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white'
        }}>
          {item.packed && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
        </div>
        <span style={{ 
          fontSize: '1rem', 
          color: item.packed ? 'var(--text-secondary)' : 'var(--text-primary)',
          textDecoration: item.packed ? 'line-through' : 'none',
          fontWeight: item.packed ? '400' : '500'
        }}>
          {item.item}
        </span>
      </div>
    ))
  );

  return (
    <div style={{ paddingBottom: '2rem' }}>
      
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 className="title" style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Hospital Bag Preparation Progress</h3>
        <div style={{ height: '12px', background: 'var(--accent-light)', borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'var(--accent-color)', transition: 'width 0.3s ease' }} />
        </div>
        <p style={{ textAlign: 'right', marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
          {progress}% Packed
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <form onSubmit={handleAddItem} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <input 
            className="input-field" 
            placeholder="Add an item..." 
            value={newItem.item} 
            onChange={e => setNewItem({...newItem, item: e.target.value})}
            style={{ flex: '1 1 200px' }}
            required
          />
          <select 
            className="input-field" 
            value={newItem.category}
            onChange={e => setNewItem({...newItem, category: e.target.value})}
            style={{ flex: '0 0 150px' }}
          >
            <option>General</option>
            <option>Special Care</option>
          </select>
          <button type="submit" className="btn">Add</button>
        </form>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 className="title" style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--accent-color)' }}>General</h3>
        {renderList(generalItems)}
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 className="title" style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#e53e3e' }}>Special Care (if needed)</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Note: Do not worry about specialized clothing sizes; the hospital will usually provide medical clothing initially. Focus on items for skin-to-skin and expressing milk.
        </p>
        {renderList(specialCareItems)}
      </div>

    </div>
  );
}
