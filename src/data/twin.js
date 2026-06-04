export const TONE_HEX = {
  green: '#2df6a1',
  amber: '#ffb22a',
  red: '#ff4d5d',
  cyan: '#2fe8ff',
  blue: '#178dff',
  violet: '#9b6cff',
  dim: '#6f8cac',
};

export const TWIN_BUILDINGS = [
  {
    id: 'hq',
    name: 'Control Tower',
    role: 'Quality command and lot traceability',
    en: 'Normal',
    pos: [0.2, -4.4],
    size: [2.15, 2.45],
    height: 8.8,
    status: 'run',
    tone: 'hq',
    nav: 'dashboard',
    stat: 'Neptune trace live',
    color: '#174a63',
    roof: true,
    roofColor: '#bfe9ff',
    windowBand: true,
    glow: 1.18,
    activeGlow: 1.65,
  },
  {
    id: 'hq-west',
    name: 'Tower annex',
    role: 'Administrative tower annex',
    en: 'Normal',
    pos: [-1.35, -4.0],
    size: [1.28, 1.92],
    height: 5.55,
    status: 'run',
    tone: 'hq',
    label: false,
    color: '#143b55',
    roof: true,
    roofColor: '#c8f2ff',
    windowBand: true,
    glow: 1.0,
  },
  {
    id: 'hq-east',
    name: 'Tower annex',
    role: 'Administrative tower annex',
    en: 'Normal',
    pos: [1.72, -4.16],
    size: [1.18, 1.72],
    height: 6.2,
    status: 'run',
    tone: 'hq',
    label: false,
    color: '#123852',
    roof: true,
    roofColor: '#c8f2ff',
    windowBand: true,
    glow: 0.96,
  },
  {
    id: 'gate',
    name: 'Receiving',
    role: 'Inbound AQL sampling and COA check',
    en: 'Normal',
    pos: [-5.35, -1.05],
    size: [2.05, 1.32],
    height: 1.38,
    status: 'run',
    nav: 'step1',
    stat: 'AQL 32/32 pass',
    label: false,
    color: '#1b5272',
    roof: true,
    roofColor: '#c7e8ff',
    windowBand: true,
  },
  {
    id: 'press-shop',
    name: 'Press shop',
    role: 'Stamped case preparation',
    en: 'Normal',
    pos: [-3.52, -0.92],
    size: [1.88, 1.38],
    height: 1.34,
    status: 'run',
    label: false,
    color: '#1a4d70',
    roof: true,
    roofColor: '#bfdfff',
    windowBand: true,
  },
  {
    id: 'line-1',
    name: 'Line 1',
    role: 'Module sub assembly',
    en: 'Normal',
    pos: [-1.72, -0.92],
    size: [1.72, 1.38],
    height: 1.3,
    status: 'run',
    label: false,
    color: '#1a4d70',
    roof: true,
    roofColor: '#bfdfff',
    windowBand: true,
  },
  {
    id: 'visitor',
    name: 'HVDB EOL',
    role: 'High-voltage end-of-line test',
    en: 'Normal',
    pos: [1.72, 0.72],
    size: [1.82, 1.36],
    height: 1.34,
    status: 'run',
    nav: 'step3',
    stat: '1.5 mΩ baseline',
    color: '#1b5576',
    roof: true,
    roofColor: '#d3ecff',
    windowBand: true,
  },
  {
    id: 'workshop',
    name: 'Assembly Line 2',
    role: 'ASSY-02 torque fastening station',
    en: 'Abnormal',
    pos: [-3.72, 0.98],
    size: [2.18, 1.42],
    height: 1.4,
    status: 'alarm',
    nav: 'step2',
    stat: 'Torque fault · LOT-A123',
    alarm: true,
    alarmMsg: 'ASSY-02 torque profile fault - cross-thread suspected on Fastener LOT-A123',
    color: '#1b4d70',
    roof: true,
    roofColor: '#d1e9ff',
    windowBand: true,
  },
  {
    id: 'warehouse',
    name: 'Warehouse',
    role: 'Fastener and relay lot storage',
    en: 'Normal',
    pos: [5.8, -0.3],
    size: [5.35, 2.72],
    height: 2.72,
    status: 'run',
    nav: 'step1',
    stat: 'LOT-A123 on hold',
    color: '#174465',
    roof: true,
    roofColor: '#cfeaff',
    windowBand: true,
    glow: 0.92,
  },
  {
    id: 'chemical',
    name: 'Vehicle EOL',
    role: 'HV bus and IMD shipment gate',
    en: 'Standby',
    pos: [-0.42, 1.05],
    size: [1.76, 1.38],
    height: 1.28,
    status: 'hold',
    nav: 'step4',
    stat: 'Re-test queue: 18',
    label: false,
    color: '#1b4e70',
    roof: true,
    roofColor: '#d3ecff',
    windowBand: true,
  },
  {
    id: 'subline-east',
    name: 'Sub line',
    role: 'Final module prep',
    en: 'Normal',
    pos: [3.35, 1.05],
    size: [1.72, 1.35],
    height: 1.24,
    status: 'run',
    label: false,
    color: '#1a4c70',
    roof: true,
    roofColor: '#d3ecff',
    windowBand: true,
  },
  {
    id: 'admin',
    name: 'Shipping & Fleet',
    role: 'Outbound and fleet telemetry',
    en: 'Normal',
    pos: [-1.95, 3.86],
    size: [1.22, 1.05],
    height: 0.94,
    status: 'run',
    nav: 'step5',
    stat: '2,400 vehicles live',
    label: false,
    color: '#223b4f',
    roof: true,
    roofColor: '#d5e8f7',
    windowBand: true,
    windowColor: '#fff136',
  },
  {
    id: 'front-admin-east',
    name: 'Park service',
    role: 'Service office',
    en: 'Normal',
    pos: [0.35, 3.86],
    size: [1.28, 1.05],
    height: 0.94,
    status: 'run',
    label: false,
    color: '#223b4f',
    roof: true,
    roofColor: '#d5e8f7',
    windowBand: true,
    windowColor: '#fff136',
  },
  {
    id: 'front-lab',
    name: 'Quality lab',
    role: 'Incoming quality lab',
    en: 'Normal',
    pos: [2.48, 3.78],
    size: [1.18, 1.08],
    height: 0.98,
    status: 'run',
    label: false,
    color: '#203b55',
    roof: true,
    roofColor: '#d5e8f7',
    windowBand: true,
    windowColor: '#fff136',
  },
];

