import {
  Object3D,
  SkinnedMesh,
  Material,
  BufferGeometry,
  SkeletonHelper,
} from "three";
import { ReactNode } from "react";

export interface AssetProps {
  url: string;
  categoryName: string;
  skeleton: SkeletonHelper | any;
}

export interface AvatarProps {
  [key: string]: any;
}

export interface CameraManagerProps {
  loading: boolean;
}

export interface ExperienceProps {
  [key: string]: any;
}

export interface LoadingAvatarProps {
  loading: boolean;
}

export interface UIProps {
  noscrollbarClass?: string;
}

export interface MusicControlsProps {
  [key: string]: any;
}

export interface PianoProps {
  [key: string]: any;
}

export interface SkySceneProps {
  [key: string]: any;
}

export interface StarFieldProps {
  [key: string]: any;
}

export interface ItemProps {
  geometry: BufferGeometry;
  material: Material;
  morphTargetDictionary?: { [key: string]: number };
  morphTargetInfluences?: Float32Array;
}

export interface AvatarWrapperProps {
  loading: boolean;
  children: ReactNode;
}
