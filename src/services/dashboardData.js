import { supabase } from '../utils/supabaseClient';

async function count(table, filters = (q) => q) {
  try {
    let query = supabase.from(table).select('*', { count: 'exact', head: true });
    query = filters(query);
    const { count: c, error } = await query;
    if (error) throw error;
    return typeof c === 'number' ? c : null;
  } catch {
    return null;
  }
}

function todayISO() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export async function getDashboardData(role = 'Field Officer') {
  // Demo defaults used when DB not present
  const demo = {
    'Field Officer': [
      { label: 'Active Claims', value: '24', change: '+3', trend: 'up', icon: 'FileText', color: 'text-primary' },
      { label: 'Pending Verification', value: '8', change: '-2', trend: 'down', icon: 'Clock', color: 'text-warning' },
      { label: 'Completed Today', value: '5', change: '+5', trend: 'up', icon: 'CheckCircle', color: 'text-success' },
      { label: 'Field Visits', value: '12', change: '+1', trend: 'up', icon: 'MapPin', color: 'text-accent' }
    ],
    'Committee Member': [
      { label: 'Pending Reviews', value: '18', change: '+6', trend: 'up', icon: 'Users', color: 'text-primary' },
      { label: 'Approved Claims', value: '142', change: '+12', trend: 'up', icon: 'CheckCircle2', color: 'text-success' },
      { label: 'Rejected Claims', value: '8', change: '+2', trend: 'up', icon: 'XCircle', color: 'text-error' },
      { label: 'Committee Meetings', value: '3', change: '0', trend: 'neutral', icon: 'Calendar', color: 'text-accent' }
    ],
    'Administrator': [
      { label: 'Total Claims', value: '1,247', change: '+89', trend: 'up', icon: 'Database', color: 'text-primary' },
      { label: 'Active Users', value: '156', change: '+12', trend: 'up', icon: 'Users', color: 'text-success' },
      { label: 'System Uptime', value: '99.8%', change: '+0.2%', trend: 'up', icon: 'Activity', color: 'text-accent' },
      { label: 'Data Storage', value: '2.4TB', change: '+120GB', trend: 'up', icon: 'HardDrive', color: 'text-warning' }
    ],
    'Public Viewer': [
      { label: 'Public Claims', value: '892', change: '+15', trend: 'up', icon: 'Globe', color: 'text-primary' },
      { label: 'Approved Rights', value: '634', change: '+8', trend: 'up', icon: 'Shield', color: 'text-success' },
      { label: 'Forest Area', value: '45.2K ha', change: '+0.8K', trend: 'up', icon: 'TreePine', color: 'text-accent' },
      { label: 'Communities', value: '78', change: '+2', trend: 'up', icon: 'Home', color: 'text-secondary' }
    ]
  };

  // Attempt live counts; if any query returns null we keep demo values
  try {
    const since = todayISO();
    if (role === 'Field Officer') {
      const [active, pendingVer, completedToday, fieldVisits] = await Promise.all([
        count('claims', (q) => q.in('status', ['assigned', 'in_verification', 'pending'])),
        count('claims', (q) => q.in('status', ['in_verification', 'pending_verification'])),
        count('claims', (q) => q.gte('updated_at', since).in('status', ['verified', 'approved', 'completed'])),
        count('field_visits', (q) => q.gte('date', since))
      ]);
      if ([active, pendingVer, completedToday, fieldVisits].every((v) => v !== null)) {
        return {
          stats: [
            { label: 'Active Claims', value: String(active), change: '+0', trend: 'neutral', icon: 'FileText', color: 'text-primary' },
            { label: 'Pending Verification', value: String(pendingVer), change: '+0', trend: 'neutral', icon: 'Clock', color: 'text-warning' },
            { label: 'Completed Today', value: String(completedToday), change: '+0', trend: 'neutral', icon: 'CheckCircle', color: 'text-success' },
            { label: 'Field Visits', value: String(fieldVisits), change: '+0', trend: 'neutral', icon: 'MapPin', color: 'text-accent' }
          ],
          source: 'live'
        };
      }
    }

    if (role === 'Committee Member') {
      const [pending, approved, rejected, meetings] = await Promise.all([
        count('claims', (q) => q.eq('status', 'committee_pending')),
        count('claims', (q) => q.eq('status', 'approved')),
        count('claims', (q) => q.eq('status', 'rejected')),
        count('committee_meetings', (q) => q.gte('scheduled_at', since))
      ]);
      if ([pending, approved, rejected, meetings].every((v) => v !== null)) {
        return {
          stats: [
            { label: 'Pending Reviews', value: String(pending), change: '+0', trend: 'neutral', icon: 'Users', color: 'text-primary' },
            { label: 'Approved Claims', value: String(approved), change: '+0', trend: 'neutral', icon: 'CheckCircle2', color: 'text-success' },
            { label: 'Rejected Claims', value: String(rejected), change: '+0', trend: 'neutral', icon: 'XCircle', color: 'text-error' },
            { label: 'Committee Meetings', value: String(meetings), change: '0', trend: 'neutral', icon: 'Calendar', color: 'text-accent' }
          ],
          source: 'live'
        };
      }
    }

    if (role === 'Administrator') {
      const [totalClaims, activeUsers] = await Promise.all([
        count('claims'),
        count('users', (q) => q.eq('active', true))
      ]);
      if ([totalClaims, activeUsers].every((v) => v !== null)) {
        return {
          stats: [
            { label: 'Total Claims', value: String(totalClaims), change: '+0', trend: 'neutral', icon: 'Database', color: 'text-primary' },
            { label: 'Active Users', value: String(activeUsers), change: '+0', trend: 'neutral', icon: 'Users', color: 'text-success' },
            { label: 'System Uptime', value: '99.8%', change: '+0%', trend: 'neutral', icon: 'Activity', color: 'text-accent' },
            { label: 'Data Storage', value: '—', change: '—', trend: 'neutral', icon: 'HardDrive', color: 'text-warning' }
          ],
          source: 'live'
        };
      }
    }

    if (role === 'Public Viewer') {
      const [publicClaims, approved, communities] = await Promise.all([
        count('claims', (q) => q.eq('is_public', true)),
        count('claims', (q) => q.eq('status', 'approved')),
        count('communities')
      ]);
      if ([publicClaims, approved, communities].every((v) => v !== null)) {
        return {
          stats: [
            { label: 'Public Claims', value: String(publicClaims), change: '+0', trend: 'neutral', icon: 'Globe', color: 'text-primary' },
            { label: 'Approved Rights', value: String(approved), change: '+0', trend: 'neutral', icon: 'Shield', color: 'text-success' },
            { label: 'Forest Area', value: '—', change: '—', trend: 'neutral', icon: 'TreePine', color: 'text-accent' },
            { label: 'Communities', value: String(communities), change: '+0', trend: 'neutral', icon: 'Home', color: 'text-secondary' }
          ],
          source: 'live'
        };
      }
    }
  } catch {}

  return { stats: demo[role] || demo['Field Officer'], source: 'demo' };
}
