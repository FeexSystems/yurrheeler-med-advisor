import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

export interface EvidenceNodeProps {
  id: string;
  label: string;
  source: string;
  confidence: number;
  position: [number, number, number];
  color?: string;
  onClick?: () => void;
}

export const EvidenceNode3D: React.FC<EvidenceNodeProps> = ({
  id,
  label,
  source,
  confidence,
  position,
  color = "#38bdf8",
  onClick,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.position.y =
        position[1] + Math.sin(t * 2 + position[0] * 3) * 0.04;
    }
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.8;
      meshRef.current.rotation.y = t * 1.2;
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      <mesh ref={meshRef}>
        <dodecahedronGeometry args={[0.09, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.7}
        />
      </mesh>

      <Html position={[0, -0.22, 0]} center distanceFactor={7} className="pointer-events-none select-none">
        <div className="bg-[#090a0b]/90 border border-cyan-500/30 px-2 py-0.5 rounded text-[10px] text-cyan-200 backdrop-blur-md whitespace-nowrap shadow-md flex items-center gap-1">
          <span className="font-mono">{Math.round(confidence * 100)}%</span>
          <span className="text-slate-400">|</span>
          <span className="max-w-[120px] truncate">{label}</span>
        </div>
      </Html>
    </group>
  );
};
