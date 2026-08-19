import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { AgentState } from '@/clinical/types';

interface AgentAvatar3DProps {
  id: string;
  name: string;
  specialty: string;
  state: AgentState;
  position: [number, number, number];
  color: string;
}

export const AgentAvatar3D: React.FC<AgentAvatar3DProps> = ({ id, name, specialty, state, position, color }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((clockState) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(clockState.clock.elapsedTime * 2 + position[0]) * 0.05;
      
      if (state === 'reasoning' || state === 'consulting') {
        meshRef.current.rotation.y += 0.02;
      } else {
        meshRef.current.rotation.y += 0.005;
      }
    }
    
    if (ringRef.current) {
      if (state === 'observing' || state === 'speaking') {
        ringRef.current.rotation.x += 0.01;
        ringRef.current.rotation.y -= 0.02;
        ringRef.current.scale.setScalar(1 + Math.sin(clockState.clock.elapsedTime * 4) * 0.1);
      } else {
        ringRef.current.scale.setScalar(1);
      }
    }
  });

  const getOpacity = () => {
    switch (state) {
      case 'idle': return 0.3;
      case 'observing': return 0.6;
      case 'reasoning': return 0.8;
      case 'consulting': return 0.9;
      case 'speaking': return 1.0;
      case 'complete': return 0.7;
      default: return 0.5;
    }
  };

  return (
    <group position={position}>
      {/* Core Avatar Mesh */}
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.15, 1]} />
        <meshPhysicalMaterial 
          color={color} 
          transparent 
          opacity={getOpacity()} 
          wireframe={state === 'reasoning'}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* State Indicator Ring */}
      {(state === 'observing' || state === 'speaking' || state === 'reasoning') && (
        <mesh ref={ringRef}>
          <torusGeometry args={[0.25, 0.005, 16, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.5} />
        </mesh>
      )}

      {/* HTML Label */}
      <Html position={[0, -0.3, 0]} center className="pointer-events-none">
        <div className="flex flex-col items-center gap-1 transition-opacity" style={{ opacity: state === 'idle' ? 0.4 : 1 }}>
          <div className="bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-700 shadow-sm flex items-center gap-1.5 whitespace-nowrap">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }} />
            {name}
          </div>
          {(state === 'reasoning' || state === 'speaking') && (
            <div className="text-[9px] uppercase tracking-wider font-mono text-slate-300 bg-slate-900/80 px-1.5 rounded backdrop-blur-md">
              {state}
            </div>
          )}
        </div>
      </Html>
    </group>
  );
};
