import { CarFront } from 'lucide-react';

export default function WorkerVehicleEol({ imdFail, onSimulateFail }) {
  return (
    <div className="worker-dash">
      <div className="worker-dash-header">
        <div className="worker-station-title">
          <div className="worker-station-icon"><CarFront size={22} /></div>
          <div>
            <h2>Vehicle EOL Gate</h2>
            <p>Final check before shipment</p>
          </div>
        </div>
        <span className="worker-shift">Bay 7</span>
      </div>

      <div className="worker-body">
        <div className={`worker-status-banner ${imdFail ? 'stopped' : 'running'}`}>
          {imdFail ? '🛑 SHIPMENT HOLD' : '● READY FOR TEST'}
        </div>

        <div className="worker-grid-3">
          <div className="worker-card">
            <label>Current VIN</label>
            <div className="big-val">8842</div>
          </div>
          <div className="worker-card">
            <label>HVDB module</label>
            <div className="big-val">#12345</div>
          </div>
          <div className="worker-card">
            <label>Build window</label>
            <div className="big-val">09:14</div>
            <div className="sub-val">±30 min re-test if fail</div>
          </div>
        </div>

        <p className="section-label">Test checklist</p>
        <div className="worker-checklist">
          {[
            { name: 'HV bus voltage stability', reading: 'Pass', ok: true },
            { name: 'Contactor response', reading: '12 ms / 9 ms', ok: true },
            { name: 'IMD self-diagnosis', reading: imdFail ? 'FAIL' : 'Pass', ok: !imdFail },
          ].map((t) => (
            <div key={t.name} className={`worker-check-item ${!t.ok ? 'fail' : ''}`}>
              <strong>{t.name}</strong>
              <span className={`badge ${t.ok ? 'badge-ok' : 'badge-alert'}`}>{t.reading}</span>
            </div>
          ))}
        </div>

        {imdFail && (
          <div className="worker-alert-box">
            <div>
              <strong>Do not release vehicle</strong>
              <p>Insulation monitor not working — vehicle cannot detect HV faults on road. 18 nearby builds flagged for re-test.</p>
            </div>
          </div>
        )}

        <div className="worker-actions">
          {!imdFail ? (
            <>
              <button type="button" className="btn-worker-primary">Approve shipment</button>
              <button type="button" className="btn-worker-danger" onClick={onSimulateFail}>Simulate IMD fail (demo)</button>
            </>
          ) : (
            <>
              <button type="button" className="btn-worker-secondary">Hold & re-test batch</button>
              <button type="button" className="btn-worker-danger">Block release</button>
            </>
          )}
        </div>

        <p className="section-label" style={{ marginTop: '1.25rem' }}>Queue</p>
        <div className="worker-queue">
          <div className={`worker-queue-item ${imdFail ? 'active' : ''}`}>VIN-8842 · {imdFail ? 'HOLD' : 'Testing'}</div>
          <div className="worker-queue-item">VIN-8843 · Waiting</div>
          <div className="worker-queue-item">VIN-8844 · Waiting</div>
        </div>
      </div>
    </div>
  );
}
