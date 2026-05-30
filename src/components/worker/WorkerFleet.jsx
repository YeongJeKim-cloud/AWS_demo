import { Radio, Send } from 'lucide-react';

const VEHICLES = [
  { vin: '8842', owner: 'Owner A', status: 'alert', trend: '+32%' },
  { vin: '9103', owner: 'Owner B', status: 'alert', trend: '+28%' },
  { vin: '9201', owner: 'Owner C', status: 'alert', trend: '+31%' },
  { vin: '7755', owner: 'Owner D', status: 'ok', trend: '+2%' },
];

export default function WorkerFleet({ recallSent, onSendRecall }) {
  return (
    <div className="worker-dash">
      <div className="worker-dash-header">
        <div className="worker-station-title">
          <div className="worker-station-icon"><Radio size={22} /></div>
          <div>
            <h2>Fleet Quality Desk</h2>
            <p>On-road monitoring & owner outreach</p>
          </div>
        </div>
        <span className="worker-shift">Analyst: S. Park</span>
      </div>

      <div className="worker-body">
        <div className={`worker-status-banner ${recallSent ? 'hold' : 'running'}`}>
          {recallSent ? '📱 RECALL IN PROGRESS' : '● MONITORING FLEET'}
        </div>

        <div className="worker-grid-3">
          <div className="worker-card">
            <label>Affected lot</label>
            <div className="big-val" style={{ color: '#f87171' }}>B456</div>
          </div>
          <div className="worker-card">
            <label>Vehicles to notify</label>
            <div className="big-val">47</div>
            <div className="sub-val">Not fleet-wide (2,400)</div>
          </div>
          <div className="worker-card">
            <label>Impedance trend</label>
            <div className="big-val">+32%</div>
            <div className="sub-val">Over 4 weeks</div>
          </div>
        </div>

        <p className="section-label">Priority vehicles — Lot B456</p>
        {VEHICLES.map((v) => (
          <div key={v.vin} className={`worker-vehicle-row ${v.status === 'alert' ? 'alert-row' : ''}`}>
            <span><strong>VIN-{v.vin}</strong> · {v.owner}</span>
            <span className="badge badge-alert">{v.trend} impedance</span>
            <span className={`badge ${recallSent ? 'badge-ok' : 'badge-external'}`}>
              {recallSent ? 'Notified' : 'Pending'}
            </span>
          </div>
        ))}

        <div className="worker-actions">
          <button type="button" className="btn-worker-primary" onClick={onSendRecall} disabled={recallSent}>
            <Send size={18} style={{ verticalAlign: 'middle', marginRight: 6 }} />
            {recallSent ? 'Notifications sent' : 'Send inspection notices (47)'}
          </button>
          <button type="button" className="btn-worker-secondary">Export VIN list</button>
        </div>

        {recallSent && (
          <div className="worker-alert-box" style={{ background: 'rgba(255,153,0,0.1)', borderColor: 'rgba(255,153,0,0.35)' }}>
            <div>
              <strong style={{ color: '#15803d' }}>Targeted recall complete</strong>
              <p style={{ color: 'var(--text-muted)' }}>47 owners notified via app/SMS. Only Lot B456 vehicles — no blanket recall.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
