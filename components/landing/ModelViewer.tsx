"use client";

import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { Suspense } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

function Model() {
  const gltf = useLoader(GLTFLoader, "/models/test-v1.glb");
  return <primitive object={gltf.scene} scale={0.8} position={[0, -0.5, 0]} />;
}

function FallbackModel() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#ea580c" />
    </mesh>
  );
}

const ModelViewer = () => {
  return (
    <Canvas
      camera={{ position: [5, 3, 6], fov: 40 }}
      style={{ width: "100%", height: "100%" }}
      gl={{ antialias: true, alpha: true }}
      shadows
    >
      <Suspense fallback={<FallbackModel />}>
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <directionalLight position={[-5, 5, -5]} intensity={0.3} />
        <Model />
        {/* Ground shadow */}
        <ContactShadows
          position={[0, -0.5, 0]}
          opacity={0.6}
          scale={12}
          blur={2.5}
          far={6}
          resolution={512}
        />
        {/* Subtle ground plane hint */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.51, 0]}
          receiveShadow
        >
          <planeGeometry args={[20, 20]} />
          <shadowMaterial transparent opacity={0.15} />
        </mesh>
        <Environment preset="city" />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate
          autoRotateSpeed={1.0}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.2}
        />
      </Suspense>
    </Canvas>
  );
};

export default ModelViewer;
