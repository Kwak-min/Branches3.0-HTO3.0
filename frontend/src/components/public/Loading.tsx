import React, { useEffect, useRef, useState, useCallback } from "react";
import styles from "../../assets/scss/etc/loading.module.scss";

// 이미지 임포트
import fullscreenBlack from "../../assets/img/Fullscreen_black.png";
import fullscreen from "../../assets/img/Fullscreen.png";
import screennoise from "../../assets/img/screennoise.png";
import screennoise1 from "../../assets/img/screennoise_1.png";
import screennoise2 from "../../assets/img/screennoise2.png";
import screennoise3 from "../../assets/img/screennoise3.png";
import screennoise4 from "../../assets/img/screennoise4.png";

const frames = [
  fullscreenBlack,
  fullscreen,
  screennoise,
  screennoise1,
  screennoise2,
  screennoise3,
  screennoise4,
];

/**
 * 로딩 컴포넌트 - 프레임 애니메이션
 * - props.intervalMs: 프레임 전환 간격(ms). 기본 800ms
 * - props.className: 외부에서 스타일 덮어쓰기 원할 때
 */
const Loading: React.FC<{ intervalMs?: number; className?: string }> = ({
  intervalMs = 800,
  className,
}) => {
  const [idx, setIdx] = useState(0);
  const isMountedRef = useRef(true);
  const timeoutRef = useRef<number | null>(null);
  const isVisibleRef = useRef(!document.hidden);

  // 이미지 사전 로딩 (깜빡임/지연 최소화)
  useEffect(() => {
    frames.forEach((src) => {
      const img = new Image();
      img.src = src as string;
    });
  }, []);

  // 스케줄 함수를 useCallback으로 정의
  const schedule = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (!isMountedRef.current || !isVisibleRef.current) return;

    timeoutRef.current = window.setTimeout(() => {
      if (isMountedRef.current) {
        setIdx((prev) => (prev + 1) % frames.length);
        schedule();
      }
    }, intervalMs);
  }, [intervalMs]);

  // 가시성 변화 처리
  useEffect(() => {
    const handleVisibility = () => {
      isVisibleRef.current = !document.hidden;
      if (isVisibleRef.current && isMountedRef.current) {
        schedule();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [schedule]);

  // 최초 시작 & 정리
  useEffect(() => {
    isMountedRef.current = true;
    schedule();

    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [schedule]);

  return (
    <div className={className ?? styles.loadingContainer}>
      {/* 단일 이미지에 프레임을 계속 끼워 넣음 */}
      <img
        key={idx}
        src={frames[idx]}
        alt={`loading-frame-${idx}`}
        className={styles.baseImage}
      />

      {/* 필요 시 텍스트 오버레이 유지 */}
      <div className={styles.textOverlay}>
        <h1>HACK</h1>
        <p>THIS OUT 2.0</p>
      </div>
    </div>
  );
};

export default Loading;
