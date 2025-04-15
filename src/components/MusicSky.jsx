import React, { useState, useEffect } from "react";
import styles from "./MusicSky.module.css";
import SkyScene from "./sky/SkyScene";
import MusicControls from "./sky/MusicControls";
import { Link } from "react-router-dom";

export default function MusicSky() {
  const [isLoading, setIsLoading] = useState(true);

  // 模拟加载过程
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2秒后显示内容

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.musicSkyContainer}>
      {/* 加载状态 */}
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingContent}>
            <h2>halo~~...</h2>
            <div className={styles.spinner}></div>
          </div>
        </div>
      )}

     

      {/* 返回按钮 */}
      <Link to="/dashboard" className={styles.backButton}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back
      </Link>

      {/* 音乐控制器 */}
      <MusicControls />

      {/* Three.js场景 */}
      <div className={styles.sceneContainer}>
        <SkyScene />
      </div>
    </div>
  );
}
