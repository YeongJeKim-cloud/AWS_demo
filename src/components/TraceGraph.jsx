import { motion } from 'framer-motion';
import { TRACE_GRAPH } from '../data/scenarios';

const TYPE_STYLE = {
  fastener: { color: '#22c55e' },
  relay: { color: '#ef4444' },
  module: { color: '#f59e0b' },
  vehicle: { color: '#06b6d4' },
  owner: { color: '#a78bfa' },
};

export default function TraceGraph({
  highlightLots = [],
  highlightNodes = [],
  highlightPath = [],
  activePathIndex = -1,
}) {
  const cols = { fastener: 0, relay: 0, module: 1, vehicle: 2, owner: 3 };
  const positions = {};
  const byCol = [[], [], [], []];

  TRACE_GRAPH.nodes.forEach((n) => {
    byCol[cols[n.type]].push(n);
  });

  byCol.forEach((col, ci) => {
    col.forEach((n, ri) => {
      positions[n.id] = { x: ci * 180 + 40, y: ri * 72 + 40 };
    });
  });

  const pathNodeSet = new Set(highlightPath.slice(0, activePathIndex + 1));
  const edgeLookup = new Set(TRACE_GRAPH.edges.map(([a, b]) => `${a}-${b}`));

  const isEdgeOnPath = (from, to) => {
    if (activePathIndex < 0 || highlightPath.length < 2) return false;
    for (let i = 0; i < activePathIndex && i < highlightPath.length - 1; i += 1) {
      const a = highlightPath[i];
      const b = highlightPath[i + 1];
      if (a === from && b === to && edgeLookup.has(`${from}-${to}`)) return true;
    }
    return false;
  };

  const isNodeHighlighted = (n) =>
    highlightNodes.includes(n.id)
    || highlightLots.some((l) => n.label.includes(l))
    || pathNodeSet.has(n.id);

  const isEdgeHighlighted = (from, to) => {
    if (isEdgeOnPath(from, to)) return true;
    if (!highlightLots.length && !highlightNodes.length) return false;
    return highlightNodes.includes(from) && highlightNodes.includes(to);
  };

  return (
    <div className="trace-graph">
      <div className="trace-labels">
        <span>Lot</span>
        <span>HVDB</span>
        <span>VIN</span>
        <span>Owner</span>
      </div>
      <svg viewBox="0 0 720 280" className="trace-svg">
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="#475569" />
          </marker>
          <marker id="arrow-hot" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="#ef4444" />
          </marker>
        </defs>
        {TRACE_GRAPH.edges.map(([from, to]) => {
          const a = positions[from];
          const b = positions[to];
          if (!a || !b) return null;
          const hot = isEdgeHighlighted(from, to);
          return (
            <motion.line
              key={`${from}-${to}`}
              x1={a.x + 70}
              y1={a.y + 20}
              x2={b.x}
              y2={b.y + 20}
              stroke={hot ? '#ef4444' : '#94a3b8'}
              strokeWidth={hot ? 2.5 : 1}
              markerEnd={hot ? 'url(#arrow-hot)' : 'url(#arrow)'}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: hot ? 1 : 0.45 }}
              transition={{ duration: 0.5 }}
            />
          );
        })}
        {TRACE_GRAPH.nodes.map((n) => {
          const pos = positions[n.id];
          const style = TYPE_STYLE[n.type];
          const hot = isNodeHighlighted(n);
          const isPathActive = pathNodeSet.has(n.id);
          return (
            <motion.g
              key={n.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: isPathActive ? 1.06 : 1 }}
              transform={`translate(${pos.x}, ${pos.y})`}
            >
              <rect
                width="130"
                height="40"
                rx="8"
                fill={hot ? 'rgba(239,68,68,0.12)' : '#ffffff'}
                stroke={hot ? '#ef4444' : style.color}
                strokeWidth={hot ? 2.5 : 1}
              />
              {isPathActive && (
                <rect width="130" height="40" rx="8" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.6">
                  <animate attributeName="opacity" values="0.6;0.2;0.6" dur="1.2s" repeatCount="indefinite" />
                </rect>
              )}
              <text x="65" y="25" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="500">
                {n.label}
              </text>
            </motion.g>
          );
        })}
      </svg>
      <p className="trace-caption">Lot → HVDB module → VIN → owner</p>
    </div>
  );
}
