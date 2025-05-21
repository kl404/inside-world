import { useAnimations, useFBX, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import { pb, useConfiguratorStore } from "../store";
import { Asset } from "./Asset";

export const Avatar = ({ animationPath = "/models/Idle.fbx", ...props }) => {
  const group = useRef();
  const { nodes } = useGLTF("/models/Armature.glb");
  const { animations } = useFBX(animationPath);
  const customization = useConfiguratorStore((state) => state.customization);
  const { actions } = useAnimations(animations, group);
  useEffect(() => {
    actions["mixamo.com"]?.play();
  }, [actions]);

  useEffect(() => {
    actions["mixamo.com"]?.play();
  }, [actions]);
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <primitive object={nodes.mixamorigHips} />
          {Object.keys(customization).map(
            (key) =>
              customization[key]?.asset?.url && (
                <Suspense key={customization[key].asset.id}>
                  <Asset
                    categoryName={key}
                    url={pb.files.getUrl(
                      customization[key].asset,
                      customization[key].asset.url
                    )}
                    skeleton={nodes.Plane.skeleton}
                  />
                </Suspense>
              )
          )}
        </group>
      </group>
    </group>
  );
};
