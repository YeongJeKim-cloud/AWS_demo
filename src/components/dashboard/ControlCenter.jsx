import { useState, useEffect } from 'react';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import {
  Package, Activity, AlertTriangle, Gauge, Factory, Target,
  Clock, Bell, TrendingUp, TrendingDown, Minus, ChevronRight, Wifi, Sigma,
} from 'lucide-react';
import {
  CC_KPIS, CC_OEE, CC_LINES, CC_HOURLY, CC_DEFECTS, CC_EVENTS, CC_SEV,
  CC_STATUS_MIX, CC_SHIFT,
} from '../../data/controlCenter';
import './ControlCenter.css';

const ICONS = { Package, Activity, AlertTriangle, Gauge, Factory, Target };
const COLOR = { green: '#16a34a', amber: '#d97706', red: '#dc2626', cyan: '#0891b2', violet: '#7c3aed' };

const TIP = {
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  color: '#1e293b',
  boxShadow: '0 4px 14px rgba(15, 23, 42, 0.10)',
  fontSize: 12,
};

const fmt = (n, d) => Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

// ── animate a number from 0 → target on mount ──
function useCountUp(target, duration = 1100) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setVal(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setVal(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setM(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return m;
}

// ── tiny SVG sparkline ──
function Sparkline({ data, color }) {
  const w = 88, h = 30, pad = 3;
  const min = Math.min(...data), max = Math.max(...data);
  const span = max - min || 1;
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / span) * (h - pad * 2);
    return [x, y];
  });
  const line = pts.map((p) => p.join(',')).join(' ');
  const area = `${pad},${h - pad} ${line} ${w - pad},${h - pad}`;
  const gid = `cc-sg-${color.replace('#', '')}`;
  const last = pts[pts.length - 1];
  return (
    <svg className="cc-spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.24" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${gid})`} />
      <polyline points={line} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={last[0]} cy={last[1]} r="2.4" fill={color} />
    </svg>
  );
}

// ── 270° arc gauge ──
function RingGauge({ value, label }) {
  const v = useCountUp(value, 1300);
  const color = value >= 85 ? COLOR.green : value >= 70 ? COLOR.cyan : value >= 50 ? COLOR.amber : COLOR.red;
  const ARC = 75; // 270° of pathLength 100
  return (
    <div className="cc-gauge-ring">
      <svg viewBox="0 0 120 120">
        <circle
          className="cc-gauge-track" cx="60" cy="60" r="50" pathLength="100" fill="none"
          strokeWidth="11" strokeLinecap="round" strokeDasharray={`${ARC} 100`} transform="rotate(135 60 60)"
        />
        <circle
          cx="60" cy="60" r="50" pathLength="100" fill="none" stroke={color}
          strokeWidth="11" strokeLinecap="round" strokeDasharray={`${(v / 100) * ARC} 100`} transform="rotate(135 60 60)"
        />
      </svg>
      <div className="cc-gauge-center">
        <span className="cc-gauge-val" style={{ color }}>{v.toFixed(1)}<i>%</i></span>
        <span className="cc-gauge-label">{label}</span>
      </div>
    </div>
  );
}

function ApqBar({ part, mounted }) {
  return (
    <div className="cc-apq-row">
      <span className="cc-apq-label">{part.label}<i>{part.en}</i></span>
      <div className="cc-apq-track"><span style={{ width: mounted ? `${part.value}%` : '0%' }} /></div>
      <span className="cc-apq-val">{part.value}%</span>
    </div>
  );
}

function KpiCard({ kpi }) {
  const c = COLOR[kpi.accent];
  const shown = useCountUp(kpi.value);
  const Icon = ICONS[kpi.icon] || Activity;
  const flat = kpi.delta === 0;
  const good = kpi.goodWhenDown ? kpi.delta < 0 : kpi.delta > 0;
  const cls = flat ? 'flat' : good ? 'good' : 'bad';
  const TrendI = flat ? Minus : kpi.delta > 0 ? TrendingUp : TrendingDown;
  const unit = kpi.id === 'output' ? '%' : kpi.id === 'lines' ? '' : '%p';
  const deltaTxt = flat ? '변동 없음' : `${kpi.delta > 0 ? '+' : ''}${kpi.delta}${unit}`;
  return (
    <div className="cc-kpi" style={{ '--c': c }}>
      <div className="cc-kpi-top">
        <span className="cc-kpi-icon"><Icon size={16} strokeWidth={2.1} /></span>
        <span className="cc-kpi-label">{kpi.label}<i>{kpi.en}</i></span>
      </div>
      <div className="cc-kpi-val">{fmt(shown, kpi.decimals)}<u>{kpi.suffix}</u></div>
      <div className="cc-kpi-foot">
        <span className={`cc-kpi-delta ${cls}`}><TrendI size={12} strokeWidth={2.6} /> {deltaTxt}</span>
        <Sparkline data={kpi.spark} color={c} />
      </div>
    </div>
  );
}

const ST_LABEL = { run: '가동', hold: '보류', alarm: '정지', idle: '대기' };

function LineRow({ line, onNavigate }) {
  return (
    <button type="button" className={`cc-line-row st-${line.status}`} onClick={() => onNavigate?.(line.nav)}>
      <span className={`cc-line-led led-${line.status}`} />
      <span className="cc-line-id">
        <strong>{line.name}</strong>
        <i>{line.tag}</i>
      </span>
      <span className={`cc-line-badge b-${line.status}`}>{ST_LABEL[line.status]}</span>
      <span className="cc-line-out">{line.output}</span>
      <span className="cc-line-oee">
        <span className="cc-line-oee-track"><span className={`st-${line.status}`} style={{ width: `${line.oee}%` }} /></span>
        <b>{line.oee}%</b>
      </span>
      <ChevronRight size={14} className="cc-line-arrow" />
    </button>
  );
}

function EventRow({ ev, onNavigate }) {
  const c = CC_SEV[ev.sev]?.color || 'cyan';
  return (
    <button type="button" className="cc-event" style={{ borderLeftColor: COLOR[c] }} onClick={() => onNavigate?.(ev.nav)}>
      <span className="cc-event-ts">{ev.ts}</span>
      <span className={`cc-event-sev sev-${c}`}>{ev.sev}</span>
      <span className="cc-event-tag">{ev.tag}</span>
      <span className="cc-event-msg">{ev.msg}</span>
    </button>
  );
}

function PanelHead({ icon, title, sub, right }) {
  return (
    <div className="cc-ph">
      <span className="cc-ph-icon">{icon}</span>
      <div className="cc-ph-text">
        <h3>{title}</h3>
        {sub && <p>{sub}</p>}
      </div>
      {right && <span className="cc-ph-right">{right}</span>}
    </div>
  );
}

export default function ControlCenter({ onNavigate }) {
  const mounted = useMounted();
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const clock = now.toLocaleTimeString('ko-KR', { hour12: false });
  const today = now.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });

  const runCount = CC_LINES.filter((l) => l.status === 'run').length;

  // Pareto: cumulative %
  const total = CC_DEFECTS.reduce((s, d) => s + d.count, 0);
  let cum = 0;
  const pareto = CC_DEFECTS.map((d) => {
    cum += d.count;
    return { ...d, cumPct: Math.round((cum / total) * 100) };
  });

  return (
    <div className="cc">
      {/* ── title bar ── */}
      <div className="cc-titlebar">
        <div className="cc-title">
          <span className="cc-title-icon"><Factory size={20} strokeWidth={2} /></span>
          <div>
            <h2>생산 관제센터 <span>Production Control Center</span></h2>
            <p>실시간 설비 · 품질 · 생산 통합 모니터링</p>
          </div>
        </div>
        <div className="cc-titlebar-right">
          <span className="cc-live"><i /> LIVE</span>
          <span className="cc-conn"><Wifi size={13} strokeWidth={2.2} /> OPC-UA 연결됨</span>
          <span className="cc-shift">{CC_SHIFT.shift} · {CC_SHIFT.window}</span>
          <span className="cc-clock"><Clock size={14} strokeWidth={2.2} /> {today} {clock}</span>
        </div>
      </div>

      {/* ── KPI strip ── */}
      <div className="cc-kpis">
        {CC_KPIS.map((k) => <KpiCard key={k.id} kpi={k} />)}
      </div>

      {/* ── main grid ── */}
      <div className="cc-main">
        <section className="cc-panel cc-gauge-panel">
          <PanelHead icon={<Gauge size={15} />} title="설비 종합효율 OEE" sub="Availability × Performance × Quality" />
          <RingGauge value={CC_OEE.oee} label="OEE" />
          <div className="cc-apq">
            {CC_OEE.parts.map((p) => <ApqBar key={p.key} part={p} mounted={mounted} />)}
          </div>
        </section>

        <section className="cc-panel cc-lines-panel">
          <PanelHead
            icon={<Activity size={15} />} title="공정별 가동 현황" sub="라인 상태 · OEE"
            right={<span>{runCount} / {CC_LINES.length} 가동</span>}
          />
          <div className="cc-lines">
            {CC_LINES.map((l) => <LineRow key={l.id} line={l} onNavigate={onNavigate} />)}
          </div>
        </section>

        <section className="cc-panel cc-events-panel">
          <PanelHead
            icon={<Bell size={15} />} title="실시간 이벤트" sub="알람 · 공정 메시지"
            right={<span className="cc-live-sm"><i /> LIVE</span>}
          />
          <div className="cc-events">
            {CC_EVENTS.map((e, i) => <EventRow key={i} ev={e} onNavigate={onNavigate} />)}
          </div>
        </section>

        <section className="cc-panel cc-trend-panel">
          <PanelHead icon={<TrendingUp size={15} />} title="시간대별 생산량 / 불량률" sub="주간조 06:00 – 17:00" />
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={CC_HOURLY} margin={{ top: 8, right: 6, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" vertical={false} />
              <XAxis dataKey="t" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
              <YAxis yAxisId="left" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} domain={[0, 1.2]} unit="%" />
              <Tooltip contentStyle={TIP} cursor={{ fill: 'rgba(148,163,184,0.10)' }} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 4 }} iconType="circle" />
              <Bar yAxisId="left" dataKey="output" name="생산량 (EA)" radius={[4, 4, 0, 0]} barSize={20}>
                {CC_HOURLY.map((e, i) => <Cell key={i} fill={e.defect >= 0.8 ? COLOR.red : COLOR.cyan} />)}
              </Bar>
              <Line yAxisId="right" type="monotone" dataKey="defect" name="불량률 (%)" stroke={COLOR.amber} strokeWidth={2.4} dot={{ r: 3, fill: COLOR.amber }} activeDot={{ r: 5 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </section>
      </div>

      {/* ── bottom ── */}
      <div className="cc-bottom">
        <section className="cc-panel">
          <PanelHead icon={<Sigma size={15} />} title="불량 유형 Pareto" sub="상위 항목 집중 관리 (누적 %)" />
          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart data={pareto} margin={{ top: 8, right: 6, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" vertical={false} />
              <XAxis dataKey="type" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} interval={0} />
              <YAxis yAxisId="left" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} unit="%" />
              <Tooltip contentStyle={TIP} cursor={{ fill: 'rgba(148,163,184,0.10)' }} />
              <Bar yAxisId="left" dataKey="count" name="발생 건수" radius={[4, 4, 0, 0]} barSize={28}>
                {pareto.map((d, i) => <Cell key={i} fill={i === 0 ? COLOR.red : COLOR.cyan} />)}
              </Bar>
              <Line yAxisId="right" type="monotone" dataKey="cumPct" name="누적 %" stroke="#7c3aed" strokeWidth={2.2} dot={{ r: 3, fill: '#7c3aed' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </section>

        <section className="cc-panel cc-donut-panel">
          <PanelHead icon={<Factory size={15} />} title="라인 상태 분포" sub="가동 / 보류 / 정지" />
          <div className="cc-donut-wrap">
            <ResponsiveContainer width="100%" height={196}>
              <PieChart>
                <Pie data={CC_STATUS_MIX} dataKey="value" nameKey="label" innerRadius={52} outerRadius={78} paddingAngle={2} stroke="none" startAngle={90} endAngle={-270}>
                  {CC_STATUS_MIX.map((s) => <Cell key={s.key} fill={s.color} />)}
                </Pie>
                <Tooltip contentStyle={TIP} />
              </PieChart>
            </ResponsiveContainer>
            <div className="cc-donut-center"><b>{CC_LINES.length}</b><span>라인</span></div>
          </div>
          <div className="cc-donut-legend">
            {CC_STATUS_MIX.map((s) => (
              <span key={s.key}><i style={{ background: s.color }} />{s.label} {s.value}</span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
