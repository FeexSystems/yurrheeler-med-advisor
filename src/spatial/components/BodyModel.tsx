import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { Html } from '@react-three/drei';
import { useClinicalStore } from '@/clinical/store';

interface BodyModelProps {
  selectedRegion?: string;
}

export const BodyModel: React.FC<BodyModelProps> = ({ selectedRegion }) => {
  const groupRef = useRef<THREE.Group>(null);
  const setSelectedRegion = useClinicalStore(state => state.setSelectedRegion);

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle floating breathing animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.02;
    }
  });

  const handlePointerDown = (e: React.PointerEvent<THREE.Mesh> | unknown, regionId: string) => {
    (e as React.PointerEvent).stopPropagation?.();
    setSelectedRegion(selectedRegion === regionId ? undefined : regionId);
  };

  const getMaterialColor = (regionId: string) => {
    return selectedRegion === regionId ? "#3b82f6" : "#e2e8f0";
  };

  const getOpacity = (regionId: string) => {
    return selectedRegion === regionId ? 0.9 : 0.6;
  };

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* Head */}
      <mesh 
        position={[0, 1.8, 0]} 
        onPointerDown={(e) => handlePointerDown(e, 'head')}
      >
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshPhysicalMaterial 
          color={getMaterialColor('head')} 
          transparent opacity={getOpacity('head')} 
          roughness={0.2} metalness={0.1} 
        />
        {selectedRegion === 'head' && (
          <Html position={[0.4, 0, 0]} center className="pointer-events-none">
            <div className="bg-slate-900/80 text-white text-xs px-2 py-1 rounded-md border border-slate-700 whitespace-nowrap">
              Neurological System
            </div>
          </Html>
        )}
      </mesh>

      {/* Torso / Chest */}
      <mesh 
        position={[0, 1.1, 0]}
        onPointerDown={(e) => handlePointerDown(e, 'chest')}
      >
        <cylinderGeometry args={[0.35, 0.3, 0.8, 32]} />
        <meshPhysicalMaterial 
          color={getMaterialColor('chest')} 
          transparent opacity={getOpacity('chest')} 
          roughness={0.2} metalness={0.1} 
        />
        {selectedRegion === 'chest' && (
          <Html position={[0.5, 0, 0]} center className="pointer-events-none">
            <div className="bg-slate-900/80 text-white text-xs px-2 py-1 rounded-md border border-slate-700 whitespace-nowrap">
              Cardiovascular / Respiratory
            </div>
          </Html>
        )}
      </mesh>

      {/* Abdomen */}
      <mesh 
        position={[0, 0.5, 0]}
        onPointerDown={(e) => handlePointerDown(e, 'abdomen')}
      >
        <cylinderGeometry args={[0.3, 0.35, 0.4, 32]} />
        <meshPhysicalMaterial 
          color={getMaterialColor('abdomen')} 
          transparent opacity={getOpacity('abdomen')} 
          roughness={0.2} metalness={0.1} 
        />
        {selectedRegion === 'abdomen' && (
          <Html position={[0.5, 0, 0]} center className="pointer-events-none">
            <div className="bg-slate-900/80 text-white text-xs px-2 py-1 rounded-md border border-slate-700 whitespace-nowrap">
              Gastrointestinal
            </div>
          </Html>
        )}
      </mesh>
      
      {/* Arms and Legs (Abstract representations) */}
      {/* Left Arm */}
      <mesh position={[-0.5, 1.1, 0]}>
        <capsuleGeometry args={[0.08, 0.6, 16, 16]} />
        <meshPhysicalMaterial color="#e2e8f0" transparent opacity={0.6} />
      </mesh>
      {/* Right Arm */}
      <mesh position={[0.5, 1.1, 0]}>
        <capsuleGeometry args={[0.08, 0.6, 16, 16]} />
        <meshPhysicalMaterial color="#e2e8f0" transparent opacity={0.6} />
      </mesh>
      
      {/* Left Leg */}
      <mesh position={[-0.18, -0.1, 0]}>
        <capsuleGeometry args={[0.1, 0.8, 16, 16]} />
        <meshPhysicalMaterial color="#e2e8f0" transparent opacity={0.6} />
      </mesh>
      {/* Right Leg */}
      <mesh position={[0.18, -0.1, 0]}>
        <capsuleGeometry args={[0.1, 0.8, 16, 16]} />
        <meshPhysicalMaterial color="#e2e8f0" transparent opacity={0.6} />
      </mesh>
    </group>
  );
};
