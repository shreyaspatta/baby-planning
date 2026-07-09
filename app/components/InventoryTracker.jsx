"use client";
import { useState } from 'react';

const INITIAL_INVENTORY = [
  { id: 1, item: "Diaper dustbin", category: "Gear", quantity: 1, status: "Need to Buy", link: "", owner: "Baby" },
  { id: 2, item: "Muslin cloth wraps", category: "Clothes", quantity: 3, status: "Need to Buy", link: "", owner: "Baby" },
  { id: 3, item: "New born clothes", category: "Clothes", quantity: 1, status: "Need to Buy", link: "", owner: "Baby" },
  { id: 4, item: "New born socks or booties", category: "Clothes", quantity: 1, status: "Need to Buy", link: "", owner: "Baby" },
  { id: 5, item: "New born head cover", category: "Clothes", quantity: 1, status: "Need to Buy", link: "", owner: "Baby" },
  { id: 6, item: "Girl baby head band (Pink, Size 2)", category: "Clothes", quantity: 1, status: "Need to Buy", link: "", owner: "Baby" },
  { id: 7, item: "Burp cloth pack", category: "Feeding", quantity: 10, status: "Need to Buy", link: "", owner: "Baby" },
  { id: 8, item: "New born diapers (1 pack)", category: "Gear", quantity: 1, status: "Need to Buy", link: "", owner: "Baby" },
  { id: 9, item: "Car seat New born", category: "Gear", quantity: 1, status: "Need to Buy", link: "", owner: "Baby" },
  { id: 10, item: "Wipes (100% water based)", category: "Gear", quantity: 1, status: "Need to Buy", link: "", owner: "Baby" },
  { id: 11, item: "Rash cream", category: "Gear", quantity: 1, status: "Need to Buy", link: "", owner: "Baby" },
  { id: 12, item: "Bath soap (BPA free)", category: "Gear", quantity: 1, status: "Need to Buy", link: "", owner: "Baby" },
  { id: 13, item: "Bath towel & Hooded towel", category: "Gear", quantity: 1, status: "Need to Buy", link: "", owner: "Baby" },
  { id: 14, item: "Hygiene kit (Tongue cleaner, thermometer, nail cutter)", category: "Gear", quantity: 1, status: "Need to Buy", link: "", owner: "Baby" },
  { id: 15, item: "Diaper station bed & containers", category: "Gear", quantity: 1, status: "Need to Buy", link: "", owner: "Baby" },
  { id: 16, item: "Baby crib (LIONELO Aurora 3 in 1)", category: "Gear", quantity: 1, status: "Need to Buy", link: "https://amzn.eu/d/0fiC6T7z", owner: "Baby" },
  { id: 17, item: "Massage oil", category: "Gear", quantity: 1, status: "Need to Buy", link: "", owner: "Baby" },
  { id: 18, item: "Baby lounger", category: "Gear", quantity: 1, status: "Procured", link: "", owner: "Baby" },
  { id: 19, item: "Toc 3 sleeping sack", category: "Clothes", quantity: 1, status: "Procured", link: "", owner: "Baby" },
  { id: 20, item: "Baby bath chair", category: "Gear", quantity: 1, status: "Need to Buy", link: "", owner: "Baby" },
  { id: 21, item: "Travel changing mat & Waterproof mat", category: "Gear", quantity: 1, status: "Need to Buy", link: "", owner: "Baby" },
  // Example Mommy item so the table isn't empty:
  { id: 22, item: "Postpartum recovery kit", category: "Gear", quantity: 1, status: "Need to Buy", link: "", owner: "Mommy" },
];

