import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Warehouse, Wrench, Cpu, CarFront, Radio, Lock, ShieldCheck, Terminal,
} from 'lucide-react';
import { LOT_TRACE_SUMMARY, QUARANTINE_STAGES } from '../../data/scenarios';

const ICONS = { Warehouse, Wrench, Cpu, CarFront, Radio };
const ROLE_LABEL = { source: 'source', upstream: 'upstream', downstream: 'downstream' };
const LOG_VERB = { source: 'LINE-STOP', upstream: 'HOLD', downstream: 'ISOLATE' };

function logTs(i) {
  const total = 9102 + i * 1053;
  const s = Math.floor(total / 1000);
  const ms = total % 1000;
  return `13:42:${String(s).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
}

/** Rolls the numeric part of a label (e.g. "4,872 pcs") up from 0 once `run` is true. */
function CountUp({ value, run }) {
  const match = String(value).match(/^([\d,]+)(.*)$/);
  const target = match ? parseInt(match[1].replace(/,/g, ''), 10) : 0;
  const suffix = match ? match[2] : ` ${value}`;
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!run || target === 0) return undefined;
    let raf;
    const start = performance.now();
    const dur = 820;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target]);

  const display = (!run || target === 0) ? 0 : n;
  return <span>{display.toLocaleString()}{suffix}</span>;
}

/**
 * Interlock isolation sequence. `activeIndex` = how many stages have tripped
 * (-1 = none). A lockout signal travels stage-to-stage; each latches ISOLATED.
 */
export default function QuarantinePropagation({ activeIndex = -1, done = false }) {
  const total = QUARANTINE_STAGES.length;
  const processed = Math.min(activeIndex + 1, total);
  const revealed = QUARANTINE_STAGES.filter((_, i) => i <= activeIndex);
  const heldCount = revealed.filter((s) => !s.clear).length;
  const pct = Math.max(0, Math.min(100, (processed / total) * 100));

  return (
    <motion.div className="quarantine-panel" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div className="qp-head">
        <span className="qp-icon"><Lock size={18} /></span>
        <div>
          <h3>LOT ISOLATION SEQUENCE</h3>
          <p>Assembly detection → quarantine interlock propagates to every stage using Fastener LOT-A123</p>
        </div>
        <span className="qp-lot">LOT-A123</span>
      </div>

      <div className="lot-trace-strip">
        <div className="lts-head">
          <span>Neptune lot trace query</span>
          <b>LOT-A123 → all consuming processes</b>
        </div>
        <div className="lts-chain">
          {LOT_TRACE_SUMMARY.map((n, i) => {
            const active = i <= Math.max(activeIndex + 1, 0);
            const doneNode = done || i <= activeIndex + 1;
            return (
              <span
                key={n.id}
                className={[
                  'lts-node',
                  `tone-${n.tone}`,
                  active ? 'active' : '',
                  doneNode ? 'done' : '',
                ].filter(Boolean).join(' ')}
              >
                <b>{n.label}</b>
                <i>{n.value}</i>
              </span>
            );
          })}
        </div>
      </div>

      <div className="qp-progress">
        <div className="qp-progress-bar">
          <motion.span animate={{ width: `${pct}%` }} transition={{ ease: 'easeOut', duration: 0.5 }} />
        </div>
        <span className="qp-progress-text">INTERLOCK <b>{heldCount}</b>/{total - 1} TRIPPED · {processed}/{total} CHECKED</span>
      </div>

      <div className="qp-body">
        {QUARANTINE_STAGES.map((s, i) => {
          const Icon = ICONS[s.icon] || Wrench;
          const isRevealed = i <= activeIndex;
          const isActive = i === activeIndex && !done;
          const isLast = i === total - 1;
          return (
            <div
              key={s.id}
              className={[
                'qnode',
                isRevealed ? 'revealed' : '',
                isActive ? 'sealing' : '',
                s.clear ? 'clear' : '',
              ].filter(Boolean).join(' ')}
            >
              <div className="qnode-rail">
                <span className="qnode-dot">
                  <span className="qnode-lamp" />
                </span>
                {!isLast && (
                  <span className="qnode-conn">
                    <span className="qnode-conn-fill" />
                    <span className="qnode-signal" />
                  </span>
                )}
              </div>

              <div className="qnode-card">
                <div className="qnode-top">
                  <span className="qnode-icowrap"><Icon size={15} strokeWidth={2} /></span>
                  <span className="qnode-tag">{s.eqTag}</span>
                  <span className="qnode-stage">{s.stage}</span>
                  <span className={`qnode-role ${s.role}`}>{ROLE_LABEL[s.role] || s.role}</span>
                </div>
                <p className="qnode-item">{s.item}</p>
                <div className="qnode-action">
                  <span className="qnode-hazard" />
                  <span className="qnode-action-text">{s.action}</span>
                </div>
              </div>

              <div className="qnode-meta">
                <div className="qnode-count"><CountUp value={s.count} run={isRevealed} /></div>
                <span className="qnode-stamp">
                  {s.clear ? <><ShieldCheck size={12} /> CLEAR</> : <><Lock size={12} /> ISOLATED</>}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* event log */}
      <div className="qlog">
        <div className="qlog-head"><Terminal size={13} /> ISOLATION EVENT LOG · OPC-UA</div>
        <div className="qlog-body">
          {revealed.length === 0 && <div className="qlog-line empty">// awaiting interlock trips…</div>}
          {revealed.map((s, i) => (
            <motion.div
              key={s.id}
              className={`qlog-line ${s.clear ? 'clear' : ''}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="ql-ts">{logTs(i)}</span>
              <span className={`ql-verb ${s.clear ? 'verify' : s.role}`}>
                {s.clear ? 'VERIFY' : (LOG_VERB[s.role] || 'ISOLATE')}
              </span>
              <span className="ql-tag">{s.eqTag}</span>
              <span className="ql-lot">LOT-A123</span>
              <span className="ql-detail">{s.clear ? 'no field exposure · 0 units' : `${s.count} latched`}</span>
            </motion.div>
          ))}
          {done && (
            <motion.div className="qlog-line done" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <span className="ql-ts">{logTs(total)}</span>
              <span className="ql-verb done">SEQ-DONE</span>
              <span className="ql-tag">SYS</span>
              <span className="ql-detail">
                {heldCount} stages isolated · <b>0 vehicles</b> reached customers · contained both directions
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
