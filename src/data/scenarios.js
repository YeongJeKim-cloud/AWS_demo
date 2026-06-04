export const STEPS = [
  { id: 'overview', label: 'Overview', step: null },
  { id: 'step1', label: 'Step 1 · Receiving', step: 1 },
  { id: 'step2', label: 'Step 2 · Assembly', step: 2 },
  { id: 'step3', label: 'Step 3 · HVDB EOL', step: 3 },
  { id: 'step4', label: 'Step 4 · Vehicle EOL', step: 4 },
  { id: 'step5', label: 'Step 5 · Fleet', step: 5 },
  { id: 'errors', label: 'Error Tracking', step: null },
  { id: 'demo', label: 'Live Demo', step: null },
];

export const GLOSSARY = [
  { term: 'Lot', desc: 'A batch of parts made under the same material, process, and time window (e.g. Fastener Lot A123 — 5,000 bolts)' },
  { term: 'EOL', desc: 'End-of-Line — final verification before shipment' },
  { term: 'Fleet Telemetry', desc: 'Diagnostic data streamed from vehicles on the road to the cloud' },
  { term: 'VIN', desc: 'Vehicle Identification Number — unique ID per vehicle' },
  { term: 'HVDB SN', desc: 'High-Voltage Distribution Box serial number' },
];

export const STEP1_FLOW = [
  { id: 'suppliers', label: 'Suppliers A/B/C', sub: 'Lot + COA/COC', type: 'external' },
  { id: 'directconnect', label: 'Direct Connect', sub: 'Dedicated link', type: 'aws', service: 'network' },
  { id: 'sitewise', label: 'IoT SiteWise', sub: 'Real-time capture', type: 'aws', service: 'iot' },
  { id: 'glue', label: 'AWS Glue', sub: 'Format standardization', type: 'aws', service: 'etl' },
  { id: 'rds', label: 'Amazon RDS', sub: 'Master ledger', type: 'aws', service: 'db' },
];

export const STEP2_FLOW = [
  { id: 'lines', label: 'Line 1/2/3', sub: 'Vision · Torque', type: 'external' },
  { id: 'greengrass', label: 'IoT Greengrass', sub: 'Edge routing', type: 'aws', service: 'edge' },
  { id: 'outposts', label: 'AWS Outposts', sub: 'On-prem server', type: 'aws', service: 'edge' },
  { id: 'neo', label: 'SageMaker Neo', sub: 'ms inference', type: 'aws', service: 'ml' },
  { id: 'lambda', label: 'Lambda → SNS', sub: 'Hot Path', type: 'aws', service: 'compute' },
  { id: 'neptune', label: 'Neptune', sub: 'Lot ↔ HVDB SN', type: 'aws', service: 'graph' },
  { id: 's3', label: 'S3', sub: 'Raw images', type: 'aws', service: 'storage' },
];

export const STEP3_FLOW = [
  { id: 'hvdbline', label: 'HVDB EOL Line', sub: 'IR · Hi-pot · Ringing', type: 'external' },
  { id: 'greengrass3', label: 'Greengrass', sub: 'Test orchestration', type: 'aws', service: 'edge' },
  { id: 'lambda3', label: 'Lambda', sub: 'Cutoff + 3σ check', type: 'aws', service: 'compute' },
  { id: 'rds3', label: 'RDS', sub: 'Test records', type: 'aws', service: 'db' },
  { id: 'sns3', label: 'SNS', sub: 'Lot isolation alert', type: 'aws', service: 'notify' },
  { id: 'neptune3', label: 'Neptune', sub: 'Lot group trace', type: 'aws', service: 'graph' },
  { id: 's33', label: 'S3', sub: 'Waveform archive', type: 'aws', service: 'storage' },
];

export const STEP4_FLOW = [
  { id: 'vehicleline', label: 'Vehicle EOL', sub: 'HV bus · Contactor · IMD', type: 'external' },
  { id: 'sitewise4', label: 'IoT SiteWise', sub: 'Test bench data', type: 'aws', service: 'iot' },
  { id: 'lambda4', label: 'Lambda', sub: 'Hold / re-test trigger', type: 'aws', service: 'compute' },
  { id: 'rds4', label: 'RDS', sub: 'VIN ↔ HVDB link', type: 'aws', service: 'db' },
  { id: 'neptune4', label: 'Neptune', sub: '±30 min window', type: 'aws', service: 'graph' },
  { id: 'sns4', label: 'SNS', sub: 'Hold shipment', type: 'aws', service: 'notify' },
];

