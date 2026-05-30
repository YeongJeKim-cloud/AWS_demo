import { useState } from 'react';
import { motion } from 'framer-motion';
import { WorkerStation } from './worker/WorkerStation';
import WorkerAssembly from './worker/WorkerAssembly';
import './worker/WorkerDashboard.css';

export default function Step2Assembly({ onNavigate }) {
  const [torqueCurve, setTorqueCurve] = useState('normal');
  const [lineStopped, setLineStopped] = useState(false);

  const triggerLineStop = () => {
    setTorqueCurve('crossThread');
    setLineStopped(true);
  };

  const reset = () => {
    setTorqueCurve('normal');
    setLineStopped(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <WorkerStation onNavigate={onNavigate}>
        <WorkerAssembly
          lineStopped={lineStopped}
          torqueCurve={torqueCurve}
          onSimulateDefect={triggerLineStop}
          onReset={reset}
        />
      </WorkerStation>
    </motion.div>
  );
}
