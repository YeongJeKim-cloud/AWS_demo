import { useState } from 'react';
import { motion } from 'framer-motion';
import { WorkerStation } from './worker/WorkerStation';
import WorkerReceiving from './worker/WorkerReceiving';
import './worker/WorkerDashboard.css';

export default function Step1Receiving({ onNavigate }) {
  const [simulating, setSimulating] = useState(false);
  const [lotStatus, setLotStatus] = useState(null);

  const runSim = (pass = true) => {
    setSimulating(true);
    setLotStatus(null);
    setTimeout(() => setLotStatus(pass ? 'pass' : 'hold'), 1200);
    setTimeout(() => setSimulating(false), 1500);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <WorkerStation onNavigate={onNavigate}>
        <WorkerReceiving
          lotStatus={lotStatus}
          simulating={simulating}
          onPass={() => runSim(true)}
          onHold={() => runSim(false)}
        />
      </WorkerStation>
    </motion.div>
  );
}
