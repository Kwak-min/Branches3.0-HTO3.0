'use client';

import { useState, FormEvent } from 'react';

const chapters = [
  {
    id: 'basic-web',
    title: '챕터 1: 웹 기초',
    summary: '브라우저, HTTP, HTML, CSS, JavaScript 기초를 확인합니다.',
    questions: [
      { title: '문제 1', text: '웹 페이지의 구조를 표현하는 마크업 언어는?', answer: 'HTML' },
      { title: '문제 2', text: '웹 페이지의 스타일을 담당하는 언어는?', answer: 'CSS' },
      { title: '문제 3', text: '브라우저에서 동작하는 대표 스크립트 언어는?', answer: 'JAVASCRIPT' },
      { title: '문제 4', text: '웹 주소를 뜻하는 세 글자 약어는?', answer: 'URL' },
      { title: '문제 5', text: '클라이언트가 서버에 데이터를 요청할 때 주로 사용하는 프로토콜은?', answer: 'HTTP' },
      { title: '문제 6', text: '암호화된 HTTP를 뜻하는 약어는?', answer: 'HTTPS' },
      { title: '문제 7', text: '웹 페이지를 해석하고 보여주는 프로그램은?', answer: '브라우저' },
      { title: '문제 8', text: '서버가 클라이언트에게 돌려주는 결과를 무엇이라고 하나요?', answer: '응답' },
      { title: '문제 9', text: '클라이언트가 서버에게 보내는 요구를 무엇이라고 하나요?', answer: '요청' },
      { title: '문제 10', text: 'HTML에서 링크를 만드는 태그 이름은?', answer: 'A' }
    ]
  },
  {
    id: 'security-start',
    title: '챕터 2: 보안 입문',
    summary: '인증, 권한, 입력 검증, 세션 같은 기본 보안 개념을 풉니다.',
    questions: [
      { title: '문제 1', text: '사용자가 누구인지 확인하는 절차는?', answer: '인증' },
      { title: '문제 2', text: '사용자가 무엇을 할 수 있는지 확인하는 절차는?', answer: '권한' },
      { title: '문제 3', text: '사용자 입력을 믿지 않고 확인하는 과정은?', answer: '검증' },
      { title: '문제 4', text: '로그인 상태를 유지하기 위해 서버와 브라우저가 사용하는 값은?', answer: '세션' },
      { title: '문제 5', text: '브라우저에 저장되는 작은 데이터 조각은?', answer: '쿠키' },
      { title: '문제 6', text: '비밀번호를 원문이 아닌 값으로 바꾸어 저장하는 방식은?', answer: '해시' },
      { title: '문제 7', text: 'SQL 문법을 악용하는 대표 웹 취약점은?', answer: 'SQLI' },
      { title: '문제 8', text: '스크립트를 삽입해 실행시키는 대표 웹 취약점은?', answer: 'XSS' },
      { title: '문제 9', text: '중요 정보를 아무나 볼 수 없게 바꾸는 과정은?', answer: '암호화' },
      { title: '문제 10', text: '보안 문제를 찾기 위해 수행하는 공격 시뮬레이션은?', answer: '모의해킹' }
    ]
  }
];

interface Chapter {
  id: string;
  title: string;
  summary: string;
  questions: Question[];
}

interface Question {
  title: string;
  text: string;
  answer: string;
}

