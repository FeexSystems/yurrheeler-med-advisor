import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

export type AnatomyRegionId =
  | "brain"
  | "heart"
  | "lungs"
  | "liver"
  | "kidney-left"
  | "kidney-right"
  | "spine";

interface AnatomyModelProps {
  selectedRegion?: string;
  onSelectRegion?: (regionId: string) => void;
  hoveredRegion?: string | null;
  onHoverRegion?: (regionId: string | null) => void;
  themeMode?: "classic-vitruvian" | "classic-clinical" | "classic-engraving";
}

export const AnatomyModel: React.FC<AnatomyModelProps> = ({
  selectedRegion,
  onSelectRegion,
  hoveredRegion,
  onHoverRegion,
  themeMode = "classic-vitruvian",
}) => {
  const modelGroupRef = useRef<THREE.Group>(null);
  const heartRef = useRef<THREE.Mesh>(null);
  const lungsLeftRef = useRef<THREE.Mesh>(null);
  const lungsRightRef = useRef<THREE.Mesh>(null);
  const brainRef = useRef<THREE.Mesh>(null);
  const vitruvianCircleRef = useRef<THREE.Mesh>(null);
  const vitruvianSquareRef = useRef<THREE.LineSegments>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (modelGroupRef.current) {
      // Gentle classical float
      modelGroupRef.current.position.y = Math.sin(t * 1.0) * 0.025 - 0.15;
    }

    // Physiological Heartbeat (classic lub-dub rhythm)
    if (heartRef.current) {
      const beat = Math.pow(Math.sin(t * 3.5), 63) * 0.22 + Math.pow(Math.sin(t * 3.5 + 0.3), 63) * 0.14;
      heartRef.current.scale.setScalar(1 + beat);
    }

    // Pulmonary respiratory expansion
    if (lungsLeftRef.current && lungsRightRef.current) {
      const breath = Math.sin(t * 1.4) * 0.07;
      lungsLeftRef.current.scale.set(1 + breath, 1 + breath * 0.5, 1 + breath);
      lungsRightRef.current.scale.set(1 + breath, 1 + breath * 0.5, 1 + breath);
    }

    // Brain synaptic neural shimmer
    if (brainRef.current) {
      brainRef.current.rotation.y = Math.sin(t * 0.4) * 0.08;
    }

    // Vitruvian compass rings slow rotation
    if (vitruvianCircleRef.current) {
      vitruvianCircleRef.current.rotation.z = t * 0.03;
    }
  });

  const getRegionMaterial = (regionId: string, baseColor = "#c5a059") => {
    const isSelected = selectedRegion === regionId;
    const isHovered = hoveredRegion === regionId;

    let color = baseColor;
    let emissive = "#000000";
    let emissiveIntensity = 0;
    let opacity = 0.7;

    if (themeMode === "classic-vitruvian") {
      color = isSelected ? "#eab308" : isHovered ? "#fde047" : "#d4af37";
      opacity = isSelected ? 0.95 : isHovered ? 0.85 : 0.65;
      if (isSelected || isHovered) {
        emissive = "#d4af37";
        emissiveIntensity = isSelected ? 0.6 : 0.3;
      }
    } else if (themeMode === "classic-clinical") {
      color = isSelected ? "#10b981" : isHovered ? "#38bdf8" : baseColor;
      if (isSelected) {
        emissive = "#10b981";
        emissiveIntensity = 0.7;
        opacity = 0.95;
      } else if (isHovered) {
        emissive = "#38bdf8";
        emissiveIntensity = 0.4;
        opacity = 0.85;
      }
    } else {
      // Engraving mode: sepia & bronze
      color = isSelected ? "#d97706" : isHovered ? "#f59e0b" : "#78716c";
      opacity = isSelected ? 0.9 : 0.6;
    }

    return (
      <meshPhysicalMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
        transparent
        opacity={opacity}
        roughness={0.35}
        metalness={themeMode === "classic-vitruvian" ? 0.65 : 0.25}
        clearcoat={0.4}
      />
    );
  };

  const handlePointerDown = (e: React.PointerEvent<THREE.Mesh> | unknown, id: AnatomyRegionId) => {
    (e as React.PointerEvent)?.stopPropagation?.();
    onSelectRegion?.(selectedRegion === id ? "" : id);
  };

  const isClassic = themeMode === "classic-vitruvian" || themeMode === "classic-engraving";

  return (
    <group ref={modelGroupRef} position={[0, 0, 0]}>
      {/* CLASSIC VITRUVIAN PROPORTION COMPASS RINGS */}
      {isClassic && (
        <group position={[0, 1.1, -0.2]}>
          {/* Outer Vitruvian Circle */}
          <mesh ref={vitruvianCircleRef}>
            <ringGeometry args={[1.38, 1.4, 64]} />
            <meshBasicMaterial color="#d4af37" transparent opacity={0.25} side={THREE.DoubleSide} />
          </mesh>
          {/* Inner Golden Ratio Ring */}
          <mesh>
            <ringGeometry args={[0.88, 0.89, 48]} />
            <meshBasicMaterial color="#c5a059" transparent opacity={0.15} side={THREE.DoubleSide} />
          </mesh>
          {/* Classic Axis Lines */}
          <mesh rotation={[0, 0, Math.PI / 4]}>
            <ringGeometry args={[1.35, 1.355, 4]} />
            <meshBasicMaterial color="#d4af37" transparent opacity={0.12} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}

      {/* 1. BRAIN / ENCEPHALON */}
      <group position={[0, 1.85, 0]}>
        <mesh
          ref={brainRef}
          onPointerDown={(e) => handlePointerDown(e, "brain")}
          onPointerOver={() => onHoverRegion?.("brain")}
          onPointerOut={() => onHoverRegion?.(null)}
        >
          <sphereGeometry args={[0.29, 32, 32]} />
          {getRegionMaterial("brain", isClassic ? "#d4af37" : "#64748b")}
        </mesh>
        {(selectedRegion === "brain" || hoveredRegion === "brain") && (
          <Html position={[0.48, 0, 0]} center className="pointer-events-none select-none">
            <div className="bg-[#120f09]/95 border border-[#d4af37]/60 text-[#fef08a] text-xs px-3 py-1.5 rounded-sm backdrop-blur-md whitespace-nowrap shadow-2xl flex flex-col font-serif">
              <span className="font-semibold tracking-wider uppercase text-[11px] text-[#facc15]">
                Cerebrum & Encephalon
              </span>
              <span className="text-[10px] text-slate-300 font-sans">
                Cognitive & Neurological Axis
              </span>
            </div>
          </Html>
        )}
      </group>

      {/* 2. TRANSLUCENT THORACIC CAGE / CLASSIC RIB CAGE MESH */}
      <mesh position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.46, 0.36, 1.25, 24, 6, true]} />
        <meshPhysicalMaterial
          color={isClassic ? "#c5a059" : "#1e293b"}
          transparent
          opacity={isClassic ? 0.3 : 0.2}
          roughness={0.7}
          metalness={isClassic ? 0.5 : 0.1}
          wireframe
        />
      </mesh>

      {/* 3. HEART / COR HUMANUM */}
      <group position={[0.07, 1.12, 0.12]}>
        <mesh
          ref={heartRef}
          onPointerDown={(e) => handlePointerDown(e, "heart")}
          onPointerOver={() => onHoverRegion?.("heart")}
          onPointerOut={() => onHoverRegion?.(null)}
        >
          <octahedronGeometry args={[0.18, 2]} />
          {getRegionMaterial("heart", isClassic ? "#dc2626" : "#ef4444")}
        </mesh>
        {(selectedRegion === "heart" || hoveredRegion === "heart") && (
          <Html position={[0.45, 0, 0]} center className="pointer-events-none select-none">
            <div className="bg-[#180808]/95 border border-rose-500/60 text-rose-200 text-xs px-3 py-1.5 rounded-sm backdrop-blur-md whitespace-nowrap shadow-2xl flex flex-col font-serif">
              <span className="font-semibold tracking-wider uppercase text-[11px] text-rose-300">
                Cor Humanum
              </span>
              <span className="text-[10px] text-slate-300 font-sans">
                Cardiovascular / 72 BPM Sinus
              </span>
            </div>
          </Html>
        )}
      </group>

      {/* 4. LUNGS / PULMONES */}
      {/* Left Lung */}
      <group position={[-0.22, 1.15, 0.05]}>
        <mesh
          ref={lungsLeftRef}
          onPointerDown={(e) => handlePointerDown(e, "lungs")}
          onPointerOver={() => onHoverRegion?.("lungs")}
          onPointerOut={() => onHoverRegion?.(null)}
        >
          <capsuleGeometry args={[0.12, 0.34, 16, 16]} />
          {getRegionMaterial("lungs", isClassic ? "#0284c7" : "#0284c7")}
        </mesh>
      </group>
      {/* Right Lung */}
      <group position={[0.25, 1.15, -0.02]}>
        <mesh
          ref={lungsRightRef}
          onPointerDown={(e) => handlePointerDown(e, "lungs")}
          onPointerOver={() => onHoverRegion?.("lungs")}
          onPointerOut={() => onHoverRegion?.(null)}
        >
          <capsuleGeometry args={[0.12, 0.31, 16, 16]} />
          {getRegionMaterial("lungs", isClassic ? "#0284c7" : "#0284c7")}
        </mesh>
        {(selectedRegion === "lungs" || hoveredRegion === "lungs") && (
          <Html position={[0.45, 0, 0]} center className="pointer-events-none select-none">
            <div className="bg-[#08131d]/95 border border-cyan-500/60 text-cyan-200 text-xs px-3 py-1.5 rounded-sm backdrop-blur-md whitespace-nowrap shadow-2xl flex flex-col font-serif">
              <span className="font-semibold tracking-wider uppercase text-[11px] text-cyan-300">
                Pulmones Sinister & Dexter
              </span>
              <span className="text-[10px] text-slate-300 font-sans">
                Pulmonary Tidal Dynamics & SpO2
              </span>
            </div>
          </Html>
        )}
      </group>

      {/* 5. LIVER / HEPAR */}
      <group position={[0.16, 0.68, 0.08]}>
        <mesh
          onPointerDown={(e) => handlePointerDown(e, "liver")}
          onPointerOver={() => onHoverRegion?.("liver")}
          onPointerOut={() => onHoverRegion?.(null)}
        >
          <boxGeometry args={[0.26, 0.16, 0.2]} />
          {getRegionMaterial("liver", isClassic ? "#b45309" : "#b45309")}
        </mesh>
        {(selectedRegion === "liver" || hoveredRegion === "liver") && (
          <Html position={[0.42, 0, 0]} center className="pointer-events-none select-none">
            <div className="bg-[#191008]/95 border border-amber-500/60 text-amber-200 text-xs px-3 py-1.5 rounded-sm backdrop-blur-md whitespace-nowrap shadow-2xl flex flex-col font-serif">
              <span className="font-semibold tracking-wider uppercase text-[11px] text-amber-300">
                Hepar
              </span>
              <span className="text-[10px] text-slate-300 font-sans">
                Hepatic Filtration & Metabolic Reserve
              </span>
            </div>
          </Html>
        )}
      </group>

      {/* 6. RENAL / RENES (Kidneys) */}
      <group position={[-0.18, 0.46, -0.1]}>
        <mesh
          onPointerDown={(e) => handlePointerDown(e, "kidney-left")}
          onPointerOver={() => onHoverRegion?.("kidney-left")}
          onPointerOut={() => onHoverRegion?.(null)}
        >
          <sphereGeometry args={[0.09, 16, 16]} />
          {getRegionMaterial("kidney-left", isClassic ? "#0d9488" : "#0d9488")}
        </mesh>
      </group>
      <group position={[0.18, 0.46, -0.1]}>
        <mesh
          onPointerDown={(e) => handlePointerDown(e, "kidney-right")}
          onPointerOver={() => onHoverRegion?.("kidney-right")}
          onPointerOut={() => onHoverRegion?.(null)}
        >
          <sphereGeometry args={[0.09, 16, 16]} />
          {getRegionMaterial("kidney-right", isClassic ? "#0d9488" : "#0d9488")}
        </mesh>
        {(selectedRegion === "kidney-left" || selectedRegion === "kidney-right" || hoveredRegion === "kidney-left" || hoveredRegion === "kidney-right") && (
          <Html position={[0.38, 0, 0]} center className="pointer-events-none select-none">
            <div className="bg-[#081816]/95 border border-teal-500/60 text-teal-200 text-xs px-3 py-1.5 rounded-sm backdrop-blur-md whitespace-nowrap shadow-2xl flex flex-col font-serif">
              <span className="font-semibold tracking-wider uppercase text-[11px] text-teal-300">
                Renes (Sinister et Dexter)
              </span>
              <span className="text-[10px] text-slate-300 font-sans">
                Glomerular Filtration Rate
              </span>
            </div>
          </Html>
        )}
      </group>

      {/* 7. SPINAL COLUMN / COLUMNA VERTEBRALIS */}
      <mesh position={[0, 0.85, -0.18]}>
        <cylinderGeometry args={[0.04, 0.04, 1.6, 16]} />
        <meshStandardMaterial
          color={isClassic ? "#c5a059" : "#475569"}
          roughness={0.3}
          metalness={isClassic ? 0.7 : 0.6}
        />
      </mesh>
    </group>
  );
};

