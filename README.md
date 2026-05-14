# Hack This Out 2.0

> 기존 [Hack This Out](https://github.com/saickersj123/Hack-This-Out)의 업그레이드 버전

웹 해킹 교육을 위한 실시간 멀티플레이어 게임 플랫폼

A real-time multiplayer game platform for web hacking education

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat-square&logo=socket.io&logoColor=white)

## What's New in 2.0

기존 Hack This Out에서 다음 3가지 핵심 목표를 중심으로 업그레이드되었습니다:

### 1. 실시간 경쟁 아레나 (Socket.io)
- **3가지 멀티플레이어 게임 모드** 추가
- Socket.io 기반 실시간 동기화
- 유예 시간, First Blood 보너스 등 경쟁 시스템

### 2. UI/UX 개선
- 사이버펑크 테마의 새로운 디자인
- 반응형 레이아웃 지원
- 한국어/영어 다국어 지원 (i18n)
- 튜토리얼 시스템 추가

### 3. 상점 및 아이템 시스템
- HTO 코인 재화 시스템
- 힌트, 시간 정지, 점수 부스트 등 다양한 아이템
- 룰렛 시스템
- 인벤토리 관리

## Overview

Hack This Out은 실제 VM 기반의 깊이 있는 모의 해킹 실습과 시뮬레이션 기반의 빠르고 재미있는 아레나 대전을 함께 제공하여 더욱 풍부한 사이버보안 학습 경험을 제공합니다.

Hack This Out combines hands-on penetration testing on real VMs with fast, fun simulation-based arena battles for a richer cybersecurity learning experience.

## Tech Stack

### Frontend
- **React 18** + TypeScript
- **Vite** (Build Tool)
- **Material-UI v6** + Emotion
- **Socket.io-client** (Real-time Communication)
- **i18next** (Korean/English)
- **React Router v7**

### Backend
- **Node.js** + Express + TypeScript
- **MongoDB** + Mongoose
- **Socket.io** (Real-time Multiplayer)
- **JWT** (Authentication)
- **Anthropic Claude SDK** (AI-powered Challenges)
- **AWS SDK** (EC2, S3)

## Game Modes

### 1. Terminal Hacking Race
가상의 리눅스 터미널 환경에서 명령어를 입력하며 시스템을 해킹하는 속도 경쟁

- 2-8 Players
- Execute shell commands to progress through stages
- First to complete all stages wins

### 2. Vulnerability Scanner Race
가상의 웹사이트에서 보안 취약점을 찾아 익스플로잇하는 CTF 스타일 경쟁

- 2 Players (1v1)
- AI-generated vulnerable web pages (SIMULATED) or real targets (REAL)
- Find vulnerabilities (SQLi, XSS, IDOR, etc.) and capture FLAGS
- Hint system with 3 levels

### 3. Forensics Rush
보안 사고가 발생한 시스템의 로그와 증거를 분석하여 사건을 해결하는 경쟁

- 2-8 Players
- Analyze evidence files (logs, pcap, memory dumps)
- Answer questions about the incident
- Wrong answer penalties

## Features

### Progression System
- **EXP & Levels**: 20 levels with experience points
- **HTO Coins**: In-game currency earned from victories
- **Leaderboard**: Global rankings

### Shop & Items
- Hints, Time Freeze, Score Boost, Invincible buffs
- Roulette system with weighted rewards

### Arena System
- Real-time multiplayer with Socket.io
- Grace period for last player to finish
- First Blood bonus
- Scoring based on speed and accuracy

### Internationalization
- Full Korean/English support

## Project Structure

```
Hack-This-Out-2.0/
├── frontend/                 # React + Vite
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── assets/           # SCSS styles
│   │   └── utils/            # Helpers, i18n locales
│   └── public/
├── backend/                  # Node.js + Express
│   ├── src/
│   │   ├── controllers/      # Route handlers
│   │   ├── models/           # MongoDB schemas
│   │   ├── routes/           # API routes
│   │   ├── sockets/          # Socket.io handlers
│   │   ├── middlewares/      # Auth, validation
│   │   └── services/         # Business logic
│   └── dist/                 # Compiled JS
└── package.json              # Monorepo scripts
```

## Installation

### Prerequisites
- Node.js 18+
- MongoDB
- AWS Account (for EC2 instances, optional)
- Anthropic API Key (for AI features)

### Setup

1. Clone the repository
```bash
git clone https://github.com/Hyeonseo1021/Hack-This-Out-2.0.git
cd Hack-This-Out-2.0
```

2. Install dependencies
```bash
# Backend
npm run install-server

# Frontend
npm run install-client
```

3. Configure environment variables

**Backend** (`backend/.env`):
```env
PORT=5000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
COOKIE_SECRET=your_cookie_secret
ADMIN_PASSWORD=your_admin_password
ANTHROPIC_API_KEY=your_anthropic_api_key
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000
```

4. Run the application
```bash
# Backend (development)
cd backend && npm run dev

# Frontend (development)
cd frontend && npm run dev
```

## API Routes

| Route | Description |
|-------|-------------|
| `/api/user` | Authentication, profile, leaderboard |
| `/api/arena` | Arena CRUD, scenarios, results |
| `/api/machines` | Challenge machines, instances |
| `/api/contest` | Contests, participation |
| `/api/shop` | Items, inventory, roulette |
| `/api/inst` | AWS EC2 instance management |

## Socket Events

### Arena Lifecycle
- `arena:join` - Join arena room
- `arena:ready` - Toggle ready status
- `arena:start` - Start game (host only)
- `arena:ended` - Game ended

### Game-Specific
- `terminal:submit-command` - Terminal race input
- `scannerRace:submit` - Submit vulnerability flag
- `forensics:submit-answer` - Forensics answer
- `socialeng:send-message` - Social engineering chat

## Scoring System

### EXP Calculation
| Factor | Value |
|--------|-------|
| Base (1st place) | 20 EXP |
| Base (2nd place) | 15 EXP |
| Base (3rd place) | 12 EXP |
| Rank Bonus (1st) | +25% |
| Score Bonus | 1.5% of score |
| Time Bonus (<3min) | +10 EXP |
| Re-clear Penalty | 20-50% reduction |

### Coin Rewards
| Factor | Value |
|--------|-------|
| Base (by mode) | 1-3 HTO |
| 1st Place | +2 HTO |
| 2nd Place | +1 HTO |
| First Clear | +Base HTO |

*Note: Re-clearing a scenario awards 0 coins (abuse prevention)*

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.

