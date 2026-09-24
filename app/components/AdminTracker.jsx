"use client";
import { useState, useMemo } from 'react';
import { Trash2, Check, Plus, X, Clock, Info } from 'lucide-react';
import useUpstashCollection from '../hooks/useUpstashCollection';

const INITIAL_TASKS = [
  { id: 1, task: "Notify Mutualiteit (Health Insurance)", description: "Must register baby immediately upon birth for NICU coverage.", deadline: "Day of birth", status: "Pending" },
  { id: 2, task: "City Registration (Stadskantoor Leuven)", description: "Register birth within 15 days. Need hospital doc, IDs, marriage/Erkenning cert.", deadline: "+15 Days", status: "Pending" },
  { id: 3, task: "Indian Passport (VFS Global Brussels)", description: "Need international birth certificate from Leuven city hall.", deadline: "ASAP after City Reg", status: "Pending" },
  { id: 4, task: "Belgian Residence Card", description: "Return to Leuven city hall with physical Indian passport.", deadline: "After Passport", status: "Pending" },
];

export default function AdminTracker() {
  const { items: tasks, add, update, remove } = useUpstashCollection('admin', INITIAL_TASKS);
  const [newTask, setNewTask] = useState({ task: '', description: '', deadline: '' });
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState('All');

  const handleToggleStatus = (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    update(id, { status: task.status === 'Completed' ? 'Pending' : 'Completed' });
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.task.trim()) return;
    add({ status: 'Pending', ...newTask });
    setNewTask({ task: '', description: '', deadline: '' });
    setShowAdd(false);
  };

  const handleDeleteTask = (id) => remove(id);

  const doneCount = tasks.filter(t => t.status === 'Completed').length;
  const progress = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;

  const filtered = useMemo(() => tasks.filter(t => {
    if (filter === 'Pending') return t.status !== 'Completed';
    if (filter === 'Done') return t.status === 'Completed';
    return true;
  }), [tasks, filter]);

  return (
    <div style={{ paddingBottom: '2rem' }}>
      {/* Info banner */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem', marginBottom: '1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start', background: 'linear-gradient(135deg, var(--accent-light), var(--pink-light))' }}>
        <Info size={20} color="var(--accent-strong)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <p className="subtitle" style={{ marginBottom: 0, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
          Belgium/Leuven paperwork checklist. Tick tasks as you complete registrations and appointments.
        </p>
      </div>

      {/* Progress */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ fontWeight: 700 }}>{doneCount} of {tasks.length} done</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-strong)' }}>{progress}%</span>
        </div>
        <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div className="segmented">
          {['All', 'Pending', 'Done'].map(f => (
            <button key={f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
        <button className="btn" onClick={() => setShowAdd(v => !v)} style={{ marginLeft: 'auto' }}>
          {showAdd ? <><X size={16} /> Close</> : <><Plus size={16} /> Add task</>}
        </button>
      </div>

      {/* Collapsible add form */}
      {showAdd && (
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem', animation: 'popIn 0.2s ease both' }}>
          <form onSubmit={handleAddTask} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input className="input-field" placeholder="Task (e.g. Register with Kind en Gezin)" value={newTask.task} onChange={e => setNewTask({ ...newTask, task: e.target.value })} autoFocus required />
            <input className="input-field" placeholder="Details / notes" value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} />
            <input className="input-field" placeholder="Deadline (e.g. +15 Days)" value={newTask.deadline} onChange={e => setNewTask({ ...newTask, deadline: e.target.value })} />
            <button type="submit" className="btn"><Plus size={16} /> Add task</button>
          </form>
        </div>
      )}

      {/* Task cards */}
      {filtered.length === 0 ? (
        <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Nothing here. Add a task or switch filters.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          {filtered.map(task => {
            const done = task.status === 'Completed';
            return (
              <div key={task.id} className={`item-card ${done ? 'done' : ''}`} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: '0.85rem' }}>
                <div
                  className={`check-box ${done ? 'on' : ''}`}
                  onClick={() => handleToggleStatus(task.id)}
                  role="checkbox"
                  aria-checked={done}
                  aria-label={task.task}
                  style={{ marginTop: '2px' }}
                >
                  {done && <Check size={14} strokeWidth={3} />}
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem', minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.6rem' }}>
                    <span className="item-name" style={{ fontSize: '1.02rem' }}>{task.task}</span>
                    {task.deadline && (
                      <span className={`badge ${done ? 'badge-success' : 'badge-warn'}`} style={{ flexShrink: 0 }}>
                        <Clock size={12} /> {task.deadline}
                      </span>
                    )}
                  </div>
                  {task.description && (
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>{task.description}</p>
                  )}
                </div>

                <button className="icon-btn" onClick={() => handleDeleteTask(task.id)} aria-label="Delete task" title="Delete task" style={{ flexShrink: 0 }}>
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
