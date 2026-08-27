import { useReducedMotion } from "framer-motion";

/**
 * CircuitNetwork — Animated nodes connected by lines, like a PCB trace or signal network.
 *
 * Nodes are positioned in a semi-random grid. Lines connect nearby nodes.
 * Pulses of light travel along the connections. Looks like a circuit board
 * or data network — technical and lab-appropriate.
 */

interface Node {
  x: number;
  y: number;
  size: number;
  delay: number;
}

function seededPos(seed: number, max: number) {
  return ((Math.sin(seed * 127.1 + seed * 311.7) * 43758.5453) % 1 + 1) % 1 * max;
}

export default function CircuitNetwork({
  className = "",
  nodeCount = 18,
  lineColor = "rgba(26, 108, 245, 0.08)",
  nodeColor = "rgba(26, 108, 245, 0.5)",
  pulseColor = "rgba(26, 108, 245, 0.8)",
}: {
  className?: string;
  nodeCount?: number;
  lineColor?: string;
  nodeColor?: string;
  pulseColor?: string;
}) {
  const reducedMotion = useReducedMotion();

  // Generate deterministic node positions
  const nodes: Node[] = Array.from({ length: nodeCount }, (_, i) => ({
    x: seededPos(i * 3 + 1, 100),
    y: seededPos(i * 7 + 3, 100),
    size: 2 + (i % 3),
    delay: (i * 1.3) % 8,
  }));

  // Generate connections between nearby nodes
  const connections: { from: number; to: number; distance: number }[] = [];
  const maxDist = 28;
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDist) {
        connections.push({ from: i, to: j, distance: dist });
      }
    }
  }

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Connection lines */}
        {connections.map((conn, i) => (
          <line
            key={`line-${i}`}
            x1={nodes[conn.from].x}
            y1={nodes[conn.from].y}
            x2={nodes[conn.to].x}
            y2={nodes[conn.to].y}
            stroke={lineColor}
            strokeWidth="0.15"
          />
        ))}

        {/* Pulse traveling along connections */}
        {!reducedMotion &&
          connections.slice(0, 8).map((conn, i) => (
            <circle key={`pulse-${i}`} r="0.4" fill={pulseColor}>
              <animateMotion
                dur={`${3 + i * 0.8}s`}
                repeatCount="indefinite"
                begin={`${i * 0.7}s`}
                path={`M${nodes[conn.from].x},${nodes[conn.from].y} L${nodes[conn.to].x},${nodes[conn.to].y}`}
              />
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                dur={`${3 + i * 0.8}s`}
                repeatCount="indefinite"
                begin={`${i * 0.7}s`}
              />
            </circle>
          ))}

        {/* Nodes */}
        {nodes.map((node, i) => (
          <g key={`node-${i}`}>
            {/* Glow halo */}
            <circle
              cx={node.x}
              cy={node.y}
              r={node.size * 1.5}
              fill={nodeColor}
              opacity="0.2"
              style={
                reducedMotion
                  ? undefined
                  : {
                      animation: `circuit-pulse ${2.5 + (i % 3) * 0.8}s ease-in-out infinite`,
                      animationDelay: `${node.delay}s`,
                    }
              }
            />
            {/* Core dot */}
            <circle cx={node.x} cy={node.y} r={node.size * 0.4} fill={nodeColor} />
          </g>
        ))}
      </svg>
    </div>
  );
}