export const TWIN_FILLER = [
  [-6.1, -7.35, 1.15, 1.58, 3.8],
  [-4.55, -7.55, 1.28, 1.8, 4.65],
  [-2.9, -7.35, 1.1, 1.48, 4.2],
  [3.25, -7.42, 1.22, 1.7, 4.4],
  [5.05, -7.22, 1.28, 1.78, 3.95],
  [6.82, -7.48, 1.05, 1.52, 3.55],
];

export const TWIN_TANKS = [
  [-3.12, 3.98, 0.62, 0.54],
  [1.64, 3.98, 0.62, 0.54],
  [-4.2, 4.75, 0.42, 0.42],
  [3.0, 4.64, 0.42, 0.42],
];

export const TWIN_ROADS = [
  { pos: [0, -6.05], size: [38, 0.18], c: '#f6a24c' },
  { pos: [0, -2.58], size: [38, 0.16], c: '#f6a24c' },
  { pos: [0, 1.82], size: [38, 0.16], c: '#f6a24c' },
  { pos: [0, 5.14], size: [38, 0.20], c: '#f6a24c' },
  { pos: [-7.85, -0.45], size: [0.18, 30], c: '#f6a24c' },
  { pos: [8.28, -0.45], size: [0.18, 30], c: '#f6a24c' },
  { pos: [-4.7, -0.4], size: [0.12, 29], c: '#2fe8ff' },
  { pos: [3.7, -0.4], size: [0.12, 29], c: '#2fe8ff' },
  { pos: [-5.75, 0.22], size: [13, 0.12], c: '#f6a24c', rot: -0.6 },
  { pos: [-4.9, -1.1], size: [12, 0.12], c: '#f6a24c', rot: 0.48 },
];

