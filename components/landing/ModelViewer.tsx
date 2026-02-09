"use client";

import { Canvas, useLoader, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { Suspense, useRef, useEffect } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

function Model() {
  const gltf = useLoader(GLTFLoader, "/models/test-v1.glb");
  // Disable shadows on model meshes (keep scene lighting and ground shadows)
  if (gltf?.scene) {
    gltf.scene.traverse((child) => {
      // @ts-ignore
      if (child.isMesh) {
        child.castShadow = false;
        child.receiveShadow = false;
        const mesh = child as THREE.Mesh;
        if (mesh.material) (mesh.material as any).needsUpdate = true;
      }
    });
  }
  const groupRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;

    // Subtle inverse parallax rotation based on mouse
    const rotationIntensity = 0.35; // slightly stronger but still subtle
    const lerpFactor = 0.04; // a bit faster so movement is noticeable

    const targetRotX = -mouse.y * rotationIntensity; // up → rotate slightly downward
    const targetRotY = -mouse.x * rotationIntensity; // right → rotate slightly left

    group.rotation.x = THREE.MathUtils.lerp(
      group.rotation.x,
      targetRotX,
      lerpFactor,
    );
    group.rotation.y = THREE.MathUtils.lerp(
      group.rotation.y,
      targetRotY,
      lerpFactor,
    );

    // Subtle floating animation on Y
    const t = state.clock.getElapsedTime();
    const floatOffset = Math.sin(t * 0.8) * 0.08; // slightly larger but still gentle

    // Base Y is -0.5 (original), float around that
    const targetPosY = -0.35 + floatOffset;
    group.position.y = THREE.MathUtils.lerp(
      group.position.y,
      targetPosY,
      lerpFactor,
    );
  });

  return (
    <group ref={groupRef} scale={1.12} position={[0, -0.35, 0]}>
      <primitive object={gltf.scene} />
    </group>
  );
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
  const sunRef = useRef<THREE.DirectionalLight | null>(null);

  useEffect(() => {
    if (sunRef.current) {
      // point the sun from the right-front-top to create a consistent "sun" angle
      sunRef.current.target.position.set(-1, 0, 0);
      // ensure the target world matrix is updated
      sunRef.current.target.updateMatrixWorld();
    }
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "auto",
        transform: "translateY(-60px)",
      }}
    >
      <Canvas
        camera={{ position: [24, 30, 30], fov: 55 }}
        style={{ width: "100%", height: "100%", background: "transparent" }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={<FallbackModel />}>
          <ambientLight intensity={0.5} />
          <directionalLight
            ref={sunRef}
            position={[10, 10, 5]}
            intensity={1.5}
            castShadow={false}
          />
          <directionalLight
            position={[-5, 5, -5]}
            intensity={0.3}
            castShadow={false}
          />
          <Model />
          {/* Ground plane (no shadows) */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.51, 0]}>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0} />
          </mesh>
          <Environment preset="city" />
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            enableRotate={false} // disable manual rotation to avoid conflict
            autoRotate
            autoRotateSpeed={0.6} // slightly slower for premium hero feel
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2.2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ModelViewer;
