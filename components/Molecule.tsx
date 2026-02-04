
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Float, Text, Plane } from '@react-three/drei';
import * as THREE from 'three';
import { MoleculeData, OrientationData } from '../types';

interface MoleculeProps {
  data: MoleculeData;
  remoteOrientation?: OrientationData;
}

const Molecule: React.FC<MoleculeProps> = ({ data, remoteOrientation }) => {
  const groupRef = useRef<THREE.Group>(null);
  const indicatorRef = useRef<THREE.Group>(null);
  
  // Orientation indicator configuration (in Three.js world units)
  const INDICATOR_SIZE = 3; // Width and height of the plane
  const INDICATOR_Z_POSITION = 2; // Distance from molecule center on Z-axis
  const INDICATOR_OPACITY = 0.4; // Transparency level (0-1) - increased for better visibility

  useFrame((state) => {
    if (!groupRef.current) return;

    if (remoteOrientation) {
      // Smoothly interpolate to remote orientation
      // Convert degrees to radians
      const targetRotationX = THREE.MathUtils.degToRad(remoteOrientation.beta);
      const targetRotationY = THREE.MathUtils.degToRad(remoteOrientation.gamma);
      const targetRotationZ = THREE.MathUtils.degToRad(remoteOrientation.alpha);

      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, 0.1);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, 0.1);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotationZ, 0.1);
      
      // Sync indicator rotation with molecule
      if (indicatorRef.current) {
        indicatorRef.current.rotation.copy(groupRef.current.rotation);
      }
    } else {
      // Default slow idle rotation
      groupRef.current.rotation.y += 0.005;
      
      // Sync indicator rotation with molecule
      if (indicatorRef.current) {
        indicatorRef.current.rotation.copy(groupRef.current.rotation);
      }
    }
  });

  return (
    <>
      {/* Orientation Indicator - Shows the front face of the molecule */}
      {/* Positioned outside Float to avoid floating animation, syncs rotation via ref */}
      <group ref={indicatorRef}>
        <Plane args={[INDICATOR_SIZE, INDICATOR_SIZE]} position={[0, 0, INDICATOR_Z_POSITION]}>
          <meshBasicMaterial 
            color="#3b82f6" 
            transparent 
            opacity={INDICATOR_OPACITY}
            side={THREE.DoubleSide}
          />
        </Plane>
      </group>

      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <group ref={groupRef}>
          {data.atoms.map((atom, idx) => (
            <group key={`atom-${idx}`} position={atom.position}>
              <Sphere args={[atom.size, 32, 32]}>
                <meshStandardMaterial color={atom.color} roughness={0.1} metalness={0.6} />
              </Sphere>
              <Text
                position={[0, atom.size + 0.2, 0]}
                fontSize={0.2}
                color="white"
                anchorX="center"
                anchorY="middle"
              >
                {atom.element}
              </Text>
            </group>
          ))}

          {data.bonds.map((bond, idx) => {
            const start = new THREE.Vector3(...bond.start);
            const end = new THREE.Vector3(...bond.end);
            const distance = start.distanceTo(end);
            const center = start.clone().lerp(end, 0.5);
            
            return (
              <mesh
                key={`bond-${idx}`}
                position={center}
                onUpdate={(self) => {
                  self.lookAt(end);
                  self.rotateX(Math.PI / 2);
                }}
              >
                <cylinderGeometry args={[0.08, 0.08, distance, 12]} />
                <meshStandardMaterial color="#888888" roughness={0.3} metalness={0.2} />
              </mesh>
            );
          })}
        </group>
      </Float>
    </>
  );
};

export default Molecule;
