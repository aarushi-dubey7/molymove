
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, Float, Text, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { MoleculeData, OrientationData } from '../types';

interface MoleculeProps {
  data: MoleculeData;
  remoteOrientation?: OrientationData;
}

const Molecule: React.FC<MoleculeProps> = ({ data, remoteOrientation }) => {
  const groupRef = useRef<THREE.Group>(null);

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
    } else {
      // Default slow idle rotation
      groupRef.current.rotation.y += 0.005;
    }
  });

  return (
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

          const direction = end.clone().sub(start).normalize();
          const quaternion = new THREE.Quaternion();
          quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

          return (
            <mesh
              key={`bond-${idx}`}
              position={center}
              quaternion={quaternion}
            >
              <cylinderGeometry args={[0.08, 0.08, distance, 12]} />
              <meshStandardMaterial color="#888888" roughness={0.3} metalness={0.2} />
            </mesh>
          );
        })}
      </group>
    </Float>
  );
};

export default Molecule;
