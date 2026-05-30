import { motion } from 'framer-motion';
import {
  Network, Radio, Workflow, Database, Server, Brain, Zap, GitBranch,
  HardDrive, BarChart3, Activity, Bell, Factory,
} from 'lucide-react';

const SERVICE_COLORS = {
  network: '#ff9900',
  iot: '#3b82f6',
  etl: '#a855f7',
  db: '#2563eb',
  edge: '#06b6d4',
  ml: '#22c55e',
  compute: '#f97316',
  graph: '#8b5cf6',
  storage: '#10b981',
  viz: '#ec4899',
  stream: '#06b6d4',
  notify: '#ef4444',
};

const SERVICE_ICONS = {
  network: Network,
  iot: Radio,
  etl: Workflow,
  db: Database,
  edge: Server,
  ml: Brain,
  compute: Zap,
  graph: GitBranch,
  storage: HardDrive,
  viz: BarChart3,
  stream: Activity,
  notify: Bell,
};

export default function ServiceNode({ node, active, alert, onClick }) {
  const isAws = node.type === 'aws';
  const color = isAws ? SERVICE_COLORS[node.service] || '#ff9900' : '#64748b';
  const Icon = isAws ? (SERVICE_ICONS[node.service] || Zap) : Factory;

  return (
    <motion.button
      type="button"
      className={`service-node ${isAws ? 'aws' : 'external'} ${active ? 'active' : ''} ${alert ? 'alert' : ''}`}
      onClick={onClick}
      layout
      initial={false}
      whileHover={{ y: -3 }}
      animate={{
        scale: active ? 1.05 : 1,
        boxShadow: active
          ? `0 0 0 2px ${color}, 0 8px 32px ${color}35`
          : alert
            ? '0 0 0 2px #ef4444, 0 8px 28px rgba(239,68,68,0.25)'
            : '0 4px 16px rgba(0,0,0,0.15)',
      }}
      transition={{ duration: 0.28, type: 'spring', stiffness: 400, damping: 28 }}
      style={{ '--accent': color }}
    >
      <span className="node-icon" style={{ background: `linear-gradient(145deg, ${color}28, ${color}10)`, color, borderColor: `${color}40` }}>
        <Icon size={18} strokeWidth={2} />
      </span>
      <span className="node-label">{node.label}</span>
      <span className="node-sub">{node.sub}</span>
      {active && <span className="pulse-ring" style={{ borderColor: color }} />}
      {active && <span className="data-pulse" style={{ background: color }} />}
    </motion.button>
  );
}