export default function Home() {
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState({ state: '', message: '' });

  const startChapter = (chapter: Chapter) => {
    setCurrentChapter(chapter);
    setCurrentQuestionIndex(0);
    setAnswer('');
    setFeedback({ state: 'info', message: '정답을 입력하면 다음 문제로 넘어갑니다.' });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!currentChapter) return;

    const question = currentChapter.questions[currentQuestionIndex];
    const submitted = answer.trim().replace(/\s+/g, ' ').toUpperCase();
    const expected = question.answer.toUpperCase();

    if (!submitted) {
      setFeedback({ state: 'error', message: '답안이 필요합니다. 검증하기 전에 토큰을 입력하세요.' });
      return;
    }

    if (submitted !== expected) {
      setFeedback({ state: 'error', message: '토큰이 올바르지 않습니다. 단서를 다시 확인하고 시도하세요.' });
      return;
    }

    if (currentQuestionIndex === currentChapter.questions.length - 1) {
      setFeedback({ state: 'success', message: '챕터 완료! 모든 문제를 해결했습니다.' });
      setTimeout(() => {
        setCurrentChapter(null);
        setCurrentQuestionIndex(0);
      }, 1500);
      return;
    }

    setFeedback({ state: 'success', message: '정답입니다. 다음 문제로 이동합니다.' });
    setTimeout(() => {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAnswer('');
      setFeedback({ state: 'info', message: '정답을 입력하면 다음 문제로 넘어갑니다.' });
    }, 600);
  };

  const progressPercent = currentChapter
    ? (currentQuestionIndex / currentChapter.questions.length) * 100
    : 0;

  return (
    <div className="app-shell">
      <header className="top-bar">
        <div>
          <a className="brand-mark" href="#home">
            <span className="brand-icon">⌁</span>
            <span>BRANCHES</span>
          </a>

          <nav className="icon-nav">
            <button className="nav-icon" type="button" aria-label="홈">
              <span aria-hidden="true">🏠</span>
              <span className="nav-tooltip">홈</span>
            </button>
            <button className="nav-icon" type="button" aria-label="사용자 관리">
              <span aria-hidden="true">👤</span>
              <span className="nav-tooltip">사용자 관리</span>
            </button>
            <button className="nav-icon" type="button" aria-label="친구">
              <span aria-hidden="true">🧑‍🤝‍🧑</span>
              <span className="nav-tooltip">친구</span>
            </button>
            <button className="nav-icon" type="button" aria-label="설정">
              <span aria-hidden="true">⚙️</span>
              <span className="nav-tooltip">설정</span>
            </button>
          </nav>
        </div>
      </header>

      <main id="home" className="main-stage">
        {!currentChapter ? (
          <>
            <section className="hero-panel">
              <div>
                <p className="eyebrow">GREEN BASE TRAINING</p>
                <h1>챕터를 선택하고 문제를 해결하세요</h1>
                <p className="hero-copy">
                  챕터에 들어가면 10개의 문제가 순서대로 표시됩니다. 정답을 맞히면 다음 문제로 넘어가고,
                  틀리면 같은 문제에서 다시 시도합니다.
                </p>
              </div>
              <aside className="status-card">
                <span className="status-label">현재 진행</span>
                <strong>챕터를 선택하세요</strong>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: '0%' }}></div>
                </div>
              </aside>
            </section>

            <section className="chapter-section">
              <div className="section-title">
                <p className="eyebrow">CHAPTER SELECT</p>
                <h2>학습 챕터</h2>
              </div>
              <div className="chapter-grid">
                {chapters.map((chapter, index) => (
                  <button
                    key={chapter.id}
                    className="chapter-card"
                    data-number={String(index + 1).padStart(2, '0')}
                    onClick={() => startChapter(chapter)}
                  >
                    <p className="eyebrow">CHAPTER {index + 1}</p>
                    <h3>{chapter.title}</h3>
                    <p>{chapter.summary}</p>
                    <span className="chapter-meta">10문제 시작하기 →</span>
                  </button>
                ))}
              </div>
            </section>
          </>
        ) : (
          <section className="quiz-panel">
            <div className="quiz-topline">
              <button
                className="ghost-button"
                type="button"
                onClick={() => setCurrentChapter(null)}
              >
                ← 챕터 선택으로
              </button>
              <span className="counter-pill">
                {currentQuestionIndex + 1} / {currentChapter.questions.length}
              </span>
            </div>

            <div className="quiz-card">
              <p className="eyebrow">{currentChapter.title}</p>
              <h2>{currentChapter.questions[currentQuestionIndex].title}</h2>
              <p className="question-text">
                {currentChapter.questions[currentQuestionIndex].text}
              </p>

              <form className="answer-form" onSubmit={handleSubmit}>
                <label htmlFor="answerInput">정답 입력</label>
                <div className="answer-row">
                  <input
                    id="answerInput"
                    name="answer"
                    autoComplete="off"
                    placeholder="정답을 입력하세요"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                  />
                  <button className="action-button" type="submit">
                    확인
                  </button>
                </div>
                {feedback.message && (
                  <p className="feedback" data-state={feedback.state}>
                    {feedback.message}
                  </p>
                )}
              </form>
            </div>

            <aside className="status-card" style={{ marginTop: '2rem' }}>
              <span className="status-label">현재 진행</span>
              <strong>
                {currentChapter.title} · {currentQuestionIndex + 1}/{currentChapter.questions.length}
              </strong>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </aside>
          </section>
        )}
      </main>
    </div>
  );
}
