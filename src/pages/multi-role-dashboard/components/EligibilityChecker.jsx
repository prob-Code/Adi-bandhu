import React, { useMemo, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const schemes = [
  { id: 'edu', name: 'Educational Support', icon: 'GraduationCap' },
  { id: 'health', name: 'Healthcare Access', icon: 'Stethoscope' },
  { id: 'livelihood', name: 'Livelihood Mission', icon: 'Briefcase' },
  { id: 'infra', name: 'Infrastructure (Community)', icon: 'Building2' },
];

function evaluateEligibility(input) {
  const reasons = [];
  let eligible = false;
  switch (input.scheme) {
    case 'edu':
      eligible = input.category === 'ST' && input.age >= 5 && input.age <= 35 && input.income <= 800000;
      if (!eligible) {
        if (input.category !== 'ST') reasons.push('Applicable only for Scheduled Tribe (ST) category.');
        if (input.age < 5 || input.age > 35) reasons.push('Age must be between 5 and 35 years.');
        if (input.income > 800000) reasons.push('Annual family income must be ≤ ₹8,00,000.');
      }
      break;
    case 'health':
      eligible = input.income <= 600000 || input.locationType === 'rural';
      if (!eligible) {
        reasons.push('Eligible for families with income ≤ ₹6,00,000 or for rural service areas.');
      }
      break;
    case 'livelihood':
      eligible = input.age >= 18 && input.age <= 60 && (input.category === 'ST' || input.category === 'OBC') && input.income <= 800000;
      if (!eligible) {
        if (input.age < 18 || input.age > 60) reasons.push('Age must be between 18 and 60 years.');
        if (!(input.category === 'ST' || input.category === 'OBC')) reasons.push('Reserved for ST or OBC categories.');
        if (input.income > 800000) reasons.push('Annual family income must be ≤ ₹8,00,000.');
      }
      break;
    case 'infra':
      eligible = true; // community-level
      break;
    default:
      eligible = false;
  }
  return { eligible, reasons };
}

const EligibilityChecker = () => {
  const [form, setForm] = useState({ name: '', age: 25, category: 'ST', income: 400000, district: 'Khandwa', locationType: 'rural', scheme: 'edu' });
  const [result, setResult] = useState(null);

  const onSubmit = (e) => {
    e.preventDefault();
    const out = evaluateEligibility({ ...form, age: Number(form.age), income: Number(form.income) });
    setResult(out);
  };

  const banner = useMemo(() => {
    if (!result) return null;
    return result.eligible ? (
      <div className="flex items-center gap-2 p-3 rounded border bg-success text-success-foreground">
        <Icon name="BadgeCheck" />
        <span className="font-medium">Eligible</span>
      </div>
    ) : (
      <div className="p-3 rounded border bg-error text-error-foreground">
        <div className="font-medium flex items-center gap-2"><Icon name="CircleAlert" />Not Eligible</div>
        {result.reasons.length > 0 && (
          <ul className="mt-2 list-disc pl-6 text-sm opacity-90">
            {result.reasons.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        )}
      </div>
    );
  }, [result]);

  return (
    <div className="bg-card border border-border rounded-lg p-6 elevation-1">
      <h3 className="text-lg font-semibold text-foreground mb-4">Scheme Eligibility Checker</h3>
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-muted-foreground">Full Name</label>
          <input value={form.name} onChange={(e)=>setForm({ ...form, name: e.target.value })} className="mt-1 w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Age</label>
          <input type="number" min="1" value={form.age} onChange={(e)=>setForm({ ...form, age: e.target.value })} className="mt-1 w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Category</label>
          <select value={form.category} onChange={(e)=>setForm({ ...form, category: e.target.value })} className="mt-1 w-full border rounded px-3 py-2">
            <option>ST</option><option>SC</option><option>OBC</option><option>General</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Annual Family Income (₹)</label>
          <input type="number" min="0" step="1000" value={form.income} onChange={(e)=>setForm({ ...form, income: e.target.value })} className="mt-1 w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="text-sm text-muted-foreground">District</label>
          <input value={form.district} onChange={(e)=>setForm({ ...form, district: e.target.value })} className="mt-1 w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Location Type</label>
          <select value={form.locationType} onChange={(e)=>setForm({ ...form, locationType: e.target.value })} className="mt-1 w-full border rounded px-3 py-2">
            <option value="rural">Rural</option>
            <option value="urban">Urban</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="text-sm text-muted-foreground">Scheme</label>
          <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
            {schemes.map(s => (
              <button type="button" key={s.id} onClick={()=>setForm({ ...form, scheme: s.id })} className={`border rounded px-3 py-2 text-left flex items-center gap-2 ${form.scheme===s.id? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
                <Icon name={s.icon} size={16} />{s.name}
              </button>
            ))}
          </div>
        </div>
        <div className="md:col-span-2 flex items-center justify-between mt-2">
          <div className="text-xs text-muted-foreground">This is an indicative checker; final eligibility is subject to verification.</div>
          <Button type="submit" variant="primary">Check Eligibility</Button>
        </div>
      </form>
      {result && <div className="mt-4">{banner}</div>}
    </div>
  );
};

export default EligibilityChecker;
