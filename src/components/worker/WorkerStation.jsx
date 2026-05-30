import { BackToMap } from '../VisualKit';
import './WorkerDashboard.css';

/** Worker-only station layout — no technical / AWS view */
export function WorkerStation({ onNavigate, children }) {
  return (
    <div className="worker-shell">
      <BackToMap onNavigate={onNavigate} />
      {children}
    </div>
  );
}
