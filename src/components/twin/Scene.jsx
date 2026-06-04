import { Component, Suspense, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Edges, Grid, Html, OrbitControls } from '@react-three/drei';
import { AlertTriangle } from 'lucide-react';
import { TWIN_BUILDINGS, TWIN_FILLER, TWIN_MACHINES, TWIN_ROADS, TWIN_TANKS } from '../../data/twin';

export const STATUS_LABEL = { run: 'In Service', hold: 'Standby', alarm: 'Offline' };

export const edgeColor = (o) => {
  if (o.status === 'alarm' || o.alarm) return '#ff4d5d';
  if (o.status === 'hold' || o.hold) return '#ffb22a';
  if (o.tone === 'hq') return '#86f7ff';
  return '#2fe8ff';
};

let winTexture = null;

function getWinTexture() {
  if (winTexture) return winTexture;

  const c = document.createElement('canvas');
  c.width = 96;
  c.height = 128;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#020712';
  ctx.fillRect(0, 0, c.width, c.height);

  for (let y = 8; y <= 116; y += 10) {
    for (let x = 8; x <= 84; x += 11) {
      const r = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1;
      const lit = r > 0.38;
      ctx.fillStyle = lit ? `rgba(35, 238, 255, ${0.42 + r * 0.5})` : 'rgba(18, 70, 96, 0.25)';
      ctx.fillRect(x, y, 5, 5);
    }
  }

  winTexture = new THREE.CanvasTexture(c);
  winTexture.wrapS = THREE.RepeatWrapping;
  winTexture.wrapT = THREE.RepeatWrapping;
  return winTexture;
}

function useWinTex(w, h) {
  return useMemo(() => {
    const t = getWinTexture().clone();
    t.needsUpdate = true;
    t.repeat.set(Math.max(2, Math.round(w * 1.6)), Math.max(2, Math.round(h * 1.05)));
    return t;
  }, [w, h]);
}

class TwinErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { err: false };
  }

  static getDerivedStateFromError() {
    return { err: true };
  }

  componentDidCatch(e) {
    console.error('[FactoryTwin] 3D render failed:', e);
  }

  render() {
    return this.state.err ? this.props.fallback : this.props.children;
  }
}

function GroundRing({ size, color, pulse }) {
  const ref = useRef();

  useFrame((s) => {
    if (!ref.current || !pulse) return;
    const o = 0.5 + 0.5 * Math.sin(s.clock.elapsedTime * 3.2);
    const k = 1 + 0.42 * o;
    ref.current.scale.set(k, k, k);
    ref.current.material.opacity = 0.5 - 0.34 * o;
  });

  const r = size * 0.72;
  return (
    <mesh ref={ref} position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[r, r + 0.14, 72]} />
      <meshBasicMaterial color={color} transparent opacity={0.46} side={THREE.DoubleSide} />
    </mesh>
  );
}

