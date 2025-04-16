import React, { useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import { Avatar } from "../../components/r3d/Avatar";

function StarField() {
  // 创建点的数据
  const { positions, sizes, shifts } = useMemo(() => {
    const positions = [];
    const sizes = [];
    const shifts = [];

    // 创建移动函数
    const pushShift = () => {
      shifts.push(
        Math.random() * Math.PI,
        Math.random() * Math.PI * 2,
        (Math.random() * 0.9 + 0.1) * Math.PI * 0.1,
        Math.random() * 0.9 + 0.1
      );
    };

    // 创建中心球体的点
    for (let i = 0; i < 50000; i++) {
      const point = new THREE.Vector3()
        .randomDirection()
        .multiplyScalar(Math.random() * 0.5 + 9.5);
      positions.push(point.x, point.y, point.z);
      sizes.push(Math.random() * 1.5 + 0.5);
      pushShift();
    }

    // 创建外围的点
    for (let i = 0; i < 100000; i++) {
      const r = 10,
        R = 40;
      const rand = Math.pow(Math.random(), 1.5);
      const radius = Math.sqrt(R * R * rand + (1 - rand) * r * r);
      const point = new THREE.Vector3().setFromCylindricalCoords(
        radius,
        Math.random() * 2 * Math.PI,
        (Math.random() - 0.5) * 2
      );
      positions.push(point.x, point.y, point.z);
      sizes.push(Math.random() * 1.5 + 0.5);
      pushShift();
    }

    return {
      positions: new Float32Array(positions),
      sizes: new Float32Array(sizes),
      shifts: new Float32Array(shifts),
    };
  }, []);

  // 着色器
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        size: { value: 0.125 },
      },
      vertexShader: `
        uniform float time;
        uniform float size;
        attribute float sizes;
        attribute vec4 shift;
        varying vec3 vColor;
        
        void main() {
          vec3 pos = position;
          float t = time;
          float moveT = mod(shift.x + shift.z * t, 6.28318530718);
          float moveS = mod(shift.y + shift.z * t, 6.28318530718);
          pos += vec3(
            cos(moveS) * sin(moveT),
            cos(moveT),
            sin(moveS) * sin(moveT)
          ) * shift.w;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          float d = length(abs(position) / vec3(40.0, 10.0, 40.0));
          d = clamp(d, 0.0, 1.0);
          vColor = mix(
            vec3(0.89, 0.61, 0.0),
            vec3(0.39, 0.20, 1.0),
            d
          );
          
          gl_PointSize = size * sizes * (300.0 / length(mvPosition.xyz));
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          float alpha = 1.0 - smoothstep(0.4, 0.5, d);
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  // 动画
  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.5;
    shaderMaterial.uniforms.time.value = t * Math.PI;
  });

  return (
    <points rotation-z={0.2} material={shaderMaterial}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-sizes"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-shift"
          count={shifts.length / 4}
          array={shifts}
          itemSize={4}
        />
      </bufferGeometry>
    </points>
  );
}

const SkyScene = () => {
  return (
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

        <group position={[0, 2, 0]} scale={3}>
          <Avatar />
        </group>

        <OrbitControls enableDamping dampingFactor={0.05} enablePan={false} />
      </Suspense>
    </Canvas>
  );
};

export default SkyScene;
