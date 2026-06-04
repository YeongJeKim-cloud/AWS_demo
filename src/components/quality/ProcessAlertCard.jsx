import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import { ASSEMBLY_ALERT } from '../../data/scenarios';

/** HMI active-alarm list row. ACK silences blink; ANALYZE opens the fault faceplate. */
export default function ProcessAlertCard({ onOpen }) {
  const a = ASSEMBLY_ALERT;
  const [acked, setAcked] = useState(false);

  return (
    <div className="alarm-panel">
      <div className="alarm-panel-head">
        <span className="aph-title">
          <span className="aph-horn"><AlertTriangle size={14} /></span>
          ACTIVE ALARMS
        </span>
        <span className={`aph-count ${acked ? 'acked' : ''}`}>
          {acked ? '1 ACK' : '1 UNACK'}
        </span>
      </div>

      <motion.div
        className={`alarm-row ${acked ? 'acked' : ''}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={onOpen}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onOpen?.();
        }}
      >
        <span className={`al-pri ${a.priority.toLowerCase()}`}>{a.priority}</span>
        <span className="al-led" />
        <span className="al-ts">{a.ts}</span>
        <span className="al-tag">{a.eqTag}·{a.sensorTag}</span>
        <span className={`al-stateflag ${acked ? 'ack' : 'unack'}`}>{acked ? 'ACK' : 'UNACK'}</span>
        <span className="al-desc">{a.title}</span>
        <span className="al-actions">
          <button
            type="button"
            className="al-btn ack"
            onClick={(e) => {
              e.stopPropagation();
              setAcked(true);
            }}
            disabled={acked}
          >
            ACK
          </button>
          <button
            type="button"
            className="al-btn analyze"
            onClick={(e) => {
              e.stopPropagation();
              onOpen?.();
            }}
          >
            ANALYZE <ChevronRight size={13} />
          </button>
        </span>
      </motion.div>
    </div>
  );
}