function AlarmBeacon({ top }) {
  const ref = useRef();

  useFrame((s) => {
    if (!ref.current) return;
    const o = 0.5 + 0.5 * Math.sin(s.clock.elapsedTime * 5);
    ref.current.scale.set(1 + 0.6 * o, 1 + 0.6 * o, 1 + 0.6 * o);
    ref.current.material.opacity = 0.68 - 0.46 * o;
  });

  const y = top + 1.08;
  return (
    <group>
      <mesh position={[0, top + 0.5, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 1.0, 8]} />
        <meshBasicMaterial color="#ff4d5d" />
      </mesh>
      <mesh position={[0, y, 0]}>
        <octahedronGeometry args={[0.28, 0]} />
        <meshBasicMaterial color="#ff704f" />
      </mesh>
      <mesh ref={ref} position={[0, y, 0]}>
        <sphereGeometry args={[0.42, 18, 18]} />
        <meshBasicMaterial color="#ff4d5d" transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

function Tag({ color, label, sub, alarm, selected, onActivate }) {
  const clickable = Boolean(onActivate);
  return (
    <div
      className={`twin-tag ${alarm ? 'alarm' : ''} ${selected ? 'sel' : ''} ${clickable ? 'clickable' : ''}`}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={(e) => {
        e.stopPropagation();
        onActivate?.();
      }}
      onKeyDown={(e) => {
        if (!clickable) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          onActivate();
        }
      }}
    >
      <i className="twin-tag-dot" style={{ background: color }} />
      <span>{label}</span>
      {sub && <em>{sub}</em>}
      {alarm && <b>!</b>}
    </div>
  );
}

function Building({ b, selected, onSelect }) {
  const [hover, setHover] = useState(false);
  const edge = edgeColor(b);
  const active = selected || hover;
  const tex = useWinTex(b.size[0], b.height);
  const alertTagClickable = Boolean(b.alarm || b.status === 'alarm');
  const showLabel = b.label !== false;
  const bodyColor = b.color || (b.tone === 'hq' ? '#123d58' : '#123556');
  const roofColor = b.roofColor || '#cfe8ff';
  const sideWindowColor = b.windowColor || '#51dfff';

  return (
    <group position={[b.pos[0], 0, b.pos[1]]}>
      <mesh
        position={[0, b.height / 2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(b);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHover(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHover(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <boxGeometry args={[b.size[0], b.height, b.size[1]]} />
        <meshStandardMaterial
          color={bodyColor}
          metalness={0.58}
          roughness={0.35}
          emissive={edge}
          emissiveMap={tex}
          emissiveIntensity={active ? (b.activeGlow ?? 1.35) : (b.glow ?? 0.72)}
        />
        <Edges threshold={15} color={edge} />
      </mesh>
      {b.windowBand && (
        <>
          <mesh position={[0, b.height * 0.48, b.size[1] / 2 + 0.014]}>
            <planeGeometry args={[b.size[0] * 0.82, Math.max(0.18, b.height * 0.14)]} />
            <meshBasicMaterial color={sideWindowColor} transparent opacity={active ? 0.78 : 0.54} />
          </mesh>
          <mesh position={[b.size[0] / 2 + 0.014, b.height * 0.48, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[b.size[1] * 0.74, Math.max(0.18, b.height * 0.14)]} />
            <meshBasicMaterial color={sideWindowColor} transparent opacity={active ? 0.72 : 0.48} />
          </mesh>
        </>
      )}
      {b.roof && (
        <>
          <mesh position={[0, b.height + 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[b.size[0] * 0.96, b.size[1] * 0.94]} />
            <meshStandardMaterial
              color={roofColor}
              metalness={0.22}
              roughness={0.42}
              emissive="#8edfff"
              emissiveIntensity={active ? 0.28 : 0.12}
            />
          </mesh>
          <mesh position={[0, b.height + 0.09, 0]}>
            <boxGeometry args={[b.size[0] * 0.98, 0.06, 0.08]} />
            <meshBasicMaterial color="#e7f7ff" transparent opacity={0.64} />
          </mesh>
        </>
      )}
      <mesh position={[0, b.height + 0.035, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[b.size[0] * 0.92, b.size[1] * 0.92]} />
        <meshBasicMaterial color={edge} transparent opacity={active ? 0.42 : 0.22} />
      </mesh>
      {(b.alarm || selected) && <GroundRing size={Math.max(b.size[0], b.size[1])} color={edge} pulse={b.alarm} />}
      {b.alarm && <AlarmBeacon top={b.height} />}
      {showLabel && (
        <Html
          center
          position={[0, b.height + (b.alarm ? 1.62 : 0.8), 0]}
          zIndexRange={[18, 0]}
          style={{ pointerEvents: alertTagClickable ? 'auto' : 'none' }}
        >
          <Tag
            color={edge}
            label={b.name}
            sub={b.en}
            alarm={b.alarm}
            selected={selected}
            onActivate={alertTagClickable ? () => onSelect(b) : undefined}
          />
        </Html>
      )}
    </group>
  );
}

function RackRow({ m, selected, onSelect }) {
  const [hover, setHover] = useState(false);
  const color = edgeColor(m);
  const w = 3.8;
  const d = 0.86;
  const h = 1.55;
  const tex = useWinTex(w, h);

  return (
    <group position={[m.cx, 0, m.cz]}>
      <mesh
        position={[0, h / 2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(m);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHover(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHover(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          color="#0a1524"
          metalness={0.7}
          roughness={0.38}
          emissive={color}
          emissiveMap={tex}
          emissiveIntensity={selected || hover ? 1.4 : 0.9}
        />
        <Edges threshold={12} color={color} />
      </mesh>

      <mesh position={[-w / 2 - 0.32, h / 2, 0]}>
        <boxGeometry args={[0.34, h * 1.05, d * 1.08]} />
        <meshStandardMaterial color="#cfd8de" metalness={0.4} roughness={0.5} emissive="#a9f8ff" emissiveIntensity={0.06} />
      </mesh>
      <mesh position={[w / 2 + 0.32, h / 2, 0]}>
        <boxGeometry args={[0.34, h * 1.05, d * 1.08]} />
        <meshStandardMaterial color="#cfd8de" metalness={0.4} roughness={0.5} emissive="#a9f8ff" emissiveIntensity={0.06} />
      </mesh>

      {m.alarm && <AlarmBeacon top={h} />}
      {(m.alarm || selected) && <GroundRing size={Math.max(w, d)} color={color} pulse={m.alarm} />}
      <Html center position={[0, h + 0.56, 0]} zIndexRange={[18, 0]} style={{ pointerEvents: 'none' }}>
        <Tag color={color} label={m.label} alarm={m.alarm} selected={selected} />
      </Html>
    </group>
  );
}

function Roads() {
  return (
    <group>
      {TWIN_ROADS.map((r, i) => (
        <mesh key={i} position={[r.pos[0], 0.018, r.pos[1]]} rotation={[-Math.PI / 2, 0, r.rot || 0]}>
          <planeGeometry args={[r.size[0], r.size[1]]} />
          <meshBasicMaterial color={r.c || '#2fe8ff'} transparent opacity={0.68} />
        </mesh>
      ))}
    </group>
  );
}

function FillerBlock({ f }) {
  const tex = useWinTex(f[2], f[4]);
  return (
    <mesh position={[f[0], f[4] / 2, f[1]]}>
      <boxGeometry args={[f[2], f[4], f[3]]} />
      <meshStandardMaterial color="#0b2038" metalness={0.6} roughness={0.35} emissive="#21c6f0" emissiveMap={tex} emissiveIntensity={0.72} />
      <Edges threshold={15} color="#1a83ba" />
    </mesh>
  );
}

function Filler() {
  return <group>{TWIN_FILLER.map((f, i) => <FillerBlock key={i} f={f} />)}</group>;
}

function fieldBlocks() {
  const out = [];
  for (let gx = -18; gx <= 18; gx += 2.8) {
    for (let gz = -15; gz <= -8.6; gz += 2.4) {
      const r = Math.abs(Math.sin(gx * 12.9898 + gz * 4.1414) * 43758.5453) % 1;
      const r2 = Math.abs(Math.sin(gx * 7.137 + gz * 31.07) * 1234.55) % 1;
      const h = 1.2 + r * 2.7 + (r2 > 0.82 ? 2.2 : 0);
      out.push([gx + (r - 0.5) * 0.46, gz + (r2 - 0.5) * 0.46, 1.3 + r2 * 0.62, 1.3 + r * 0.62, h]);
    }
  }
  for (let side of [-1, 1]) {
    for (let gx = 11.2 * side; Math.abs(gx) <= 19; gx += 2.8 * side) {
      for (let gz = -6.2; gz <= 7.2; gz += 2.7) {
        const r = Math.abs(Math.sin(gx * 9.61 + gz * 5.37) * 23451.77) % 1;
        const r2 = Math.abs(Math.sin(gx * 2.81 + gz * 19.31) * 9821.13) % 1;
        const h = 0.7 + r * 1.5 + (r2 > 0.9 ? 1.2 : 0);
        out.push([gx + (r - 0.5) * 0.34, gz + (r2 - 0.5) * 0.34, 1.2 + r2 * 0.5, 1.2 + r * 0.5, h]);
      }
    }
  }
  return out;
}

function Field() {
  const blocks = useMemo(fieldBlocks, []);

  return (
    <group>
      {blocks.map((f, i) => (
        <mesh key={i} position={[f[0], f[4] / 2, f[1]]}>
          <boxGeometry args={[f[2], f[4], f[3]]} />
          <meshStandardMaterial
            color="#061a30"
            metalness={0.48}
            roughness={0.58}
            emissive="#0d5f94"
            emissiveIntensity={0.12}
            transparent
            opacity={0.42}
          />
          <Edges threshold={15} color="#0b6fa3" />
        </mesh>
      ))}
    </group>
  );
}

function Tanks() {
  return (
    <group>
      {TWIN_TANKS.map((t, i) => (
        <group key={i} position={[t[0], 0, t[1]]}>
          <mesh position={[0, t[3] / 2, 0]}>
            <cylinderGeometry args={[t[2], t[2], t[3], 28]} />
            <meshStandardMaterial color="#13263f" metalness={0.5} roughness={0.4} emissive="#2fe8ff" emissiveIntensity={0.14} />
            <Edges threshold={15} color="#2fe8ff" />
          </mesh>
          <mesh position={[0, t[3] + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[t[2], 28]} />
            <meshBasicMaterial color="#2fe8ff" transparent opacity={0.18} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function DeviceFloor() {
  return (
    <group>
      <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14.5, 9.5]} />
        <meshBasicMaterial color="#050b14" transparent opacity={0.58} />
      </mesh>
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.2, 2.45, 92]} />
        <meshBasicMaterial color="#ff4d5d" transparent opacity={0.28} side={THREE.DoubleSide} />
      </mesh>
      {[-5.2, 5.2].map((x) => (
        <mesh key={x} position={[x, 0.04, 2.8]} rotation={[-Math.PI / 2, 0, 0]}>
          <boxGeometry args={[2.5, 1.1, 0.04]} />
          <meshBasicMaterial color="#2fe8ff" transparent opacity={0.32} />
        </mesh>
      ))}
    </group>
  );
}

export function CampusScene({ selectedId, onSelect }) {
  return (
    <>
      <Field />
      <Roads />
      <Filler />
      <Tanks />
      {TWIN_BUILDINGS.map((b) => (
        <Building key={b.id} b={b} selected={selectedId === b.id} onSelect={onSelect} />
      ))}
    </>
  );
}

export function DeviceScene({ selectedId, onSelect }) {
  return (
    <>
      <DeviceFloor />
      {TWIN_MACHINES.map((m) => (
        <RackRow key={m.id} m={m} selected={selectedId === m.id} onSelect={onSelect} />
      ))}
    </>
  );
}

export function TwinCanvas({ camera, target = [0, 1, 0], onNavigate, children }) {
  const fallback = (
    <div className="twin-fallback">
      <AlertTriangle size={30} />
      <h3>3D view is unavailable</h3>
      <p>This browser or device cannot start WebGL.</p>
      <button type="button" className="btn-primary" onClick={() => onNavigate?.('dashboard')}>Open control center</button>
    </div>
  );

  return (
    <TwinErrorBoundary fallback={fallback}>
      <Canvas className="twin-canvas" camera={camera} dpr={[1, 1.75]} gl={{ preserveDrawingBuffer: true }}>
        <Suspense fallback={null}>
          <color attach="background" args={['#03070f']} />
          <fog attach="fog" args={['#03070f', 26, 56]} />
          <ambientLight intensity={0.55} />
          <hemisphereLight args={['#9db8ff', '#05070f', 0.42]} />
          <directionalLight position={[12, 18, 8]} intensity={1.1} />
          <directionalLight position={[-10, 8, -6]} intensity={0.45} color="#178dff" />
          <Grid
            args={[130, 130]}
            cellSize={1}
            cellThickness={0.45}
            cellColor="#173b58"
            sectionSize={5}
            sectionThickness={1.2}
            sectionColor="#2fe8ff"
            fadeDistance={78}
            fadeStrength={1.55}
            infiniteGrid
          />
          {children}
          <OrbitControls
            target={target}
            enablePan={false}
            enableDamping
            dampingFactor={0.08}
            minDistance={8}
            maxDistance={46}
            maxPolarAngle={Math.PI / 2.08}
            minPolarAngle={0.18}
          />
        </Suspense>
      </Canvas>
    </TwinErrorBoundary>
  );
}
