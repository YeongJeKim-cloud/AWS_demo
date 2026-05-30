import { useState } from 'react';
import { motion } from 'framer-motion';
import { WorkerStation } from './worker/WorkerStation';
import WorkerHvdbEol from './worker/WorkerHvdbEol';
import './worker/WorkerDashboard.css';

export default function Step3HvdbEol({ onNavigate }) {
  const [showAlert, setShowAlert] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <WorkerStation onNavigate={onNavigate}>
        <WorkerHvdbEol showAlert={showAlert} onSimulateAlert={() => setShowAlert(true)} />
      </WorkerStation>
    </motion.div>
  );
}
