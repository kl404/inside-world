import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import { Mesh, Object3D } from "three";
import { AssetProps, ItemProps } from "../../types/components";
import { useConfiguratorStore } from "../store";

export const Asset = ({ url, categoryName, skeleton }: AssetProps) => {
  const { scene } = useGLTF(url);

  const customization = useConfiguratorStore((state) => state.customization);
  const lockedGroups = useConfiguratorStore((state) => state.lockedGroups);

  const assetColor = customization[categoryName]?.color;

  const skin = useConfiguratorStore((state) => state.skin);

  useEffect(() => {
    scene.traverse((child: Object3D) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        if (
          mesh.material &&
          "name" in mesh.material &&
          typeof mesh.material.name === "string" &&
          mesh.material.name.includes("Color_")
        ) {
          if (
            "color" in mesh.material &&
            mesh.material.color &&
            typeof mesh.material.color.set === "function"
          ) {
            mesh.material.color.set(assetColor);
          }
        }
      }
    });
  }, [assetColor, scene]);

  const attachedItems = useMemo(() => {
    const items: ItemProps[] = [];
    scene.traverse((child: Object3D) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        items.push({
          geometry: mesh.geometry,
          material:
            "name" in mesh.material &&
            typeof mesh.material.name === "string" &&
            mesh.material.name.includes("Skin_")
              ? skin
              : mesh.material,
          morphTargetDictionary: mesh.morphTargetDictionary,
          morphTargetInfluences: mesh.morphTargetInfluences,
        });
      }
    });
    return items;
  }, [scene, skin]);

  if (lockedGroups[categoryName]) {
    return null;
  }

  return (
    <>
      {attachedItems.map((item, index) => (
        <skinnedMesh
          key={index}
          geometry={item.geometry}
          material={item.material}
          skeleton={skeleton}
          morphTargetDictionary={item.morphTargetDictionary}
          morphTargetInfluences={item.morphTargetInfluences}
          castShadow
          receiveShadow
        />
      ))}
    </>
  );
};
