import { Canvas } from "@react-three/fiber";
import { Experience } from "./r3d/Experience";
import { UI } from "./r3d/UI";
import React from "react";

export default function AvatarCreator(): React.ReactElement {
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
    <UI />
    <Canvas
      camera={{
        position: [-1, 1, 5],
        fov: 45,
      }}
      shadows
    >
      <color attach="background" args={["#555"]} />
      <fog attach="fog" args={["#555", 15, 25]} />
      <group position-y={-1}>
        <Experience />
      </group>
    </Canvas>
  </div>
  );
}
