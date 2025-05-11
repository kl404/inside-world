import React, { useEffect, useState } from "react";
import styles from "./Piano.module.css";

const Piano = () => {
  const [isVisible, setIsVisible] = useState(true);

  const keyMap = {
    a: { note: "C4", key: "A" },
    s: { note: "D4", key: "S" },
    d: { note: "E4", key: "D" },
    f: { note: "F4", key: "F" },
    g: { note: "G4", key: "G" },
    h: { note: "A4", key: "H" },
    j: { note: "B4", key: "J" },
    k: { note: "C5", key: "K" },
  };

  useEffect(() => {
    // 创建音频上下文
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();

    const playNote = (frequency) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.00001,
        audioContext.currentTime + 1
      );

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 1);
    };

    const getFrequency = (note) => {
      const notes = {
        C4: 261.63,
        D4: 293.66,
        E4: 329.63,
        F4: 349.23,
        G4: 392.0,
        A4: 440.0,
        B4: 493.88,
        C5: 523.25,
      };
      return notes[note];
    };

    const handleKeyDown = (event) => {
      if (!isVisible) return;

      const key = event.key.toLowerCase();
      if (keyMap[key]) {
        const pianoKey = document.querySelector(
          `[data-note="${keyMap[key].note}"]`
        );
        if (pianoKey && !event.repeat) {
          pianoKey.classList.add(styles.active);
          playNote(getFrequency(keyMap[key].note));
        }
      }
    };

    const handleKeyUp = (event) => {
      const key = event.key.toLowerCase();
      if (keyMap[key]) {
        const pianoKey = document.querySelector(
          `[data-note="${keyMap[key].note}"]`
        );
        if (pianoKey) {
          pianoKey.classList.remove(styles.active);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isVisible]);

  const togglePiano = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div
      className={`${styles.pianoContainer} ${
        isVisible ? styles.visible : styles.hidden
      }`}
    >
      <button className={styles.toggleButton} onClick={togglePiano}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {isVisible ? (
            <path d="M19 12H5M12 5l-7 7 7 7" />
          ) : (
            <path d="M9 18l6-6-6-6" />
          )}
        </svg>
      </button>
      {isVisible && (
        <div className={styles.piano}>
          {Object.entries(keyMap).map(([key, { note, key: label }]) => (
            <div key={note} data-note={note} className={styles.key}>
              {label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Piano;
