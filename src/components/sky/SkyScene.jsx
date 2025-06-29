import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Avatar } from "../../components/r3d/Avatar";
import Piano from "./Piano";
import StarField from "./StarField";

const SkyScene = () => {
  return (
    <>
      <Canvas
        shadows
        camera={{ position: [0, 4, 21], fov: 60 }}
        style={{ background: "#160016" }}
      >
        <Suspense fallback={null}>
          <StarField />
          <Environment preset="sunset" environmentIntensity={0.3} />

          {/* Key Light */}
          <directionalLight position={[5, 5, 5]} intensity={2.2} />
          {/* Fill Light */}
          <directionalLight position={[-5, 5, 5]} intensity={0.7} />
          {/* Back Lights */}
          <directionalLight
            position={[3, 3, -5]}
            intensity={6}
            color={"#ff3b3b"}
          />
          <directionalLight
            position={[-3, 3, -5]}
            intensity={8}
            color={"#3cb1ff"}
          />

          <group position={[0, 0, 0]} scale={3}>
            <Avatar animationPath="/models/Piano.fbx" />
          </group>

          <OrbitControls enableDamping dampingFactor={0.05} enablePan={false} />
        </Suspense>
      </Canvas>
      <Piano />
    </>
  );
};

export default SkyScene;
