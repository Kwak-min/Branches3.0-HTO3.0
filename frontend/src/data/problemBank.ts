export type ProblemDifficulty = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export interface ProblemChapter {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  focus: string;
  recommendedDifficulty: ProblemDifficulty;
}

export interface HackingProblem {
  id: number;
  chapterId: string;
  title: string;
  category: string;
  difficulty: ProblemDifficulty;
  points: number;
  solved: number;
  acceptanceRate: number;
  tags: string[];
  scenario: string;
  objective: string;
  hints: string[];
  answer: string;
  explanation: string;
}

export interface DifficultyProfile {
  label: string;
  targetDifficulty: ProblemDifficulty;
  message: string;
}

export const difficultyOrder: ProblemDifficulty[] = ['Bronze', 'Silver', 'Gold', 'Platinum'];

export const problemChapters: ProblemChapter[] = [
  {
    id: 'web-basic',
    order: 1,
    title: '웹 기초 정찰',
    subtitle: 'robots.txt, 노출 경로, 기본 인증 흐름을 읽는 단계',
    focus: 'Recon / Web Basics',
    recommendedDifficulty: 'Bronze',
  },
  {
    id: 'auth-session',
    order: 2,
    title: '인증과 세션',
    subtitle: '쿠키, 세션, 권한 상승 실수를 점검하는 단계',
    focus: 'Auth / Session',
    recommendedDifficulty: 'Silver',
  },
  {
    id: 'injection',
    order: 3,
    title: '인젝션 공격',
    subtitle: 'SQLi, XSS처럼 입력값 검증 실패를 다루는 단계',
    focus: 'SQLi / XSS',
    recommendedDifficulty: 'Gold',
  },
  {
    id: 'crypto-encoding',
    order: 4,
    title: '암호와 인코딩',
    subtitle: 'Base64, 해시, 약한 암호 운용을 구분하는 단계',
    focus: 'Crypto / Encoding',
    recommendedDifficulty: 'Bronze',
  },
  {
    id: 'forensics',
    order: 5,
    title: '포렌식과 로그',
    subtitle: '로그 타임라인과 침해 흔적을 추적하는 단계',
    focus: 'Log / Incident',
    recommendedDifficulty: 'Silver',
  },
  {
    id: 'network',
    order: 6,
    title: '네트워크 분석',
    subtitle: '포트, 패킷, 터널링 트래픽을 해석하는 단계',
    focus: 'Network / Traffic',
    recommendedDifficulty: 'Gold',
  },
  {
    id: 'linux-privesc',
    order: 7,
    title: '리눅스 권한 상승',
    subtitle: '파일 권한, 백업 노출, SUID 실수를 찾는 단계',
    focus: 'Linux / Privilege',
    recommendedDifficulty: 'Platinum',
  },
];

export const problemCategories = ['전체', ...problemChapters.map((chapter) => chapter.title)];

export const difficultyProfiles: DifficultyProfile[] = [
  {
    label: '입문자',
    targetDifficulty: 'Bronze',
    message: '정찰과 단일 개념 위주 문제를 먼저 배정합니다.',
  },
  {
    label: '기초 완성',
    targetDifficulty: 'Silver',
    message: '힌트가 있으면 풀 수 있는 인증/로그 문제를 배정합니다.',
  },
  {
    label: '실전 준비',
    targetDifficulty: 'Gold',
    message: '여러 단서를 결합해야 하는 취약점 분석 문제를 배정합니다.',
  },
  {
    label: '상급 도전',
    targetDifficulty: 'Platinum',
    message: '복합 공격 흐름과 고난도 분석 문제를 배정합니다.',
  },
];

