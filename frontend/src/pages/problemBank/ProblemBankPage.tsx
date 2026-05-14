import React, { useMemo, useState } from 'react';
import Main from '../../components/main/Main';
import {
  difficultyProfiles,
  hackingProblems,
  problemChapters,
  type HackingProblem,
  type ProblemDifficulty,
} from '../../data/problemBank';
import '../../assets/scss/problemBank/ProblemBankPage.scss';

type ExamResult = 'idle' | 'correct' | 'wrong';
type FlowStep = 'difficulty' | 'chapter' | 'problem' | 'solve';
type WorkspaceFile = {
  name: string;
  content: string;
};

const getDifficultyClass = (difficulty: HackingProblem['difficulty']) => difficulty.toLowerCase();

const normalizeForGrading = (value: string) => value
  .trim()
  .toLowerCase()
  .replace(/^hto\{/, '')
  .replace(/\}$/, '')
  .replace(/[`'"\s{}]/g, '')
  .replace(/[_-]/g, '');

const calculateSimilarityScore = (submittedAnswer: string, expectedAnswer: string) => {
  const submitted = normalizeForGrading(submittedAnswer);
  const expected = normalizeForGrading(expectedAnswer);

  if (!submitted) return 0;
  if (submitted === expected) return 100;
  if (submitted.includes(expected) || expected.includes(submitted)) return 82;

  const submittedChars = new Set(submitted.split(''));
  const expectedChars = new Set(expected.split(''));
  const matchedChars = [...submittedChars].filter((char) => expectedChars.has(char)).length;
  const charScore = Math.round((matchedChars / Math.max(expectedChars.size, 1)) * 55);
  const lengthGap = Math.abs(submitted.length - expected.length);
  const lengthScore = Math.max(0, 25 - lengthGap * 3);
  const prefixScore = expected.startsWith(submitted.slice(0, Math.min(submitted.length, 4))) ? 20 : 0;

  return Math.min(99, charScore + lengthScore + prefixScore);
};

const getProblemWorkspace = (problem: HackingProblem, chapterTitle: string): WorkspaceFile[] => [
  {
    name: 'README.md',
    content: [
      `# ${problem.id} ${problem.title}`,
      `난이도: ${problem.difficulty}`,
      `챕터: ${chapterTitle}`,
      '',
      problem.scenario,
      '',
      `목표: ${problem.objective}`,
    ].join('\n'),
  },
  {
    name: 'target.txt',
    content: problem.objective,
  },
  {
    name: 'tags.txt',
    content: problem.tags.map((tag) => `#${tag}`).join(' '),
  },
  {
    name: 'hint1.txt',
    content: problem.hints[0] ?? '이 문제에는 첫 번째 힌트가 없습니다.',
  },
  {
    name: 'hint2.txt',
    content: problem.hints[1] ?? '이 문제에는 두 번째 힌트가 없습니다.',
  },
  {
    name: 'submit.sh',
    content: '사용법: ./submit.sh HTO{your_answer}\n또는 submit HTO{your_answer}',
  },
];

const formatTerminalContent = (content: string) => content.split('\n').join('\n');

