export const STATIONS = [
  { id: 'twin', label: '디지털 트윈', step: null },
  { id: 'dashboard', label: '관제센터', step: null },
  { id: 'overview', label: 'Plant map', step: null },
  { id: 'step1', label: 'Receiving', step: 1 },
  { id: 'step2', label: 'Assembly', step: 2 },
  { id: 'step3', label: 'HVDB test', step: 3 },
  { id: 'step4', label: 'Vehicle gate', step: 4 },
  { id: 'step5', label: 'Fleet desk', step: 5 },
  { id: 'errors', label: 'Trace issue', step: null },
];

/** @deprecated use STATIONS — kept for imports */
export const STEPS = STATIONS;
