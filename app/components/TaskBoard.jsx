"use client";
import { useState, useMemo } from 'react';
import { Plus, Trash2, Check, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import useUpstashCollection from '../hooks/useUpstashCollection';

const TAGS = [
  { label: 'Cleaning', color: '#6b9bd1' },
  { label: 'Grocery', color: '#e0a458' },
  { label: 'Admin', color: '#5c9e8d' },
  { label: 'Call', color: '#e58aa0' },
  { label: 'Buy', color: '#b48ad1' },
  { label: 'Other', color: '#9aa2ab' },
];
const TAG_COLOR = Object.fromEntries(TAGS.map(t => [t.label, t.color]));

export default function TaskBoard() {
  const { items, add, update, remove } = useUpstashCollection('tasks', []);
  const [text, setText] = useState('');
  const [tag, setTag] = useState('');
  const [dragId, setDragId] = useState(null);

  const sorted = useMemo(
    () => [...items].sort((a, b) => (a.position ?? 1e9) - (b.position ?? 1e9)),
    [items]
  );

  const handleAdd = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    add({ text: text.trim(), tag: tag || null, done: false, position: items.length });
    setText('');
  };

  const toggleDone = (id) => {
    const t = items.find(i => i.id === id);
    if (!t) return;
    update(id, { done: !t.done });
  };

  const persistOrder = (arr) => {
    arr.forEach((it, idx) => {
      if (it.position !== idx) update(it.id, { position: idx });
    });
  };

  const move = (id, dir) => {
    const arr = [...sorted];
    const from = arr.findIndex(i => i.id === id);
    const to = from + dir;
    if (to < 0 || to >= arr.length) return;
    [arr[from], arr[to]] = [arr[to], arr[from]];
    persistOrder(arr);
  };

  const handleDrop = (overId) => {
    if (!dragId || dragId === overId) { setDragId(null); return; }
    const arr = [...sorted];
    const from = arr.findIndex(i => i.id === dragId);
    const to = arr.findIndex(i => i.id === overId);
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);
    persistOrder(arr);
    setDragId(null);
  };

  const doneCount = items.filter(i => i.done).length;

  return (
    <div style={{ paddingBottom: '2rem' }}>
      {/* Quick add â€” the main entry point */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <input
              className="input-field"
              style={{ fontSize: '1.05rem', padding: '0.85rem 1rem' }}
              placeholder="Jot anything downâ€¦ groceries, chores, reminders"
              value={text}
              onChange={e => setText(e.target.value)}
            />
            <button type="submit" className="btn" aria-label="Add task"><Plus size={18} /></button>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)' }}>TAG (optional)</span>
            {TAGS.map(t => (
              <button
                type="button"
                key={t.label}
                className={`chip ${tag === t.label ? 'active' : ''}`}
                style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
                onClick={() => setTag(tag === t.label ? '' : t.label)}
              >
                <span className="cat-dot" style={{ background: t.color }} /> {t.label}
              </button>
            ))}
          </div>
        </form>
      </div>

      {items.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0.25rem 0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <span>{items.length} task{items.length === 1 ? '' : 's'} Â· {doneCount} done</span>
          <span style={{ fontSize: '0.78rem' }}>Drag or use â†‘ â†“ to prioritize</span>
        </div>
      )}

      {sorted.length === 0 ? (
        <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Nothing here yet. Add your first task above â€” anything on your mind.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
          {sorted.map((t, idx) => (
            <div
              key={t.id}
              className={`item-card ${t.done ? 'done' : ''}`}
              style={{ flexDirection: 'row', alignItems: 'center', gap: '0.6rem', opacity: dragId === t.id ? 0.5 : 1 }}
              draggable
              onDragStart={() => setDragId(t.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(t.id)}
              onDragEnd={() => setDragId(null)}
            >
              <span className="drag-handle" title="Drag to reorder" aria-hidden="true">
                <GripVertical size={18} />
              </span>

              <div
                className={`check-box ${t.done ? 'on' : ''}`}
                onClick={() => toggleDone(t.id)}
                role="checkbox"
                aria-checked={t.done}
                aria-label={t.text}
              >
                {t.done && <Check size={14} strokeWidth={3} />}
              </div>

              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span className="item-name" style={{ fontSize: '0.98rem' }}>{t.text}</span>
                {t.tag && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    <span className="cat-dot" style={{ background: TAG_COLOR[t.tag] || 'var(--accent-color)' }} /> {t.tag}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <button className="ctrl-btn" onClick={() => move(t.id, -1)} disabled={idx === 0} aria-label="Move up"><ChevronUp size={16} /></button>
                <button className="ctrl-btn" onClick={() => move(t.id, 1)} disabled={idx === sorted.length - 1} aria-label="Move down"><ChevronDown size={16} /></button>
              </div>

              <button className="icon-btn" onClick={() => remove(t.id)} aria-label="Delete task" title="Delete task">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
