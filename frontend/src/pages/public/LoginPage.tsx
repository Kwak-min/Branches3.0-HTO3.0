import React, { useState, useContext, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../assets/scss/etc/MainPage.module.scss';

import LoginForm from '../../components/login/LoginForm';
import RegisterForm from '../../components/login/RegisterForm';
import Modal from '../../components/modal/Modal';
import Loading from '../../components/public/Loading';

import { AuthUserContext } from '../../contexts/AuthUserContext';

import fullscreenBlack from '../../assets/img/Fullscreen_black.png';
import fullscreen from '../../assets/img/Fullscreen.png';
import screennoise from "../../assets/img/screennoise.png";
import screennoise1 from "../../assets/img/screennoise_1.png";
import screennoise2 from "../../assets/img/screennoise2.png";
import screennoise3 from "../../assets/img/screennoise3.png";
import screennoise4 from "../../assets/img/screennoise4.png";

interface LoginPageProps {
  intervalMs?: number;
}

const noiseFrames = [screennoise, screennoise1, screennoise2, screennoise3, screennoise4];

const LoginPage: React.FC<LoginPageProps> = ({ intervalMs = 40 }) => {
  const navigate = useNavigate();
  const { isLoggedIn, isLoading } = useContext(AuthUserContext)!;

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [currentImage, setCurrentImage] = useState(fullscreenBlack);
  const [glitchIntensity, setGlitchIntensity] = useState(0);

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

  useEffect(() => {
    if (!isLoading && isLoggedIn) navigate('/');
  }, [isLoggedIn, isLoading, navigate]);

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

  const style = {
    backgroundImage: `url(${currentImage})`,
    filter: `contrast(${1 + glitchIntensity * 0.3}) brightness(${1 + glitchIntensity * 0.2})`,
    transition: 'background-image 0.1s ease-in-out, filter 0.08s ease-in-out',
  };

  // 로딩 중일 때는 Loading 컴포넌트 표시
  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      {/* MainPage와 동일한 글리치 배경 */}
      <div
        ref={containerRef}
        style={style}
        onClick={() => setShowLoginModal(true)}
        className={styles.glitch}
      >
        {/* RGB 채널 왜곡 */}
        <div className={`${styles.channel} ${styles.r}`} style={{ opacity: 0.3 + glitchIntensity * 0.5 }}></div>
        <div className={`${styles.channel} ${styles.g}`} style={{ opacity: 0.3 + glitchIntensity * 0.5 }}></div>
        <div className={`${styles.channel} ${styles.b}`} style={{ opacity: 0.3 + glitchIntensity * 0.5 }}></div>

        {/* 스크린 노이즈 오버레이 */}
        <div className={styles.noise} style={{ opacity: 0.25 + glitchIntensity * 0.5 }}></div>
      </div>

      {/* 로그인 모달 */}
      <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)}>
        <LoginForm openRegisterModal={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }} />
      </Modal>

      {/* 회원가입 모달 */}
      <Modal isOpen={showRegisterModal} onClose={() => setShowRegisterModal(false)}>
        <RegisterForm closeRegisterModal={() => setShowRegisterModal(false)} />
      </Modal>
    </>
  );
};

export default LoginPage;
