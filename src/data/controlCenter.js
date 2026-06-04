// ════════════════════════════════════════════════════════════
//  Production Control Center — mock data
//  Day shift (06:00–17:00). Ties into the same world as the
//  quality demo: Fastener Lot A123, Relay Lot B456 (defective),
//  cross-thread torque fault at Assembly Line 2 (13:42).
// ════════════════════════════════════════════════════════════

/** Headline KPIs for the top strip. accent maps to a status color. */
export const CC_KPIS = [
  {
    id: 'output',
    label: '금일 생산량',
    en: 'Today Output',
    icon: 'Package',
    accent: 'cyan',
    value: 12840,
    decimals: 0,
    suffix: ' EA',
    delta: 3.2,
    spark: [1080, 1180, 1150, 1220, 1190, 1140, 920, 1130],
  },
  {
    id: 'util',
    label: '설비 가동률',
    en: 'Utilization',
    icon: 'Activity',
    accent: 'green',
    value: 87.4,
    decimals: 1,
    suffix: '%',
    delta: 1.1,
    spark: [84, 85, 86, 87, 86, 88, 87, 87.4],
  },
  {
    id: 'defect',
    label: '불량률',
    en: 'Defect Rate',
    icon: 'AlertTriangle',
    accent: 'amber',
    value: 0.42,
    decimals: 2,
    suffix: '%',
    delta: -0.08,
    goodWhenDown: true,
    spark: [0.5, 0.45, 0.4, 0.38, 0.52, 0.48, 0.42, 0.42],
  },
  {
    id: 'oee',
    label: 'OEE 종합효율',
    en: 'Overall Equipment Eff.',
    icon: 'Gauge',
    accent: 'violet',
    value: 82.1,
    decimals: 1,
    suffix: '%',
    delta: 2.0,
    spark: [79, 80, 81, 82, 81, 83, 82, 82.1],
  },
  {
    id: 'lines',
    label: '가동 라인',
    en: 'Active Lines',
    icon: 'Factory',
    accent: 'cyan',
    value: 5,
    decimals: 0,
    suffix: ' / 6',
    delta: 0,
    spark: [6, 6, 5, 5, 6, 5, 5, 5],
  },
  {
    id: 'plan',
    label: '계획 달성률',
    en: 'Plan Attainment',
    icon: 'Target',
    accent: 'green',
    value: 94,
    decimals: 0,
    suffix: '%',
    delta: 1.5,
    spark: [88, 90, 91, 92, 93, 94, 94],
  },
];

/** OEE = Availability × Performance × Quality (0.915×0.952×0.943 ≈ 0.821). */
export const CC_OEE = {
  oee: 82.1,
  parts: [
    { key: 'availability', label: '가용성', en: 'Availability', value: 91.5 },
    { key: 'performance', label: '성능', en: 'Performance', value: 95.2 },
    { key: 'quality', label: '품질', en: 'Quality', value: 94.3 },
  ],
};

/** Per-process line status board. status: run | hold | alarm | idle. */
export const CC_LINES = [
  { id: 'rcv', name: 'Receiving', tag: 'RCV-01', status: 'run', oee: 93, output: 'AQL 32 / 32', note: '정상', nav: 'step1' },
  { id: 'asm1', name: 'Assembly L1', tag: 'ASSY-01', status: 'run', oee: 89, output: '1,240 EA', note: '정상', nav: 'step2' },
  { id: 'asm2', name: 'Assembly L2', tag: 'ASSY-02', status: 'alarm', oee: 0, output: 'TRQ FAULT', note: '체결 토크 이상', nav: 'step2' },
  { id: 'hvdb', name: 'HVDB EOL', tag: 'EOL-03', status: 'hold', oee: 71, output: 'Lot B456 검토', note: '5σ 편차 보류', nav: 'step3' },
  { id: 'vhcl', name: 'Vehicle EOL', tag: 'VHCL-04', status: 'run', oee: 88, output: 'IMD OK', note: '정상', nav: 'step4' },
  { id: 'fleet', name: 'Fleet Desk', tag: 'FLT-05', status: 'run', oee: 97, output: '2,400 ▸', note: '텔레메트리 정상', nav: 'step5' },
];

