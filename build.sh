#!/bin/bash

# 머니또 탐험대장 Admin Dashboard 프로덕션 빌드 스크립트

echo "🏗️  Building 머니또 탐험대장 Admin Dashboard for production..."

# Frontend 빌드
echo "🎨 Building Frontend..."
cd frontend
npm install
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Frontend build completed successfully!"
else
    echo "❌ Frontend build failed!"
    exit 1
fi

# Backend 빌드
echo "📡 Building Backend..."
cd ../backend
npm install
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Backend build completed successfully!"
else
    echo "❌ Backend build failed!"
    exit 1
fi

echo ""
echo "🎉 Build completed successfully!"
echo ""
echo "To run in production:"
echo "1. Backend: cd backend && npm start"
echo "2. Frontend: cd frontend && npm run preview"
echo ""
echo "Production URLs:"
echo "📊 Backend API: http://localhost:3001/health"
echo "🌐 Frontend: http://localhost:4173/"