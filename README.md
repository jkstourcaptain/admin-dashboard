# 머니또 탐험대장 Admin Dashboard

Exploration 앱의 관리자 웹사이트입니다. 실시간 통계, 사용자 관리, 컨텐츠 관리 등의 기능을 제공합니다.

## 🚀 빠른 시작

### 1. 자동 시작 (권장)
```bash
./start.sh
```

### 2. 수동 시작

#### Backend 서버 시작
```bash
cd backend
npm install
npm run dev
```

#### Frontend 서버 시작 (새 터미널에서)
```bash
cd frontend
npm install
npm run dev
```

## 📱 접속 정보

- **로컬 접속**: http://localhost:5173/
- **외부 접속**: http://[서버IP]:5173/
- **API 헬스체크**: http://localhost:3001/health

### 기본 로그인 정보
- **Username**: `admin`
- **Password**: `admin123`

## 🌐 외부 URL 공유

이 Admin Dashboard는 외부에서 URL을 통해 접근할 수 있도록 설정되어 있습니다:

1. **개발 환경**: `http://[서버IP]:5173/`
2. **프로덕션 빌드**: `http://[서버IP]:4173/`

### 외부 접속 설정 확인
```bash
# 현재 서버의 IP 주소 확인
hostname -I

# 방화벽 포트 열기 (Ubuntu/Debian)
sudo ufw allow 5173
sudo ufw allow 3001

# 방화벽 포트 열기 (CentOS/RHEL)
sudo firewall-cmd --add-port=5173/tcp --permanent
sudo firewall-cmd --add-port=3001/tcp --permanent
sudo firewall-cmd --reload
```

## 📁 프로젝트 구조

```
admin-dashboard/
├── backend/                 # Express.js API 서버
│   ├── src/
│   │   ├── controllers/     # API 컨트롤러
│   │   ├── routes/          # API 라우트
│   │   ├── middleware/      # 인증 미들웨어
│   │   ├── config/          # 데이터베이스 설정
│   │   └── index.ts         # 서버 진입점
│   └── package.json
├── frontend/                # React 웹 애플리케이션
│   ├── src/
│   │   ├── components/      # React 컴포넌트
│   │   ├── pages/           # 페이지 컴포넌트
│   │   ├── services/        # API 서비스
│   │   ├── store/           # 상태 관리 (Zustand)
│   │   └── types/           # TypeScript 타입 정의
│   └── package.json
├── start.sh                 # 시작 스크립트
└── README.md
```

## 🛠 기술 스택

### Backend
- **Node.js** + **Express.js**
- **TypeScript**
- **SQLite** (인메모리 데이터베이스)
- **JWT** 인증
- **bcrypt** 패스워드 해싱

### Frontend
- **React 19** + **TypeScript**
- **Vite** 빌드 도구
- **React Router** 라우팅
- **Axios** HTTP 클라이언트
- **Zustand** 상태 관리
- **Tailwind CSS** 스타일링
- **Recharts** 차트 라이브러리
- **Heroicons** 아이콘

## 📊 주요 기능

- ✅ **대시보드**: 실시간 KPI 및 통계
- ✅ **사용자 분석**: Android/iOS 가입자 통계
- ✅ **리워드 통계**: 방문 및 미션 완료 분석
- ✅ **인증 시스템**: JWT 기반 로그인
- ✅ **반응형 디자인**: 모바일/태블릿/데스크톱 지원
- 🔄 **유저 관리**: 개발 예정
- 🔄 **컨텐츠 관리**: 개발 예정
- 🔄 **포인트 관리**: 개발 예정

## 🔧 환경 변수

### Backend (.env)
```env
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret_here
BCRYPT_SALT_ROUNDS=10
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=머니또 탐험대장 Admin
VITE_APP_VERSION=1.0.0
```

## 🚀 배포

### 프로덕션 빌드
```bash
# Frontend 빌드
cd frontend
npm run build

# 빌드된 파일 미리보기
npm run preview

# Backend 빌드
cd ../backend
npm run build
npm start
```

### Docker 배포 (선택사항)
```dockerfile
# 추후 Docker 설정 추가 예정
```

## 🔒 보안

- JWT 토큰 기반 인증
- bcrypt 패스워드 해싱
- CORS 설정
- Rate Limiting 적용
- Helmet 보안 헤더

## 📝 라이센스

ISC License

## 👥 문의

개발 관련 문의사항이 있으시면 언제든 연락주세요.