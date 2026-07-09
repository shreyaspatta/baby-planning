"use client";
import { useState } from 'react';

const INITIAL_TASKS = [
  { id: 1, task: "Notify Mutualiteit (Health Insurance)", description: "Must register baby immediately upon birth for NICU coverage.", deadline: "Day of birth", status: "Pending" },
  { id: 2, task: "City Registration (Stadskantoor Leuven)", description: "Register birth within 15 days. Need hospital doc, IDs, marriage/Erkenning cert.", deadline: "+15 Days", status: "Pending" },
  { id: 3, task: "Indian Passport (VFS Global Brussels)", description: "Need international birth certificate from Leuven city hall.", deadline: "ASAP after City Reg", status: "Pending" },
  { id: 4, task: "Belgian Residence Card", description: "Return to Leuven city hall with physical Indian passport.", deadline: "After Passport", status: "Pending" },
];

export default function AdminTracker() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  const handleToggleStatus = (id) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        return { ...t, status: t.status === 'Completed' ? 'Pending' : 'Completed' };
      }
      return t;
    }));
  };

  return (
    <div style={{ paddingBottom: '2rem' }}>
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', backgroundColor: 'rgba(92, 158, 141, 0.1)' }}>
        <h3 className="title" style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--accent-color)' }}>
          Email Reminders Active ✉️
        </h3>
        <p className="subtitle" style={{ marginBottom: 0, fontSize: '0.9rem' }}>
          You will receive automated emails for upcoming deadlines to ensure paperwork is filed on time.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {tasks.map(task => (
          <div key={task.id} className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <h4 style={{ fontWeight: '700', fontSize: '1.1rem', color: task.status === 'Completed' ? 'var(--text-secondary)' : 'var(--text-primary)', textDecoration: task.status === 'Completed' ? 'line-through' : 'none' }}>
                {task.task}
              </h4>
              <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '4px', backgroundColor: task.status === 'Completed' ? '#e6f0ed' : '#fee2e2', color: task.status === 'Completed' ? 'var(--accent-color)' : '#991b1b', fontWeight: '600' }}>
                {task.deadline}
              </span>
            </div>
            
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.4' }}>
              {task.description}
            </p>
            
            <button 
              className={`btn ${task.status === 'Completed' ? 'btn-secondary' : ''}`}
              style={{ width: '100%' }}
              onClick={() => handleToggleStatus(task.id)}
            >
              {task.status === 'Completed' ? 'Mark as Pending' : 'Mark as Completed'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
