# Problem Bank 업데이트 3차 최종 검토

## 이번에 추가한 것

- 채점 방식을 완전 일치에서 AI식 점수 채점으로 변경했다.
- 제출 답안과 기준 답안을 정규화한 뒤 핵심 문자열 포함 여부, 문자 유사도, 길이 차이, 접두부 유사도를 점수화한다.
- AI 채점 점수가 70점 이상이면 통과 처리하고, 70점 미만이면 보완 필요로 표시한다.
- 문제풀이 흐름 영역을 추가해 `챕터 선택 → AI 문제 제출 → AI 채점/복습` 순서가 화면에서 보이게 했다.
- Linux Command Mode를 추가해 `help`, `ls`, `cd`, `open`, `cat`, `submit` 명령어로 난이도/챕터/문제 이동과 답안 제출을 할 수 있게 했다.

## 3회 반복 결과

1. 1차: 7개 챕터와 14개 보안 문제, 난이도별 AI 추천 구조를 만들었다.
2. 2차: 챕터별 진행률, 오답 기록, 보완 필요 챕터를 보여주는 상태 요약을 추가했다.
3. 3차: AI식 70점 통과 채점 방식과 문제풀이 루프 안내를 추가했다.
4. 추가 검증: 브라우저에서 `cd silver → cd ch2 → open 1201 → submit HTO{cookie_role_admin}` 흐름을 실행해 터미널 이동과 100점 통과 처리를 확인했다.

## 수정된 주요 파일

- `frontend/src/data/problemBank.ts`
  - 문제 데이터, 7개 챕터, 난이도 프로필 추가.
- `frontend/src/pages/problemBank/ProblemBankPage.tsx`
  - 챕터 UI, AI 추천, 상태 요약, AI 채점 로직, Linux Command Mode 추가.
- `frontend/src/assets/scss/problemBank/ProblemBankPage.scss`
  - 문제은행/AI 코치/챕터 카드/상태 요약/터미널 패널 스타일 보강.
- `frontend/docs/problem-bank-update-iteration-1.md`
  - 1차 검토 기록.
- `frontend/docs/problem-bank-update-iteration-2.md`
  - 2차 검토 기록.
- `frontend/docs/problem-bank-update-iteration-3-final.md`
  - 3차 최종 검토 기록.

## 앞으로 추가하면 좋은 것

- 실제 LLM API를 연결해 답안 의미 채점을 서버에서 수행한다.
- 사용자별 풀이 기록을 localStorage 또는 백엔드 DB에 저장한다.
- 문제별 풀이 시간, 재시도 횟수, 챕터별 약점 분석 차트를 추가한다.
- 관리자 페이지에서 문제를 직접 추가/수정할 수 있게 만든다.
