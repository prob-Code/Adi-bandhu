import React, { useEffect, useMemo, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import MapCanvas from '../../interactive-web-gis-map/components/MapCanvas';
import { recommendSchemes, buildSchemeLayers, explainRecommendation, SCHEME_CATALOG } from '../../../utils/dss';

const DSSPanel = ({ claim, onClose }) => {
  const [contextSignals, setContextSignals] = useState({
    nearProtectedArea: true,
    hasWildlifeCorridor: false,
    lowConnectivity: true,
    healthRiskSeason: false,
  });
  const [selectedSchemeIds, setSelectedSchemeIds] = useState([]);
  const [sortKey, setSortKey] = useState('score');

  const recommendations = useMemo(() => {
    const recs = recommendSchemes(claim, contextSignals);
    if (sortKey === 'alpha') return [...recs].sort((a, b) => a.name.localeCompare(b.name));
    return recs;
  }, [claim, contextSignals, sortKey]);

  const schemeLayers = useMemo(() => {
    const selectedRecs = recommendations.filter(r => selectedSchemeIds.includes(r.schemeId));
    return buildSchemeLayers(selectedRecs);
  }, [recommendations, selectedSchemeIds]);

  useEffect(() => {
    // Auto-select top 2 on first load for quick visualization
    if (!selectedSchemeIds?.length && recommendations?.length) {
      setSelectedSchemeIds(recommendations.slice(0, 2).map(r => r.schemeId));
    }
  }, [recommendations]);

  const toggleScheme = (id) => {
    setSelectedSchemeIds((prev) => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const sortOptions = [
    { value: 'score', label: 'Score (High → Low)' },
    { value: 'alpha', label: 'Alphabetical' },
  ];

  return (
    <div className="bg-card border border-border rounded-lg elevation-2 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
            <Icon name="Brain" size={20} className="text-secondary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Decision Support System</h3>
            <p className="text-sm text-muted-foreground">Claim #{claim?.id} • Scheme recommendations</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <Icon name="X" size={20} />
        </Button>
      </div>

      {/* Controls */}
      <div className="p-4 border-b border-border grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <h4 className="font-medium text-foreground">Context Signals</h4>
          <div className="space-y-2">
            <Checkbox label="Near protected area" checked={contextSignals.nearProtectedArea} onChange={() => setContextSignals(s => ({ ...s, nearProtectedArea: !s.nearProtectedArea }))} />
            <Checkbox label="Wildlife corridor overlap" checked={contextSignals.hasWildlifeCorridor} onChange={() => setContextSignals(s => ({ ...s, hasWildlifeCorridor: !s.hasWildlifeCorridor }))} />
            <Checkbox label="Poor last-mile connectivity" checked={contextSignals.lowConnectivity} onChange={() => setContextSignals(s => ({ ...s, lowConnectivity: !s.lowConnectivity }))} />
            <Checkbox label="Seasonal health risks" checked={contextSignals.healthRiskSeason} onChange={() => setContextSignals(s => ({ ...s, healthRiskSeason: !s.healthRiskSeason }))} />
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-foreground">Select Schemes</h4>
          <div className="grid grid-cols-2 gap-2">
            {SCHEME_CATALOG.map((s) => (
              <label key={s.id} className="flex items-center space-x-2 p-2 border border-border rounded-md cursor-pointer hover:bg-muted/40">
                <input type="checkbox" className="w-4 h-4" checked={selectedSchemeIds.includes(s.id)} onChange={() => toggleScheme(s.id)} />
                <span className="text-sm flex-1 truncate">{s.name}</span>
                <span className="w-3 h-3 rounded" style={{ backgroundColor: s.color }} />
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-foreground">Sort</h4>
          <Select options={sortOptions} value={sortKey} onChange={setSortKey} />
          <div className="text-xs text-muted-foreground">Sorted list affects which layers are auto-selected and shown.</div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-12 gap-4 p-4 overflow-hidden flex-1">
        {/* Recommendations list */}
        <div className="col-span-12 lg:col-span-5 overflow-y-auto pr-2">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-foreground">Recommended Schemes</h4>
            <span className="text-xs text-muted-foreground">{recommendations.length} matches</span>
          </div>
          <div className="space-y-3">
            {recommendations.map((rec) => (
              <div key={rec.schemeId} className={`p-3 border rounded-lg ${selectedSchemeIds.includes(rec.schemeId) ? 'border-primary bg-primary/5' : 'border-border'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: rec.color + '20' }}>
                      <Icon name={rec.icon} size={16} style={{ color: rec.color }} />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{rec.name}</div>
                      <div className="text-xs text-muted-foreground">{rec.category}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Score</div>
                    <div className="text-sm font-semibold">{rec.score}</div>
                  </div>
                </div>
                <div className="mt-2 h-1.5 w-full bg-muted rounded">
                  <div className="h-1.5 rounded" style={{ width: Math.min(100, rec.score) + '%', backgroundColor: rec.color }} />
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {explainRecommendation(rec).map((r, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full border" style={{ borderColor: rec.color + '55', color: rec.color }}>{r}</span>
                  ))}
                </div>
                <div className="mt-2 text-xs text-muted-foreground">Benefits: {rec.benefits.join(' • ')}</div>
                <div className="mt-2">
                  <Button size="sm" variant={selectedSchemeIds.includes(rec.schemeId) ? 'default' : 'outline'} onClick={() => toggleScheme(rec.schemeId)}>
                    <Icon name={selectedSchemeIds.includes(rec.schemeId) ? 'EyeOff' : 'Eye'} size={14} className="mr-1" />
                    {selectedSchemeIds.includes(rec.schemeId) ? 'Hide on Map' : 'Show on Map'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map with layers */}
        <div className="col-span-12 lg:col-span-7">
          <div className="h-full min-h-[360px] rounded-lg overflow-hidden border border-border relative">
            <MapCanvas selectedLayers={["states","districts","forest_cover" ]} mapMode="2d" schemeLayers={schemeLayers} />

            {/* Legend */}
            {schemeLayers?.length > 0 && (
              <div className="absolute bottom-3 left-3 bg-card/90 backdrop-blur-sm border border-border rounded-md p-2 text-xs">
                <div className="font-medium mb-1">Scheme Layers</div>
                <div className="space-y-1">
                  {schemeLayers.map(l => (
                    <div key={l.id} className="flex items-center space-x-2">
                      <span className="w-3 h-3 rounded" style={{ backgroundColor: l.color }} />
                      <span>{l.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <div className="text-muted-foreground">Layer recommended schemes to plan targeted development around approved claims.</div>
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button variant="default">
              <Icon name="Check" size={14} className="mr-1" />
              Save Recommendations
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DSSPanel;
