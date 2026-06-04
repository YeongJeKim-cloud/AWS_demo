import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, X, Lightbulb, Lock, ArrowRight } from 'lucide-react';
import TorqueCurveChart from '../TorqueCurveChart';
import { ASSEMBLY_ALERT, TORQUE_COMPARE } from '../../data/scenarios';

function TorqueColumn({ tone, data, scopeTag }) {
  return (
    <div className={`torque-col ${tone}`}>
      <div className="tc-head">
        <span>{data.label}</span>
        <span className="tc-verdict">{data.verdict}</span>
      </div>
      <div className="tc-scopebar">
        <span>{scopeTag}</span>
        <span>CH1 · TORQUE [Nm]</span>
        <span>100 Hz</span>
      </div>
      <div className="tc-chart scope">
        <TorqueCurveChart activeCurve={data.key} variant="scope" />
        <div className="torque-callouts" aria-hidden="true">
          {data.callouts?.map((c, i) => (
            <span
              key={c.id}
              className={`torque-callout c${i + 1}`}
              style={{ left: `${c.x}%`, top: `${c.y}%` }}
            >
              <b>{c.title}</b>
              <i>{c.detail}</i>
            </span>
          ))}
        </div>
      </div>
      <ul className="torque-notes">
        {data.notes.map((n) => (
          <li key={n.t}>
            <span className="tn-dot" />
            <span><b>{n.t}</b> — {n.d}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Detail view for the assembly torque alert: why it's a defect + quarantine decision. */
export default function AlertDetailModal({ onQuarantine, onContinue, onClose }) {
  const a = ASSEMBLY_ALERT;
  const c = TORQUE_COMPARE;

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <motion.div
      className="modal-overlay"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      >
        <div className="modal-head">
          <span className="mh-icon"><AlertTriangle size={22} /></span>
          <div>
            <div className="mh-tags">
              <span className="mh-pri">{a.priority} ALARM</span>
              <span className="mh-tag">{a.eqTag}</span>
              <span className="mh-tag">{a.sensorTag}</span>
              <span className="mh-ts">{a.ts}</span>
            </div>
            <h3>{a.title}</h3>
            <p className="mh-meta">
              <span>{a.station}</span>·
              <span>Module <b>{a.module}</b></span>·
              <span>Parts <b>{a.lotType} Lot {a.lot}</b> + Relay Lot {a.partner}</span>·
              <span>inference <b>{a.detectMs} ms</b></span>
            </p>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="insight-line">
            <Lightbulb size={18} />
            <span>{c.insight}</span>
          </div>

          <div className="torque-compare-grid">
            <TorqueColumn tone="normal" data={c.normal} scopeTag="REF · GOLDEN" />
            <TorqueColumn tone="bad" data={c.crossThread} scopeTag={`${a.eqTag} · CAPTURED`} />
          </div>

          <table className="compare-table">
            <thead>
              <tr>
                <th>Compare</th>
                <th>Normal</th>
                <th>Cross-thread (suspect)</th>
              </tr>
            </thead>
            <tbody>
              {c.metrics.map((m) => (
                <tr key={m.label} className={m.sameButBad ? 'same-but-bad' : ''}>
                  <td className="metric-name">{m.label}</td>
                  <td className="col-normal">{m.normal}</td>
                  <td className="col-bad">
                    {m.bad}
                    {m.sameButBad && <span className="same-flag">same, but defective</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="catch-note">
            <h5>Defects you catch from the curve shape</h5>
            <ul>
              {c.catches.map((line) => <li key={line}>{line}</li>)}
            </ul>
          </div>

          <div className="operator-note">
            <span className="operator-note-kicker">DECISION IMPACT</span>
            <p>{c.operatorPrompt}</p>
          </div>
        </div>

        <div className="decision-bar">
          <span className="db-q">
            <span className="db-q-label">OPERATOR ACTION</span>
            Quality call — choose how to handle <b>LOT-{a.lot}</b>
          </span>
          <button type="button" className="btn-decision continue" onClick={onContinue}>
            Continue · OVERRIDE <ArrowRight size={15} />
          </button>
          <button type="button" className="btn-decision quarantine" onClick={onQuarantine}>
            <Lock size={15} /> Quarantine · ISOLATE LOT
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
