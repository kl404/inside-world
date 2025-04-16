import React from "react";
import { Canvas } from "@react-three/fiber";
import { Avatar } from "./r3d/Avatar";
import { Environment, OrbitControls } from "@react-three/drei";

export default function ModelTest() {
  return (
    <div style={{ width: "100vw", height: "100vh", background: "#000" }}>
      <Canvas
        shadows
        camera={{
          position: [0, 1, 2],
          fov: 45,
        }}
      >
        <Environment preset="sunset" />
        <directionalLight position={[5, 5, 5]} intensity={2} />
        <Avatar />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
