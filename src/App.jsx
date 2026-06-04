import { useState } from 'react';
import FactoryTwin from './components/twin/FactoryTwin';
import ControlCenter from './components/dashboard/ControlCenter';
import Overview from './components/Overview';
import Step1Receiving from './components/Step1Receiving';
import Step2Assembly from './components/Step2Assembly';
import Step3HvdbEol from './components/Step3HvdbEol';
import Step4VehicleEol from './components/Step4VehicleEol';
import Step5Fleet from './components/Step5Fleet';
import ErrorTracking from './components/ErrorTracking';
import { StationBar } from './components/VisualKit';
import { STATIONS } from './data/stations';
import './App.css';

const VIEWS = {
  twin: FactoryTwin,
  dashboard: ControlCenter,
  overview: Overview,
  step1: Step1Receiving,
  step2: Step2Assembly,
  step3: Step3HvdbEol,
  step4: Step4VehicleEol,
  step5: Step5Fleet,
  errors: ErrorTracking,
};

const STEP_NUM = { step1: 1, step2: 2, step3: 3, step4: 4, step5: 5 };

export default function App() {
  const [active, setActive] = useState('twin');
  const View = VIEWS[active];
  const stepNum = STEP_NUM[active];

  const navigate = (id) => {
    setActive(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`app app-worker ${active === 'twin' ? 'app-twin-mode' : ''}`}>
      <header className="app-header">
        <div className="header-inner">
          <div className="logo-block">
            <div className="logo-mark">QC</div>
            <div className="logo-text">
              <h1>Plant Quality System</h1>
              <p>Lot tracking · line response · owner notifications</p>
            </div>
          </div>
          <nav className="stage-nav">
            {STATIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                className={[
                  active === s.id ? 'active' : '',
                  s.id === 'errors' ? 'nav-errors' : '',
                  s.id === 'dashboard' ? 'nav-dashboard' : '',
                  s.id === 'twin' ? 'nav-twin' : '',
                ].filter(Boolean).join(' ')}
                onClick={() => navigate(s.id)}
              >
                {s.label}
              </button>
            ))}
          </nav>
        </div>
      </header>
      <main className="app-main">
        {stepNum && <StationBar activeStep={stepNum} />}
        <View onNavigate={navigate} />
      </main>
      <footer className="app-footer">
        Demo mode — sample data only · not connected to live factory systems
      </footer>
    </div>
  );
}
