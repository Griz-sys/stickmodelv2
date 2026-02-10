"use client";

import { Canvas, useLoader, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { Suspense, useRef, useEffect, useState } from "react";
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
  const [webglError, setWebglError] = useState(false);
  const [webglChecked, setWebglChecked] = useState(false);

  useEffect(() => {
    // Check WebGL support before attempting to render Canvas
    const checkWebGL = () => {
      try {
        const canvas = document.createElement("canvas");
        const gl =
          canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (!gl) {
          setWebglError(true);
        }
      } catch (e) {
        console.error("WebGL check failed:", e);
        setWebglError(true);
      }
      setWebglChecked(true);
    };

    checkWebGL();
  }, []);

  useEffect(() => {
    if (sunRef.current) {
      // point the sun from the right-front-top to create a consistent "sun" angle
      sunRef.current.target.position.set(-1, 0, 0);
      // ensure the target world matrix is updated
      sunRef.current.target.updateMatrixWorld();
    }
  }, []);

  if (!webglChecked) {
    return (
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ zIndex: 5 }}
      >
        <div className="text-gray-600">Loading 3D viewer...</div>
      </div>
    );
  }

  if (webglError) {
    return (
      <div
        className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100"
        style={{ zIndex: 5 }}
      >
        <div className="text-center p-8 max-w-md bg-white rounded-lg shadow-lg">
          <div className="text-5xl mb-4">🎨</div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-3">
            3D Viewer Unavailable
          </h3>
          <p className="text-gray-600 mb-4">
            Your browser couldn't initialize WebGL. This is usually a GPU driver
            issue.
          </p>
          <div className="text-left text-sm text-gray-700 space-y-3 mb-6 bg-gray-50 p-4 rounded">
            <p className="font-semibold">Quick fixes:</p>
            <ul className="space-y-2 ml-2">
              <li>✓ Enable hardware acceleration in your browser settings</li>
              <li>✓ Update your graphics drivers (NVIDIA/AMD/Intel)</li>
              <li>✓ Try a different browser (Chrome, Firefox, or Edge)</li>
              <li>✓ Restart your browser</li>
              <li>✓ Close other GPU-intensive apps</li>
            </ul>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 5, opacity: 0.7 }}
    >
      <Canvas
        camera={{ position: [18, 20, 25], fov: 20 }}
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          width: "100%",
          height: "100%",
          background: "transparent",
        }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          try {
            const context = gl.getContext();
            if (!context) {
              setWebglError(true);
            }
          } catch (e) {
            console.error("WebGL initialization failed:", e);
            setWebglError(true);
          }
        }}
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
            enableRotate={true}
            autoRotate
            autoRotateSpeed={0.6}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2.2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ModelViewer;