export const STEP5_FLOW = [
  { id: 'cars', label: 'Fleet Vehicles', sub: 'MQTT telemetry', type: 'external' },
  { id: 'iotcore', label: 'IoT Core', sub: 'MQTT ingest', type: 'aws', service: 'iot' },
  { id: 'kinesis', label: 'Kinesis', sub: 'Real-time stream', type: 'aws', service: 'stream' },
  { id: 'sagemaker', label: 'SageMaker', sub: '4-week trend', type: 'aws', service: 'ml' },
  { id: 'bedrock', label: 'Bedrock', sub: 'Symptom clustering', type: 'aws', service: 'ml' },
  { id: 'lambda5', label: 'Lambda', sub: 'Lot → VIN map', type: 'aws', service: 'compute' },
  { id: 'rds5', label: 'RDS', sub: 'Owner contacts', type: 'aws', service: 'db' },
  { id: 'sns5', label: 'SNS', sub: 'Targeted recall', type: 'aws', service: 'notify' },
  { id: 'quicksight', label: 'QuickSight', sub: 'Fleet dashboard', type: 'aws', service: 'viz' },
];

export const FLOW_MAP = {
  step1: STEP1_FLOW,
  step2: STEP2_FLOW,
  step3: STEP3_FLOW,
  step4: STEP4_FLOW,
  step5: STEP5_FLOW,
};

export const TORQUE_CURVES = {
  normal: {
    label: 'Normal fastening',
    color: '#22c55e',
    points: [0, 2, 5, 12, 22, 35, 45, 50, 50, 50, 50],
    desc: 'Stable rise → seating contact → target 50 Nm held',
  },
  crossThread: {
    label: 'Cross-thread suspect',
    color: '#ef4444',
    points: [0, 8, 28, 48, 50, 50, 49, 48, 47, 46, 45],
    desc: 'Sharp rise over short rotation — jammed threads, short plateau',
  },
  overStretch: {
    label: 'Over-stretch suspect',
    color: '#f59e0b',
    points: [0, 3, 10, 25, 42, 52, 48, 42, 38, 35, 32],
    desc: 'Drop after peak — past yield point, clamping force lost',
  },
};

