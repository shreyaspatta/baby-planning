"use client";
import { useState, useEffect, useCallback, useRef } from 'react';

function newId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// Debounce helper
function useDebounce(fn, delay) {
  const timer = useRef(null);
  return useCallback((...args) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => fn(...args), delay);
  }, [fn, delay]);
}

export default function useUpstashCollection(board, initialItems = []) {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);
  const fetchedRef = useRef(false);

  const saveToKV = useCallback((updated) => {
    fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: board, value: updated }),
    }).catch(console.error);
  }, [board]);
  
  const debouncedSave = useDebounce(saveToKV, 600);

  useEffect(() => {
    fetch(`/api/data?key=${board}`)
      .then(r => r.json())
      .then(data => {
        if (!data || data.length === 0) {
          // Use initialItems and add IDs if they don't have them
          const initial = initialItems.map(i => ({ id: newId(), ...i }));
          setItems(initial);
          saveToKV(initial);
        } else {
          setItems(data);
        }
        setReady(true);
      })
      .catch(() => {
        setItems(initialItems.map(i => ({ id: newId(), ...i })));
        setReady(true);
      });
  }, [board]); // removed initialItems to avoid loops

  const add = useCallback((data) => {
    setItems(prev => {
      const updated = [...prev, { id: newId(), ...data }];
      saveToKV(updated);
      return updated;
    });
  }, [saveToKV]);

  const update = useCallback((id, patch) => {
    setItems(prev => {
      const updated = prev.map(i => (i.id === id ? { ...i, ...patch } : i));
      debouncedSave(updated);
      return updated;
    });
  }, [debouncedSave]);

  const remove = useCallback((id) => {
    setItems(prev => {
      const updated = prev.filter(i => i.id !== id);
      saveToKV(updated);
      return updated;
    });
  }, [saveToKV]);

  return { items, add, update, remove, ready };
}
