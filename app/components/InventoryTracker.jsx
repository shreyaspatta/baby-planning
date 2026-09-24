"use client";
import { useState, useMemo } from 'react';
import { ExternalLink, Trash2, ShoppingCart, CheckCircle2, Search, Plus, Minus, X, Link2 } from 'lucide-react';
import useUpstashCollection from '../hooks/useUpstashCollection';

const CATEGORIES = ['Clothes', 'Gear', 'Feeding', 'Care'];
const CATEGORY_COLORS = {
  Clothes: '#e58aa0',
  Gear: '#5c9e8d',
  Feeding: '#e0a458',
  Care: '#6b9bd1',
};
const OWNERS = ['Baby', 'Mommy'];
const OWNER_EMOJI = { Baby: '👶', Mommy: '👩' };

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
  const { items, add, update, remove } = useUpstashCollection('inventory', INITIAL_INVENTORY);
  const [newItem, setNewItem] = useState({ item: '', category: 'Gear', quantity: 1, status: 'Need to Buy', link: '', owner: 'Baby' });
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');
  const [ownerFilter, setOwnerFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const handleToggleStatus = (id) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    update(id, { status: item.status === 'Procured' ? 'Need to Buy' : 'Procured' });
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItem.item.trim()) return;
    add({ ...newItem, quantity: Number(newItem.quantity) || 1 });
    setNewItem({ item: '', category: 'Gear', quantity: 1, status: 'Need to Buy', link: '', owner: 'Baby' });
    setShowAdd(false);
  };

  const handleLinkChange = (id, newLink) => update(id, { link: newLink });
  const handleDeleteItem = (id) => remove(id);
  const handleQty = (id, current, delta) => {
    const next = Math.max(1, (Number(current) || 1) + delta);
    update(id, { quantity: next });
  };

  const needToBuyCount = items.filter(i => i.status === 'Need to Buy').length;
  const procuredCount = items.filter(i => i.status === 'Procured').length;
  const progress = items.length ? Math.round((procuredCount / items.length) * 100) : 0;

  const filtered = useMemo(() => {
    return items.filter(i => {
      if (ownerFilter !== 'All' && i.owner !== ownerFilter) return false;
      if (statusFilter === 'To Buy' && i.status !== 'Need to Buy') return false;
      if (statusFilter === 'Got it' && i.status !== 'Procured') return false;
      if (search && !`${i.item} ${i.category}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [items, ownerFilter, statusFilter, search]);

  const renderCard = (item) => {
    const done = item.status === 'Procured';
    const catColor = CATEGORY_COLORS[item.category] || 'var(--accent-color)';
    return (
      <div key={item.id} className={`item-card ${done ? 'done' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <span className="item-name">{item.item}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              <span className="cat-dot" style={{ background: catColor }} />
              {item.category}
              <span style={{ opacity: 0.5 }}>·</span>
              <span aria-hidden="true">{OWNER_EMOJI[item.owner]}</span> {item.owner}
            </span>
          </div>
          <button className="icon-btn" onClick={() => handleDeleteItem(item.id)} title="Delete item" aria-label="Delete item">
            <Trash2 size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <div className="stepper" aria-label="Quantity">
            <button type="button" onClick={() => handleQty(item.id, item.quantity, -1)} aria-label="Decrease"><Minus size={14} /></button>
            <span>{item.quantity}</span>
            <button type="button" onClick={() => handleQty(item.id, item.quantity, 1)} aria-label="Increase"><Plus size={14} /></button>
          </div>
          <button
            type="button"
            className={`status-toggle ${done ? 'done' : 'buy'}`}
            onClick={() => handleToggleStatus(item.id)}
          >
            {done ? <><CheckCircle2 size={14} /> Got it</> : <><ShoppingCart size={14} /> To buy</>}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div className="search" style={{ flex: 1, padding: '0 0.55rem' }}>
            <Link2 size={14} color="var(--text-secondary)" />
            <input
              type="url"
              placeholder="Add link…"
              defaultValue={item.link}
              key={item.link}
              style={{ fontSize: '0.8rem', padding: '0.45rem 0' }}
              onBlur={(e) => handleLinkChange(item.id, e.target.value.trim())}
              onKeyDown={(e) => { if (e.key === 'Enter') { handleLinkChange(item.id, e.target.value.trim()); e.target.blur(); } }}
            />
          </div>
          {item.link && (
            <a href={item.link} target="_blank" rel="noopener noreferrer" title="Open link" className="icon-btn" style={{ color: 'var(--accent-color)' }}>
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ paddingBottom: '2rem' }}>
      {/* Progress + stats */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
              <ShoppingCart size={18} color="var(--danger)" /> {needToBuyCount} <span style={{ fontWeight: 500, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>to buy</span>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
              <CheckCircle2 size={18} color="var(--accent-color)" /> {procuredCount} <span style={{ fontWeight: 500, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>got</span>
            </span>
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-strong)' }}>{progress}% ready</span>
        </div>
        <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div className="search" style={{ flex: '1 1 220px' }}>
          <Search size={16} color="var(--text-secondary)" />
          <input placeholder="Search items…" value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button className="icon-btn" style={{ width: 26, height: 26 }} onClick={() => setSearch('')} aria-label="Clear search"><X size={14} /></button>}
        </div>
        <div className="segmented">
          {['All', 'Baby', 'Mommy'].map(o => (
            <button key={o} className={ownerFilter === o ? 'active' : ''} onClick={() => setOwnerFilter(o)}>{o}</button>
          ))}
        </div>
        <div className="segmented">
          {['All', 'To Buy', 'Got it'].map(s => (
            <button key={s} className={statusFilter === s ? 'active' : ''} onClick={() => setStatusFilter(s)}>{s}</button>
          ))}
        </div>
        <button className="btn" onClick={() => setShowAdd(v => !v)} style={{ marginLeft: 'auto' }}>
          {showAdd ? <><X size={16} /> Close</> : <><Plus size={16} /> Add item</>}
        </button>
      </div>

      {/* Collapsible add form */}
      {showAdd && (
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem', animation: 'popIn 0.2s ease both' }}>
          <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input
              className="input-field"
              placeholder="Item name…"
              value={newItem.item}
              onChange={e => setNewItem({ ...newItem, item: e.target.value })}
              autoFocus
              required
            />
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>FOR</div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {OWNERS.map(o => (
                  <button type="button" key={o} className={`chip ${newItem.owner === o ? 'active' : ''}`} onClick={() => setNewItem({ ...newItem, owner: o })}>
                    <span aria-hidden="true">{OWNER_EMOJI[o]}</span> {o}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>CATEGORY</div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {CATEGORIES.map(c => (
                  <button type="button" key={c} className={`chip ${newItem.category === c ? 'active' : ''}`} onClick={() => setNewItem({ ...newItem, category: c })}>
                    <span className="cat-dot" style={{ background: CATEGORY_COLORS[c] }} /> {c}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>QTY</span>
                <div className="stepper">
                  <button type="button" onClick={() => setNewItem({ ...newItem, quantity: Math.max(1, Number(newItem.quantity) - 1) })} aria-label="Decrease"><Minus size={14} /></button>
                  <span>{newItem.quantity}</span>
                  <button type="button" onClick={() => setNewItem({ ...newItem, quantity: Number(newItem.quantity) + 1 })} aria-label="Increase"><Plus size={14} /></button>
                </div>
              </div>
              <input
                className="input-field"
                style={{ flex: '1 1 200px' }}
                placeholder="Link (optional)…"
                type="url"
                value={newItem.link}
                onChange={e => setNewItem({ ...newItem, link: e.target.value })}
              />
            </div>
            <button type="submit" className="btn"><Plus size={16} /> Add to list</button>
          </form>
        </div>
      )}

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No items match. Try clearing filters or add a new one.
        </div>
      ) : (
        <div className="item-grid">
          {filtered.map(renderCard)}
        </div>
      )}
    </div>
  );
}
