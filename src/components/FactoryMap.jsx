import { Fragment } from 'react';
import { motion } from 'framer-motion';
import {
  Truck, PackageSearch, Warehouse, Wrench, Cpu, CarFront, Radio, Lock,
} from 'lucide-react';
import { MIMIC_STATIONS } from '../data/scenarios';
import './FactoryMap.css';

const ICONS = { Truck, PackageSearch, Warehouse, Wrench, Cpu, CarFront, Radio };

/** Industrial line mimic (P&ID style). Same props as before — drives the demo. */
export default function FactoryMap({
  onNavigate,
  alertZone = 'step2',
  onAlertClick = null,
  quarantined = [],
  cleared = [],
}) {
  const heldSet = new Set(quarantined);
  const clearedSet = new Set(cleared);
  const alertIndex = MIMIC_STATIONS.findIndex((s) => s.id === alertZone);

  const clickable = (s) => Boolean(s.step) || s.id === alertZone;

  const handleClick = (s) => {
    if (s.id === alertZone && !heldSet.has(s.id) && onAlertClick) onAlertClick(s);
    else if (s.step) onNavigate?.(s.id);
  };

  const tileState = (s) => {
    if (heldSet.has(s.id)) return 'isolated';
    if (clearedSet.has(s.id)) return 'clear';
    if (s.id === alertZone) return 'alarm';
    return 'run';
  };

  const readout = (s, state) => {
    if (state === 'isolated') return 'LOCKED OUT';
    if (state === 'clear') return '0 AFFECTED';
    if (state === 'alarm') return 'TRQ FAULT';
    return s.readout;
  };

  const STATE_LABEL = { run: 'RUN', alarm: 'ALARM', isolated: 'ISOLATED', clear: 'CLEAR' };

  return (
    <div className="mimic">
      <div className="mimic-topbar">
        <span className="mimic-title">LINE 2 ▸ HVDB ASSEMBLY — PROCESS MIMIC</span>
        <span className="mimic-busbar">
          <span className="bus-tag">OPC-UA ▸ HISTORIAN</span>
          <span className="bus-track">
            {Array.from({ length: 9 }).map((_, k) => <i key={k} style={{ animationDelay: `${k * 0.18}s` }} />)}
          </span>
        </span>
      </div>

      <div className="mimic-line">
        {MIMIC_STATIONS.map((s, i) => {
          const Icon = ICONS[s.icon] || Wrench;
          const state = tileState(s);
          const isClickable = clickable(s);
          const isLast = i === MIMIC_STATIONS.length - 1;
          // flow segment after this tile
          let flow = 'idle';
          if (i < alertIndex) flow = 'live';
          else if (i === alertIndex) flow = 'halted';

          return (
            <Fragment key={s.id}>
              <motion.button
                type="button"
                className={`eq-tile state-${state} ${isClickable ? 'clickable' : ''}`}
                onClick={() => isClickable && handleClick(s)}
                whileHover={isClickable ? { y: -3 } : {}}
                whileTap={isClickable ? { scale: 0.98 } : {}}
              >
                <span className="eq-head">
                  <span className="eq-tag">{s.tag}</span>
                  <span className={`eq-led led-${state}`} />
                </span>
                <span className="eq-icon">
                  <Icon size={24} strokeWidth={1.7} />
                  {state === 'isolated' && <span className="eq-lock"><Lock size={13} /></span>}
                </span>
                <span className="eq-name">{s.name}</span>
                <span className="eq-readout">{readout(s, state)}</span>
                <span className={`eq-state st-${state}`}>{STATE_LABEL[state]}</span>
              </motion.button>

              {!isLast && (
                <span className={`flow-link flow-${flow}`}>
                  <i className="chev" /><i className="chev" /><i className="chev" />
                  {flow === 'halted' && <span className="flow-halt">HALT</span>}
                </span>
              )}
            </Fragment>
          );
        })}
      </div>

      <div className="mimic-legend">
        <span><i className="lg led-run" /> RUN</span>
        <span><i className="lg led-alarm" /> ALARM</span>
        <span><i className="lg led-isolated" /> ISOLATED</span>
        <span><i className="lg led-clear" /> CLEAR</span>
        <span className="lg-spacer" />
        <span className="lg-mode">MODE <b>AUTO</b></span>
      </div>
    </div>
  );
}
