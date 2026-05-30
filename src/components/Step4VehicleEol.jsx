import { useState } from 'react';
import { motion } from 'framer-motion';
import { WorkerStation } from './worker/WorkerStation';
import WorkerVehicleEol from './worker/WorkerVehicleEol';
import './worker/WorkerDashboard.css';

export default function Step4VehicleEol({ onNavigate }) {
  const [imdFail, setImdFail] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <WorkerStation onNavigate={onNavigate}>
        <WorkerVehicleEol imdFail={imdFail} onSimulateFail={() => setImdFail(true)} />
      </WorkerStation>
    </motion.div>
  );
}
