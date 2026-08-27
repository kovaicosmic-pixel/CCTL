import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Real WebGL anechoic chamber, ported from the reference build. Absorber pyramids are drawn as
 * instanced cones on five surfaces; the camera dollies down the chamber as the hero scene
 * scrolls and drifts with the pointer.
 */

type WallProps = {
  width: number;
  height: number;
  cols: number;
  rows: number;
  position: [number, number, number];
  rotation?: [number, number, number];
  tone: number;
};

function AbsorberWall({
  width,
  height,
  cols,
  rows,
  position,
  rotation = [0, 0, 0],
  tone,
}: WallProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const stepX = width / cols;
  const stepY = height / rows;
  const depth = stepX * 1.9;

  const geometry = useMemo(() => new THREE.ConeGeometry(stepX * 0.72, depth, 4, 1), [stepX, depth]);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    let i = 0;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        dummy.position.set(
          -width / 2 + stepX * (x + 0.5),
          -height / 2 + stepY * (y + 0.5),
          depth / 2,
        );
        dummy.rotation.set(Math.PI / 2, 0, Math.PI / 4);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        const n = 0.62 + Math.random() * 0.38;
        color.setHSL(0.6, 0.06, tone * n);
        mesh.setColorAt(i, color);
        i++;
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [cols, rows, width, height, stepX, stepY, depth, tone]);

  return (
    <group position={position} rotation={rotation}>
      <instancedMesh ref={meshRef} args={[geometry, undefined, cols * rows]} castShadow={false}>
        <meshStandardMaterial roughness={0.95} metalness={0.02} flatShading />
      </instancedMesh>
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color="#dfe4ec" roughness={1} />
      </mesh>
    </group>
  );
}

function WaveRings() {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    group.current?.children.forEach((child, i) => {
      const phase = (t * 0.35 + i / 4) % 1;
      const s = 0.4 + phase * 7;
      child.scale.set(s, s, s);
      const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      mat.opacity = (1 - phase) * 0.5;
    });
  });
  return (
    <group ref={group} position={[0, -1.1, -1]} rotation={[-Math.PI / 2, 0, 0]}>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i}>
          <ringGeometry args={[0.98, 1, 96]} />
          <meshBasicMaterial
            color="#1a6cf5"
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function TurntableDUT() {
  const g = useRef<THREE.Group>(null);
  useFrame((_s, d) => {
    if (g.current) g.current.rotation.y += d * 0.35;
  });
  return (
    <group position={[0, -1.1, -1]}>
      {/* turntable */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.5, 64]} />
        <meshStandardMaterial color="#c9d1de" roughness={0.5} metalness={0.35} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <ringGeometry args={[1.44, 1.5, 64]} />
        <meshBasicMaterial color="#1a6cf5" transparent opacity={0.7} />
      </mesh>
      <group ref={g}>
        <mesh position={[0, 0.35, 0]} castShadow>
          <boxGeometry args={[1.1, 0.7, 0.8]} />
          <meshStandardMaterial color="#8e9bb0" roughness={0.35} metalness={0.6} />
        </mesh>
        <mesh position={[0, 0.72, 0]}>
          <boxGeometry args={[1.14, 0.04, 0.84]} />
          <meshStandardMaterial
            color="#1a6cf5"
            emissive="#1a6cf5"
            emissiveIntensity={0.6}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[0.35, 1.05, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.7, 8]} />
          <meshStandardMaterial color="#7a879b" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
}

function AntennaMast() {
  return (
    <group position={[2.6, -1.1, 1.6]} rotation={[0, -0.5, 0]}>
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.045, 0.06, 1.8, 12]} />
        <meshStandardMaterial color="#94a2b6" metalness={0.85} roughness={0.3} />
      </mesh>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh key={i} position={[0, 1.35 + i * 0.13, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.012, 0.012, 1.05 - i * 0.13, 8]} />
          <meshStandardMaterial color="#aab7c8" metalness={0.9} roughness={0.25} />
        </mesh>
      ))}
    </group>
  );
}

function Rig({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const { camera } = useThree();
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, delta) => {
    const p = progressRef.current;
    const k = 1 - Math.pow(0.001, delta);
    // slow arc: dolly in a little, then swing around the turntable
    const targetZ = 6.6 - p * 2.8;
    const targetY = -0.1 + p * 1.1 + pointer.current.y * -0.35;
    const targetX = -Math.sin(p * 1.15) * 2.6 + pointer.current.x * 0.7;
    camera.position.x += (targetX - camera.position.x) * k;
    camera.position.y += (targetY - camera.position.y) * k;
    camera.position.z += (targetZ - camera.position.z) * k;
    camera.lookAt(0, -0.55 + p * 0.25, -1);
    state.camera.updateProjectionMatrix();
  });
  return null;
}

export default function ChamberCanvas({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>;
}) {
  const W = 9;
  const H = 5.6;
  const D = 16;
  return (
    <Canvas
      dpr={[1, 1.6]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: 52, position: [0, -0.1, 6.4], near: 0.1, far: 60 }}
    >
      <color attach="background" args={["#eef1f6"]} />
      <fog attach="fog" args={["#eef1f6", 7, 30]} />

      <ambientLight intensity={1.15} />
      <pointLight position={[0, 1.8, 1]} intensity={16} color="#ffffff" distance={18} />
      <pointLight position={[-3, 0.4, -5]} intensity={10} color="#cfdcff" distance={16} />
      <spotLight
        position={[0, 2.2, 2.4]}
        angle={0.7}
        penumbra={1}
        intensity={26}
        color="#ffffff"
        distance={20}
      />

      {/* back wall */}
      <AbsorberWall
        width={W}
        height={H}
        cols={22}
        rows={14}
        position={[0, 0, -D / 2]}
        tone={1.02}
      />
      {/* left / right walls */}
      <AbsorberWall
        width={D}
        height={H}
        cols={38}
        rows={14}
        position={[-W / 2, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        tone={0.96}
      />
      <AbsorberWall
        width={D}
        height={H}
        cols={38}
        rows={14}
        position={[W / 2, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        tone={0.96}
      />
      {/* ceiling */}
      <AbsorberWall
        width={W}
        height={D}
        cols={22}
        rows={38}
        position={[0, H / 2, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        tone={1.08}
      />

      {/* ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -H / 2 + 1.7, 0]}>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color="#e3e8f0" roughness={0.4} metalness={0.3} />
      </mesh>
      <gridHelper args={[D, 32, "#9fb3d6", "#c8d1de"]} position={[0, -H / 2 + 1.705, 0]} />

      <TurntableDUT />
      <AntennaMast />
      <WaveRings />

      <Rig progressRef={progressRef} />
    </Canvas>
  );
}