export const DEMO_SCENARIO = [
  {
    id: 1,
    title: 'Step 1 — Lot A123 inbound sampling',
    stage: 'step1',
    events: [
      { delay: 0, type: 'log', message: 'Supplier A: Fastener Lot A123 (5,000 pcs) + COA received' },
      { delay: 1200, type: 'flow', node: 'suppliers' },
      { delay: 1800, type: 'log', message: 'Direct Connect — dedicated line into AWS Cloud' },
      { delay: 2400, type: 'flow', node: 'directconnect' },
      { delay: 3000, type: 'log', message: 'IoT SiteWise — AQL 32-sample tensile, XRF, dimension auto-capture' },
      { delay: 3600, type: 'flow', node: 'sitewise' },
      { delay: 4200, type: 'log', message: 'AWS Glue — Excel/PDF → standard Lot ID format' },
      { delay: 4800, type: 'flow', node: 'glue' },
      { delay: 5400, type: 'log', message: 'Amazon RDS — Lot A123 PASS → warehouse release' },
      { delay: 6000, type: 'flow', node: 'rds', status: 'success' },
    ],
  },
  {
    id: 2,
    title: 'Step 2 — Torque anomaly → Line Stop',
    stage: 'step2',
    events: [
      { delay: 0, type: 'log', message: 'HVDB SN #12345 assembly — Fastener Lot A123 + Relay Lot B456' },
      { delay: 1000, type: 'log', message: 'Neptune — Lot ↔ HVDB SN relationship recorded in real time' },
      { delay: 2000, type: 'torque', curve: 'crossThread' },
      { delay: 3500, type: 'log', message: 'SageMaker Neo (Outposts) — Cross-thread pattern detected (87 ms)' },
      { delay: 4500, type: 'flow', node: 'neo', status: 'alert' },
      { delay: 5200, type: 'log', message: 'Lambda → SNS — Line Stop command (< 10 s)' },
      { delay: 5800, type: 'flow', node: 'lambda', status: 'alert' },
      { delay: 6400, type: 'alert', message: '⛔ Conveyor stopped — defective module quarantined' },
    ],
  },
  {
    id: 3,
    title: 'Step 3 — HVDB EOL Lot B456 5σ alert',
    stage: 'step3',
    events: [
      { delay: 0, type: 'log', message: 'HVDB EOL — IR, Hi-pot, 1000-cycle ringing complete' },
      { delay: 1500, type: 'log', message: 'Module #12345 — contact resistance 2.1 mΩ ✓ (cutoff ≤ 3.0)' },
      { delay: 2800, type: 'log', message: 'Relay Lot B456 group avg 2.0 mΩ — 5σ above baseline 1.5 ± 0.1' },
      { delay: 4000, type: 'stat', sigma: 5, lot: 'B456' },
      { delay: 5000, type: 'log', message: 'Alert → quality review → HVDB units with Lot B456 isolated' },
      { delay: 6000, type: 'trace', lots: ['B456'] },
    ],
  },
  {
    id: 4,
    title: 'Step 4 — Vehicle EOL IMD hold',
    stage: 'step4',
    events: [
      { delay: 0, type: 'log', message: 'Vehicle EOL — HV bus voltage stability test running' },
      { delay: 1200, type: 'flow', node: 'vehicleline' },
      { delay: 2000, type: 'log', message: 'Contactor response — close 12 ms, open 9 ms ✓' },
      { delay: 3200, type: 'log', message: 'IMD self-diagnosis FAIL on VIN-8842 — monitor not functional' },
      { delay: 4400, type: 'flow', node: 'lambda4', status: 'alert' },
      { delay: 5200, type: 'log', message: 'Neptune — ±30 min assembly window: 18 vehicles flagged for re-test' },
      { delay: 6200, type: 'alert', message: '🛑 Shipment hold — same shift / same lot parts suspected' },
    ],
  },
  {
    id: 5,
    title: 'Step 5 — Fleet targeted recall',
    stage: 'step5',
    events: [
      { delay: 0, type: 'log', message: '2,400 vehicles streaming HV bus impedance via MQTT' },
      { delay: 1200, type: 'flow', node: 'iotcore' },
      { delay: 2000, type: 'flow', node: 'kinesis' },
      { delay: 2800, type: 'log', message: 'SageMaker — 47 Lot B456 vehicles: +32% impedance rise over 4 weeks' },
      { delay: 3600, type: 'log', message: 'Bedrock — service notes clustered: "HV warning light", "sudden shutdown"' },
      { delay: 4400, type: 'chart', trend: 'impedance' },
      { delay: 5200, type: 'log', message: 'Lambda → RDS — Lot B456 → 47 VINs → owner contacts mapped' },
      { delay: 6200, type: 'flow', node: 'sns5' },
      { delay: 7000, type: 'alert', message: '📱 Targeted recall — 47 vehicles only (not fleet-wide)' },
    ],
  },
];

// ── Single-alert quality demo (Assembly torque anomaly → lot quarantine) ──

/** The one active plant alarm: cross-thread torque curve at assembly. */
export const ASSEMBLY_ALERT = {
  id: 'torque-crossthread',
  zone: 'step2',
  eqTag: 'ASSY-02',
  sensorTag: 'TRQ-4471',
  priority: 'P1',
  ts: '13:42:07.881',
  station: 'Assembly Line 2 · Station 4',
  module: 'HVDB SN #12345',
  lot: 'A123',
  lotType: 'Fastener',
  partner: 'B456',
  title: 'TORQUE PROFILE FAULT — CROSS-THREAD SUSPECTED',
  summary: 'Peak torque reached 50 Nm but the curve shape is out of envelope — fastener seated loose.',
  detectMs: 87,
  time: 'just now',
};

