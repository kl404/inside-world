import React, { useMemo, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function StarField() {
  const [audioData, setAudioData] = useState({
    bassEnergy: 0,
    midEnergy: 0,
    trebleEnergy: 0,
    volume: 0,
  });

  useEffect(() => {
    const handleAudioData = (event) => {
      setAudioData(event.detail);
    };

    window.addEventListener("audioData", handleAudioData);
    return () => window.removeEventListener("audioData", handleAudioData);
  }, []);

  // 创建点的数据
  const { positions, sizes, shifts } = useMemo(() => {
    const positions = [];
    const sizes = [];
    const shifts = [];

    // 创建移动函数 - 极度简化版
    // 只存储随机起始位置和移动幅度两个值
    const pushShift = () => {
      shifts.push(
        Math.random(), // 第一个值：随机的起始位置 (0-1)
        Math.random() * 0.5 + 0.5 // 第二个值：随机的移动幅度 (0.5-1)
      );
    };

    // 创建外围星云结构
    for (let i = 0; i < 100000; i++) {
      // 基础参数
      const r = 10,
        R = 40;

      // 创建不规则的外围结构
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI - Math.PI / 2;

      // 添加一些不规则性
      const distortion =
        1 + Math.sin(theta * 5) * 0.2 + Math.cos(phi * 3) * 0.3;

      // 使用幂律分布创建更自然的密度梯度
      const rand = Math.pow(Math.random(), 1.3);
      const radius = Math.sqrt(R * R * rand + (1 - rand) * r * r) * distortion;

      // 创建略微扁平的椭球体
      const flatness = 0.4; // 扁平程度
      const x = radius * Math.cos(theta) * Math.cos(phi);
      const y = radius * Math.sin(phi) * flatness;
      const z = radius * Math.sin(theta) * Math.cos(phi);

      positions.push(x, y, z);

      // 根据位置调整大小
      const distanceFromCenter = Math.sqrt(x * x + y * y + z * z);
      const sizeVariation =
        1 - Math.min(1, Math.max(0, (distanceFromCenter - r) / (R - r))) * 0.5;
      sizes.push(Math.random() * 1.5 * sizeVariation + 0.5);

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
        bassEnergy: { value: 0 },
        midEnergy: { value: 0 },
        trebleEnergy: { value: 0 },
        volume: { value: 0 },
      },
      vertexShader: `
        uniform float time;
        uniform float size;
        uniform float bassEnergy;
        uniform float midEnergy;
        uniform float trebleEnergy;
        uniform float volume;
        attribute float sizes;
        attribute vec2 shift;
        varying vec3 vColor;
        
        void main() {
          vec3 pos = position;
          float t = time;
          
          // 超级简单的粒子运动 - 纯粹的上下移动
          // shift.x: 随机的起始位置
          // shift.y: 随机的移动幅度
          
          // 简单的正弦波上下移动
          float upDown = sin(t + shift.x * 10.0) * 0.5;
          
          // 音量影响移动幅度
          float moveAmount = upDown * shift.y * (1.0 + volume * 0.01);
          
          // 只做简单的上下移动
          pos.y += moveAmount;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          float d = length(abs(position) / vec3(40.0, 10.0, 40.0));
          d = clamp(d, 0.0, 1.0);
          
          // 使用音量影响颜色
          vec3 colorA = mix(
            vec3(1.0, 0.2, 0.2),    // 红色
            vec3(0.89, 0.61, 0.0),  // 橙黄色
            volume * 0.01
          );
          
          vec3 colorB = mix(
            vec3(0.2, 0.8, 1.0),    // 天蓝色
            vec3(0.39, 0.20, 1.0),  // 蓝紫色
            volume * 0.01
          );
          
          vColor = mix(colorA, colorB, d);
          
          // 使用音量影响星星大小
          gl_PointSize = size * sizes * (300.0 / length(mvPosition.xyz)) * (1.0 + volume * 0.005);
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

    // 更新音频相关的 uniform 值
    shaderMaterial.uniforms.bassEnergy.value = audioData.bassEnergy;
    shaderMaterial.uniforms.midEnergy.value = audioData.midEnergy;
    shaderMaterial.uniforms.trebleEnergy.value = audioData.trebleEnergy;
    shaderMaterial.uniforms.volume.value = audioData.volume;
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
          count={shifts.length / 2}
          array={shifts}
          itemSize={2}
        />
      </bufferGeometry>
    </points>
  );
}

export default StarField;
