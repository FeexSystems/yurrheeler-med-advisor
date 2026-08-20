import React from "react";

export const SpatialLighting: React.FC = () => {
  return (
    <>
      <ambientLight intensity={0.65} color="#faf8f5" />
      {/* Primary Key Light - Crisp Gallery Warm White */}
      <directionalLight
        position={[4, 6, 4]}
        intensity={0.9}
        color="#fffbf5"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      {/* Subtle Classical Rim Light */}
      <directionalLight
        position={[-4, 3, -4]}
        intensity={0.4}
        color="#e2e8f0"
      />
      {/* Gentle Underside Fill */}
      <pointLight position={[0, -2, 2.5]} intensity={0.25} color="#cbd5e1" />
    </>
  );
};

