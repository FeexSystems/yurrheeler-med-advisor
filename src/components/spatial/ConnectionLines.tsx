import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ConnectionLinesProps {
  connections: Array<{
    from: [number, number, number];
    to: [number, number, number];
    color?: string;
  }>;
}

export const ConnectionLines: React.FC<ConnectionLinesProps> = ({
  connections,
}) => {
  const lineGroupRef = useRef<THREE.Group>(null);

  // Generate curve geometries and animated signal meshes
  const curves = useMemo(() => {
    return connections.map((conn) => {
      const vFrom = new THREE.Vector3(...conn.from);
      const vTo = new THREE.Vector3(...conn.to);
      const mid = new THREE.Vector3()
        .addVectors(vFrom, vTo)
        .multiplyScalar(0.5)
        .add(new THREE.Vector3(0, 0.2, 0.1));

      const curve = new THREE.QuadraticBezierCurve3(vFrom, mid, vTo);
      const points = curve.getPoints(24);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      return {
        curve,
        geometry,
        color: conn.color || "#10b981",
      };
    });
  }, [connections]);

  useFrame((state) => {
    if (lineGroupRef.current) {
      const t = state.clock.elapsedTime;
      lineGroupRef.current.children.forEach((child, i) => {
        // Pulse line opacity
        if (child instanceof THREE.Line) {
          const mat = child.material as THREE.LineBasicMaterial;
          mat.opacity = 0.3 + Math.sin(t * 2 + i) * 0.2;
        }
      });
    }
  });

  return (
    <group ref={lineGroupRef}>
      {curves.map((item, idx) => (
        <line key={idx} geometry={item.geometry}>
          <lineBasicMaterial
            color={item.color}
            transparent
            opacity={0.4}
            linewidth={1}
          />
        </line>
      ))}
    </group>
  );
};
