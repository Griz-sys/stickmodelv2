"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface BuildingModelProps {
  className?: string;
}

/* ----------------------------- */
/* 3D MODEL COMPONENT */
/* ----------------------------- */

function Model() {
  const groupRef = useRef<THREE.Group>(null!);
  const { scene } = useGLTF("/test-v1.glb");

  const axis = new THREE.Vector3(1, 1, 0).normalize();

  useFrame((state) => {
    if (!groupRef.current) return;

    const t = state.clock.elapsedTime;

    // smooth rotation
    groupRef.current.rotateOnAxis(axis, 0.003);
    groupRef.current.rotation.x += Math.sin(t * 0.4) * 0.0005;
    groupRef.current.rotation.y += Math.cos(t * 0.35) * 0.0004;
  });

  return (
    <group
      ref={groupRef}
      rotation={[
        THREE.MathUtils.degToRad(30),
        THREE.MathUtils.degToRad(-15),
        0,
      ]}
    >
      <primitive object={scene} scale={1.5} />
    </group>
  );
}

/* ----------------------------- */
/* LOADING FALLBACK */
/* ----------------------------- */

function LoaderFallback() {
  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#f97316" />
    </mesh>
  );
}

/* ----------------------------- */
/* MAIN EXPORT */
/* ----------------------------- */

export function BuildingModel({ className = "" }: BuildingModelProps) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <pointLight position={[-5, -5, -5]} intensity={0.5} />

        <Suspense fallback={<LoaderFallback />}>
          <Model />
        </Suspense>
      </Canvas>
    </div>
  );
}

/* Preload model for better performance */
useGLTF.preload("/test-v1.glb");