export const PLANT_METRICS = [
  { label: 'IoT Sensors Online', value: '247', icon: 'screen' },
  { label: 'Vision Cameras', value: '36', icon: 'camera' },
  { label: 'Stations Running', value: '18', icon: 'shield' },
  { label: 'Active Quality Alarms', value: '1', icon: 'hydrant' },
];

export const PLANT_SUMMARY = [
  { label: 'Modules Built Today', value: '1,284' },
  { label: 'Lots Released', value: '46' },
  { label: 'Open Quality Holds', value: '3' },
];

export const QUALITY_EVENTS = [
  { time: '13:42', station: 'ASSY-02', event: 'Torque fault', lot: 'A123' },
  { time: '11:18', station: 'EOL-03', event: '5σ resistance drift', lot: 'B456' },
  { time: '09:24', station: 'RCV-01', event: 'AQL sample pass', lot: 'C781' },
  { time: '08:05', station: 'WRH-STK', event: 'Lot released', lot: 'A120' },
];

export const QUALITY_PROGRAMS = [
  { label: 'Control Plans', value: '24', icon: 'lock' },
  { label: 'SPC Charts Live', value: '86', icon: 'case' },
  { label: 'Open CAPAs', value: '5', icon: 'user' },
  { label: 'Audits / Month', value: '4', icon: 'run' },
];

export const DEFECT_TYPES = [
  { m: 'Cross-thread', a: 12, b: 7 },
  { m: 'Over-stretch', a: 4, b: 9 },
  { m: 'Resistance drift', a: 8, b: 3 },
  { m: 'IMD / Insulation', a: 2, b: 5 },
];

export const THROUGHPUT_24H = [
  { h: '8', v: 980 },
  { h: '10', v: 2600 },
  { h: '12', v: 720 },
  { h: '14', v: 1540 },
  { h: '16', v: 3240 },
  { h: '18', v: 1980 },
  { h: '20', v: 410 },
  { h: '22', v: 380 },
  { h: '2', v: 520 },
  { h: '4', v: 360 },
  { h: '6', v: 890 },
];

export const TWIN_MACHINES = (() => {
  const rows = [-2.7, -1.05, 0.6, 2.25];
  const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const out = [];
  rows.forEach((cz, i) => {
    out.push({ id: `L${i}`, label: `Server ${labels[i]}`, cx: -2.4, cz, alarm: i === 0 });
  });
  rows.forEach((cz, i) => {
    out.push({ id: `R${i}`, label: `Server ${labels[i + 4]}`, cx: 2.4, cz, hold: i === 2 });
  });
  return out;
})();

export const TWIN_ABNORMAL = [
  { id: 'l1', label: 'Level-1 Alert', value: 0, tone: 'red' },
  { id: 'l2', label: 'Level-2 Alert', value: 0, tone: 'red' },
  { id: 'l3', label: 'Level-3 Alert', value: 0, tone: 'red' },
  { id: 'off', label: 'Offline Devices', value: 0, tone: 'dim' },
];

export const TWIN_PERCAP = [
  { label: 'Total Production', value: 86, tone: '#72d8ff' },
  { label: 'Production', value: 74, tone: '#ffb020' },
];

export const TWIN_DEVICE_TABLE = [
  { name: 'Device 1', status: 'run', time: '6', cap: 1200 },
  { name: 'Device 2', status: 'run', time: '6.6', cap: 1843 },
  { name: 'Device 3', status: 'run', time: '5.8', cap: 1000 },
  { name: 'Device 4', status: 'hold', time: '4.2', cap: 760 },
  { name: 'Device 5', status: 'run', time: '5.4', cap: 924 },
];

export const TWIN_CAP_RANK = [
  { name: 'Device 6', value: 96, fill: '#178dff' },
  { name: 'Device 5', value: 88, fill: '#1f9bff' },
  { name: 'Device 4', value: 81, fill: '#29b7ff' },
  { name: 'Device 2', value: 76, fill: '#4fcfff' },
  { name: 'Device 1', value: 68, fill: '#7b6cff' },
];

