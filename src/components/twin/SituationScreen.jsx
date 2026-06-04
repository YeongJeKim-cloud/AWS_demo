import { AlertTriangle, Boxes, GitBranch, LockKeyhole, ShieldAlert, Wrench } from 'lucide-react';
import { ASSEMBLY_ALERT, QUARANTINE_STAGES, TORQUE_COMPARE } from '../../data/scenarios';

const OTHER_FACTORY_RANKING = [
  { plant: 'Tevian Gwangju Factory', rate: 100.0, rank: '01', tone: 'hot' },
  { plant: 'Tevian Ulsan Factory', rate: 98.4, rank: '02', tone: 'normal' },
  { plant: 'Tevian Asan Module Center', rate: 95.2, rank: '03', tone: 'normal' },
  { plant: 'Tevian Hwaseong Factory', rate: 91.0, rank: '04', tone: 'warn' },
  { plant: 'Tevian Changwon Factory', rate: 88.7, rank: '05', tone: 'normal' },
  { plant: 'Tevian Daegu EOL Center', rate: 86.5, rank: '06', tone: 'normal' },
];

export default function SituationScreen({ onEnterInspection }) {
  const a = ASSEMBLY_ALERT;
  const scope = QUARANTINE_STAGES.filter((s) => ['warehouse', 'assembly', 'hvdb', 'vehicle'].includes(s.id));

  return (
    <>
      <div className="factory-reference-scene" aria-label="Tevian smart factory digital twin">
        <button type="button" className="factory-hotspot factory-hotspot-alarm" onClick={onEnterInspection}>
          <span className="twin-tag alarm clickable">
            <i className="twin-tag-dot" />
            <span>ASSY-02</span>
            <em>Torque Alarm</em>
            <b>!</b>
          </span>
        </button>
        <span className="factory-hotspot-label point-two">
          <span className="twin-tag">
            <i className="twin-tag-dot" />
            <span>EOL-03</span>
            <em>HVDB Queue</em>
          </span>
        </span>
        <span className="factory-hotspot-label point-six">
          <span className="twin-tag">
            <i className="twin-tag-dot" />
            <span>WRH-STK</span>
            <em>LOT-A123 Stock</em>
          </span>
        </span>
        <span className="factory-hotspot-label point-rcv">
          <span className="twin-tag">
            <i className="twin-tag-dot" />
            <span>RCV-01</span>
            <em>Inbound AQL</em>
          </span>
        </span>
        <span className="factory-hotspot-label point-vhcl">
          <span className="twin-tag">
            <i className="twin-tag-dot" />
            <span>VHCL-04</span>
            <em>Vehicle EOL</em>
          </span>
        </span>
        <span className="factory-hotspot-label point-flt">
          <span className="twin-tag">
            <i className="twin-tag-dot" />
            <span>FLT-05</span>
            <em>Fleet Live</em>
          </span>
        </span>
      </div>

      <div className="twin-col twin-left situation-left demo-left">
        <div className="twin-panel demo-alert-panel">
          <div className="demo-panel-head danger">
            <span><AlertTriangle size={18} /></span>
            <div>
              <h4>Active Torque Alarm <span>{a.priority}</span></h4>
              <p>{a.title}</p>
            </div>
          </div>
          <div className="demo-kv-grid">
            <span><b>Station</b><i>{a.eqTag}</i></span>
            <span><b>Tool</b><i>{a.sensorTag}</i></span>
            <span><b>Module</b><i>{a.module}</i></span>
            <span><b>Fastener Lot</b><i>LOT-{a.lot}</i></span>
          </div>
          <div className="demo-torque-summary">
            <Wrench size={18} />
            <p>{a.summary}</p>
          </div>
        </div>

        <div className="twin-panel demo-curve-panel">
          <h4>Curve Decision <span>same 50 Nm</span></h4>
          <table className="twin-table demo-curve-table">
            <thead>
              <tr><th>Check</th><th>Normal</th><th>Suspect</th></tr>
            </thead>
            <tbody>
              {TORQUE_COMPARE.metrics.slice(0, 3).map((m) => (
                <tr key={m.label}>
                  <td>{m.label}</td>
                  <td>{m.normal}</td>
                  <td>{m.bad}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" className="demo-open-inspection" onClick={onEnterInspection}>
            <ShieldAlert size={15} /> Open robot inspection
          </button>
        </div>
      </div>

      <div className="twin-col twin-right situation-right demo-right">
        <div className="twin-panel demo-impact-panel">
          <div className="demo-panel-head">
            <span><GitBranch size={18} /></span>
            <div>
              <h4>LOT-A123 Impact Scope <span>quarantine ready</span></h4>
              <p>Same fastener lot is already mapped across warehouse, assembly, HVDB EOL, and vehicle EOL.</p>
            </div>
          </div>
          <div className="demo-scope-list">
            {scope.map((s) => (
              <span key={s.id}>
                <Boxes size={14} />
                <b>{s.eqTag}</b>
                <i>{s.stage}</i>
                <em>{s.count}</em>
              </span>
            ))}
          </div>
          <div className="demo-lock-note">
            <LockKeyhole size={16} />
            <p>Quarantine locks all downstream use of LOT-{a.lot} before shipment.</p>
          </div>
        </div>

        <div className="twin-panel demo-live-panel demo-ranking-panel">
          <h4>Cross-Plant Quality Ranking <span>live rolling</span></h4>
          <div className="demo-ranking-viewport">
            <div
              className="demo-ranking-track"
              style={{ '--rank-cycle': `${OTHER_FACTORY_RANKING.length * 38}px` }}
            >
              {[...OTHER_FACTORY_RANKING, ...OTHER_FACTORY_RANKING].map((f, idx) => (
                <div key={`${f.plant}-${idx}`} className={`demo-ranking-row ${f.tone}`}>
                  <i className="demo-ranking-dot" />
                  <span className="demo-ranking-main">
                    <b>{f.plant}</b>
                    <em>· {f.rate.toFixed(1)}%</em>
                    <span className="demo-ranking-bar"><i style={{ width: `${f.rate}%` }} /></span>
                  </span>
                  <strong>{f.rank}</strong>
                </div>
              ))}
            </div>
          </div>
          <div className="demo-live-ticker">
            <i /> cross-plant feed synced · updating sequence
          </div>
        </div>
      </div>
    </>
  );
}