const ProblemBankPage: React.FC = () => {
  const [step, setStep] = useState<FlowStep>('difficulty');
  const [selectedDifficulty, setSelectedDifficulty] = useState<ProblemDifficulty | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [selectedProblemId, setSelectedProblemId] = useState<number | null>(null);
  const [result, setResult] = useState<ExamResult>('idle');
  const [gradingScore, setGradingScore] = useState(0);
  const [score, setScore] = useState(0);
  const [solvedProblemIds, setSolvedProblemIds] = useState<number[]>([]);
  const [wrongProblemIds, setWrongProblemIds] = useState<number[]>([]);
  const [terminalCommand, setTerminalCommand] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '문제 랩이 준비되었습니다.',
    'ls로 파일을 확인하고 cat README.md로 시작하세요.',
  ]);

  const selectedChapter = problemChapters.find((chapter) => chapter.id === selectedChapterId) ?? null;
  const selectedProblem = hackingProblems.find((problem) => problem.id === selectedProblemId) ?? null;
  const examProgress = Math.round((solvedProblemIds.length / hackingProblems.length) * 100);
  const wrongAttempts = wrongProblemIds.length;

  const terminalPath = [
    'home/hto/problems',
    selectedDifficulty?.toLowerCase(),
    selectedChapter?.id,
    selectedProblem ? String(selectedProblem.id) : undefined,
  ].filter(Boolean).join('/');

  const selectedProblemWorkspace = useMemo(() => {
    if (!selectedProblem || !selectedChapter) return [];

    return getProblemWorkspace(selectedProblem, selectedChapter.title);
  }, [selectedChapter, selectedProblem]);

  const chapterProblems = useMemo(() => {
    if (!selectedDifficulty || !selectedChapterId) return [];

    return hackingProblems.filter((problem) => (
      problem.difficulty === selectedDifficulty && problem.chapterId === selectedChapterId
    ));
  }, [selectedChapterId, selectedDifficulty]);

  const handleDifficultySelect = (difficulty: ProblemDifficulty) => {
    setSelectedDifficulty(difficulty);
    setSelectedChapterId(null);
    setSelectedProblemId(null);
    setResult('idle');
    setGradingScore(0);
    setStep('chapter');
  };

  const handleChapterSelect = (chapterId: string) => {
    setSelectedChapterId(chapterId);
    setSelectedProblemId(null);
    setResult('idle');
    setGradingScore(0);
    setStep('problem');
  };

  const handleProblemSelect = (problemId: number) => {
    setSelectedProblemId(problemId);
    setResult('idle');
    setGradingScore(0);
    setTerminalCommand('');
    setTerminalLogs([
      '문제 랩이 준비되었습니다.',
      'ls로 파일을 확인하고 cat README.md로 시작하세요.',
    ]);
    setStep('solve');
  };

  const gradeSubmittedAnswer = (submittedAnswer: string) => {
    if (!selectedProblem) {
      setTerminalLogs((previousLogs) => [...previousLogs, '$ submit', '문제를 먼저 open 하세요. 예: open 1101']);
      return;
    }

    const aiScore = calculateSimilarityScore(submittedAnswer, selectedProblem.answer);
    setGradingScore(aiScore);

    if (aiScore >= 70) {
      setResult('correct');
      setWrongProblemIds((previousIds) => previousIds.filter((problemId) => problemId !== selectedProblem.id));
      if (!solvedProblemIds.includes(selectedProblem.id)) {
        setSolvedProblemIds((previousIds) => [...previousIds, selectedProblem.id]);
        setScore((previousScore) => previousScore + selectedProblem.points);
      }
      setTerminalLogs((previousLogs) => [...previousLogs, `$ submit ${submittedAnswer}`, `AI 채점 ${aiScore}점: 통과`]);
      return;
    }

    setResult('wrong');
    if (!wrongProblemIds.includes(selectedProblem.id)) {
      setWrongProblemIds((previousIds) => [...previousIds, selectedProblem.id]);
    }
    setTerminalLogs((previousLogs) => [...previousLogs, `$ submit ${submittedAnswer}`, `AI 채점 ${aiScore}점: 70점 미만`]);
  };

  const runTerminalCommand = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const rawCommand = terminalCommand.trim();
    const command = rawCommand.toLowerCase();
    setTerminalCommand('');

    if (!command) return;

    const appendLog = (message: string) => {
      setTerminalLogs((previousLogs) => [...previousLogs, `$ ${rawCommand}`, message]);
    };

    if (command === 'clear') {
      setTerminalLogs([]);
      return;
    }

    if (command === 'help') {
      appendLog('명령어: ls, pwd, cat README.md, cat target.txt, cat hint1.txt, cat hint2.txt, ./submit.sh HTO{...}, submit HTO{...}, clear');
      return;
    }

    if (command === 'pwd') {
      appendLog(`/${terminalPath}`);
      return;
    }

    if (command === 'ls') {
      appendLog(selectedProblem ? selectedProblemWorkspace.map((file) => file.name).join('  ') : '문제를 먼저 선택하세요. 예: open 1201');
      return;
    }

    if (command === 'cat' || command.startsWith('cat ')) {
      if (!selectedProblem) {
        appendLog('문제를 먼저 open 하세요. 예: open 1201');
        return;
      }

      const fileName = command === 'cat' ? 'README.md' : rawCommand.replace(/^cat\s+/i, '').trim();
      const workspaceFile = selectedProblemWorkspace.find((file) => file.name.toLowerCase() === fileName.toLowerCase());
      appendLog(workspaceFile ? formatTerminalContent(workspaceFile.content) : `cat: ${fileName}: No such file`);
      return;
    }

    if (command.startsWith('submit ') || command.startsWith('./submit.sh ')) {
      gradeSubmittedAnswer(rawCommand.replace(/^(submit|\.\/submit\.sh)\s+/i, '').trim());
      return;
    }

    appendLog('알 수 없는 명령어입니다. help를 입력하세요.');
  };

  return (
    <Main title="Problem Bank" description="Baekjoon-style focused security problem solving">
      <div className="problem-bank-page">
        <div className="problem-bank-hero">
          <div>
            <p className="eyebrow">HTO ONLINE JUDGE</p>
            <h1>집중형 보안 문제풀이</h1>
            <p className="hero-description">
              난이도를 먼저 고르고, 챕터를 고른 뒤, 원하는 문제 하나만 열어 풀이에 집중합니다.
              채점은 AI식 점수로 판단하며 70점 이상이면 통과입니다.
            </p>
          </div>

          <div className="exam-summary-card">
            <span>전체 진행률</span>
            <strong>{examProgress}%</strong>
            <div className="progress-track">
              <div className="progress-bar" style={{ width: `${examProgress}%` }} />
            </div>
            <small>{solvedProblemIds.length}/{hackingProblems.length} solved · {score} pts · 오답 {wrongAttempts}</small>
          </div>
        </div>

        <nav className="problem-flow-nav" aria-label="문제풀이 단계">
          <span className={step === 'difficulty' ? 'active' : ''}>1. 난이도</span>
          <span className={step === 'chapter' ? 'active' : ''}>2. 챕터</span>
          <span className={step === 'problem' ? 'active' : ''}>3. 문제 선택</span>
          <span className={step === 'solve' ? 'active' : ''}>4. 집중 풀이</span>
        </nav>

        {step === 'difficulty' && (
          <section className="focus-step-panel">
            <p className="eyebrow">STEP 1</p>
            <h2>난이도를 선택하세요</h2>
            <div className="difficulty-selector focus-selector">
              {difficultyProfiles.map((profile) => (
                <button
                  key={profile.targetDifficulty}
                  type="button"
                  onClick={() => handleDifficultySelect(profile.targetDifficulty)}
                >
                  <strong>{profile.label}</strong>
                  <span>{profile.targetDifficulty}</span>
                  <small>{profile.message}</small>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 'chapter' && selectedDifficulty && (
          <section className="focus-step-panel">
            <button type="button" className="back-button" onClick={() => setStep('difficulty')}>← 난이도 다시 선택</button>
            <p className="eyebrow">STEP 2 · {selectedDifficulty}</p>
            <h2>챕터를 선택하세요</h2>
            <div className="chapter-overview focus-chapters">
              {problemChapters.map((chapter) => {
                const availableCount = hackingProblems.filter((problem) => (
                  problem.difficulty === selectedDifficulty && problem.chapterId === chapter.id
                )).length;

                return (
                  <button
                    key={chapter.id}
                    type="button"
                    className="chapter-card"
                    onClick={() => handleChapterSelect(chapter.id)}
                    disabled={availableCount === 0}
                  >
                    <span>CH {chapter.order}</span>
                    <strong>{chapter.title}</strong>
                    <small>{chapter.subtitle}</small>
                    <em>{availableCount}문제</em>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {step === 'problem' && selectedDifficulty && selectedChapter && (
          <section className="focus-step-panel">
            <button type="button" className="back-button" onClick={() => setStep('chapter')}>← 챕터 다시 선택</button>
            <p className="eyebrow">STEP 3 · {selectedDifficulty} · {selectedChapter.title}</p>
            <h2>풀 문제를 선택하세요</h2>
            {chapterProblems.length === 0 ? (
              <div className="empty-problem-box">이 난이도에는 해당 챕터 문제가 아직 없습니다. 다른 난이도나 챕터를 선택하세요.</div>
            ) : (
              <div className="focused-problem-list">
                {chapterProblems.map((problem) => {
                  const isSolved = solvedProblemIds.includes(problem.id);
                  return (
                    <button key={problem.id} type="button" onClick={() => handleProblemSelect(problem.id)}>
                      <span>#{problem.id}</span>
                      <strong>{problem.title}</strong>
                      <em className={`difficulty-badge ${getDifficultyClass(problem.difficulty)}`}>{problem.difficulty}</em>
                      <small>{problem.points} pts · 정답률 {problem.acceptanceRate}% · {isSolved ? '통과 완료' : '미해결'}</small>
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {step === 'solve' && selectedProblem && selectedChapter && (
          <section className="linux-lab-panel focused-solve-panel">
            <button type="button" className="back-button" onClick={() => setStep('problem')}>← 문제 목록으로</button>
            <div className="linux-lab-grid">
              <aside className="linux-lab-sidebar" aria-label="현재 랩 파일">
                <p className="eyebrow">LIVE LINUX LAB</p>
                <h2>/{terminalPath}</h2>
                <div className="problem-meta-row">
                  <span>#{selectedProblem.id}</span>
                  <span>{selectedProblem.difficulty}</span>
                  <span>{selectedProblem.points} pts</span>
                  <span>{selectedProblem.acceptanceRate}% accepted</span>
                </div>
                <div className="file-tree">
                  <strong>~/problems/{selectedProblem.id}</strong>
                  {selectedProblemWorkspace.map((file) => (
                    <span key={file.name}>├─ {file.name}</span>
                  ))}
                </div>
                <p className="lab-guide">
                  문제 본문은 카드로 보여주지 않습니다. 터미널에서 <code>ls</code>, <code>cat README.md</code>, <code>cat hint1.txt</code>처럼 파일을 읽고,
                  <code> ./submit.sh HTO{'{...}'}</code>로 제출하세요.
                </p>
              </aside>

              <div className="linux-workstation">
                <div className="workstation-titlebar">
                  <span />
                  <span />
                  <span />
                  <strong>hto-terminal — {selectedProblem.title}</strong>
                </div>
                <div className="workstation-screen">
                  {terminalLogs.slice(-10).map((log, index) => (
                    <p key={`${log}-${index}`}>{log}</p>
                  ))}
                </div>
                <form className="terminal-command-form lab-command-form" onSubmit={runTerminalCommand}>
                  <label htmlFor="terminal-command">hto@lab:/{terminalPath}$</label>
                  <input
                    id="terminal-command"
                    value={terminalCommand}
                    onChange={(event) => setTerminalCommand(event.target.value)}
                    placeholder="ls, cat README.md, cat hint1.txt, ./submit.sh HTO{...}"
                    autoComplete="off"
                  />
                  <button type="submit">Enter</button>
                </form>
              </div>
            </div>

            {result !== 'idle' && (
              <div className="grade-report">
                <strong>AI 판단 점수: {gradingScore}점</strong>
                <p>{gradingScore >= 70 ? '핵심 의미가 충분히 맞아 통과 기준을 넘었습니다.' : '핵심 의미와 형식 유사도가 부족해 통과 기준에 못 미쳤습니다.'}</p>
              </div>
            )}

            {result === 'correct' && (
              <div className="result-box correct">
                <strong>AI 채점 {gradingScore}점 · 통과했습니다!</strong>
                <p>{selectedProblem.explanation}</p>
              </div>
            )}

            {result === 'wrong' && (
              <div className="result-box wrong">
                <strong>AI 채점 {gradingScore}점 · 70점 미만입니다.</strong>
                <p>핵심 키워드, 플래그 의미, 대소문자, 문제 목표를 다시 확인하세요.</p>
              </div>
            )}
          </section>
        )}
      </div>
    </Main>
  );
};

export default ProblemBankPage;
