import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

export type AgentNodeState =
  | "idle"
  | "observing"
  | "processing"
  | "reasoning"
  | "complete"
  | "warning"
  | "critical";

export interface AgentNodeProps {
  id: string;
  name: string;
  specialty: string;
  state?: AgentNodeState;
  position: [number, number, number];
  color?: string;
  onClick?: () => void;
  showDetails?: boolean;
}

export const AgentNode: React.FC<AgentNodeProps> = ({
  id,
  name,
  specialty,
  state = "observing",
  position,
  color = "#10b981",
  onClick,
  showDetails = true,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);

  useFrame((clockState) => {
    const t = clockState.clock.elapsedTime;

    if (groupRef.current) {
      // Gentle vertical float
      groupRef.current.position.y =
        position[1] + Math.sin(t * 1.5 + position[0] * 2) * 0.08;
    }

    if (coreRef.current) {
      coreRef.current.rotation.y += 0.01;
      coreRef.current.rotation.z += 0.005;

      // Pulse based on state
      const pulseSpeed =
        state === "reasoning" || state === "processing" ? 4 : 1.5;
      const pulseAmp = state === "warning" || state === "critical" ? 0.15 : 0.06;
      const scaleVal = 1 + Math.sin(t * pulseSpeed) * pulseAmp;
      coreRef.current.scale.setScalar(scaleVal);
    }

    if (ringRef.current) {
      ringRef.current.rotation.x = t * 0.8;
      ringRef.current.rotation.y = t * 0.6;
    }

    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = -t * 0.5;
      outerRingRef.current.rotation.x = t * 0.3;
    }
  });

  const getStateColor = () => {
    switch (state) {
      case "critical":
        return "#ef4444";
      case "warning":
        return "#f59e0b";
      case "reasoning":
      case "processing":
        return "#38bdf8";
      case "complete":
        return "#10b981";
      case "observing":
      default:
        return color;
    }
  };

  const activeColor = getStateColor();

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      {/* Central Core Octahedron */}
      <mesh ref={coreRef}>
        <octahedronGeometry args={[0.18, 0]} />
        <meshStandardMaterial
          color={activeColor}
          emissive={activeColor}
          emissiveIntensity={state === "reasoning" || state === "processing" ? 0.45 : 0.15}
          roughness={0.3}
          metalness={0.4}
          wireframe={state === "processing"}
        />
      </mesh>

      {/* Orbiting Torus Ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[0.3, 0.008, 16, 48]} />
        <meshBasicMaterial
          color={activeColor}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Outer Subtle Minimal Ring */}
      <mesh ref={outerRingRef}>
        <ringGeometry args={[0.38, 0.385, 48]} />
        <meshBasicMaterial
          color={activeColor}
          transparent
          opacity={0.18}
          side={THREE.DoubleSide}
        />
      </mesh>


      {/* HTML Annotation overlay */}
      {showDetails && (
        <Html position={[0, -0.45, 0]} center distanceFactor={8} className="pointer-events-none select-none">
          <div className="flex flex-col items-center gap-1">
            <div className="bg-[#090a0b]/90 border border-white/15 px-2.5 py-1 rounded-md backdrop-blur-md shadow-xl flex items-center gap-1.5 whitespace-nowrap">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: activeColor }}
              />
              <span className="text-[11px] font-semibold text-white tracking-wide">
                {name}
              </span>
            </div>
            <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider bg-black/40 px-1.5 py-0.5 rounded border border-white/5">
              {specialty}
            </span>
          </div>
        </Html>
      )}
    </group>
  );
};
