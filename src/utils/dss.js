// src/utils/dss.js
// Rule-based Decision Support System (DSS) for recommending Centrally Sponsored Schemes (CSS)
// based on claim attributes and simple map/context signals. Also provides map layer hints
// for visualizing recommended schemes.

// Catalog of supported schemes with basic targeting criteria
const SCHEMES = [
  {
    id: 'sch-education',
    name: 'Educational Support',
    category: 'Human Development',
    icon: 'GraduationCap',
    color: '#2563eb',
    criteria: {
      claimTypes: ['Community Forest Rights', 'Individual Forest Rights'],
      minFamilies: 1,
      districtsPriority: ['Barwani', 'Jhabua', 'Dhar'],
      priorityBoost: { High: 15, Medium: 8, Low: 0 },
    },
    benefits: [
      'Scholarships for ST students',
      'Residential hostels near schools',
      'Digital access & remote learning centers',
    ],
  },
  {
    id: 'sch-health',
    name: 'Healthcare Access',
    category: 'Human Development',
    icon: 'Stethoscope',
    color: '#16a34a',
    criteria: {
      claimTypes: ['Community Forest Rights', 'Individual Forest Rights'],
      minArea: 2,
      districtsPriority: ['Khandwa', 'Barwani'],
      priorityBoost: { High: 12, Medium: 6, Low: 0 },
    },
    benefits: [
      'Mobile clinics and telemedicine',
      'Maternal and child health programs',
      'Health camps for seasonal outbreaks',
    ],
  },
  {
    id: 'sch-livelihood',
    name: 'Livelihood Mission',
    category: 'Economic Empowerment',
    icon: 'Briefcase',
    color: '#ea580c',
    criteria: {
      claimTypes: ['Community Forest Rights', 'Individual Forest Rights'],
      minArea: 1,
      minFamilies: 1,
      districtsPriority: ['Dhar', 'Jhabua'],
      priorityBoost: { High: 10, Medium: 5, Low: 0 },
    },
    benefits: [
      'Minor forest produce value chains',
      'SHG formation and market linkages',
      'Skill development & entrepreneurship',
    ],
  },
  {
    id: 'sch-infra',
    name: 'Rural Infrastructure',
    category: 'Connectivity',
    icon: 'Building2',
    color: '#9333ea',
    criteria: {
      claimTypes: ['Community Forest Rights'],
      minFamilies: 10,
      minArea: 5,
      districtsPriority: ['Barwani', 'Khandwa', 'Jhabua'],
      priorityBoost: { High: 8, Medium: 4, Low: 0 },
    },
    benefits: [
      'All-weather roads and bridges',
      'Rural housing upgrades',
      'Last-mile digital connectivity',
    ],
  },
];

function scoreByCriteria(claim, scheme) {
  let score = 0;
  const reasons = [];
  const c = scheme.criteria || {};

  // Claim type match
  if (c.claimTypes?.includes(claim?.type)) {
    score += 20;
    reasons.push('Matches claim type');
  }

  // Families count
  if (typeof c.minFamilies === 'number' && claim?.families >= c.minFamilies) {
    score += 10;
    reasons.push(`Families ≥ ${c.minFamilies}`);
  }

  // Area threshold
  if (typeof c.minArea === 'number' && claim?.area >= c.minArea) {
    score += 10;
    reasons.push(`Area ≥ ${c.minArea} ha`);
  }

  // District prioritization
  if (c.districtsPriority?.includes(claim?.district)) {
    score += 10;
    reasons.push(`Priority district: ${claim?.district}`);
  }

  // Claim priority boost
  const boost = c.priorityBoost?.[claim?.priority] || 0;
  if (boost) {
    score += boost;
    reasons.push(`${claim?.priority} priority boost (+${boost})`);
  }

  return { score, reasons };
}

// Map/contextual signals can nudge scores further
function scoreByContext(context = {}) {
  const ctxReasons = [];
  let ctxScore = 0;

  if (context?.nearProtectedArea) {
    ctxScore += 6;
    ctxReasons.push('Near protected area');
  }
  if (context?.hasWildlifeCorridor) {
    ctxScore += 5;
    ctxReasons.push('Wildlife corridor overlap');
  }
  if (context?.lowConnectivity) {
    ctxScore += 8;
    ctxReasons.push('Poor last-mile connectivity');
  }
  if (context?.healthRiskSeason) {
    ctxScore += 6;
    ctxReasons.push('Seasonal health risks');
  }

  return { ctxScore, ctxReasons };
}

export function recommendSchemes(claim, context = {}) {
  if (!claim) return [];
  const { ctxScore, ctxReasons } = scoreByContext(context);

  return SCHEMES.map((scheme) => {
    const { score, reasons } = scoreByCriteria(claim, scheme);
    const total = score + ctxScore;
    return {
      schemeId: scheme.id,
      name: scheme.name,
      icon: scheme.icon,
      color: scheme.color,
      category: scheme.category,
      benefits: scheme.benefits,
      score: total,
      reasons: [...reasons, ...ctxReasons],
    };
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
}

// Build simple rectangular overlays for the map to visualize potential scheme focus areas.
// Returns array: [{ id, name, color, boundsPercent: { left, top, width, height } }]
export function buildSchemeLayers(recommendations = []) {
  const baseLeft = 10;
  const baseTop = 15;
  const width = 22;
  const height = 16;

  return recommendations.slice(0, 4).map((rec, i) => ({
    id: `layer_${rec.schemeId}`,
    name: rec.name,
    color: rec.color,
    boundsPercent: {
      left: baseLeft + i * 8,
      top: baseTop + i * 6,
      width: width + (i % 2 === 0 ? 4 : -2),
      height: height + (i % 2 === 1 ? 3 : -1),
    },
  }));
}

export function explainRecommendation(rec) {
  const uniqueReasons = Array.from(new Set(rec?.reasons || []));
  return uniqueReasons;
}

export const SCHEME_CATALOG = SCHEMES.map(({ id, name, icon, color, category }) => ({ id, name, icon, color, category }));
