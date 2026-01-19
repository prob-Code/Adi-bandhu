import React, { useMemo, useState } from 'react';
import Icon from '../../../components/AppIcon';

const baseLogs = [
  { id: 'l1', time: '2025-09-16 10:10', actor: 'Rajesh Kumar', action: 'Updated claim details', entity: 'Claim FR2025007' },
  { id: 'l2', time: '2025-09-16 09:42', actor: 'Anita Sharma', action: 'Approved claim', entity: 'Claim FR2025002' },
  { id: 'l3', time: '2025-09-16 09:10', actor: 'System', action: 'Nightly backup completed', entity: 'Storage' },
  { id: 'l4', time: '2025-09-15 18:34', actor: 'Committee', action: 'Scheduled meeting', entity: 'Review Board' },
];

const AuditLogs = () => {
  const [q, setQ] = useState('');
  const logs = useMemo(() => baseLogs.filter(l => (l.actor + l.action + l.entity).toLowerCase().includes(q.toLowerCase())), [q]);
  return (
    <div className="bg-card border border-border rounded-lg p-6 elevation-1">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-foreground">Audit Logs</h3>
        <div className="flex items-center gap-2">
          <Icon name="Search" size={16} />
          <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search" className="border rounded px-2 py-1 text-sm" />
        </div>
      </div>
      <div className="space-y-2 max-h-72 overflow-auto">
        {logs.map(l => (
          <div key={l.id} className="border rounded p-3 flex items-start gap-3">
            <Icon name="History" size={16} className="mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="font-medium">{l.action}</div>
                <div className="text-xs text-muted-foreground">{l.time}</div>
              </div>
              <div className="text-sm">{l.entity}</div>
              <div className="text-xs text-muted-foreground">By: {l.actor}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuditLogs;
