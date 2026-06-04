import { useEffect, useState } from 'react';
import { Wifi } from 'lucide-react';
import SituationScreen from './SituationScreen';
import RobotInspectionScreen from './RobotInspectionScreen';
import LotIsolationScreen from './LotIsolationScreen';
import './FactoryTwin.css';

const FLOW = [
  { id: 'factory', label: '1 Factory Overview', title: 'Tevian Smart Factory', sub: '' },
  { id: 'inspection', label: '2 Robot Inspection', title: 'Robot Torque Inspection', sub: '' },
  { id: 'isolation', label: '3 Lot Isolation', title: 'Lot Isolation', sub: '' },
];

const TITLE_BY_ID = Object.fromEntries(FLOW.map((f) => [f.id, f]));

export default function FactoryTwin({ onNavigate }) {
  const [screen, setScreen] = useState('factory');
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const title = TITLE_BY_ID[screen] || TITLE_BY_ID.factory;
  const clock = now.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const enterInspection = () => setScreen('inspection');
  const enterIsolation = () => setScreen('isolation');
  const resetFlow = () => setScreen('factory');

  return (
    <div className={`twin tab-${screen}`}>
      {screen === 'factory' && <SituationScreen onNavigate={onNavigate} onEnterInspection={enterInspection} />}
      {screen === 'inspection' && (
        <RobotInspectionScreen onBack={resetFlow} onQuarantine={enterIsolation} />
      )}
      {screen === 'isolation' && (
        <LotIsolationScreen onBack={enterInspection} onReset={resetFlow} />
      )}

      <div className="twin-scanlines" />
      <div className="twin-vignette" />

      <div className="twin-titlebar">
        <span className="twin-corner left">TEVIAN SMART FACTORY · LOT TRACEABILITY</span>
        <div className="twin-title-frame">
          <i className="twin-frame-wing left" />
          <div className="twin-title">
            <h2>{title.title}</h2>
            {title.sub && <span className="twin-title-en">{title.sub}</span>}
            <i className="twin-title-underline" />
          </div>
          <i className="twin-frame-wing right" />
        </div>
        <span className="twin-corner right">
          <span className="twin-brand">Tevian Quality System</span>
          <span className="twin-live"><i /> LIVE</span>
          <span className="twin-conn"><Wifi size={12} strokeWidth={2.2} /> IoT 247</span>
          <span className="twin-clock">{clock}</span>
        </span>
      </div>

      <div className="twin-corner-mark tl" />
      <div className="twin-corner-mark tr" />
      <div className="twin-corner-mark bl" />
      <div className="twin-corner-mark br" />

      <div className="twin-tabs" aria-label="Digital twin demo flow">
        {FLOW.map((t) => (
          <button key={t.id} type="button" className={screen === t.id ? 'active' : ''} onClick={() => setScreen(t.id)}>
            <span>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
