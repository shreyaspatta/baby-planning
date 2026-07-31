"use client";
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

// Strips any client-side `id` so the datastore (or generated uuid) owns identity.
function stripId({ id, ...rest }) {
  return rest;
}

function newId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/**
 * Shared collection backed by Supabase (cross-device, realtime) with an automatic
 * localStorage fallback when Supabase env keys are not configured.
 *
 * Returns { items, add, update, remove, ready } where each item is { id, ...data }.
 */
export default function useSupabaseCollection(board, initialItems) {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);
  const storageKey = `baby-${board}`;
  const seededRef = useRef(false);

  // --- localStorage fallback -------------------------------------------------
  useEffect(() => {
    if (isSupabaseConfigured) return;
    let initial = initialItems.map(i => ({ id: newId(), ...stripId(i) }));
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored !== null) initial = JSON.parse(stored);
    } catch {
      // ignore malformed storage
    }
    setItems(initial);
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board]);

  useEffect(() => {
    if (isSupabaseConfigured || !ready) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {
      // ignore storage write failures
    }
  }, [items, ready, storageKey]);

  // --- Supabase --------------------------------------------------------------
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let cancelled = false;

    const load = async () => {
      const { data, error } = await supabase
        .from('entries')
        .select('id, data, created_at')
        .eq('board', board)
        .order('created_at', { ascending: true });

      if (cancelled) return;
      if (error) {
        setReady(true);
        return;
      }

      if ((!data || data.length === 0) && !seededRef.current && initialItems.length > 0) {
        seededRef.current = true;
        const rows = initialItems.map(i => ({ board, data: stripId(i) }));
        const { data: inserted } = await supabase
          .from('entries')
          .insert(rows)
          .select('id, data, created_at');
        if (!cancelled && inserted) {
          setItems(inserted.map(r => ({ id: r.id, ...r.data })));
        }
      } else {
        setItems(data.map(r => ({ id: r.id, ...r.data })));
      }
      setReady(true);
    };

    load();

    const channel = supabase
      .channel(`entries-${board}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'entries', filter: `board=eq.${board}` },
        (payload) => {
          setItems(prev => {
            if (payload.eventType === 'DELETE') {
              return prev.filter(i => i.id !== payload.old.id);
            }
            const row = payload.new;
            const next = { id: row.id, ...row.data };
            const exists = prev.some(i => i.id === row.id);
            return exists ? prev.map(i => (i.id === row.id ? next : i)) : [...prev, next];
          });
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board]);

  // --- CRUD ------------------------------------------------------------------
  const add = useCallback(async (data) => {
    const clean = stripId(data);
    if (!isSupabaseConfigured) {
      setItems(prev => [...prev, { id: newId(), ...clean }]);
      return;
    }
    const { data: inserted } = await supabase
      .from('entries')
      .insert({ board, data: clean })
      .select('id, data')
      .single();
    if (inserted) {
      setItems(prev =>
        prev.some(i => i.id === inserted.id) ? prev : [...prev, { id: inserted.id, ...inserted.data }]
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board]);

  const update = useCallback(async (id, patch) => {
    setItems(prev => prev.map(i => (i.id === id ? { ...i, ...patch } : i)));
    if (!isSupabaseConfigured) return;
    const current = items.find(i => i.id === id);
    const nextData = stripId({ ...current, ...patch });
    await supabase.from('entries').update({ data: nextData }).eq('id', id);
  }, [items]);

  const remove = useCallback(async (id) => {
    setItems(prev => prev.filter(i => i.id !== id));
    if (!isSupabaseConfigured) return;
    await supabase.from('entries').delete().eq('id', id);
  }, []);

  return { items, add, update, remove, ready };
}
