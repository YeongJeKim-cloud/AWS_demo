import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { MetricCard } from './VisualKit';
import FactoryMap from './FactoryMap';
import './FactoryMap.css';

export default function Overview({ onNavigate }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <div className="problem-banner overview-metrics">
        <MetricCard value="1 open" label="Active alert on plant map" accent="#f87171" icon={AlertTriangle} />
        <MetricCard value="<10s" label="Line stop when defect found" accent="#22d3ee" />
        <MetricCard value="47" label="Vehicles to notify (not whole fleet)" accent="#4ade80" />
      </div>

      <div className="panel panel-glow-orange overview-map-panel">
        <FactoryMap onNavigate={onNavigate} />
      </div>

      <p className="overview-hint">Tap a red or yellow zone to open that station&apos;s work screen.</p>
    </motion.div>
  );
}