/** Normal vs abnormal torque curve — side-by-side teaching content for the modal. */
export const TORQUE_COMPARE = {
  insight:
    'Even when the peak torque is the same 50 Nm, the fastening is defective if the path to that 50 Nm is different. Some defects only show up in the shape of the curve.',
  normal: {
    key: 'normal',
    label: 'Normal fastening',
    labelEn: 'Normal fastening',
    verdict: 'PASS',
    notes: [
      { t: 'Steady rise', d: 'Torque climbs gently, step by step, with rotation angle' },
      { t: 'Snug point', d: 'Bearing face seats normally against the joint' },
      { t: 'Peak held', d: 'Holds a stable plateau after reaching the 50 Nm target' },
    ],
    callouts: [
      { id: 'n1', title: 'Normal rise', detail: 'Friction increases steadily', x: 25, y: 47 },
      { id: 'n2', title: 'Snug point', detail: 'Face makes contact, preload starts to build', x: 52, y: 34 },
      { id: 'n3', title: 'Normal plateau', detail: 'Holds near 50 Nm long enough', x: 73, y: 20 },
    ],
  },
  crossThread: {
    key: 'crossThread',
    label: 'Cross-thread suspect',
    labelEn: 'Cross-thread suspect',
    verdict: 'DEFECT',
    notes: [
      { t: 'Peak reached too early', d: 'Threads cross at an angle, so torque spikes for little rotation' },
      { t: 'Short plateau', d: 'The brief hold means the joint is actually seated loose' },
      { t: 'Same peak, still a defect', d: '50 Nm matches, but the abnormal path means lost preload' },
    ],
    callouts: [
      { id: 'b1', title: 'Abnormal spike', detail: 'Torque jumps too fast for the rotation', x: 31, y: 33 },
      { id: 'b2', title: 'Early peak', detail: 'Path to target torque is outside the normal envelope', x: 50, y: 15 },
      { id: 'b3', title: 'Short hold', detail: 'Same 50 Nm, but the clamp force is too low', x: 74, y: 29 },
    ],
  },
  metrics: [
    { label: 'Peak torque', normal: '50 Nm', bad: '50 Nm', sameButBad: true },
    { label: 'Plateau length', normal: 'Long · stable', bad: 'Short · loose' },
    { label: 'Rise slope', normal: 'Gentle · stepped', bad: 'Steep · early peak' },
    { label: 'Verdict', normal: 'PASS', bad: 'Cross-thread suspect' },
  ],
  catches: [
    'Cross-thread — peak is right but the plateau is short, so the joint is loose',
    'Over-stretch — past the yield point, the fastener deforms and loses preload',
    'Paint or oil on the bearing face — the early curve looks off',
  ],
  operatorPrompt:
    'Right here the operator decides whether to treat this as a single bad part or a lot-level risk and quarantine it. Choosing quarantine automatically locks every process using LOT-A123 — warehouse stock, in-progress modules, the EOL queue, and vehicles waiting to ship.',
};

/**
 * When Lot A123 is quarantined, the same lot is held across every stage.
 * Ordered along the production flow: warehouse → assembly line → assembly cell → HVDB EOL → vehicle EOL.
 */
export const QUARANTINE_STAGES = [
  {
    id: 'warehouse',
    zone: 'warehouse',
    eqTag: 'WRH-STK',
    icon: 'Warehouse',
    stage: 'Warehouse',
    img: '/zone-warehouse.jpg',
    item: 'Remaining Fastener Lot A123 stock',
    count: '4,872 pcs',
    unit: 'pcs',
    action: 'HOLD — release to assembly blocked',
    role: 'upstream',
  },
  {
    id: 'assembly',
    zone: 'step2',
    eqTag: 'ASSY-02',
    icon: 'Wrench',
    stage: 'Assembly Line 2',
    img: '/zone-assembly.jpg',
    item: 'HVDB #12345 on station + in-progress builds',
    count: '6 modules',
    unit: 'modules',
    action: 'LINE STOP — conveyor halted, module quarantined',
    role: 'source',
  },
  {
    id: 'cell',
    zone: 'step2',
    eqTag: 'CELL-02',
    icon: 'Cpu',
    stage: 'Assembly Cell',
    img: '/zone-cell.jpg',
    item: 'Robot cell builds using Lot A123',
    count: '8 modules',
    unit: 'modules',
    action: 'CELL LOCKOUT — robot cell stopped and isolated',
    role: 'source',
  },
  {
    id: 'hvdb',
    zone: 'step3',
    eqTag: 'EOL-03',
    icon: 'Cpu',
    stage: 'HVDB EOL',
    img: '/zone-hvdb.jpg',
    item: 'Built modules containing Lot A123',
    count: '14 modules',
    unit: 'modules',
    action: 'QUARANTINE — pulled from test queue',
    role: 'downstream',
  },
  {
    id: 'vehicle',
    zone: 'step4',
    eqTag: 'VHCL-04',
    icon: 'CarFront',
    stage: 'Vehicle EOL',
    img: '/zone-vehicle.jpg',
    item: 'Pre-ship vehicles with a Lot A123 module',
    count: '3 vehicles',
    unit: 'vehicles',
    action: 'SHIPMENT HOLD — blocked at gate',
    role: 'downstream',
  },
];

