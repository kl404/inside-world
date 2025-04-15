import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Leva } from "leva";
import { DEFAULT_CAMERA_POSITION } from "./r3d/CameraManager";
import { Experience } from "./r3d/Experience";
import { UI } from "./r3d/UI";
import styles from "./AvatarCreator.module.css";

export default function AvatarCreator() {
  return (
    <div className={styles.avatarCreator}>
      <Leva hidden />
      <UI noscrollbarClass={styles.noscrollbar} />
      <div className={styles.canvasContainer}>
        <Canvas
          camera={{
            position: DEFAULT_CAMERA_POSITION,
            fov: 45,
          }}
          gl={{
            preserveDrawingBuffer: true,
          }}
          shadows
        >
          <color attach="background" args={["#130f30"]} />
          <fog attach="fog" args={["#130f30", 10, 40]} />
          <group position-y={-1}>
            <Experience />
          </group>
          <EffectComposer>
            <Bloom mipmapBlur luminanceThreshold={1.2} intensity={1.2} />
          </EffectComposer>
        </Canvas>
      </div>
    </div>
  );
}
