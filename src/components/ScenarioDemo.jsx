import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DEMO_SCENARIO, IMPEDANCE_TREND, FLOW_MAP } from '../data/scenarios';
import ArchitectureFlow from './ArchitectureFlow';
import TorqueCurveChart from './TorqueCurveChart';
import TraceGraph from './TraceGraph';
import './TraceGraph.css';

export default function ScenarioDemo() {
  const [selected, setSelected] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [logs, setLogs] = useState([]);
  const [activeNode, setActiveNode] = useState(null);
  const [alertNode, setAlertNode] = useState(null);
  const [torqueCurve, setTorqueCurve] = useState(null);
  const [showChart, setShowChart] = useState(false);
  const [showTrace, setShowTrace] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);
  const [sigma, setSigma] = useState(null);
  const timersRef = useRef([]);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const reset = useCallback(() => {
    clearTimers();
    setPlaying(false);
    setLogs([]);
    setActiveNode(null);
    setAlertNode(null);
    setTorqueCurve(null);
    setShowChart(false);
    setShowTrace(false);
    setAlertMsg(null);
    setSigma(null);
  }, []);

  const play = () => {
    reset();
    setPlaying(true);
    const scenario = DEMO_SCENARIO[selected];
    const addLog = (msg, type = 'active') => {
      setLogs((prev) => [...prev, { msg, type, ts: Date.now() }]);
    };

    scenario.events.forEach((ev) => {
      const t = setTimeout(() => {
        if (ev.type === 'log') addLog(ev.message);
        if (ev.type === 'flow') {
          setActiveNode(ev.node);
          if (ev.status === 'alert') setAlertNode(ev.node);
        }
        if (ev.type === 'torque') setTorqueCurve(ev.curve);
        if (ev.type === 'alert') setAlertMsg(ev.message);
        if (ev.type === 'stat') setSigma(ev.sigma);
        if (ev.type === 'trace') setShowTrace(true);
        if (ev.type === 'chart') setShowChart(true);
      }, ev.delay);
      timersRef.current.push(t);
    });

    const endT = setTimeout(() => setPlaying(false), 8500);
    timersRef.current.push(endT);
  };

  const playAll = async () => {
    for (let i = 0; i < DEMO_SCENARIO.length; i++) {
      setSelected(i);
      reset();
      await new Promise((r) => setTimeout(r, 100));
      play();
      await new Promise((r) => setTimeout(r, 9000));
    }
  };

  useEffect(() => () => clearTimers(), []);

  const scenario = DEMO_SCENARIO[selected];
  const flow = FLOW_MAP[scenario.stage] || FLOW_MAP.step2;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="grid-2">
        <div className="panel panel-glow-cyan">
          <span className="badge badge-aws">Live Demo</span>
          <h2 className="panel-title" style={{ marginTop: '0.65rem' }}>Client Presentation — 5-Step Walkthrough</h2>
          <p className="panel-sub">Play each step to show how AWS services respond in the manufacturing recall-prevention flow.</p>

          <div className="scenario-list">
            {DEMO_SCENARIO.map((s, i) => (
              <button
                key={s.id}
                type="button"
                className={`scenario-item ${selected === i ? 'selected' : ''}`}
                onClick={() => { setSelected(i); reset(); }}
              >
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <span className="num">{s.id}</span>
                  <span>{s.title}</span>
                </span>
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={play} disabled={playing}>
              {playing ? '▶ Playing…' : '▶ Play step'}
            </button>
            <button className="btn-ghost" onClick={playAll} disabled={playing}>Play all 5</button>
            <button className="btn-ghost" onClick={reset}>Reset</button>
          </div>
        </div>

        <div className="panel">
          <h3 style={{ fontSize: '0.95rem', margin: '0 0 0.75rem' }}>Event log</h3>
          <div className="log-panel">
            {logs.length === 0 && (
              <div className="log-line">Select a step and press Play…</div>
            )}
            <AnimatePresence>
              {logs.map((l, i) => (
                <motion.div
                  key={l.ts + i}
                  className={`log-line ${l.type}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  › {l.msg}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {alertMsg && <div className="alert-banner">{alertMsg}</div>}
          {sigma && (
            <div className="sigma-box">
              <span className="sigma-value">{sigma}σ</span>
              <div>
                <strong>Relay Lot B456 — contact resistance anomaly</strong>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  vs. baseline 1.5 ± 0.1 mΩ — systematic process deviation
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="panel" style={{ marginTop: '1.25rem' }}>
        <ArchitectureFlow flow={flow} activeNode={activeNode} alertNode={alertNode} />
      </div>

      <div className="grid-2" style={{ marginTop: '1.25rem' }}>
        {torqueCurve && (
          <div className="panel">
            <h3 className="panel-title" style={{ fontSize: '1rem' }}>Torque curve detection</h3>
            <TorqueCurveChart activeCurve={torqueCurve} />
          </div>
        )}
        {showChart && (
          <div className="panel">
            <h3 className="panel-title" style={{ fontSize: '1rem' }}>Fleet impedance trend</h3>
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={IMPEDANCE_TREND}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" />
                  <XAxis dataKey="week" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} domain={[95, 140]} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
                  <Line type="monotone" dataKey="lotB" name="Lot B456" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        {showTrace && (
          <div className="panel" style={{ gridColumn: torqueCurve && !showChart ? '1 / -1' : 'auto' }}>
            <h3 className="panel-title" style={{ fontSize: '1rem' }}>Neptune traceability</h3>
            <TraceGraph highlightLots={['B456']} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