export const hackingProblems: HackingProblem[] = [
  {
    id: 1101,
    chapterId: 'web-basic',
    title: '숨겨진 관리자 페이지',
    category: 'Web',
    difficulty: 'Bronze',
    points: 100,
    solved: 238,
    acceptanceRate: 74,
    tags: ['robots.txt', 'recon', 'web'],
    scenario: '테스트 웹 서버에서 검색 엔진이 접근하지 말아야 할 경로가 노출되어 있다. 서버 루트에서 힌트를 찾고 관리자 페이지의 플래그를 확인해야 한다.',
    objective: 'robots.txt에 숨겨진 관리자 경로를 찾아 플래그 문자열을 제출하세요.',
    hints: ['검색 엔진 크롤러가 먼저 확인하는 파일을 떠올려 보세요.', 'Disallow 항목은 숨겨진 경로를 알려주는 단서가 될 수 있습니다.'],
    answer: 'HTO{robots_admin_found}',
    explanation: '/robots.txt의 Disallow 경로를 확인한 뒤 관리자 페이지로 이동하면 플래그를 얻을 수 있습니다.',
  },
  {
    id: 1102,
    chapterId: 'web-basic',
    title: '디렉터리 인덱싱',
    category: 'Web',
    difficulty: 'Bronze',
    points: 120,
    solved: 191,
    acceptanceRate: 69,
    tags: ['directory-listing', 'backup', 'recon'],
    scenario: '/backup/ 경로가 디렉터리 목록을 그대로 보여주고, old-config.txt 파일에 플래그가 남아 있다.',
    objective: '노출된 백업 파일명을 HTO{파일명} 형식으로 제출하세요.',
    hints: ['목록이 보이는 디렉터리는 민감 파일 탐색의 시작점입니다.', '확장자까지 포함해야 합니다.'],
    answer: 'HTO{old-config.txt}',
    explanation: '디렉터리 인덱싱은 배포 전 비활성화해야 하며 백업 파일은 웹 루트 밖에 둬야 합니다.',
  },
  {
    id: 1201,
    chapterId: 'auth-session',
    title: '쿠키 권한 상승',
    category: 'Auth',
    difficulty: 'Silver',
    points: 180,
    solved: 121,
    acceptanceRate: 48,
    tags: ['cookie', 'auth', 'tampering'],
    scenario: '로그인 후 발급되는 쿠키에 사용자 권한이 평문으로 저장되어 있다. 서버가 서명을 검증하지 않아 클라이언트 조작이 가능하다.',
    objective: '일반 사용자 쿠키를 분석해 관리자 권한으로 바꾼 뒤 얻는 플래그를 제출하세요.',
    hints: ['브라우저 개발자 도구의 Application/Storage 영역을 확인하세요.', 'role 또는 admin처럼 보이는 값을 조심스럽게 바꿔보세요.'],
    answer: 'HTO{cookie_role_admin}',
    explanation: '권한 정보는 서버에서 검증해야 합니다. 클라이언트 쿠키 값만 믿으면 권한 상승 취약점이 됩니다.',
  },
  {
    id: 1202,
    chapterId: 'auth-session',
    title: '예측 가능한 재설정 토큰',
    category: 'Auth',
    difficulty: 'Silver',
    points: 220,
    solved: 83,
    acceptanceRate: 39,
    tags: ['reset-token', 'predictable', 'session'],
    scenario: '비밀번호 재설정 URL의 token 값이 사용자 ID와 날짜를 이어 붙인 값으로 만들어진다.',
    objective: '토큰에 반드시 들어가면 안 되는 예측 가능한 식별자 이름을 HTO{이름} 형식으로 제출하세요.',
    hints: ['다른 사용자의 토큰을 추측할 수 있게 만드는 값입니다.', '문제 설명에서 직접 언급된 식별자입니다.'],
    answer: 'HTO{user_id}',
    explanation: '재설정 토큰은 충분히 긴 난수로 만들고 서버에서 만료 시간을 관리해야 합니다.',
  },
  {
    id: 1301,
    chapterId: 'injection',
    title: '간단한 SQL 인증 우회',
    category: 'Injection',
    difficulty: 'Gold',
    points: 350,
    solved: 58,
    acceptanceRate: 31,
    tags: ['sqli', 'login', 'input-validation'],
    scenario: "로그인 쿼리가 문자열 결합으로 `WHERE id='입력' AND pw='입력'` 형태로 만들어진다.",
    objective: '비밀번호 조건을 무력화하는 대표 페이로드를 제출하세요. 공백 포함 정확히 입력하세요.',
    hints: ['작은따옴표로 문자열을 닫고 항상 참인 조건을 추가합니다.', '뒤의 조건은 주석 처리할 수 있습니다.'],
    answer: "' OR '1'='1' --",
    explanation: '문자열 결합 SQL은 인증 우회에 취약합니다. Prepared Statement를 사용해야 합니다.',
  },
  {
    id: 1302,
    chapterId: 'injection',
    title: '반사형 XSS 경고창',
    category: 'Injection',
    difficulty: 'Gold',
    points: 330,
    solved: 66,
    acceptanceRate: 34,
    tags: ['xss', 'reflected', 'html'],
    scenario: '검색어가 HTML 본문에 이스케이프 없이 그대로 출력된다. alert(1)을 실행하는 입력이 필요하다.',
    objective: '가장 기본적인 script 태그 페이로드를 제출하세요.',
    hints: ['브라우저가 HTML 태그로 해석하게 만들어야 합니다.', 'alert 함수의 인자는 숫자 1입니다.'],
    answer: '<script>alert(1)</script>',
    explanation: '사용자 입력을 HTML에 출력할 때는 이스케이프와 CSP를 함께 적용해야 합니다.',
  },
  {
    id: 1401,
    chapterId: 'crypto-encoding',
    title: 'Base64는 암호가 아니다',
    category: 'Crypto',
    difficulty: 'Bronze',
    points: 90,
    solved: 310,
    acceptanceRate: 82,
    tags: ['encoding', 'base64'],
    scenario: '관리자가 남긴 백업 메모에 `SFRPe2Jhc2U2NF9pc19lbmNvZGluZ30=` 문자열이 적혀 있다.',
    objective: '문자열을 올바르게 해석해 플래그를 제출하세요.',
    hints: ['끝의 = 패딩은 인코딩 방식의 흔한 흔적입니다.', '디코딩하면 사람이 읽을 수 있는 문자열이 됩니다.'],
    answer: 'HTO{base64_is_encoding}',
    explanation: 'Base64는 암호화가 아니라 인코딩입니다. 누구나 원문으로 되돌릴 수 있습니다.',
  },
  {
    id: 1402,
    chapterId: 'crypto-encoding',
    title: '약한 해시 보관',
    category: 'Crypto',
    difficulty: 'Silver',
    points: 210,
    solved: 94,
    acceptanceRate: 42,
    tags: ['hash', 'md5', 'password'],
    scenario: '사용자 비밀번호가 salt 없이 MD5로만 저장되어 레인보우 테이블 공격에 취약하다.',
    objective: '문제에서 사용된 취약한 해시 알고리즘 이름을 대문자로 제출하세요.',
    hints: ['32자리 16진수 해시로 자주 보입니다.', '문제 설명에 알고리즘이 등장합니다.'],
    answer: 'HTO{MD5}',
    explanation: '비밀번호는 bcrypt, scrypt, Argon2 같은 느린 해시와 salt를 사용해야 합니다.',
  },
  {
    id: 1501,
    chapterId: 'forensics',
    title: '수상한 접속 로그',
    category: 'Forensics',
    difficulty: 'Silver',
    points: 200,
    solved: 96,
    acceptanceRate: 41,
    tags: ['log', 'incident', 'timeline'],
    scenario: '웹 서버 로그에서 `/upload.php`로 비정상 POST 요청이 반복되었다. 공격자는 마지막에 `cmd=id` 파라미터를 호출했다.',
    objective: '침해에 사용된 최초 업로드 엔드포인트 이름을 플래그 형식으로 제출하세요. 예: HTO{endpoint}',
    hints: ['반복된 POST 요청 경로가 초기 침투 지점일 가능성이 큽니다.', '확장자를 제외하지 말고 파일명 전체를 사용하세요.'],
    answer: 'HTO{upload.php}',
    explanation: '로그 타임라인상 upload.php가 웹쉘 업로드에 사용된 최초 엔드포인트입니다.',
  },
  {
    id: 1502,
    chapterId: 'forensics',
    title: '삭제된 계정의 로그인',
    category: 'Forensics',
    difficulty: 'Gold',
    points: 310,
    solved: 47,
    acceptanceRate: 29,
    tags: ['auth.log', 'timeline', 'persistence'],
    scenario: 'auth.log에서 퇴사자 계정 `park`이 삭제된 뒤에도 SSH 로그인 성공 기록이 남아 있다.',
    objective: '침해 의심 계정명을 HTO{계정명} 형식으로 제출하세요.',
    hints: ['삭제 이후에도 성공 로그가 있는 계정입니다.', '문제 설명의 백틱 안 계정명을 확인하세요.'],
    answer: 'HTO{park}',
    explanation: '퇴사자 계정은 즉시 비활성화하고 키/세션/토큰까지 회수해야 합니다.',
  },
  {
    id: 1601,
    chapterId: 'network',
    title: '열린 포트 찾기',
    category: 'Network',
    difficulty: 'Bronze',
    points: 110,
    solved: 204,
    acceptanceRate: 67,
    tags: ['nmap', 'recon', 'port'],
    scenario: '스캔 결과 `22/tcp open ssh`, `80/tcp open http`, `3306/tcp filtered mysql`이 확인되었다.',
    objective: '외부에서 접속 가능한 웹 서비스 포트 번호를 HTO{번호} 형식으로 제출하세요.',
    hints: ['open 상태와 filtered 상태를 구분하세요.', 'HTTP의 기본 포트를 떠올려 보세요.'],
    answer: 'HTO{80}',
    explanation: '80/tcp가 open 상태인 HTTP 서비스입니다.',
  },
  {
    id: 1602,
    chapterId: 'network',
    title: '패킷 속 DNS 터널링',
    category: 'Network',
    difficulty: 'Platinum',
    points: 500,
    solved: 17,
    acceptanceRate: 19,
    tags: ['dns', 'exfiltration', 'traffic-analysis'],
    scenario: '패킷 캡처에서 `chunk1.secret.attacker.test`, `chunk2.secret.attacker.test`처럼 긴 서브도메인 질의가 반복된다.',
    objective: '데이터 유출에 악용된 프로토콜 이름을 대문자로 제출하세요. 예: HTO{PROTO}',
    hints: ['정상 도메인 조회처럼 보이지만 서브도메인에 데이터 조각이 들어갑니다.', '문제 제목도 단서입니다.'],
    answer: 'HTO{DNS}',
    explanation: 'DNS 질의의 서브도메인 영역을 이용해 데이터를 외부로 빼내는 DNS 터널링 패턴입니다.',
  },
  {
    id: 1701,
    chapterId: 'linux-privesc',
    title: '권한이 이상한 백업 파일',
    category: 'Linux',
    difficulty: 'Gold',
    points: 320,
    solved: 43,
    acceptanceRate: 27,
    tags: ['linux', 'permission', 'backup'],
    scenario: '`/var/backups/site.bak` 파일이 모든 사용자에게 읽기 가능하며 데이터베이스 접속 비밀번호가 포함되어 있다.',
    objective: '취약한 파일 권한을 나타내는 세 자리 모드를 HTO{모드} 형식으로 제출하세요.',
    hints: ['소유자, 그룹, 기타 사용자 모두 읽을 수 있는 권한입니다.', '쓰기/실행 권한은 없고 읽기 권한만 있다고 가정하세요.'],
    answer: 'HTO{444}',
    explanation: '모든 사용자에게 읽기 권한만 있으면 444입니다. 민감 백업은 최소 권한으로 보호해야 합니다.',
  },
  {
    id: 1702,
    chapterId: 'linux-privesc',
    title: 'SUID 바이너리 점검',
    category: 'Linux',
    difficulty: 'Platinum',
    points: 520,
    solved: 15,
    acceptanceRate: 16,
    tags: ['suid', 'privilege-escalation', 'linux'],
    scenario: '`find / -perm -4000 -type f` 결과에서 `/usr/bin/vim.basic`에 SUID가 설정되어 있다.',
    objective: '권한 상승 위험이 있는 바이너리 이름만 HTO{이름} 형식으로 제출하세요.',
    hints: ['문제에서 비정상적으로 SUID가 붙은 실행 파일입니다.', '전체 경로가 아니라 파일명만 제출합니다.'],
    answer: 'HTO{vim.basic}',
    explanation: '편집기류 바이너리에 SUID가 붙으면 쉘 실행 등으로 권한 상승이 가능할 수 있습니다.',
  },
];
