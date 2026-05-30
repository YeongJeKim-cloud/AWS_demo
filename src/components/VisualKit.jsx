import { Package, Factory, Cpu, CarFront, Radio } from 'lucide-react';

const STEP_COLORS = {
  1: { color: '#ff9900', light: '#ffb84d' },
  2: { color: '#22d3ee', light: '#67e8f9' },
  3: { color: '#a78bfa', light: '#c4b5fd' },
  4: { color: '#4ade80', light: '#86efac' },
  5: { color: '#f472b6', light: '#f9a8d4' },
};

export function MetricCard({ value, label, accent = '#4ade80', icon: Icon }) {
  return (
    <div className="stat-card" style={{ '--accent': accent, '--icon-bg': `${accent}18` }}>
      {Icon && (
        <div className="metric-icon-wrap">
          <Icon size={18} strokeWidth={2.2} />
        </div>
      )}
      <div className="value">{value}</div>
      <div className="label">{label}</div>
    </div>
  );
}

export function StationBar({ activeStep = 0 }) {
  const stations = [
    { n: 1, label: 'Receiving', icon: Package },
    { n: 2, label: 'Assembly', icon: Factory },
    { n: 3, label: 'HVDB test', icon: Cpu },
    { n: 4, label: 'Vehicle gate', icon: CarFront },
    { n: 5, label: 'Fleet desk', icon: Radio },
  ];

  return (
    <div className="pipeline-bar">
      {stations.map((s, i) => {
        const done = activeStep > s.n;
        const active = activeStep === s.n;
        const Icon = s.icon;
        return (
          <div key={s.n} className="pipeline-step">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className={`pipeline-dot ${active ? 'active' : ''} ${done ? 'done' : ''}`}>
                {done ? '✓' : <Icon size={14} strokeWidth={2.5} />}
              </div>
              <span className="pipeline-label">{s.label}</span>
            </div>
            {i < stations.length - 1 && <div className={`pipeline-line ${done ? 'done' : ''}`} />}
          </div>
        );
      })}
    </div>
  );
}

export function BackToMap({ onNavigate }) {
  if (!onNavigate) return null;
  return (
    <button type="button" className="back-to-map" onClick={() => onNavigate('overview')}>
      ← Plant map
    </button>
  );
}

export { STEP_COLORS };
