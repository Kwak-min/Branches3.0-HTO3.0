import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../../assets/scss/etc/MainPage.module.scss';

import fullscreenBlack from '../../assets/img/Fullscreen_black.png';
import fullscreen from '../../assets/img/Fullscreen.png';
import screennoise from "../../assets/img/screennoise.png";
import screennoise1 from "../../assets/img/screennoise_1.png";
import screennoise2 from "../../assets/img/screennoise2.png";
import screennoise3 from "../../assets/img/screennoise3.png";
import screennoise4 from "../../assets/img/screennoise4.png";

interface MainPageProps {
  intervalMs?: number;
  className?: string;
}

const noiseFrames = [screennoise, screennoise1, screennoise2, screennoise3, screennoise4];

const MainPage: React.FC<MainPageProps> = ({
  intervalMs = 40,
  className = '',
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);

  const [currentImage, setCurrentImage] = useState(fullscreenBlack);
  const [glitchIntensity, setGlitchIntensity] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // 모든 타이머를 추적하기 위한 ref
  const timersRef = useRef<Set<NodeJS.Timeout>>(new Set());
  const intervalsRef = useRef<Set<NodeJS.Timeout>>(new Set());
  const isMountedRef = useRef(true);

  // 타이머 생성 헬퍼 (추적 가능)
  const safeSetTimeout = useCallback((fn: () => void, delay: number) => {
    const timer = setTimeout(() => {
      timersRef.current.delete(timer);
      if (isMountedRef.current) fn();
    }, delay);
    timersRef.current.add(timer);
    return timer;
  }, []);

  const safeSetInterval = useCallback((fn: () => void, delay: number) => {
    const interval = setInterval(() => {
      if (isMountedRef.current) fn();
    }, delay);
    intervalsRef.current.add(interval);
    return interval;
  }, []);

  // 모든 타이머 정리
  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current.clear();
    intervalsRef.current.forEach(interval => clearInterval(interval));
    intervalsRef.current.clear();
  }, []);

  const handleTransition = useCallback(() => {
    setIsFadingOut(true);
    safeSetTimeout(() => {
      navigate('/manual');
    }, 400);
  }, [navigate, safeSetTimeout]);

  // 키보드 이벤트
  useEffect(() => {
    const handleKeyPress = () => handleTransition();
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleTransition]);

  // 글리치 애니메이션 루프
  useEffect(() => {
    isMountedRef.current = true;
    let noiseIndex = 0;
    let isFirstPhase = true;

    const startLoop = () => {
      if (!isMountedRef.current) return;

      // 첫 화면: fullscreen_black → fullscreen
      if (isFirstPhase) {
        setCurrentImage(fullscreenBlack);
        safeSetTimeout(() => setCurrentImage(fullscreen), 400);
        safeSetTimeout(() => {
          isFirstPhase = false;
          startLoop();
        }, 1000);
        return;
      }

      // 일반 루프
      setCurrentImage(fullscreen);
      safeSetTimeout(() => {
        if (!isMountedRef.current) return;

        const noiseInterval = safeSetInterval(() => {
          setCurrentImage(noiseFrames[noiseIndex % noiseFrames.length]);
          setGlitchIntensity(Math.random() * 0.8 + 0.3);
          noiseIndex++;
        }, intervalMs);

        // 노이즈 끝 → 다시 fullscreen
        safeSetTimeout(() => {
          clearInterval(noiseInterval);
          intervalsRef.current.delete(noiseInterval);
          setCurrentImage(fullscreen);
          setGlitchIntensity(0);
          safeSetTimeout(startLoop, 1200);
        }, 1200);
      }, 800);
    };

    startLoop();

    return () => {
      isMountedRef.current = false;
      clearAllTimers();
    };
  }, [intervalMs, safeSetTimeout, safeSetInterval, clearAllTimers]);

  // 로그인 후 자동 전환
  useEffect(() => {
    if (location.state?.fromLogin) {
      const timer = safeSetTimeout(() => handleTransition(), 6000);
      return () => {
        clearTimeout(timer);
        timersRef.current.delete(timer);
      };
    }
  }, [location.state, handleTransition, safeSetTimeout]);

  const handleClick = () => handleTransition();

  const style = {
    backgroundImage: `url(${currentImage})`,
    filter: `contrast(${1 + glitchIntensity * 0.3}) brightness(${1 + glitchIntensity * 0.2})`,
    transition: 'background-image 0.1s ease-in-out, filter 0.08s ease-in-out',
  };

  return (
    <div
      ref={containerRef}
      style={style}
      onClick={handleClick}
      className={`
        ${styles.glitch}
        ${className}
        ${isFadingOut ? styles.fadeOut : ''}
      `}
    >
      {/* RGB 채널 왜곡 */}
      <div className={`${styles.channel} ${styles.r}`} style={{ opacity: 0.3 + glitchIntensity * 0.5 }}></div>
      <div className={`${styles.channel} ${styles.g}`} style={{ opacity: 0.3 + glitchIntensity * 0.5 }}></div>
      <div className={`${styles.channel} ${styles.b}`} style={{ opacity: 0.3 + glitchIntensity * 0.5 }}></div>

      {/* 스크린 노이즈 오버레이 */}
      <div className={styles.noise} style={{ opacity: 0.25 + glitchIntensity * 0.5 }}></div>
    </div>
  );
};

export default MainPage;
