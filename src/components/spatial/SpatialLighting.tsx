import React from "react";

export const SpatialLighting: React.FC = () => {
  return (
    <>
      <ambientLight intensity={0.4} color="#f8fafc" />
      {/* Key light */}
      <directionalLight
        position={[6, 8, 5]}
        intensity={1.2}
        color="#ffffff"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      {/* Cool rim light */}
      <directionalLight
        position={[-6, 4, -5]}
        intensity={0.8}
        color="#10b981"
      />
      {/* Soft fill light */}
      <pointLight position={[0, -3, 3]} intensity={0.5} color="#06b6d4" />
    </>
  );
};
