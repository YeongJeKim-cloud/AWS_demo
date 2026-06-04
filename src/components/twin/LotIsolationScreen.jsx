import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Lock, RadioTower, RotateCcw, ShieldAlert } from 'lucide-react';
import { LOT_TRACE_SUMMARY, QUARANTINE_STAGES } from '../../data/scenarios';

const STEP_MS = 1150;

function zoneClass(stage) {
  if (stage.id === 'warehouse') return 'warehouse';
  if (stage.id === 'assembly' || stage.id === 'cell') return 'assembly';
  if (stage.id === 'hvdb') return 'eol';
  if (stage.id === 'vehicle') return 'vehicle';
  return 'fleet';
}

export default function LotIsolationScreen({ onBack, onReset }) {
  const [active, setActive] = useState(-1);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timers = [];
    QUARANTINE_STAGES.forEach((_, i) => {
      timers.push(setTimeout(() => setActive(i), 450 + i * STEP_MS));
    });
    timers.push(setTimeout(() => setDone(true), 450 + QUARANTINE_STAGES.length * STEP_MS + 300));
    return () => timers.forEach(clearTimeout);
  }, []);

  const revealed = useMemo(() => QUARANTINE_STAGES.filter((_, i) => i <= active), [active]);
  const held = revealed.filter((s) => !s.clear).length;

  return (
    <div className="lot-isolation-scene">
      <div className="lot-isolation-bg" />
      <div className="lot-isolation-grid" />

      <button type="button" className="iso-back" onClick={onBack}>
        <ArrowLeft size={15} /> Robot inspection
      </button>

      <div className="iso-command">
        <span className="iso-command-icon"><ShieldAlert size={20} /></span>
        <div>
          <h3>LOT-A123 Quarantine Interlock</h3>
          <p>Neptune traced every consuming process. Quarantine holds are propagating across every consuming zone.</p>
        </div>
        <div className="iso-command-counts">
          <span><b>{held}</b> zones held</span>
          <span><b>0</b> customer exposure</span>
        </div>
        <button type="button" onClick={onReset}><RotateCcw size={14} /> Reset</button>
      </div>

      <div className="iso-trace-chain">
        {LOT_TRACE_SUMMARY.map((n, i) => (
          <span
            key={n.id}
            className={[
              `tone-${n.tone}`,
              i <= Math.max(active + 1, 0) ? 'active' : '',
              done ? 'done' : '',
            ].filter(Boolean).join(' ')}
          >
            <b>{n.label}</b>
            <i>{n.value}</i>
          </span>
        ))}
      </div>

      <div className="factory-isolation-floor">
        {QUARANTINE_STAGES.map((s, i) => {
          const isOn = i <= active;
          return (
            <section
              key={s.id}
              className={[
                'iso-zone',
                zoneClass(s),
                isOn ? 'locked' : '',
                i === active && !done ? 'closing' : '',
              ].filter(Boolean).join(' ')}
            >
              <div className="iso-zone-head">
                <b>{s.eqTag}</b>
                <span>{s.stage}</span>
              </div>
              <span className="iso-status">{isOn ? 'Quarantined' : 'Running'}</span>
              <div className="iso-equipment" style={{ backgroundImage: `url(${s.img})` }}>
                <span className="iso-equipment-shade" />
                <span className="iso-scan" aria-hidden="true" />
                <span className="iso-seal" aria-hidden="true">
                  <Lock size={20} />
                  <i>Quarantine Hold</i>
                </span>
              </div>
              <p>{s.item}</p>
              <strong>{s.count}</strong>
            </section>
          );
        })}

        <div className="iso-signal-path">
          {QUARANTINE_STAGES.slice(0, -1).map((s, i) => (
            <i key={s.id} className={i < active ? 'active' : ''} />
          ))}
        </div>
      </div>

      <div className="iso-event-feed">
        <div className="iso-feed-head"><RadioTower size={14} /> live isolation feed</div>
        {revealed.map((s, i) => (
          <p key={s.id} className={s.clear ? 'clear' : ''}>
            <span>13:42:{String(9 + i).padStart(2, '0')}.{String(102 + i * 53).padStart(3, '0')}</span>
            <b>{s.id === 'assembly' ? 'LINE-STOP' : 'HOLD'}</b>
            <em>{s.eqTag}</em>
            <i>{s.action}</i>
          </p>
        ))}
        {done && (
          <p className="done">
            <span>13:42:15.881</span>
            <b>SEQ-DONE</b>
            <em>SYS</em>
            <i>All LOT-A123 exposure is contained before shipment.</i>
          </p>
        )}
      </div>
    </div>
  );
}
