import TorqueCurveChart from '../TorqueCurveChart';

export default function WorkerAssembly({
  lineStopped,
  torqueCurve,
  onSimulateDefect,
  onReset,
}) {
  return (
    <div className="worker-dash">
      <div className="worker-dash-header">
        <div className="worker-station-title">
          <div className="worker-station-icon" style={{ background: lineStopped ? 'rgba(248,113,113,0.15)' : undefined, color: lineStopped ? '#f87171' : undefined }}>
            <span className={`live-dot ${lineStopped ? 'off' : ''}`} style={{ width: 12, height: 12 }} />
          </div>
          <div>
            <h2>Assembly Line 2</h2>
            <p>HVDB module build · Station 4</p>
          </div>
        </div>
        <span className="worker-shift">Operator: J. Kim</span>
      </div>

      <div className="worker-body">
        <div className={`worker-status-banner ${lineStopped ? 'stopped' : 'running'}`}>
          {lineStopped ? '⛔ LINE STOPPED' : '● LINE RUNNING'}
        </div>

        <div className="worker-grid-3">
          <div className="worker-card">
            <label>Module</label>
            <div className="big-val">#12345</div>
            <div className="sub-val">HVDB serial</div>
          </div>
          <div className="worker-card">
            <label>Parts in build</label>
            <div className="big-val">A123 + B456</div>
            <div className="sub-val">Fastener + Relay lots</div>
          </div>
          <div className="worker-card">
            <label>Seating vision</label>
            <div className="big-val" style={{ color: lineStopped ? '#f87171' : 'var(--green)' }}>
              {lineStopped ? 'FAIL' : 'PASS'}
            </div>
            <div className="sub-val">Last check 2s ago</div>
          </div>
        </div>

        <p className="section-label">Live torque monitor</p>
        <TorqueCurveChart activeCurve={torqueCurve} />

        {lineStopped && (
          <div className="worker-alert-box">
            <div>
              <strong>Defect detected — do not proceed</strong>
              <p>Cross-thread pattern on fastener. Module quarantined. Call supervisor. Line will resume after clearance.</p>
            </div>
          </div>
        )}

        <div className="worker-actions">
          {!lineStopped ? (
            <button type="button" className="btn-worker-danger" onClick={onSimulateDefect}>
              Simulate defect (demo)
            </button>
          ) : (
            <button type="button" className="btn-worker-secondary" onClick={onReset}>
              Reset line (demo)
            </button>
          )}
          <button type="button" className="btn-worker-secondary" disabled={lineStopped}>
            Mark complete & next
          </button>
        </div>
      </div>
    </div>
  );
}