export const LOT_TRACE_SUMMARY = [
  { id: 'root', label: 'Fastener LOT-A123', value: 'trigger lot', tone: 'red' },
  { id: 'stock', label: 'Warehouse stock', value: '4,872 pcs', tone: 'violet' },
  { id: 'assy', label: 'Assembly WIP', value: '6 modules', tone: 'violet' },
  { id: 'eol', label: 'HVDB EOL queue', value: '14 modules', tone: 'violet' },
  { id: 'vehicle', label: 'Vehicle EOL', value: '3 vehicles', tone: 'violet' },
  { id: 'field', label: 'Field exposure', value: '0 vehicles', tone: 'green' },
];

/** P&ID-style line mimic stations (left→right material flow). */
export const MIMIC_STATIONS = [
  { id: 'supplier', tag: 'SUP-00', name: 'Suppliers', icon: 'Truck', readout: 'COA OK', kind: 'src' },
  { id: 'step1', tag: 'RCV-01', name: 'Receiving', icon: 'PackageSearch', readout: 'AQL 32/32', step: 1 },
  { id: 'warehouse', tag: 'WRH-STK', name: 'Warehouse', icon: 'Warehouse', readout: 'LOT A123', kind: 'store' },
  { id: 'step2', tag: 'ASSY-02', name: 'Assembly', icon: 'Wrench', readout: 'TRQ FAULT', step: 2, alert: true },
  { id: 'step3', tag: 'EOL-03', name: 'HVDB EOL', icon: 'Cpu', readout: '1.5 mΩ', step: 3 },
  { id: 'step4', tag: 'VHCL-04', name: 'Vehicle EOL', icon: 'CarFront', readout: 'IMD OK', step: 4 },
  { id: 'step5', tag: 'FLT-05', name: 'Fleet', icon: 'Radio', readout: '2,400 ▸', step: 5 },
];

export const TRACE_GRAPH = {
  nodes: [
    { id: 'lot-a', label: 'Lot A123', type: 'fastener', status: 'ok' },
    { id: 'lot-b', label: 'Lot B456', type: 'relay', status: 'alert' },
    { id: 'hvdb-1', label: 'HVDB #12345', type: 'module', status: 'hold' },
    { id: 'hvdb-2', label: 'HVDB #12340', type: 'module', status: 'hold' },
    { id: 'vin-1', label: 'VIN-8842', type: 'vehicle', status: 'monitor' },
    { id: 'vin-2', label: 'VIN-9103', type: 'vehicle', status: 'monitor' },
    { id: 'owner-1', label: 'Owner A', type: 'owner', status: 'notify' },
    { id: 'owner-2', label: 'Owner B', type: 'owner', status: 'notify' },
  ],
  edges: [
    ['lot-a', 'hvdb-1'],
    ['lot-b', 'hvdb-1'],
    ['lot-b', 'hvdb-2'],
    ['hvdb-1', 'vin-1'],
    ['hvdb-2', 'vin-2'],
    ['vin-1', 'owner-1'],
    ['vin-2', 'owner-2'],
  ],
};

export const IMPEDANCE_TREND = [
  { week: 'W1', normal: 100, lotB: 100 },
  { week: 'W2', normal: 101, lotB: 108 },
  { week: 'W3', normal: 100, lotB: 118 },
  { week: 'W4', normal: 102, lotB: 132 },
];

