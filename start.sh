#!/bin/bash

# 머니또 탐험대장 Admin Dashboard 시작 스크립트

echo "🚀 Starting 머니또 탐험대장 Admin Dashboard..."

# Backend 시작
echo "📡 Starting Backend Server..."
cd backend
npm install
npm run dev &
BACKEND_PID=$!

# 잠시 대기 (Backend가 시작될 시간)
sleep 3

# Frontend 시작
echo "🎨 Starting Frontend Server..."
cd ../frontend
npm install
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ 서버가 시작되었습니다!"
echo "📊 Backend API: http://localhost:3001/health"
echo "🌐 Frontend: http://localhost:5173/"
echo "🔗 External URL: http://$(hostname -I | awk '{print $1}'):5173/"
echo ""
echo "기본 로그인 정보:"
echo "- Username: admin"
echo "- Password: admin123"
echo ""
echo "종료하려면 Ctrl+C를 누르세요."

# 프로세스 종료 시 자동으로 서버들 종료
trap "echo '🛑 서버를 종료합니다...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT

# 백그라운드 프로세스들이 종료될 때까지 대기
wait