import { useState } from 'react';
import { RadialBar, RadialBarChart, ResponsiveContainer, Cell } from 'recharts';
import { AlertTriangle, ChevronRight, Server, WifiOff } from 'lucide-react';
import { TwinCanvas, DeviceScene as DeviceObjects, STATUS_LABEL } from './Scene';
import {
  TWIN_ABNORMAL,
  TWIN_CAP_RANK,
  TWIN_DEVICE_TABLE,
  TWIN_MACHINES,
  TWIN_PERCAP,
  TWIN_USAGE_RANK,
} from '../../data/twin';

function DonutGauge({ value, label, color }) {
  const c = 2 * Math.PI * 34;

  return (
    <div className="twin-gauge">
      <svg viewBox="0 0 90 90" aria-hidden="true">
        <circle cx="45" cy="45" r="34" fill="none" stroke="rgba(56, 99, 140, 0.45)" strokeWidth="7" />
        <circle
          cx="45"
          cy="45"
          r="34"
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={`${(value / 100) * c} ${c}`}
          transform="rotate(-90 45 45)"
        />
        <text x="45" y="42" textAnchor="middle" dominantBaseline="middle" fontSize="16" fontWeight="800" fill={color}>{value}%</text>
        <text x="45" y="56" textAnchor="middle" dominantBaseline="middle" fontSize="7" fontWeight="700" fill="#d7e8ff">{label}</text>
      </svg>
    </div>
  );
}

export default function DeviceScreen({ onNavigate }) {
  const [selId, setSelId] = useState('L0');

  return (
    <>
      <TwinCanvas camera={{ position: [8.6, 6.3, 11.8], fov: 34 }} target={[0.2, 0.6, 0]}>
        <DeviceObjects selectedId={selId} onSelect={(m) => setSelId(m.id)} />
      </TwinCanvas>

      <div className="twin-col twin-left device-left">
        <div className="twin-panel">
          <h4>Abnormal Device Monitoring <span>Alert Levels</span></h4>
          <div className="twin-abn">
            {TWIN_ABNORMAL.map((a) => (
              <div className={`twin-abn-cell t-${a.tone} ${a.value > 0 ? 'on' : ''}`} key={a.id}>
                <span className="twin-abn-ico">{a.id === 'off' ? <WifiOff size={15} /> : <AlertTriangle size={15} />}</span>
                <b>{a.value}</b>
                <span className="twin-abn-label">{a.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="twin-panel">
          <h4>Per Capita Production Capacity <span>Output Rate</span></h4>
          <div className="twin-gauges">
            {TWIN_PERCAP.map((g) => <DonutGauge key={g.label} value={g.value} label={g.label} color={g.tone} />)}
          </div>
        </div>

        <div className="twin-panel">
          <h4>Device Operating Status Details <span>Status Details</span></h4>
          <table className="twin-table">
            <thead>
              <tr><th>Device Name</th><th>Operation Status</th><th>Operating Time</th><th>Production Capacity</th></tr>
            </thead>
            <tbody>
              {TWIN_DEVICE_TABLE.map((d) => (
                <tr key={d.name}>
                  <td>{d.name}</td>
                  <td><span className={`twin-st st-${d.status}`}>{STATUS_LABEL[d.status]}</span></td>
                  <td>{d.time}</td>
                  <td>{d.cap.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="device-footnote">*Note: the scenario and data of this demo are both fictional and for visualization purposes only.</p>
        </div>
      </div>

      <div className="twin-col twin-right device-right">
        <div className="twin-panel">
          <h4>Device Production Capacity Ranking <span>Capacity Ranking</span></h4>
          <ResponsiveContainer width="100%" height={188}>
            <RadialBarChart data={TWIN_CAP_RANK} innerRadius="26%" outerRadius="94%" startAngle={90} endAngle={-270}>
              <RadialBar dataKey="value" background={{ fill: 'rgba(34, 74, 116, 0.45)' }} cornerRadius={5}>
                {TWIN_CAP_RANK.map((d) => <Cell key={d.name} fill={d.fill} />)}
              </RadialBar>
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="twin-caplegend">
            {TWIN_CAP_RANK.map((d) => (
              <span key={d.name}><i style={{ background: d.fill }} />{d.name}</span>
            ))}
          </div>
        </div>

        <div className="twin-panel">
          <h4>Device Usage Ranking <span>Usage Ranking</span></h4>
          <div className="twin-urankwrap">
            {TWIN_USAGE_RANK.map((u, i) => (
              <div className="twin-urank" key={u.name}>
                <span className="twin-urank-name"><Server size={12} />{u.name}<i>{u.delta}</i></span>
                <span className="twin-urank-bar"><span style={{ width: `${u.value}%` }} /></span>
                <b>{u.rank}</b>
                <em>{String(i + 1).padStart(2, '0')}</em>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="device-floor-label">
        {TWIN_MACHINES.find((m) => m.id === selId)?.label || 'Server A'}
      </div>

      <div className="device-alarm-entry">
        <span className="dae-icon"><AlertTriangle size={16} /></span>
        <div>
          <b>P1 TORQUE PROFILE FAULT</b>
          <span>ASSY-02 · Fastener LOT-A123 · curve out of envelope</span>
        </div>
        <button type="button" onClick={() => onNavigate?.('overview')}>
          Analyze torque fault <ChevronRight size={14} />
        </button>
      </div>
    </>
  );
}
