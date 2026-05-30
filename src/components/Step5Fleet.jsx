import { useState } from 'react';
import { motion } from 'framer-motion';
import { WorkerStation } from './worker/WorkerStation';
import WorkerFleet from './worker/WorkerFleet';
import './worker/WorkerDashboard.css';

export default function Step5Fleet({ onNavigate }) {
  const [recallSent, setRecallSent] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <WorkerStation onNavigate={onNavigate}>
        <WorkerFleet recallSent={recallSent} onSendRecall={() => setRecallSent(true)} />
      </WorkerStation>
    </motion.div>
  );
}
