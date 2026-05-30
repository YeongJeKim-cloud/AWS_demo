import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, AlertOctagon } from 'lucide-react';
import { BackToMap } from './VisualKit';
import TraceGraph from './TraceGraph';
import { ERROR_SCENARIOS } from '../data/scenarios';
import './TraceGraph.css';
import './ErrorTracking.css';

const SEVERITY_CLASS = {
  hold: 'severity-hold',
  critical: 'severity-critical',
};

export default function ErrorTracking({ onNavigate }) {
  const [selected, setSelected] = useState('hvdb-lot-sigma');
  const [playing, setPlaying] = useState(false);
  const [stepIndex, setStepIndex] = useState(-1);
  const [pathIndex, setPathIndex] = useState(-1);
  const timersRef = useRef([]);

  const scenario = ERROR_SCENARIOS.find((s) => s.id === selected) || ERROR_SCENARIOS[0];

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const reset = () => {
    clearTimers();
    setPlaying(false);
    setStepIndex(-1);
    setPathIndex(-1);
  };

  const runTrace = () => {
    reset();
    setPlaying(true);
    scenario.traceSteps.forEach((_, i) => {
      timersRef.current.push(setTimeout(() => setStepIndex(i), i * 1400));
    });
    scenario.highlightPath.forEach((_, i) => {
      timersRef.current.push(setTimeout(() => setPathIndex(i), 800 + i * 700));
    });
    timersRef.current.push(setTimeout(() => setPlaying(false), scenario.traceSteps.length * 1400 + 500));
  };

  useEffect(() => () => clearTimers(), []);
  useEffect(() => { reset(); }, [selected]);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <BackToMap onNavigate={onNavigate} />

      <div className="panel error-hero panel-glow-red">
        <span className="badge badge-alert">
          <AlertOctagon size={12} />
          Supervisor desk
        </span>
        <h2 className="panel-title" style={{ marginTop: '0.65rem' }}>Trace an issue — find every affected lot & vehicle</h2>
        <p className="panel-sub">
          Pick what went wrong. See which lots, modules, and VINs are involved — in seconds, not days.
        </p>
        <div className="before-after">
          <div className="ba-card before">
            <span className="ba-label">Old way</span>
            <span className="ba-value">24–72 hours</span>
            <span className="ba-desc">Search SAP, MES, QMS, fleet by hand</span>
          </div>
          <div className="ba-arrow">→</div>
          <div className="ba-card after">
            <span className="ba-label">This system</span>
            <span className="ba-value">&lt; 5 seconds</span>
            <span className="ba-desc">One lookup: Lot → module → VIN → owner</span>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: '1.25rem' }}>
        <div className="panel">
          <h3 style={{ fontSize: '0.95rem', margin: '0 0 0.75rem' }}>What happened?</h3>
          <div className="error-list">
            {ERROR_SCENARIOS.map((err) => (
              <button
                key={err.id}
                type="button"
                className={`error-item ${selected === err.id ? 'selected' : ''}`}
                onClick={() => setSelected(err.id)}
              >
                <span className={`error-severity ${SEVERITY_CLASS[err.severity]}`}>
                  {err.severity === 'critical' ? 'CRIT' : 'HOLD'}
                </span>
                <span className="error-item-body">
                  <strong>{err.title.replace(/Step \d — /, '')}</strong>
                  <span>{err.error.slice(0, 55)}…</span>
                </span>
              </button>
            ))}
          </div>
          <button className="btn-worker-primary" style={{ marginTop: '1rem', width: '100%' }} onClick={runTrace} disabled={playing}>
            {playing ? 'Tracing…' : 'Run trace'}
          </button>
        </div>

        <div className="panel">
          <div className="error-field">
            <label>Problem</label>
            <p>{scenario.error}</p>
          </div>
          <div className="query-box">
            <label><Search size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />Lookup</label>
            <code>{scenario.query.replace(/Neptune|RDS|AWS|Lambda|SNS/g, '').trim() || scenario.query}</code>
          </div>
        </div>
      </div>

      <div className="panel" style={{ marginTop: '1.25rem' }}>
        <TraceGraph
          highlightLots={scenario.highlightLots}
          highlightNodes={stepIndex >= 0 ? scenario.highlightNodes : []}
          highlightPath={scenario.highlightPath}
          activePathIndex={pathIndex}
        />
      </div>

      <div className="grid-2" style={{ marginTop: '1.25rem' }}>
        <div className="panel">
          <h3 style={{ fontSize: '0.95rem', margin: '0 0 0.75rem' }}>What we did</h3>
          <div className="trace-timeline">
            {scenario.traceSteps.map((step, i) => (
              <div key={step.label} className={`trace-step ${i <= stepIndex ? 'revealed' : ''} ${i === stepIndex ? 'active' : ''}`}>
                <span className="trace-step-time">{step.time}</span>
                <div className="trace-step-body">
                  <strong>{step.label}</strong>
                  <p>{step.detail.replace(/Neptune|RDS|AWS|Lambda|SNS|SageMaker|Glue|SiteWise/g, (m) => {
                    const map = { Neptune: 'trace graph', RDS: 'records', Lambda: 'system', SNS: 'alert', SageMaker: 'analysis', Glue: 'import', SiteWise: 'bench' };
                    return map[m] || m;
                  })}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <h3 style={{ fontSize: '0.95rem', margin: '0 0 0.75rem' }}>Who is affected?</h3>
          <table className="impact-table">
            <thead>
              <tr><th>Area</th><th>Count</th><th>Action</th></tr>
            </thead>
            <tbody>
              {scenario.impact.map((row) => (
                <tr key={row.stage} className={stepIndex >= scenario.traceSteps.length - 1 ? 'revealed' : ''}>
                  <td>{row.stage}</td>
                  <td><strong>{row.count}</strong></td>
                  <td>{row.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
