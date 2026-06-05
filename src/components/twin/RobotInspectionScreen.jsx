import { useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AlertTriangle, ArrowLeft, Lock, Search, ShieldAlert, Video } from 'lucide-react';
import TorqueCurveChart from '../TorqueCurveChart';
import CrossThreadDetailModal from './CrossThreadDetailModal';
import { ASSEMBLY_ALERT, TORQUE_COMPARE } from '../../data/scenarios';

function MetricRow({ label, normal, bad, flag }) {
  return (
    <tr className={flag ? 'flag' : ''}>
      <td>{label}</td>
      <td>{normal}</td>
      <td>
        {bad}
        {flag && <span>same peak, bad process</span>}
      </td>
    </tr>
  );
}

function CurveCard({ kind, data, onInspect }) {
  const interactive = typeof onInspect === 'function';
  const Tag = interactive ? 'button' : 'div';
  return (
    <Tag
      type={interactive ? 'button' : undefined}
      className={`robot-curve-card ${kind}${interactive ? ' interactive' : ''}`}
      onClick={interactive ? onInspect : undefined}
    >
      <div className="robot-curve-head">
        <b>{data.label}</b>
        <span>{data.verdict}</span>
      </div>
      <div className="robot-curve-chart">
        <TorqueCurveChart activeCurve={data.key} variant="scope" scopeHeight={100} />
        {data.callouts?.map((c) => (
          <i key={c.id} className="robot-curve-pin" style={{ left: `${c.x}%`, top: `${c.y}%` }}>
            {c.title}
          </i>
        ))}
        {interactive && (
          <span className="robot-curve-cta">
            <Search size={16} /> Why is this a defect?
          </span>
        )}
      </div>
      <ul>
        {data.notes.map((n) => (
          <li key={n.t}><b>{n.t}</b><span>{n.d}</span></li>
        ))}
      </ul>
    </Tag>
  );
}

export default function RobotInspectionScreen({ onBack, onQuarantine }) {
  const a = ASSEMBLY_ALERT;
  const c = TORQUE_COMPARE;
  const metrics = useMemo(() => c.metrics, [c.metrics]);
  const [showDefect, setShowDefect] = useState(false);

  return (
    <div className="robot-inspection">
      <div className="robot-photo-bg" />
      <div className="robot-photo-vignette" />

      <button type="button" className="robot-back" onClick={onBack}>
        <ArrowLeft size={15} /> Factory overview
      </button>

      <div className="robot-status-strip">
        <span className="rs-priority"><AlertTriangle size={13} /> {a.priority} ACTIVE</span>
        <span>{a.eqTag}</span>
        <span>{a.sensorTag}</span>
        <span>Module <b>{a.module}</b></span>
        <span>Fastener <b>LOT-{a.lot}</b></span>
        <span>Inference <b>{a.detectMs} ms</b></span>
      </div>

      <div className="cctv-live-card">
        <div className="cctv-live-head">
          <span><Video size={14} /> CCTV-04 LIVE</span>
          <i>REC</i>
        </div>
        <div className="cctv-live-screen">
          <span className="cctv-time">10:06:30.247</span>
          <span className="cctv-cam">ASSY-02 / ROBOT CELL</span>
          <span className="cctv-reticle" />
          <span className="cctv-bolt-alert">THREAD ANGLE SUSPECT</span>
        </div>
        <div className="cctv-live-readouts">
          <span>Robot tool: TRQ-4471</span>
          <span>Frame: bolt seating moment</span>
          <span>Vision status: thread angle suspect</span>
        </div>
      </div>

      <aside className="robot-analysis-panel">
        <div className="robot-analysis-title">
          <span><ShieldAlert size={18} /></span>
          <div>
            <h3>Torque Curve Problem</h3>
            <p>Peak torque is identical, but the fastening process is abnormal. <b>Click the red curve to see why →</b></p>
          </div>
        </div>

        <div className="robot-curve-grid">
          <CurveCard kind="normal" data={c.normal} />
          <CurveCard kind="bad" data={c.crossThread} onInspect={() => setShowDefect(true)} />
        </div>

        <table className="robot-compare-table">
          <thead>
            <tr><th>Compare</th><th>Normal</th><th>Cross-thread suspect</th></tr>
          </thead>
          <tbody>
            {metrics.map((m) => (
              <MetricRow key={m.label} label={m.label} normal={m.normal} bad={m.bad} flag={m.sameButBad} />
            ))}
          </tbody>
        </table>

        <div className="robot-decision">
          <div>
            <b>Decision impact</b>
            <span>Quarantine locks every process consuming LOT-{a.lot}: warehouse stock, assembly WIP, HVDB EOL, and vehicle EOL.</span>
          </div>
          <button type="button" className="robot-pass-btn">
            Single part only
          </button>
          <button type="button" className="robot-quarantine-btn" onClick={onQuarantine}>
            <Lock size={15} /> Quarantine LOT-{a.lot}
          </button>
        </div>
      </aside>

      <AnimatePresence>
        {showDefect && <CrossThreadDetailModal onClose={() => setShowDefect(false)} />}
      </AnimatePresence>
    </div>
  );
}
