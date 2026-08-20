import React, { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { SpatialLighting } from "./SpatialLighting";
import { ParticleField } from "./ParticleField";

interface ClinicalSceneProps {
  children: React.ReactNode;
  cameraPosition?: [number, number, number];
  fov?: number;
  enableOrbit?: boolean;
  enableParticles?: boolean;
  particleColor?: string;
  className?: string;
  fallback2D?: React.ReactNode;
}

export const ClinicalScene: React.FC<ClinicalSceneProps> = ({
  children,
  cameraPosition = [0, 1.2, 4.2],
  fov = 45,
  enableOrbit = true,
  enableParticles = true,
  particleColor = "#10b981",
  className = "w-full h-full min-h-[400px]",
  fallback2D,
}) => {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setHasWebGL(false);
      }
    } catch {
      setHasWebGL(false);
    }
  }, []);

  if (!isClient) return null;

  if (!hasWebGL && fallback2D) {
    return <div className={`relative ${className}`}>{fallback2D}</div>;
  }

  return (
    <div className={`relative ${className}`}>
      <Canvas
        camera={{ position: cameraPosition, fov }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        className="w-full h-full"
      >
        <SpatialLighting />
        {enableParticles && (
          <ParticleField count={60} color={particleColor} spread={7} />
        )}
        {enableOrbit && (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 1.7}
            minPolarAngle={Math.PI / 2.6}
            maxAzimuthAngle={Math.PI / 4}
            minAzimuthAngle={-Math.PI / 4}
            rotateSpeed={0.5}
          />
        )}
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  );
};