export default function InventoryTracker() {
  const [items, setItems] = useState(INITIAL_INVENTORY);
  const [newItem, setNewItem] = useState({ item: '', category: 'Gear', quantity: 1, status: 'Need to Buy', link: '', owner: 'Baby' });

  const handleToggleStatus = (id) => {
    setItems(items.map(i => {
      if (i.id === id) {
        return { ...i, status: i.status === 'Procured' ? 'Need to Buy' : 'Procured' };
      }
      return i;
    }));
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItem.item.trim()) return;
    setItems([{ ...newItem, id: Date.now() }, ...items]);
    setNewItem({ item: '', category: 'Gear', quantity: 1, status: 'Need to Buy', link: '', owner: 'Baby' });
  };

  const handleLinkChange = (id, newLink) => {
    setItems(items.map(i => i.id === id ? { ...i, link: newLink } : i));
  };

  const needToBuyCount = items.filter(i => i.status === 'Need to Buy').length;
  const procuredCount = items.filter(i => i.status === 'Procured').length;

  const mommyItems = items.filter(i => i.owner === 'Mommy');
  const babyItems = items.filter(i => i.owner === 'Baby');

  const renderTable = (tableItems) => (
    <div style={{ overflowX: 'auto', paddingBottom: '1rem' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid rgba(0,0,0,0.1)' }}>
            <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>Item</th>
            <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>Qty</th>
            <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>Link</th>
            <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {tableItems.map(item => (
            <tr key={item.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', backgroundColor: item.status === 'Procured' ? 'rgba(0,0,0,0.02)' : 'transparent' }}>
              <td style={{ padding: '0.75rem 0.5rem', fontWeight: '500', color: item.status === 'Procured' ? 'var(--text-secondary)' : 'var(--text-primary)', textDecoration: item.status === 'Procured' ? 'line-through' : 'none' }}>
                <div style={{ marginBottom: '2px' }}>{item.item}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.category}</div>
              </td>
              <td style={{ padding: '0.75rem 0.5rem', fontWeight: '600' }}>
                {item.quantity}
              </td>
              <td style={{ padding: '0.75rem 0.5rem' }}>
                {item.link ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color)', textDecoration: 'underline', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                      Link
                    </a>
                    <button onClick={() => handleLinkChange(item.id, '')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e53e3e', fontSize: '0.75rem' }}>✕</button>
                  </div>
                ) : (
                  <input 
                    type="url"
                    placeholder="Add..."
                    className="input-field"
                    style={{ padding: '0.25rem', fontSize: '0.75rem', width: '60px' }}
                    onBlur={(e) => handleLinkChange(item.id, e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLinkChange(item.id, e.target.value)}
                  />
                )}
              </td>
              <td style={{ padding: '0.75rem 0.5rem' }}>
                <button 
                  className={`btn ${item.status === 'Procured' ? 'btn-secondary' : ''}`}
                  style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', minWidth: '90px' }}
                  onClick={() => handleToggleStatus(item.id)}
                >
                  {item.status}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div style={{ paddingBottom: '2rem' }}>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ flex: 1, padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#e53e3e' }}>{needToBuyCount}</div>
          <div className="subtitle" style={{ marginBottom: 0 }}>Need to Buy</div>
        </div>
        <div className="glass-panel" style={{ flex: 1, padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent-color)' }}>{procuredCount}</div>
          <div className="subtitle" style={{ marginBottom: 0 }}>Procured</div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 className="title" style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Add New Item</h3>
        <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            className="input-field" 
            placeholder="Item name..." 
            value={newItem.item} 
            onChange={e => setNewItem({...newItem, item: e.target.value})}
            required
          />
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <select 
              className="input-field" 
              style={{ flex: '1 1 100px' }}
              value={newItem.owner}
              onChange={e => setNewItem({...newItem, owner: e.target.value})}
            >
              <option>Baby</option>
              <option>Mommy</option>
            </select>
            <select 
              className="input-field" 
              style={{ flex: '1 1 100px' }}
              value={newItem.category}
              onChange={e => setNewItem({...newItem, category: e.target.value})}
            >
              <option>Clothes</option>
              <option>Gear</option>
              <option>Feeding</option>
              <option>Care</option>
            </select>
            <input 
              type="number" 
              className="input-field" 
              style={{ width: '70px', flex: '0 0 70px' }} 
              value={newItem.quantity}
              onChange={e => setNewItem({...newItem, quantity: e.target.value})}
              min="1"
            />
          </div>
          <input 
            className="input-field" 
            placeholder="Link (e.g. Amazon URL)..." 
            type="url"
            value={newItem.link} 
            onChange={e => setNewItem({...newItem, link: e.target.value})}
          />
          <button type="submit" className="btn">Add Item</button>
        </form>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', width: '100%' }}>
        {/* Mommy Column */}
        <div className="glass-panel" style={{ flex: '1 1 45%', minWidth: '320px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.5rem' }}>👩</span>
            <h3 className="title" style={{ fontSize: '1.25rem', marginBottom: 0, color: 'var(--accent-color)' }}>Mommy</h3>
          </div>
          {renderTable(mommyItems)}
        </div>

        {/* Baby Column */}
        <div className="glass-panel" style={{ flex: '1 1 45%', minWidth: '320px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.5rem' }}>👶</span>
            <h3 className="title" style={{ fontSize: '1.25rem', marginBottom: 0, color: '#e53e3e' }}>Baby</h3>
          </div>
          {renderTable(babyItems)}
        </div>
      </div>
    </div>
  );
}