/** Hourly production (EA) + defect rate (%) for the trend chart. Sums to 12,840. */
export const CC_HOURLY = [
  { t: '06', output: 1080, defect: 0.31 },
  { t: '07', output: 1180, defect: 0.28 },
  { t: '08', output: 1150, defect: 0.35 },
  { t: '09', output: 1220, defect: 0.30 },
  { t: '10', output: 1190, defect: 0.33 },
  { t: '11', output: 1140, defect: 0.40 },
  { t: '12', output: 920, defect: 0.52 },
  { t: '13', output: 780, defect: 0.91 },
  { t: '14', output: 1130, defect: 0.48 },
  { t: '15', output: 1180, defect: 0.38 },
  { t: '16', output: 1090, defect: 0.35 },
  { t: '17', output: 780, defect: 0.42 },
];

/** Defect types for the Pareto (sorted desc; cumulative % computed in component). */
export const CC_DEFECTS = [
  { type: '체결 토크', en: 'Torque', count: 38 },
  { type: '치수', en: 'Dimension', count: 22 },
  { type: '도금 두께', en: 'Plating', count: 15 },
  { type: '외관', en: 'Cosmetic', count: 11 },
  { type: 'IMD', en: 'IMD', count: 7 },
  { type: '기타', en: 'Other', count: 5 },
];

/** Real-time event / alarm feed. sev: P1 | HOLD | WARN | INFO. */
export const CC_EVENTS = [
  { ts: '13:42:07', sev: 'P1', tag: 'ASSY-02', msg: '체결 토크 이상 — Cross-thread 의심, Line Stop', nav: 'step2' },
  { ts: '13:40:55', sev: 'HOLD', tag: 'EOL-03', msg: 'Relay Lot B456 접촉저항 5σ 편차 — 격리 검토', nav: 'step3' },
  { ts: '13:31:12', sev: 'INFO', tag: 'VHCL-04', msg: 'VIN-8842 IMD 재검 완료 — 합격', nav: 'step4' },
  { ts: '13:18:40', sev: 'INFO', tag: 'RCV-01', msg: 'Fastener Lot A124 입고 — AQL 32/32 통과', nav: 'step1' },
  { ts: '12:55:03', sev: 'WARN', tag: 'ASSY-01', msg: '사이클타임 +6% — 비전 재보정 권고', nav: 'step2' },
  { ts: '12:30:21', sev: 'INFO', tag: 'FLT-05', msg: 'Fleet 텔레메트리 2,400대 정상 수신', nav: 'step5' },
  { ts: '11:47:58', sev: 'WARN', tag: 'EOL-03', msg: 'HVDB #12351 링잉 재시험 1회', nav: 'step3' },
  { ts: '11:20:33', sev: 'INFO', tag: 'ASSY-02', msg: 'Line 2 토크건 TRQ-4471 자동 보정 완료', nav: 'step2' },
  { ts: '10:58:14', sev: 'INFO', tag: 'VHCL-04', msg: '차량 EOL 142대 출하 게이트 통과', nav: 'step4' },
  { ts: '10:12:09', sev: 'INFO', tag: 'RCV-01', msg: 'Relay Lot B457 입고 — 검사 대기', nav: 'step1' },
  { ts: '09:34:47', sev: 'WARN', tag: 'EOL-03', msg: '항온항습 챔버 +1.2℃ 상승 — 모니터링', nav: 'step3' },
  { ts: '08:05:00', sev: 'INFO', tag: 'FLT-05', msg: '주간조 A 교대 시작 — 24명 출근', nav: 'step5' },
];

export const CC_SEV = {
  P1: { color: 'red', label: 'P1' },
  HOLD: { color: 'violet', label: 'HOLD' },
  WARN: { color: 'amber', label: 'WARN' },
  INFO: { color: 'cyan', label: 'INFO' },
};

/** Line status distribution for the donut. */
export const CC_STATUS_MIX = [
  { key: 'run', label: '가동', value: 4, color: '#16a34a' },
  { key: 'hold', label: '보류', value: 1, color: '#d97706' },
  { key: 'alarm', label: '정지', value: 1, color: '#dc2626' },
];

export const CC_SHIFT = {
  shift: '주간조 A',
  shiftEn: 'Day Shift A',
  window: '06:00 – 18:00',
  supervisor: '김영제',
  operators: 24,
};
