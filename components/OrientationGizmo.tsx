import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Text } from '@react-three/drei';
import * as THREE from 'three';
import { OrientationData } from '../types';

interface OrientationGizmoProps {
    remoteOrientation?: OrientationData;
}

const FaceLabel: React.FC<{ position: [number, number, number]; rotation?: [number, number, number]; text: string }> = ({ position, rotation, text }) => (
    <Text
        position={position}
        rotation={rotation}
        fontSize={0.5}
        color="black"
        anchorX="center"
        anchorY="middle"
    >
        {text}
    </Text>
);

const OrientationGizmo: React.FC<OrientationGizmoProps> = ({ remoteOrientation }) => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame(() => {
        if (!meshRef.current) return;

        if (remoteOrientation) {
            // Convert degrees to radians
            // Convert target Euler to Quaternion
            const targetRotationX = THREE.MathUtils.degToRad(remoteOrientation.beta);
            const targetRotationY = THREE.MathUtils.degToRad(remoteOrientation.gamma);
            const targetRotationZ = THREE.MathUtils.degToRad(remoteOrientation.alpha);

            const targetEuler = new THREE.Euler(targetRotationX, targetRotationY, targetRotationZ);
            const targetQuaternion = new THREE.Quaternion().setFromEuler(targetEuler);

            // Smoothly slerp to target
            meshRef.current.quaternion.slerp(targetQuaternion, 0.05);
        } else {
            // Idle rotation to match molecule
            meshRef.current.rotation.y += 0.005;
        }
    });

    return (
        <mesh ref={meshRef}>
            <boxGeometry args={[1.5, 1.5, 1.5]} />
            <meshStandardMaterial color="#dddddd" />

            {/* Front */}
            <FaceLabel position={[0, 0, 0.76]} text="FRONT" />
            {/* Back */}
            <FaceLabel position={[0, 0, -0.76]} rotation={[0, Math.PI, 0]} text="BACK" />
            {/* Right */}
            <FaceLabel position={[0.76, 0, 0]} rotation={[0, Math.PI / 2, 0]} text="RIGHT" />
            {/* Left */}
            <FaceLabel position={[-0.76, 0, 0]} rotation={[0, -Math.PI / 2, 0]} text="LEFT" />
            {/* Top */}
            <FaceLabel position={[0, 0.76, 0]} rotation={[-Math.PI / 2, 0, 0]} text="TOP" />
            {/* Bottom */}
            <FaceLabel position={[0, -0.76, 0]} rotation={[Math.PI / 2, 0, 0]} text="BTM" />

            {/* Edges for better visibility */}
            <lineSegments>
                <edgesGeometry args={[new THREE.BoxGeometry(1.5, 1.5, 1.5)]} />
                <lineBasicMaterial color="black" />
            </lineSegments>
        </mesh>
    );
};

export default OrientationGizmo;
