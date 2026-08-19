import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const AmbientField: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 1000;

  const [positions, scales] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      scales[i] = Math.random();
    }
    return [positions, scales];
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-scale"
          count={scales.length}
          array={scales}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#94a3b8"
        transparent
        opacity={0.3}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

interface SignalBeamProps {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
  active?: boolean;
}

export const SignalBeam: React.FC<SignalBeamProps> = ({ start, end, color = "#3b82f6", active = false }) => {
  const lineRef = useRef<THREE.Line>(null);
  
  const points = useMemo(() => {
    return [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  }, [start, end]);

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  useFrame((state) => {
    if (lineRef.current && active) {
      const material = lineRef.current.material as THREE.LineBasicMaterial;
      material.opacity = 0.2 + Math.sin(state.clock.elapsedTime * 8) * 0.2;
    }
  });

  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={active ? 0.4 : 0.1} />
    </line>
  );
};
