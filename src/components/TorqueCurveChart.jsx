import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TORQUE_CURVES } from '../data/scenarios';

const TOOLTIP_STYLE = {
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  color: '#0f172a',
  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
};

const SCOPE_TOOLTIP_STYLE = {
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 6,
  color: '#1e293b',
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: 11,
  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
};

const GRID_STROKE = 'rgba(148, 163, 184, 0.35)';
const SCOPE_GRID = 'rgba(148, 163, 184, 0.25)';
function buildData(curveKey) {
  const curve = TORQUE_CURVES[curveKey];
  if (!curve) return [];
  return curve.points.map((torque, i) => ({
    angle: i * 10,
    torque,
  }));
}

export default function TorqueCurveChart({ activeCurve = 'normal', compareAll = false, variant = 'light' }) {
  const scope = variant === 'scope';
  if (compareAll) {
    const data = TORQUE_CURVES.normal.points.map((_, i) => ({
      angle: i * 10,
      normal: TORQUE_CURVES.normal.points[i],
      crossThread: TORQUE_CURVES.crossThread.points[i],
      overStretch: TORQUE_CURVES.overStretch.points[i],
    }));
    return (
      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
            <XAxis dataKey="angle" stroke="#64748b" fontSize={11} label={{ value: 'Rotation (°)', position: 'bottom', fill: '#64748b', fontSize: 11 }} />
            <YAxis stroke="#64748b" fontSize={11} domain={[0, 55]} label={{ value: 'Torque (Nm)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Legend />
            <Line type="monotone" dataKey="normal" name="Normal" stroke="#22c55e" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="crossThread" name="Cross-thread" stroke="#ef4444" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="overStretch" name="Over-stretch" stroke="#f59e0b" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  const curve = TORQUE_CURVES[activeCurve];
  const data = buildData(activeCurve);
  const lineColor = scope
    ? (activeCurve === 'normal' ? '#16a34a' : activeCurve === 'crossThread' ? '#dc2626' : '#d97706')
    : curve.color;

  return (
    <div className="chart-wrap">
      {!scope && (
        <div className="chart-header">
          <span className="badge" style={{ background: `${curve.color}22`, color: curve.color, border: `1px solid ${curve.color}55` }}>
            {curve.label}
          </span>
          <p className="chart-desc">{curve.desc}</p>
        </div>
      )}
      <ResponsiveContainer width="100%" height={scope ? 150 : 220}>
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke={scope ? SCOPE_GRID : GRID_STROKE} />
          <XAxis dataKey="angle" stroke={scope ? '#94a3b8' : '#64748b'} fontSize={10} tick={{ fontFamily: scope ? 'JetBrains Mono, monospace' : undefined }} />
          <YAxis stroke={scope ? '#94a3b8' : '#64748b'} fontSize={10} domain={[0, 55]} tick={{ fontFamily: scope ? 'JetBrains Mono, monospace' : undefined }} />
          <Tooltip contentStyle={scope ? SCOPE_TOOLTIP_STYLE : TOOLTIP_STYLE} cursor={{ stroke: '#cbd5e1' }} />
          <Line
            type="monotone"
            dataKey="torque"
            name="Torque"
            stroke={lineColor}
            strokeWidth={scope ? 2.2 : 2.5}
            dot={scope ? false : { r: 3 }}
            isAnimationActive
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
