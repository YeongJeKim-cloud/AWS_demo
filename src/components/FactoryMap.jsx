import { motion } from 'framer-motion';
import {
  Truck, PackageSearch, Warehouse, Wrench, Cpu, CarFront, Radio,
  AlertTriangle, ChevronRight, Database,
} from 'lucide-react';
import './FactoryMap.css';

const ZONES = [
  {
    id: 'supplier',
    step: null,
    label: 'Suppliers',
    sub: 'Lot + COA',
    icon: Truck,
    status: 'ok',
    x: 4,
    y: 38,
  },
  {
    id: 'step1',
    step: 1,
    label: 'Receiving',
    sub: 'AQL sample',
    icon: PackageSearch,
    status: 'ok',
    x: 16,
    y: 38,
  },
  {
    id: 'warehouse',
    step: null,
    label: 'Warehouse',
    sub: 'Lot A123 ✓',
    icon: Warehouse,
    status: 'ok',
    x: 28,
    y: 38,
  },
  {
    id: 'step2',
    step: 2,
    label: 'Assembly',
    sub: 'Torque · Vision',
    icon: Wrench,
    status: 'warn',
    alert: 'Cross-thread',
    x: 40,
    y: 38,
  },
  {
    id: 'step3',
    step: 3,
    label: 'HVDB EOL',
    sub: 'IR · Hi-pot',
    icon: Cpu,
    status: 'error',
    alert: 'Lot B456 · 5σ',
    x: 52,
    y: 38,
  },
  {
    id: 'step4',
    step: 4,
    label: 'Vehicle EOL',
    sub: 'IMD · Contactor',
    icon: CarFront,
    status: 'warn',
    alert: 'IMD hold',
    x: 64,
    y: 38,
  },
  {
    id: 'step5',
    step: 5,
    label: 'Fleet',
    sub: '47 vehicles',
    icon: Radio,
    status: 'error',
    alert: 'Target recall',
    x: 76,
    y: 38,
  },
];

const FLOW_PATH = 'M 8 50 L 92 50';

export default function FactoryMap({ onNavigate, highlightId = null }) {
  const clickable = (z) => z.id.startsWith('step');

  return (
    <div className="factory-map-wrap">
      <div className="factory-map-header">
        <div>
          <h2>Plant map</h2>
          <p>Tap a <span className="legend-dot error" /> zone to open that station</p>
        </div>
        <div className="factory-legend">
          <span><i className="dot ok" /> Normal</span>
          <span><i className="dot warn" /> Warning</span>
          <span><i className="dot error" /> Alert</span>
        </div>
      </div>

      <div className="factory-map-canvas">
        <div className="aws-cloud-strip data-strip">
          <Database size={16} />
          <span>Shared lot records</span>
          <div className="cloud-services">
            {['Lot history', 'Module trace', 'VIN link', 'Alerts'].map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </div>

        <svg className="factory-svg" viewBox="0 0 100 62" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff9900" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#f87171" stopOpacity="0.4" />
            </linearGradient>
            <filter id="glow-red">
              <feGaussianBlur stdDeviation="1.2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Factory floor */}
          <rect x="2" y="28" width="96" height="28" rx="2" fill="rgba(30,41,59,0.5)" stroke="rgba(148,163,184,0.15)" strokeWidth="0.3" />
          <text x="50" y="26" textAnchor="middle" fill="#64748b" fontSize="2.2" fontWeight="600">FACTORY FLOOR</text>

          {/* Conveyor line */}
          <path d={FLOW_PATH} stroke="url(#flowGrad)" strokeWidth="0.5" fill="none" strokeDasharray="2 1">
            <animate attributeName="stroke-dashoffset" from="0" to="-6" dur="2s" repeatCount="indefinite" />
          </path>

          {/* Data links to shared records */}
          {ZONES.filter((z) => z.step).map((z) => (
            <line
              key={`cloud-${z.id}`}
              x1={z.x + 4}
              y1={z.y + 2}
              x2={z.x + 4}
              y2={12}
              stroke={z.status === 'error' ? '#f87171' : z.status === 'warn' ? '#fbbf24' : 'rgba(148,163,184,0.2)'}
              strokeWidth="0.25"
              strokeDasharray="1 0.8"
              opacity={z.status === 'ok' ? 0.4 : 0.8}
            />
          ))}

          {/* Road */}
          <rect x="74" y="52" width="24" height="6" rx="1" fill="rgba(51,65,85,0.6)" />
          <text x="86" y="56.5" textAnchor="middle" fill="#64748b" fontSize="1.8">ROAD</text>
        </svg>

        {/* HTML overlay zones for interaction */}
        <div className="factory-zones">
          {ZONES.map((zone, i) => {
            const Icon = zone.icon;
            const isClickable = clickable(zone);
            const isHighlight = highlightId === zone.id;
            return (
              <motion.button
                key={zone.id}
                type="button"
                className={`factory-zone status-${zone.status} ${isClickable ? 'clickable' : ''} ${isHighlight ? 'highlight' : ''}`}
                style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
                onClick={() => isClickable && onNavigate?.(zone.id)}
                whileHover={isClickable ? { scale: 1.06, y: -4 } : {}}
                whileTap={isClickable ? { scale: 0.98 } : {}}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                {(zone.status === 'error' || zone.status === 'warn') && (
                  <span className="zone-pulse" />
                )}
                {zone.status !== 'ok' && (
                  <span className={`zone-alert status-${zone.status}`}>
                    <AlertTriangle size={10} />
                    {zone.alert}
                  </span>
                )}
                <div className="zone-icon">
                  <Icon size={22} strokeWidth={1.8} />
                  {zone.step && <span className="zone-step-num">{zone.step}</span>}
                </div>
                <span className="zone-label">{zone.label}</span>
                <span className="zone-sub">{zone.sub}</span>
                {isClickable && (
                  <span className="zone-cta">
                    Open <ChevronRight size={12} />
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Lot B456 trace overlay */}
        <motion.button
          type="button"
          className="lot-trace-banner"
          onClick={() => onNavigate?.('step3')}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <span className="lot-pill">Lot B456</span>
          <svg className="lot-trace-line" viewBox="0 0 400 40" preserveAspectRatio="none">
            <path
              d="M 0 20 Q 100 5, 200 20 T 400 20"
              fill="none"
              stroke="#f87171"
              strokeWidth="2"
              strokeDasharray="6 4"
            >
              <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="1.5s" repeatCount="indefinite" />
            </path>
          </svg>
          <span className="lot-trace-label">Defect thread → click to trace Lot B456</span>
        </motion.button>
      </div>
    </div>
  );
}
