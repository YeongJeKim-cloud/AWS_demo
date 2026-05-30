import ServiceNode from './ServiceNode';
import './ServiceNode.css';

function FlowConnector({ active }) {
  return (
    <div className={`flow-connector ${active ? 'active' : ''}`}>
      <div className={`flow-connector-line ${active ? 'active' : ''}`} />
      <span className="flow-connector-arrow" aria-hidden>›</span>
    </div>
  );
}

export default function ArchitectureFlow({ flow, activeNode, alertNode, onNodeClick, label = 'Data flow' }) {
  return (
    <div className="flow-canvas">
      <span className="flow-canvas-label">{label}</span>
      <div className="flow-diagram">
        {flow.map((node, i) => (
          <span key={node.id} style={{ display: 'contents' }}>
            {i > 0 && (
              <FlowConnector
                active={activeNode === node.id || activeNode === flow[i - 1]?.id}
              />
            )}
            <ServiceNode
              node={node}
              active={activeNode === node.id}
              alert={alertNode === node.id}
              onClick={() => onNodeClick?.(node)}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
