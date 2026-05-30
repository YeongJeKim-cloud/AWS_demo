import { Cpu, AlertTriangle } from 'lucide-react';

export default function WorkerHvdbEol({ showAlert, onSimulateAlert }) {
  return (
    <div className="worker-dash">
      <div className="worker-dash-header">
        <div className="worker-station-title">
          <div className="worker-station-icon"><Cpu size={22} /></div>
          <div>
            <h2>HVDB Test Bench</h2>
            <p>EOL station · Bay 2</p>
          </div>
        </div>
        <span className="worker-shift">Tech: M. Rivera</span>
      </div>

      <div className="worker-body">
        <div className={`worker-status-banner ${showAlert ? 'hold' : 'running'}`}>
          {showAlert ? '⚠ REVIEW REQUIRED' : '● TEST IN PROGRESS'}
        </div>

        <div className="worker-grid-3">
          <div className="worker-card">
            <label>Module under test</label>
            <div className="big-val">#12345</div>
          </div>
          <div className="worker-card">
            <label>Relay lot</label>
            <div className="big-val" style={{ color: showAlert ? '#f87171' : undefined }}>B456</div>
          </div>
          <div className="worker-card">
            <label>Contact resistance</label>
            <div className="big-val">2.1 mΩ</div>
            <div className="sub-val">Limit: 3.0 mΩ</div>
          </div>
        </div>

        <p className="section-label">Test checklist</p>
        <div className="worker-checklist">
          {[
            { name: 'Insulation resistance', reading: '850 MΩ', ok: true },
            { name: 'Hi-pot withstand', reading: 'Pass · 60s', ok: true },
            { name: 'Contactor ringing', reading: 'Consistent', ok: true },
            { name: 'Lot group check (B456)', reading: showAlert ? '5σ drift' : 'Within limits', ok: !showAlert },
          ].map((t) => (
            <div key={t.name} className={`worker-check-item ${!t.ok ? 'fail' : ''}`}>
              <strong>{t.name}</strong>
              <span className={`badge ${t.ok ? 'badge-ok' : 'badge-alert'}`}>{t.reading}</span>
            </div>
          ))}
        </div>

        {showAlert && (
          <div className="worker-alert-box">
            <AlertTriangle size={22} color="#f87171" />
            <div>
              <strong>Lot B456 — quality team notified</strong>
              <p>3 modules flagged. Hold warehouse stock. Stop assembly using Lot B456 relays until supervisor signs off.</p>
            </div>
          </div>
        )}

        <div className="worker-actions">
          {!showAlert ? (
            <>
              <button type="button" className="btn-worker-primary">Pass — send to warehouse</button>
              <button type="button" className="btn-worker-danger" onClick={onSimulateAlert}>Simulate lot alert (demo)</button>
            </>
          ) : (
            <>
              <button type="button" className="btn-worker-danger">Isolate lot B456</button>
              <button type="button" className="btn-worker-secondary">Escalate to quality</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
