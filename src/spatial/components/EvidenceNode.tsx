import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { EvidenceNode as EvidenceNodeType } from '@/clinical/types';
import { Activity, FileText, Microscope, AlertCircle } from 'lucide-react';

interface EvidenceNodeProps {
  evidence: EvidenceNodeType;
  position: [number, number, number];
}

export const EvidenceNode3D: React.FC<EvidenceNodeProps> = ({ evidence, position }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.02;
    }
  });

  const getColor = () => {
    switch (evidence.confidence) {
      case 'high': return '#10b981'; // emerald
      case 'medium': return '#f59e0b'; // amber
      case 'low': return '#ef4444'; // red
      case 'conflicting': return '#f97316'; // orange
      default: return '#3b82f6'; // blue
    }
  };

  const getIcon = () => {
    switch (evidence.type) {
      case 'guideline': return <FileText className="w-3 h-3 text-blue-400" />;
      case 'lab': return <Microscope className="w-3 h-3 text-purple-400" />;
      case 'observation': return <Activity className="w-3 h-3 text-emerald-400" />;
      case 'record': return <FileText className="w-3 h-3 text-slate-400" />;
      default: return <AlertCircle className="w-3 h-3 text-slate-400" />;
    }
  };

  return (
    <group ref={groupRef} position={position}>
      <mesh>
        <boxGeometry args={[0.08, 0.08, 0.08]} />
        <meshPhysicalMaterial color={getColor()} transparent opacity={0.7} roughness={0.2} metalness={0.5} />
      </mesh>
      
      <Html position={[0.1, 0, 0]} className="pointer-events-auto">
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-lg p-2 shadow-lg w-48 text-white">
          <div className="flex items-center gap-1.5 mb-1">
            {getIcon()}
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{evidence.type}</span>
          </div>
          <div className="text-xs font-semibold leading-tight line-clamp-2 mb-1.5">
            {evidence.title}
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-500 truncate max-w-[100px]">{evidence.source}</span>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getColor() }} />
              <span className="text-slate-300 capitalize">{evidence.confidence}</span>
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
};
