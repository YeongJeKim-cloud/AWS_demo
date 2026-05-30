import { useState } from 'react';
import { BackToMap } from '../VisualKit';
import './WorkerDashboard.css';

export function StepViewShell({
  onNavigate,
  workerContent,
  archContent,
  defaultView = 'worker',
}) {
  const [view, setView] = useState(defaultView);

  return (
    <div className="worker-shell">
      <div className="worker-toolbar">
        <BackToMap onNavigate={onNavigate} />
        <div className="view-toggle">
          <button
            type="button"
            className={view === 'worker' ? 'active' : ''}
            onClick={() => setView('worker')}
          >
            Worker screen
          </button>
          <button
            type="button"
            className={view === 'arch' ? 'arch-active' : ''}
            onClick={() => setView('arch')}
          >
            AWS architecture
          </button>
        </div>
      </div>
      {view === 'worker' ? workerContent : archContent}
    </div>
  );
}
