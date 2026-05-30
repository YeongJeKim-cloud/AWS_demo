import { PackageSearch, CheckCircle2, XCircle } from 'lucide-react';

export default function WorkerReceiving({ lotStatus, onPass, onHold, simulating }) {
  const samplesDone = simulating ? 32 : 28;
  const progress = (samplesDone / 32) * 100;

  return (
    <div className="worker-dash">
      <div className="worker-dash-header">
        <div className="worker-station-title">
          <div className="worker-station-icon"><PackageSearch size={22} /></div>
          <div>
            <h2>Receiving Station</h2>
            <p>Dock 3 · Inbound inspection</p>
          </div>
        </div>
        <span className="worker-shift">Shift A · {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>

      <div className="worker-body">
        <div className={`worker-status-banner ${lotStatus === 'hold' ? 'stopped' : 'running'}`}>
          {lotStatus === 'hold' ? '⛔ LOT ON HOLD' : lotStatus === 'pass' ? '✓ LOT RELEASED' : '● INSPECTING'}
        </div>

        <div className="worker-grid-3">
          <div className="worker-card">
            <label>Current lot</label>
            <div className="big-val">A123</div>
            <div className="sub-val">Fasteners · 5,000 pcs</div>
          </div>
          <div className="worker-card">
            <label>Supplier</label>
            <div className="big-val">Supplier A</div>
            <div className="sub-val">COA #8842 received</div>
          </div>
          <div className="worker-card">
            <label>Sample progress</label>
            <div className="big-val">{samplesDone} / 32</div>
            <div className="worker-progress">
              <div className="worker-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <p className="section-label">Sample tests</p>
        <div className="worker-checklist">
          {[
            { name: 'Tensile strength', val: lotStatus === 'hold' ? 'FAIL #17' : '32/32 OK', ok: lotStatus !== 'hold' },
            { name: 'XRF plating thickness', val: lotStatus === 'hold' ? '8.2 µm (min 12)' : 'All in spec', ok: lotStatus !== 'hold' },
            { name: 'Dimensions', val: 'All in spec', ok: true },
          ].map((t) => (
            <div key={t.name} className={`worker-check-item ${!t.ok ? 'fail' : ''}`}>
              <strong>{t.name}</strong>
              <span className={`badge ${t.ok ? 'badge-ok' : 'badge-alert'}`}>{t.val}</span>
            </div>
          ))}
        </div>

        <div className="worker-actions">
          <button type="button" className="btn-worker-primary" onClick={onPass} disabled={simulating}>
            <CheckCircle2 size={18} style={{ verticalAlign: 'middle', marginRight: 6 }} />
            Release to warehouse
          </button>
          <button type="button" className="btn-worker-danger" onClick={onHold} disabled={simulating}>
            <XCircle size={18} style={{ verticalAlign: 'middle', marginRight: 6 }} />
            Hold entire lot
          </button>
        </div>

        <p className="section-label" style={{ marginTop: '1.25rem' }}>Queue</p>
        <div className="worker-queue">
          <div className="worker-queue-item active">Lot A123 · Fasteners · Inspecting</div>
          <div className="worker-queue-item">Lot C789 · Relays · Waiting</div>
          <div className="worker-queue-item">Lot D012 · Fasteners · Waiting</div>
        </div>
      </div>
    </div>
  );
}