export const TWIN_USAGE_RANK = [
  { name: 'Device 7', delta: '83%', value: 83, rank: '04' },
  { name: 'Device 1', delta: '76%', value: 76, rank: '05' },
  { name: 'Device 8', delta: '75%', value: 75, rank: '06' },
  { name: 'Device 5', delta: '69%', value: 69, rank: '07' },
  { name: 'Device 3', delta: '66%', value: 66, rank: '08' },
];

export const INV_HUB = [
  { label: 'Inventory', value: '1,235', tone: 'cyan' },
  { label: 'Business Income', value: '4,936', tone: 'green' },
  { label: 'Inventory Growth Rate', value: '68%', tone: 'cyan' },
  { label: 'Main Business Cost', value: '3,965', tone: 'violet' },
  { label: 'Revenue Growth Rate', value: '98%', tone: 'green' },
  { label: 'Inventory Turnover Days', value: '23', tone: 'amber' },
];

export const INV_GROWTH = [
  { m: 'January', inv: 110, rev: 55 },
  { m: 'February', inv: 70, rev: 85 },
  { m: 'March', inv: 100, rev: 79 },
  { m: 'April', inv: 115, rev: 80 },
  { m: 'May', inv: 70, rev: 56 },
  { m: 'June', inv: 60, rev: 86 },
  { m: 'July', inv: 61, rev: 116 },
  { m: 'August', inv: 54, rev: 60 },
];

export const INV_MONTHLY = [
  { m: 'May', inv: 1092, income: 4549.0, cost: 843.0, growth: '58.4%' },
  { m: 'June', inv: 1979, income: 4485.0, cost: 584.0, growth: '58.9%' },
  { m: 'July', inv: 1096, income: 4632.0, cost: 357.0, growth: '57.8%' },
  { m: 'August', inv: 1089, income: 4542.0, cost: 567.0, growth: '58.3%' },
  { m: 'September', inv: 1090, income: 4536.0, cost: 656.0, growth: '58.4%' },
];

export const INV_TURNOVER = [
  { m: 'January', cur: 14, prev: 28 },
  { m: 'March', cur: 30, prev: 46 },
  { m: 'May', cur: 19, prev: 42 },
  { m: 'July', cur: 43, prev: 36 },
  { m: 'September', cur: 40, prev: 35 },
];

export const INV_CUMULATIVE = [
  { m: 'May', inv: 980, same: 920 },
  { m: 'June', inv: 1800, same: 1600 },
  { m: 'July', inv: 1040, same: 930 },
  { m: 'August', inv: 1040, same: 930 },
  { m: 'September', inv: 1040, same: 920 },
  { m: 'October', inv: 1040, same: 900 },
  { m: 'November', inv: 1040, same: 880 },
  { m: 'December', inv: 1080, same: 940 },
];

export const INV_COST_INCOME = [
  { m: 'May', income: 4520, cost: 840 },
  { m: 'June', income: 4480, cost: 620 },
  { m: 'July', income: 4600, cost: 360 },
  { m: 'August', income: 4540, cost: 570 },
  { m: 'September', income: 4550, cost: 640 },
  { m: 'October', income: 4620, cost: 580 },
  { m: 'November', income: 4200, cost: 590 },
  { m: 'December', income: 4520, cost: 930 },
];

export const INV_REVENUE = [
  { m: 'May', inv: 1080, income: 4550 },
  { m: 'June', inv: 1980, income: 4480 },
  { m: 'July', inv: 1090, income: 4620 },
  { m: 'August', inv: 1080, income: 4550 },
  { m: 'September', inv: 1090, income: 4520 },
  { m: 'October', inv: 1100, income: 4590 },
  { m: 'November', inv: 1080, income: 4150 },
  { m: 'December', inv: 1090, income: 4520 },
];

export const INV_ASSESSMENT = [
  'Inventory Balance Upper Limit Warning Analysis',
  'Inventory Change Presentation',
  'Cycle Inventory Reasoning Analysis',
];

export const TWIN_TABS = [
  { id: 'situation', label: 'Situation Overview', en: 'Situation Overview' },
  { id: 'device', label: 'Device Management', en: 'Device Management' },
  { id: 'inventory', label: 'Inventory Analysis', en: 'Inventory Analysis' },
];
