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

    // 创建移动函数
    const pushShift = () => {
      shifts.push(
        Math.random() * Math.PI,
        Math.random() * Math.PI * 2,
        (Math.random() * 0.9 + 0.1) * Math.PI * 0.1,
        Math.random() * 0.9 + 0.1
      );
    };

    // 创建蝴蝶花形态
    const createButterflySculpture = () => {
      // 蝴蝶花瓣数
      const petalCount = 5;
      // 每个花瓣上的点数
      const pointsPerPetal = 300;
      // 花朵的基本大小
      const baseSize = 15;
      // 花朵的层数
      const layers = 7;

      // 对每层创建花朵
      for (let layer = 0; layer < layers; layer++) {
        // 每层的大小和高度
        const layerSize = baseSize * (1 - 0.1 * layer);
        const layerHeight = layer * 5 - 15;

        // 为每个花瓣创建点
        for (let petal = 0; petal < petalCount; petal++) {
          const petalAngle = (petal / petalCount) * Math.PI * 2;

          for (let i = 0; i < pointsPerPetal; i++) {
            // 使用参数方程创建花瓣形状
            const t = (i / pointsPerPetal) * Math.PI;

            // 蝴蝶曲线参数方程（修改自蝴蝶曲线）
            const r =
              layerSize * Math.exp(Math.cos(t)) -
              2 * Math.cos(4 * t) +
              Math.pow(Math.sin(t / 12), 5) * Math.sin(petalAngle);

            const theta = t + petalAngle;

            const x = r * Math.cos(theta);
            const z = r * Math.sin(theta);
            const y = layerHeight + Math.sin(t * 3) * 2; // 增加一些波动

            positions.push(x, y, z);
            sizes.push(Math.random() * 0.8 + 0.4);
            pushShift();
          }
        }
      }
    };

    // 创建涟漪波纹
    const createRipples = () => {
      // 涟漪圈数
      const rippleCount = 12;
      // 每圈的点数
      const pointsPerRipple = 500;
      // 涟漪的最大半径
      const maxRadius = 40;

      for (let ripple = 0; ripple < rippleCount; ripple++) {
        const radius = (ripple / rippleCount) * maxRadius;

        for (let i = 0; i < pointsPerRipple; i++) {
          const angle = (i / pointsPerRipple) * Math.PI * 2;
          // 添加一些波动变化
          const radialNoise =
            Math.sin(angle * 8) * 1.5 + Math.cos(angle * 5) * 1.2;
          const actualRadius = radius + radialNoise;

          // 涟漪的x、z坐标
          const x = actualRadius * Math.cos(angle);
          const z = actualRadius * Math.sin(angle);

          // 涟漪的y坐标（高度），形成波浪
          const waveHeight = Math.sin(radius * 0.4) * 3;
          const y = waveHeight + Math.sin(angle * 3) * 0.8;

          positions.push(x, y, z);

          // 根据半径大小调整点的大小
          const sizeFactor = 1 - radius / maxRadius;
          sizes.push(Math.random() * 0.6 + 0.3 + sizeFactor * 0.8);
          pushShift();
        }
      }
    };

    // 创建飘散的粒子云
    const createParticleCloud = () => {
      const particleCount = 25000;
      const cloudRadius = 50;

      for (let i = 0; i < particleCount; i++) {
        // 使用球面坐标创建更均匀的分布
        const phi = Math.acos(2 * Math.random() - 1); // 均匀分布在[-1,1]
        const theta = Math.random() * Math.PI * 2;

        // 添加一些艺术化的分布
        const r = cloudRadius * Math.pow(Math.random(), 0.5);

        // 转换为直角坐标
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.cos(phi);
        const z = r * Math.sin(phi) * Math.sin(theta);

        positions.push(x, y, z);

        // 远离中心的粒子更小
        const distFactor = 1 - r / cloudRadius;
        sizes.push((Math.random() * 0.5 + 0.2) * distFactor);
        pushShift();
      }
    };

    // 创建连接的丝带线
    const createSilkRibbons = () => {
      const ribbonCount = 8;
      const pointsPerRibbon = 500;

      for (let r = 0; r < ribbonCount; r++) {
        // 每条丝带的起始角度
        const startAngle = (r / ribbonCount) * Math.PI * 2;

        for (let i = 0; i < pointsPerRibbon; i++) {
          const t = i / pointsPerRibbon;
          // 螺旋参数
          const radius = 5 + t * 35; // 丝带由内向外延伸
          const heightScale = 15;
          const rotations = 3; // 旋转次数

          // 螺旋上升的角度
          const angle = startAngle + t * Math.PI * 2 * rotations;

          // 螺旋坐标
          const x = radius * Math.cos(angle);
          const z = radius * Math.sin(angle);

          // 螺旋高度，加入波动
          const y = Math.sin(t * Math.PI * 2) * heightScale;

          positions.push(x, y, z);
          sizes.push(Math.random() * 0.7 + 0.5);
          pushShift();
        }
      }
    };

    // 调用创建函数
    createButterflySculpture();
    createRipples();
    createSilkRibbons();
    createParticleCloud();

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
        attribute vec4 shift;
        varying vec3 vColor;
        
        void main() {
          vec3 pos = position;
          float t = time;
          
          // 使用低频能量影响粒子的位置
          float moveT = mod(shift.x + shift.z * t + bassEnergy * 0.01, 6.28318530718);
          float moveS = mod(shift.y + shift.z * t + midEnergy * 0.01, 6.28318530718);
          
          // 使用高频能量影响移动幅度
          float amplitude = shift.w * (1.0 + trebleEnergy * 0.01);
          
          // 添加更有艺术感的运动
          float flowFactor = sin(pos.x * 0.05 + t) * cos(pos.z * 0.05 + t) * sin(pos.y * 0.05 + t * 0.7);
          
          pos += vec3(
            cos(moveS) * sin(moveT) + sin(t * 0.5 + pos.y * 0.1) * 0.2,
            cos(moveT) + flowFactor * 0.3,
            sin(moveS) * sin(moveT) + sin(t * 0.6 + pos.x * 0.1) * 0.2
          ) * amplitude;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          // 基于位置生成颜色 - 恢复初始蝴蝶花版本的颜色
          float distFromCenter = length(pos.xz) / 60.0;
          float heightFactor = abs(pos.y) / 30.0;
          float colorMix = clamp(distFromCenter + heightFactor, 0.0, 1.0);
          
          // 使用音量和频率影响颜色
          vec3 colorA = mix(
            vec3(0.1, 0.5, 1.0), // 蓝色基调
            vec3(0.9, 0.3, 1.0), // 紫色调
            bassEnergy * 0.008
          );
          
          vec3 colorB = mix(
            vec3(0.9, 0.6, 0.1), // 金色
            vec3(1.0, 0.3, 0.2), // 红色
            trebleEnergy * 0.008
          );
          
          vColor = mix(colorA, colorB, colorMix);
          
          // 使用音量影响粒子大小
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
    const t = state.clock.elapsedTime * 0.2; // 更慢的旋转速度
    shaderMaterial.uniforms.time.value = t * Math.PI;

    // 更新音频相关的 uniform 值
    shaderMaterial.uniforms.bassEnergy.value = audioData.bassEnergy;
    shaderMaterial.uniforms.midEnergy.value = audioData.midEnergy;
    shaderMaterial.uniforms.trebleEnergy.value = audioData.trebleEnergy;
    shaderMaterial.uniforms.volume.value = audioData.volume;
  });

  return (
    <points
      rotation-y={Math.PI * 0.1}
      rotation-x={Math.PI * 0.1}
      material={shaderMaterial}
    >
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

export default StarField;
