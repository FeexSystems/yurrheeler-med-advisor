import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { BodyModel } from '../components/BodyModel';
import { AgentAvatar3D } from '../components/AgentAvatar3D';
import { EvidenceNode3D } from '../components/EvidenceNode';
import { AmbientField, SignalBeam } from '../components/Effects';
import { useClinicalStore } from '@/clinical/store';
import { getAgentById } from '@/lib/agents';

export const ClinicalEnvironment: React.FC = () => {
  const selectedRegion = useClinicalStore((state) => state.selectedRegion);
  const activeAgents = useClinicalStore((state) => state.activeAgents);
  const agentStates = useClinicalStore((state) => state.agentStates);
  const evidence = useClinicalStore((state) => state.evidence);

  // Calculate positions for active agents in a semicircle around the patient
  const agentPositions = useMemo(() => {
    const positions: Record<string, [number, number, number]> = {};
    const count = activeAgents.length;
    const radius = 1.5;
    
    activeAgents.forEach((agentId, index) => {
      // If only 1, place slightly to the right. If more, distribute in arc.
      const angle = count === 1 ? Math.PI / 6 : (Math.PI / 2) * (index / Math.max(1, count - 1)) - Math.PI / 4;
      positions[agentId] = [Math.sin(angle) * radius, 1.2, Math.cos(angle) * radius];
    });
    
    return positions;
  }, [activeAgents]);

  return (
    <div className="w-full h-full relative bg-clinical-bg transition-colors duration-500">
      <Canvas
        className="relative z-10"
        camera={{ position: [0, 1.2, 3], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <spotLight position={[5, 5, 5]} angle={0.2} penumbra={1} intensity={1} castShadow />
        <spotLight position={[-5, 5, -5]} angle={0.2} penumbra={1} intensity={0.5} />
        
        <Suspense fallback={null}>
          <AmbientField />
          <BodyModel selectedRegion={selectedRegion} />
          
          {/* Active Specialists */}
          {activeAgents.map(agentId => {
            const agent = getAgentById(agentId);
            if (!agent) return null;
            const pos = agentPositions[agentId] || [0, 1, 0];
            return (
              <AgentAvatar3D 
                key={agentId}
                id={agentId}
                name={agent.name}
                specialty={agent.specialty}
                state={agentStates[agentId] || 'idle'}
                position={pos}
                color={agent.badgeColor || '#3b82f6'}
              />
            );
          })}

          {/* Connect agents to selected region if consulting or observing */}
          {activeAgents.map(agentId => {
            const state = agentStates[agentId];
            if (state === 'observing' || state === 'reasoning' || state === 'consulting') {
               const pos = agentPositions[agentId];
               // Target depends on region (abstracted to center body for now)
               const target: [number, number, number] = [0, selectedRegion === 'head' ? 1.8 : selectedRegion === 'chest' ? 1.1 : 0.5, 0];
               return <SignalBeam key={`beam-${agentId}`} start={pos} end={target} active={state === 'reasoning' || state === 'consulting'} />;
            }
            return null;
          })}

          {/* Evidence Nodes */}
          {evidence.map((ev, index) => {
            // Distribute evidence nodes
            const angle = (Math.PI * 2) * (index / Math.max(1, evidence.length));
            const pos: [number, number, number] = [Math.sin(angle) * 1.2, 0.5 + (index * 0.2), Math.cos(angle) * 1.2 - 0.5];
            
            return (
              <React.Fragment key={ev.id}>
                <EvidenceNode3D evidence={ev} position={pos} />
                {ev.relatedRegions.length > 0 && (
                   <SignalBeam start={pos} end={[0, 1.1, 0]} color="#94a3b8" />
                )}
              </React.Fragment>
            );
          })}
          
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
          <directionalLight position={[-5, 3, -5]} intensity={0.5} />
          
          <ContactShadows position={[0, -1, 0]} opacity={0.4} scale={10} blur={2} far={4} />
        </Suspense>

        <OrbitControls 
          enablePan={false}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 1.8}
          minDistance={1.5}
          maxDistance={5}
        />
      </Canvas>
    </div>
  );
};

export default ClinicalEnvironment;
