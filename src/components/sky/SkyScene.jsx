import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const SkyScene = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 清除控制台
    console.clear();

    // 创建场景
    const scene = new THREE.Scene();
    // 设置场景背景颜色
    scene.background = new THREE.Color(0x160016);

    // 创建相机
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    // 设置相机位置
    camera.position.set(0, 4, 21);

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    // 设置渲染器大小
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 把渲染器加入到页面中
    containerRef.current.appendChild(renderer.domElement);

    // 监听窗口大小变化事件
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // 创建控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    // 开启阻尼效果
    controls.enableDamping = true;
    // 禁用面板
    controls.enablePan = false;

    // 创建全局uniform
    const gu = {
      time: { value: 0 },
      size: { value: 0.125 },
    };

    // 创建点的大小数组和移动数组
    const sizes = [];
    const shift = [];

    // 创建移动函数
    const pushShift = () => {
      shift.push(
        Math.random() * Math.PI,
        Math.random() * Math.PI * 2,
        (Math.random() * 0.9 + 0.1) * Math.PI * 0.1,
        Math.random() * 0.9 + 0.1
      );
    };

    // 创建点的顶点数组（中间的球体）
    const pts = new Array(50000).fill().map(() => {
      sizes.push(Math.random() * 1.5 + 0.5);
      pushShift();
      return new THREE.Vector3()
        .randomDirection()
        .multiplyScalar(Math.random() * 0.5 + 9.5);
    });

    // 添加更多的点（旁边围绕的）
    for (let i = 0; i < 100000; i++) {
      const r = 10,
        R = 40;
      const rand = Math.pow(Math.random(), 1.5);
      const radius = Math.sqrt(R * R * rand + (1 - rand) * r * r);
      pts.push(
        new THREE.Vector3().setFromCylindricalCoords(
          radius,
          Math.random() * 2 * Math.PI,
          (Math.random() - 0.5) * 2
        )
      );
      sizes.push(Math.random() * 1.5 + 0.5);
      pushShift();
    }

    // 创建几何体
    const g = new THREE.BufferGeometry().setFromPoints(pts);
    g.setAttribute("sizes", new THREE.Float32BufferAttribute(sizes, 1));
    g.setAttribute("shift", new THREE.Float32BufferAttribute(shift, 4));

    // 创建点材质
    const m = new THREE.ShaderMaterial({
      uniforms: gu,
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

    // 创建点云并将其添加到场景中
    const p = new THREE.Points(g, m);
    // 旋转角度 0.2
    p.rotation.z = 0.2;
    scene.add(p);

    // 创建时钟
    const clock = new THREE.Clock();

    // 渲染循环
    const animate = () => {
      controls.update();
      const t = clock.getElapsedTime() * 0.5;
      gu.time.value = t * Math.PI;
      p.rotation.y = t * 0.05;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // 组件卸载时清理
    return () => {
      window.removeEventListener("resize", handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      g.dispose();
      m.dispose();
    };
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
};

export default SkyScene;
