import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Lock, RotateCcw, Activity } from 'lucide-react';
import FactoryMap from './FactoryMap';
import ProcessAlertCard from './quality/ProcessAlertCard';
import AlertDetailModal from './quality/AlertDetailModal';
import QuarantinePropagation from './quality/QuarantinePropagation';
import { QUARANTINE_STAGES } from '../data/scenarios';
import './FactoryMap.css';
import './quality/QualityDemo.css';

const STAGE_STEP_MS = 1150;

function Clock() {
  const [t, setT] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const p = (n) => String(n).padStart(2, '0');
  return <span className="hmi-clock">{p(t.getHours())}:{p(t.getMinutes())}:{p(t.getSeconds())}</span>;
}

export default function Overview({ onNavigate }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [decision, setDecision] = useState(null); // null | 'continue' | 'quarantine'
  const [propIndex, setPropIndex] = useState(-1);
  const [propDone, setPropDone] = useState(false);

  useEffect(() => {
    if (decision !== 'quarantine') return undefined;
    const timers = [];
    QUARANTINE_STAGES.forEach((_, i) => {
      timers.push(setTimeout(() => setPropIndex(i), 300 + i * STAGE_STEP_MS));
    });
    timers.push(setTimeout(() => setPropDone(true), 300 + QUARANTINE_STAGES.length * STAGE_STEP_MS + 200));
    return () => timers.forEach(clearTimeout);
  }, [decision]);

  const openModal = () => setModalOpen(true);

  const handleQuarantine = () => {
    setModalOpen(false);
    setPropIndex(-1);
    setPropDone(false);
    setDecision('quarantine');
  };

  const handleContinue = () => {
    setModalOpen(false);
    setDecision('continue');
  };

  const resetDemo = () => {
    setModalOpen(false);
    setDecision(null);
    setPropIndex(-1);
    setPropDone(false);
  };

  const revealed = QUARANTINE_STAGES.filter((_, i) => i <= propIndex);
  const quarantinedZones = decision === 'quarantine' ? revealed.filter((s) => !s.clear).map((s) => s.zone) : [];
  const clearedZones = decision === 'quarantine' ? revealed.filter((s) => s.clear).map((s) => s.zone) : [];
  const heldNow = revealed.filter((s) => !s.clear).length;

  const readouts = decision === 'quarantine'
    ? [
        { label: 'STAGES ISOLATED', value: String(heldNow), tone: 'violet' },
        { label: 'LOT TRACE', value: 'LIVE', tone: 'cyan' },
        { label: 'TO CUSTOMERS', value: '0', tone: 'green' },
      ]
    : decision === 'continue'
      ? [
          { label: 'ALARM', value: 'OVERRIDDEN', tone: 'amber' },
          { label: 'LOTS ISOLATED', value: '0', tone: 'dim' },
          { label: 'RISK', value: 'ACCEPTED', tone: 'red' },
        ]
      : [
          { label: 'ACTIVE ALARMS', value: '1', tone: 'red' },
          { label: 'DETECT TIME', value: '87ms', tone: 'cyan' },
          { label: 'DECISION', value: 'PENDING', tone: 'amber' },
        ];

  const alarmsActive = decision === null || decision === 'continue';

  return (
    <motion.div className="hmi-console" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      {/* HMI status bar */}
      <div className="hmi-statusbar">
        <div className="hsb-left">
          <span className="hsb-crumb">PLANT&nbsp;1 <i>▸</i> LINE&nbsp;2 <i>▸</i> HVDB&nbsp;ASSY</span>
        </div>
        <div className="hmi-readouts">
          {readouts.map((r) => (
            <div key={r.label} className={`ro-tile ro-${r.tone}`}>
              <span className="ro-val">{r.value}</span>
              <span className="ro-label">{r.label}</span>
            </div>
          ))}
        </div>
        <div className="hsb-right">
          <span className={`hsb-alarm ${alarmsActive ? 'on' : ''}`}>
            <AlertTriangle size={12} /> ALM {alarmsActive ? '1' : '0'}
          </span>
          <span className="hsb-conn"><Activity size={12} /> LIVE</span>
          <span className="hsb-mode">AUTO</span>
          <Clock />
        </div>
      </div>

      {/* process mimic */}
      <FactoryMap
        onNavigate={onNavigate}
        onAlertClick={openModal}
        quarantined={quarantinedZones}
        cleared={clearedZones}
      />

      {/* bottom: single alarm → decision → isolation sequence */}
      {decision === null && <ProcessAlertCard onOpen={openModal} />}

      {decision === 'continue' && (
        <motion.div className="decision-banner continue" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <AlertTriangle size={18} />
          <span>
              <strong>OVERRIDE — Continue</strong> · LOT-A123 alarm ignored, line kept running. Quarantine interlock not triggered.
          </span>
          <button type="button" className="db-reopen" onClick={openModal}>RE-ANALYZE</button>
        </motion.div>
      )}

      {decision === 'quarantine' && (
        <>
          <motion.div className="decision-banner quarantine" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <Lock size={18} />
            <span>
              <strong>ISOLATE — Quarantine</strong> · Quarantine interlock auto-propagates to every stage using LOT-A123.
            </span>
            <button type="button" className="db-reopen" onClick={resetDemo}>
              <RotateCcw size={12} style={{ verticalAlign: '-2px', marginRight: 4 }} />
              RESET
            </button>
          </motion.div>
          <QuarantinePropagation activeIndex={propIndex} done={propDone} />
        </>
      )}

      {decision === null && (
        <p className="overview-hint">// Click the red ALARM zone (ASSY-02) or the alarm row below → compare normal vs abnormal torque curves → decide quarantine or pass</p>
      )}

      <AnimatePresence>
        {modalOpen && (
          <AlertDetailModal
            onQuarantine={handleQuarantine}
            onContinue={handleContinue}
            onClose={() => setModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