export const SERVICE_SYMPTOMS = [
  { raw: 'Sudden shutdown while driving', cluster: 'Drive power loss' },
  { raw: 'Engine cut off on highway', cluster: 'Drive power loss' },
  { raw: 'HV warning light on', cluster: 'HV system fault' },
  { raw: 'High voltage fault displayed', cluster: 'HV system fault' },
  { raw: 'Charging won\'t complete', cluster: 'Charging failure' },
];

export const ERROR_SCENARIOS = [
  {
    id: 'inbound-hold',
    step: 1,
    severity: 'hold',
    title: 'Inbound — XRF sample fail',
    error: 'Sample #17 XRF plating thickness below spec (8.2 µm vs 12 µm min)',
    detection: 'IoT SiteWise → AWS Glue → RDS lot status = HOLD',
    query: 'Which lots are blocked from warehouse?',
    highlightLots: ['A123'],
    highlightNodes: ['lot-a'],
    highlightPath: [],
    traceSteps: [
      { label: 'Error detected', detail: 'AQL sample 17/32 fails XRF — destructive tensile not yet run', time: 'T+0 s' },
      { label: 'RDS updated', detail: 'Lot A123 status → HOLD. 5,000 fasteners quarantined at dock.', time: 'T+2 s' },
      { label: 'Trace scope', detail: 'No HVDB/VIN impact yet — caught at factory gate before assembly', time: 'T+2 s' },
      { label: 'Action', detail: 'Supplier A notified · remaining 4,999 units blocked · no line exposure', time: 'T+5 s' },
    ],
    impact: [
      { stage: 'Warehouse', count: '5,000 pcs', action: 'Full lot hold — zero released to assembly' },
      { stage: 'Assembly', count: '0', action: 'No modules affected' },
      { stage: 'Vehicles', count: '0', action: 'No VIN exposure' },
    ],
    awsServices: ['SiteWise', 'Glue', 'RDS', 'SNS'],
    lookupBefore: 'Manual COA review — hours to days',
    lookupAfter: 'Instant — RDS lot status + supplier link',
  },
  {
    id: 'torque-stop',
    step: 2,
    severity: 'critical',
    title: 'Assembly — Cross-thread detected',
    error: 'Torque curve anomaly on HVDB SN #12345 — cross-thread pattern (87 ms inference)',
    detection: 'SageMaker Neo (Outposts) → Lambda → SNS → Line Stop',
    query: 'Which lots are in HVDB SN #12345?',
    highlightLots: ['B456'],
    highlightNodes: ['lot-a', 'lot-b', 'hvdb-1'],
    highlightPath: ['lot-a', 'hvdb-1'],
    traceSteps: [
      { label: 'Error detected', detail: 'Cross-thread torque curve — peak OK but plateau too short', time: 'T+0 s' },
      { label: 'Line Stop', detail: 'Lambda → SNS — conveyor stopped in 9.2 s. Module quarantined.', time: 'T+9 s' },
      { label: 'Neptune query', detail: 'HVDB #12345 ← Fastener Lot A123 + Relay Lot B456', time: 'T+10 s' },
      { label: 'S3 evidence', detail: 'Raw torque curve + seating vision image archived for review', time: 'T+11 s' },
      { label: 'Action', detail: 'Single module scrapped · lot relationship preserved for lot-level analysis', time: 'T+12 s' },
    ],
    impact: [
      { stage: 'This module', count: '1', action: 'Scrapped — Line Stop before next station' },
      { stage: 'Same lots', count: 'A123 + B456', action: 'Flagged in Neptune — watch FMT re-torque trend' },
      { stage: 'Other HVDBs', count: 'TBD', action: 'Query Neptune: all modules containing Lot B456' },
    ],
    awsServices: ['SageMaker Neo', 'Lambda', 'SNS', 'Neptune', 'S3'],
    lookupBefore: '24–72 h — search MES logs manually',
    lookupAfter: '< 5 s — Neptune graph traverse from HVDB SN',
  },
  {
    id: 'hvdb-lot-sigma',
    step: 3,
    severity: 'critical',
    title: 'HVDB EOL — Relay Lot B456 5σ drift',
    error: 'Lot group contact resistance 2.0 mΩ vs baseline 1.5 ± 0.1 mΩ — 5σ statistical alert',
    detection: 'Lambda cutoff pass per module, but lot-group 3σ check triggers SNS alert',
    query: 'Which HVDB SNs contain Relay Lot B456?',
    highlightLots: ['B456'],
    highlightNodes: ['lot-b', 'hvdb-1', 'hvdb-2'],
    highlightPath: ['lot-b', 'hvdb-1', 'hvdb-2'],
    traceSteps: [
      { label: 'Error detected', detail: 'Module #12345 passes individual cutoff (2.1 mΩ) but Lot B456 group fails 3σ', time: 'T+0 s' },
      { label: 'Neptune query', detail: 'Lot B456 → HVDB #12340, #12345, #12351 (3 modules in warehouse + line)', time: 'T+3 s' },
      { label: 'RDS + Neptune', detail: 'Cross-reference: 2 in warehouse, 1 on line, 0 in vehicles yet', time: 'T+5 s' },
      { label: 'Human review', detail: 'Quality team confirms — plating batch issue at Supplier B', time: 'T+4 h' },
      { label: 'Isolation', detail: 'All Lot B456 HVDB units held · in-assembly line stopped for Lot B456', time: 'T+4 h' },
    ],
    impact: [
      { stage: 'Warehouse', count: '2 SNs', action: 'Quarantine — #12340, #12351' },
      { stage: 'In assembly', count: '1 SN', action: 'Line stop — #12345 rework or scrap' },
      { stage: 'In vehicles (pre-ship)', count: '0', action: 'None yet at this stage' },
      { stage: 'Shipped', count: '0', action: 'None yet — caught before vehicle install' },
    ],
    awsServices: ['Lambda', 'RDS', 'Neptune', 'SNS', 'S3'],
    lookupBefore: '24–72 h — SAP + MES + QMS manual join',
    lookupAfter: '< 5 s — Neptune: Lot B456 → all HVDB SNs',
  },
  {
    id: 'vehicle-imd',
    step: 4,
    severity: 'hold',
    title: 'Vehicle EOL — IMD self-test fail',
    error: 'VIN-8842 IMD self-diagnosis FAIL — insulation monitor not functional',
    detection: 'SiteWise test bench → Lambda → SNS shipment hold',
    query: 'Which lots were used on VIN-8842 and ±30 min neighbors?',
    highlightLots: ['B456'],
    highlightNodes: ['hvdb-1', 'vin-1', 'lot-b'],
    highlightPath: ['lot-b', 'hvdb-1', 'vin-1'],
    traceSteps: [
      { label: 'Error detected', detail: 'IMD self-test fail — vehicle would drive blind to insulation faults', time: 'T+0 s' },
      { label: 'Shipment hold', detail: 'VIN-8842 blocked from release — Lambda → SNS', time: 'T+2 s' },
      { label: 'Neptune ±30 min', detail: '18 vehicles same shift window flagged — same lots / operators / robots', time: 'T+5 s' },
      { label: 'Trace back', detail: 'VIN-8842 → HVDB #12345 → Relay Lot B456 + Fastener Lot A123', time: 'T+6 s' },
      { label: 'Action', detail: 'Re-test 18 vehicles · swap HVDB if needed · pattern vs random check', time: 'T+1 h' },
    ],
    impact: [
      { stage: 'This VIN', count: '1', action: 'Shipment hold — VIN-8842' },
      { stage: '±30 min window', count: '18 VINs', action: 'Re-test queue — same assembly batch' },
      { stage: 'Lot link', count: 'B456', action: 'Confirms earlier HVDB EOL alert — not isolated incident' },
    ],
    awsServices: ['SiteWise', 'Lambda', 'RDS', 'Neptune', 'SNS'],
    lookupBefore: '24–72 h — trace paper build sheet + MES',
    lookupAfter: '< 5 s — VIN → HVDB SN → all lots in Neptune',
  },
  {
    id: 'fleet-recall',
    step: 5,
    severity: 'critical',
    title: 'Fleet — Lot B456 targeted recall',
    error: '47 vehicles with Lot B456: +32% HV bus impedance rise over 4 weeks',
    detection: 'SageMaker trend + Bedrock service note clustering → Lambda recall trigger',
    query: 'Which VINs and owners have Relay Lot B456?',
    highlightLots: ['B456'],
    highlightNodes: ['lot-b', 'hvdb-1', 'hvdb-2', 'vin-1', 'vin-2', 'owner-1', 'owner-2'],
    highlightPath: ['lot-b', 'hvdb-1', 'vin-1', 'owner-1'],
    traceSteps: [
      { label: 'Trend detected', detail: 'SageMaker: impedance +32% over 4 weeks — only Lot B456 vehicles', time: 'Week 4' },
      { label: 'Service signal', detail: 'Bedrock clusters "HV warning light" — over-indexed on Lot B456 VINs', time: 'Week 4' },
      { label: 'Neptune + RDS query', detail: 'Lot B456 → 47 VINs → 47 owner contacts mapped', time: 'T+3 s' },
      { label: 'Risk tier', detail: '29 shipped · 18 already serviced · fire-risk tier → immediate notice', time: 'T+5 s' },
      { label: 'Targeted recall', detail: 'SNS → 47 owners only. NOT fleet-wide (2,400 vehicles untouched).', time: 'T+10 s' },
    ],
    impact: [
      { stage: 'Affected VINs', count: '47', action: 'Targeted inspection notice via SNS/app' },
      { stage: 'Unaffected fleet', count: '2,353', action: 'No action — precise lot trace avoids blanket recall' },
      { stage: 'Regulatory', count: 'NHTSA', action: 'Voluntary report if severity threshold met — scoped to Lot B456' },
    ],
    awsServices: ['IoT Core', 'Kinesis', 'SageMaker', 'Bedrock', 'Lambda', 'RDS', 'Neptune', 'SNS'],
    lookupBefore: '24–72 h — fleet ops + SAP + service records manual merge',
    lookupAfter: '< 5 s — Lot → VIN → owner in one Neptune + RDS query',
  },
  {
    id: 'full-cascade',
    step: 0,
    severity: 'critical',
    title: 'Full cascade — Lot B456 root cause to recall',
    error: 'End-to-end: supplier plating defect → factory detection → fleet recall (same lot thread)',
    detection: 'Multiple gates — only connected trace graph reveals single root cause',
    query: 'Show full path: Lot B456 → every HVDB → every VIN → every owner',
    highlightLots: ['B456'],
    highlightNodes: ['lot-b', 'hvdb-1', 'hvdb-2', 'vin-1', 'vin-2', 'owner-1', 'owner-2'],
    highlightPath: ['lot-b', 'hvdb-1', 'vin-1', 'owner-1'],
    traceSteps: [
      { label: 'Step 1 — Inbound', detail: 'Lot B456 relays PASS inbound (plating defect not visible at AQL)', time: 'Day 0' },
      { label: 'Step 2 — Assembly', detail: 'Cross-thread on #12345 — lots recorded in Neptune', time: 'Day 1' },
      { label: 'Step 3 — HVDB EOL', detail: '5σ lot-group alert — 3 HVDB SNs isolated', time: 'Day 1' },
      { label: 'Step 4 — Vehicle EOL', detail: 'Some units already in vehicles — VIN trace activated', time: 'Day 2' },
      { label: 'Step 5 — Fleet', detail: '29 on road show impedance trend — 47 owners notified', time: 'Week 4' },
      { label: 'Root cause', detail: 'Single supplier plating batch (Lot B456) — NOT random failures', time: 'Resolved' },
    ],
    impact: [
      { stage: 'Without trace graph', count: '2,400', action: 'Blind fleet-wide recall — cost + customer panic' },
      { stage: 'With Neptune trace', count: '47', action: 'Surgical recall — only Lot B456 exposure' },
      { stage: 'Time saved', count: '24–72 h → 5 s', action: 'Per lookup query across siloed systems' },
    ],
    awsServices: ['Full stack — RDS + Neptune connects all 5 steps'],
    lookupBefore: '24–72 h per query · multiple teams · spreadsheet merges',
    lookupAfter: '< 5 s · one graph query · single pane of glass',
  },
];
