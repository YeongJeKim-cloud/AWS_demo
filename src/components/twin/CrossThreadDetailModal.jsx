import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, X, Activity } from 'lucide-react';
import TorqueCurveChart from '../TorqueCurveChart';
import { TORQUE_COMPARE } from '../../data/scenarios';

/**
 * Detail popup for the assembly torque alert: walks through HOW a cross-thread
 * fastening turns into a field failure, step by step on the captured curve.
 */
export default function CrossThreadDetailModal({ onClose }) {
  const bad = TORQUE_COMPARE.crossThread;
  const d = TORQUE_COMPARE.defect;

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return createPortal(
    <motion.div
      className="xt-overlay"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="xt-card"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 22, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 22, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        role="dialog"
        aria-modal="true"
        aria-label={d.title}
      >
        <div className="xt-head">
          <span className="xt-head-icon"><AlertTriangle size={20} /></span>
          <div className="xt-head-text">
            <h3>{d.title}</h3>
            <p>{d.subtitle}</p>
          </div>
          <span className="xt-head-verdict">{bad.verdict}</span>
          <button type="button" className="xt-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="xt-body">
          <div className="xt-scope">
            <div className="xt-scope-bar">
              <span><Activity size={12} /> CAPTURED · CH1 TORQUE [Nm]</span>
              <span>100 Hz</span>
            </div>
            <div className="xt-chart">
              <TorqueCurveChart activeCurve={bad.key} variant="scope" scopeHeight={210} />
              {bad.callouts?.map((c, i) => (
                <span
                  key={c.id}
                  className="xt-pin"
                  style={{ left: `${c.x}%`, top: `${c.y}%` }}
                >
                  <i>{i + 1}</i>
                  <b>{c.title}</b>
                </span>
              ))}
            </div>
            <p className="xt-mechanism">{d.mechanism}</p>
          </div>

          <ol className="xt-chain">
            {d.chain.map((s) => (
              <li key={s.n} className={`xt-step ${s.tone}`}>
                <span className="xt-step-num">{s.n}</span>
                <div className="xt-step-text">
                  <b>{s.phase}</b>
                  <span>{s.detail}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="xt-verdict">
          <span className="xt-verdict-kicker">KEY POINT</span>
          <p>{d.verdict}</p>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}
