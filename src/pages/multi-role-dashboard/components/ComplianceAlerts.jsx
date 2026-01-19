import React from 'react';
import Icon from '../../../components/AppIcon';

const alerts = [
  { id: 'a1', severity: 'High', message: 'Pending claim verifications exceed SLA in 3 districts', date: '2025-09-15' },
  { id: 'a2', severity: 'Medium', message: 'Monthly audit report due in 2 days', date: '2025-09-18' },
  { id: 'a3', severity: 'Low', message: 'Backup storage approaching threshold (85%)', date: '2025-09-16' },
];

const badge = (sev) => {
  switch (sev) {
    case 'High': return 'bg-error text-error-foreground';
    case 'Medium': return 'bg-warning text-warning-foreground';
    default: return 'bg-muted text-foreground';
  }
};

const ComplianceAlerts = () => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 elevation-1">
      <h3 className="text-lg font-semibold text-foreground mb-4">Compliance & Alerts</h3>
      <div className="space-y-3">
        {alerts.map(a => (
          <div key={a.id} className="flex items-start gap-3 border rounded p-3">
            <Icon name="BellRing" size={16} className="mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium">{a.message}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${badge(a.severity)}`}>{a.severity}</span>
              </div>
              <div className="text-xs text-muted-foreground">{a.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplianceAlerts;
