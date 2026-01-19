import React, { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const STORAGE_KEY = 'fra.grievances.v1';

const GrievanceCenter = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', contact: '', category: 'Scheme', priority: 'Normal', subject: '', description: '' });

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      setItems(saved);
    } catch {}
  }, []);

  const save = (next) => {
    setItems(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.subject || !form.description) return;
    const newItem = {
      id: 'G' + Math.random().toString(36).slice(2, 8).toUpperCase(),
      date: new Date().toISOString(),
      status: 'Submitted',
      ...form,
    };
    const next = [newItem, ...items];
    save(next);
    setForm({ name: '', contact: '', category: 'Scheme', priority: 'Normal', subject: '', description: '' });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 elevation-1">
      <h3 className="text-lg font-semibold text-foreground mb-4">Grievance Redressal</h3>
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <input placeholder="Full Name" className="border rounded px-3 py-2" value={form.name} onChange={(e)=>setForm({ ...form, name: e.target.value })} />
        <input placeholder="Contact (Email/Phone)" className="border rounded px-3 py-2" value={form.contact} onChange={(e)=>setForm({ ...form, contact: e.target.value })} />
        <select className="border rounded px-3 py-2" value={form.category} onChange={(e)=>setForm({ ...form, category: e.target.value })}>
          <option>Scheme</option><option>Service</option><option>Website</option><option>Other</option>
        </select>
        <select className="border rounded px-3 py-2" value={form.priority} onChange={(e)=>setForm({ ...form, priority: e.target.value })}>
          <option>Low</option><option>Normal</option><option>High</option>
        </select>
        <input placeholder="Subject" className="md:col-span-2 border rounded px-3 py-2" value={form.subject} onChange={(e)=>setForm({ ...form, subject: e.target.value })} required />
        <textarea placeholder="Description" className="md:col-span-2 border rounded px-3 py-2 min-h-24" value={form.description} onChange={(e)=>setForm({ ...form, description: e.target.value })} required />
        <div className="md:col-span-2 flex items-center justify-between">
          <div className="text-xs text-muted-foreground">A ticket ID will be generated after submission.</div>
          <Button type="submit" variant="primary"><Icon name="Send" size={16} className="mr-2" />Submit</Button>
        </div>
      </form>

      <div className="border-t pt-4">
        <h4 className="font-medium mb-2">Recent Submissions</h4>
        {items.length === 0 ? (
          <div className="text-sm text-muted-foreground">No grievances submitted yet.</div>
        ) : (
          <div className="space-y-2 max-h-72 overflow-auto">
            {items.map(g => (
              <div key={g.id} className="border rounded p-3 flex items-start gap-3">
                <Icon name="FileText" size={16} className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{g.subject}</div>
                    <span className={`text-xs px-2 py-0.5 rounded ${g.status==='Submitted'?'bg-warning text-warning-foreground':'bg-success text-success-foreground'}`}>{g.status}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{new Date(g.date).toLocaleString('en-IN')}</div>
                  <div className="text-sm mt-1">{g.description}</div>
                  <div className="text-xs text-muted-foreground mt-1">Category: {g.category} • Priority: {g.priority} • Contact: {g.contact || 'N/A'}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GrievanceCenter;
