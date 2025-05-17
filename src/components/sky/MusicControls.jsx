import React, { useState, useRef, useEffect, useCallback } from "react";
import styles from "./MusicControls.module.css";

// 预定义的音乐列表
const musicList = [
  {
    id: 1,
    title: "Lucy Liu",
    artist: "PSY.P",
    file: "/mp3/Lucy Liu.mp3",
  },
];

const MusicControls = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceNodeRef = useRef(null);

  // 初始化音频分析器
  const initializeAudioAnalyser = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048; // FFT大小，决定了频率数据的精度

      // 连接音频节点
      sourceNodeRef.current = audioContextRef.current.createMediaElementSource(
        audioRef.current
      );
      sourceNodeRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
    }
  }, []);

  // 获取音频数据
  const getAudioData = useCallback(() => {
    if (!analyserRef.current || !isPlaying) return null;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // 获取频率数据
    analyserRef.current.getByteFrequencyData(dataArray);

    // 计算低、中、高频能量
    const bassEnergy = dataArray.slice(0, 20).reduce((a, b) => a + b) / 20;
    const midEnergy = dataArray.slice(20, 60).reduce((a, b) => a + b) / 40;
    const trebleEnergy = dataArray.slice(60, 100).reduce((a, b) => a + b) / 40;

    return {
      frequencyData: Array.from(dataArray),
      bassEnergy,
      midEnergy,
      trebleEnergy,
      volume: dataArray.reduce((a, b) => a + b) / bufferLength,
    };
  }, [isPlaying]);

  // 处理播放/暂停
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // 确保音频上下文已初始化
      if (!audioContextRef.current) {
        initializeAudioAnalyser();
      }
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // 处理上一首
  const playPrevious = () => {
    const newTrack =
      currentTrack === 0 ? musicList.length - 1 : currentTrack - 1;
    setCurrentTrack(newTrack);
  };

  // 处理下一首
  const playNext = () => {
    const newTrack =
      currentTrack === musicList.length - 1 ? 0 : currentTrack + 1;
    setCurrentTrack(newTrack);
  };

  // 处理音量变化
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  // 处理进度条变化
  const handleProgressChange = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    audioRef.current.currentTime = time;
  };

  // 音频加载完成时设置持续时间
  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
    if (isPlaying) {
      audioRef.current.play();
    }
  };

  // 音频时间更新
  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  // 音频结束时自动播放下一首
  const handleEnded = () => {
    playNext();
  };

  // 切换播放器展开/折叠状态
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // 格式化时间显示
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // 当当前曲目变化时，更新音频源
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = musicList[currentTrack].file;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentTrack]);

  // 动画帧更新
  useEffect(() => {
    let animationFrameId;

    const updateAudioData = () => {
      const audioData = getAudioData();
      if (audioData) {
        // 发送自定义事件，包含音频数据
        window.dispatchEvent(
          new CustomEvent("audioData", { detail: audioData })
        );
      }
      animationFrameId = requestAnimationFrame(updateAudioData);
    };

    if (isPlaying) {
      updateAudioData();
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isPlaying, getAudioData]);

  return (
    <div
      className={`${styles.musicControls} ${isExpanded ? styles.expanded : ""}`}
    >
      <div className={styles.toggleButton} onClick={toggleExpand}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {isExpanded ? (
            <path d="M19 12H5M12 5l-7 7 7 7" />
          ) : (
            <path d="M9 18l6-6-6-6" />
          )}
        </svg>
      </div>

      <div className={styles.controlsContainer}>
        <div className={styles.trackInfo}>
          <h3>{musicList[currentTrack].title}</h3>
          <p>{musicList[currentTrack].artist}</p>
        </div>

        <div className={styles.progressContainer}>
          <span className={styles.timeInfo}>{formatTime(currentTime)}</span>
          <input
            type="range"
            className={styles.progressBar}
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleProgressChange}
          />
          <span className={styles.timeInfo}>{formatTime(duration)}</span>
        </div>

        <div className={styles.controlButtons}>
          <button onClick={playPrevious} className={styles.controlButton}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="19 20 9 12 19 4 19 20"></polygon>
              <line x1="5" y1="19" x2="5" y2="5"></line>
            </svg>
          </button>
          <button
            onClick={togglePlay}
            className={`${styles.controlButton} ${styles.playButton}`}
          >
            {isPlaying ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            )}
          </button>
          <button onClick={playNext} className={styles.controlButton}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="5 4 15 12 5 20 5 4"></polygon>
              <line x1="19" y1="5" x2="19" y2="19"></line>
            </svg>
          </button>
        </div>

        <div className={styles.volumeContainer}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.volumeIcon}
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            {volume > 0 && (
              <>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                {volume > 0.5 && (
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                )}
              </>
            )}
          </svg>
          <input
            type="range"
            className={styles.volumeSlider}
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
          />
        </div>
      </div>

      <audio
        ref={audioRef}
        src={musicList[currentTrack].file}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        preload="metadata"
      />
    </div>
  );
};

export default MusicControls;
