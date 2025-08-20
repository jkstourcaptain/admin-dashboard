import sqlite3 from "sqlite3";
import path from "path";

// 실제 파일 데이터베이스 사용
const dbPath = path.join(__dirname, "../../data/explorer_admin.db");
export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Connected to SQLite database:", dbPath);
    initializeTables();
  }
});

// 모든 테이블 초기화
function initializeTables() {
  console.log("Initializing all tables...");
  
  // 1. Admin Users 테이블
  db.run(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role TEXT DEFAULT 'admin',
      is_active BOOLEAN DEFAULT 1,
      last_login DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, handleTableCreation("admin_users"));

  // 2. Admin Activity Logs 테이블
  db.run(`
    CREATE TABLE IF NOT EXISTS admin_activity_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      admin_user_id INTEGER,
      action VARCHAR(100) NOT NULL,
      target_type VARCHAR(50),
      target_id INTEGER,
      details TEXT,
      ip_address VARCHAR(45),
      user_agent TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (admin_user_id) REFERENCES admin_users(id)
    )
  `, handleTableCreation("admin_activity_logs"));

  // 3. App Users 테이블 (앱 사용자)
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id VARCHAR(50) UNIQUE NOT NULL,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE,
      phone VARCHAR(20),
      platform VARCHAR(10) NOT NULL CHECK(platform IN ('AOS', 'iOS')),
      level INTEGER DEFAULT 1,
      points INTEGER DEFAULT 0,
      marketing_consent BOOLEAN DEFAULT 0,
      status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'suspended')),
      last_login DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, handleTableCreation("users"));

  // 4. Daily Signup Stats 테이블
  db.run(`
    CREATE TABLE IF NOT EXISTS user_signups_daily (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date DATE NOT NULL,
      platform VARCHAR(10) NOT NULL CHECK(platform IN ('AOS', 'iOS')),
      signup_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(date, platform)
    )
  `, handleTableCreation("user_signups_daily"));

  // 5. Quizzes 테이블
  db.run(`
    CREATE TABLE IF NOT EXISTS quizzes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title VARCHAR(200) NOT NULL,
      category VARCHAR(50) NOT NULL,
      difficulty VARCHAR(20) DEFAULT 'normal' CHECK(difficulty IN ('easy', 'normal', 'hard')),
      question TEXT NOT NULL,
      option1 VARCHAR(200) NOT NULL,
      option2 VARCHAR(200) NOT NULL,
      option3 VARCHAR(200) NOT NULL,
      option4 VARCHAR(200) NOT NULL,
      correct_answer INTEGER NOT NULL CHECK(correct_answer IN (1,2,3,4)),
      explanation TEXT,
      reward_points INTEGER DEFAULT 10,
      status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'draft')),
      created_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES admin_users(id)
    )
  `, handleTableCreation("quizzes"));

  // 6. Quiz Completions 테이블 (퀴즈 완료 기록)
  db.run(`
    CREATE TABLE IF NOT EXISTS quiz_completions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      quiz_id INTEGER NOT NULL,
      selected_answer INTEGER NOT NULL,
      is_correct BOOLEAN NOT NULL,
      points_earned INTEGER DEFAULT 0,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (quiz_id) REFERENCES quizzes(id),
      UNIQUE(user_id, quiz_id)
    )
  `, handleTableCreation("quiz_completions"));

  // 7. Advertisements 테이블 (광고 매장)
  db.run(`
    CREATE TABLE IF NOT EXISTS advertisements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(200) NOT NULL,
      address TEXT NOT NULL,
      category VARCHAR(50) NOT NULL,
      ad_type VARCHAR(20) DEFAULT 'banner' CHECK(ad_type IN ('banner', 'popup', 'text', 'marker')),
      position VARCHAR(20) DEFAULT '상단' CHECK(position IN ('상단', '중앙', '하단', '사이드')),
      target_url TEXT,
      reward_points INTEGER DEFAULT 50,
      daily_visit_limit INTEGER DEFAULT 1,
      total_budget INTEGER,
      spent_budget INTEGER DEFAULT 0,
      today_visits INTEGER DEFAULT 0,
      total_visits INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'paused')),
      start_date DATE,
      end_date DATE,
      created_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES admin_users(id)
    )
  `, handleTableCreation("advertisements"));

  // 8. Ad Visits 테이블 (매장 방문 기록)
  db.run(`
    CREATE TABLE IF NOT EXISTS ad_visits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      ad_id INTEGER NOT NULL,
      visit_type VARCHAR(20) DEFAULT 'actual' CHECK(visit_type IN ('actual', 'virtual')),
      points_earned INTEGER DEFAULT 0,
      location_verified BOOLEAN DEFAULT 0,
      visited_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (ad_id) REFERENCES advertisements(id)
    )
  `, handleTableCreation("ad_visits"));

  // 9. Products 테이블
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(200) NOT NULL,
      category VARCHAR(50) NOT NULL,
      description TEXT,
      price_points INTEGER NOT NULL,
      stock_quantity INTEGER DEFAULT 0,
      effect_type VARCHAR(50),
      effect_duration VARCHAR(50),
      rarity VARCHAR(20) DEFAULT 'common' CHECK(rarity IN ('common', 'rare', 'epic', 'legendary')),
      image_url TEXT,
      status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'soldout')),
      created_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES admin_users(id)
    )
  `, handleTableCreation("products"));

  // 10. Purchases 테이블
  db.run(`
    CREATE TABLE IF NOT EXISTS purchases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER DEFAULT 1,
      total_points INTEGER NOT NULL,
      payment_method VARCHAR(20) DEFAULT 'points',
      transaction_id VARCHAR(100),
      status TEXT DEFAULT 'completed' CHECK(status IN ('pending', 'completed', 'cancelled', 'refunded')),
      cancel_reason TEXT,
      cancel_date DATETIME,
      purchased_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `, handleTableCreation("purchases"));

  // 11. Inquiries 테이블
  db.run(`
    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      category VARCHAR(50) NOT NULL,
      title VARCHAR(200) NOT NULL,
      content TEXT NOT NULL,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'answered', 'closed')),
      admin_answer TEXT,
      answered_by INTEGER,
      answered_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (answered_by) REFERENCES admin_users(id)
    )
  `, handleTableCreation("inquiries"));

  // 12. Notices 테이블 (공지사항)
  db.run(`
    CREATE TABLE IF NOT EXISTS notices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title VARCHAR(200) NOT NULL,
      content TEXT NOT NULL,
      category VARCHAR(50) NOT NULL,
      priority INTEGER DEFAULT 0,
      is_pinned BOOLEAN DEFAULT 0,
      view_count INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'draft')),
      created_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES admin_users(id)
    )
  `, handleTableCreation("notices"));

  // 13. Receipts 테이블 (영수증 관리)
  db.run(`
    CREATE TABLE IF NOT EXISTS receipts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      store_name VARCHAR(200) NOT NULL,
      purchase_amount DECIMAL(10,2) NOT NULL,
      receipt_image_url TEXT NOT NULL,
      ocr_text TEXT,
      reward_points INTEGER DEFAULT 0,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
      admin_notes TEXT,
      reviewed_by INTEGER,
      reviewed_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (reviewed_by) REFERENCES admin_users(id)
    )
  `, handleTableCreation("receipts"));

  // 14. Daily Reward Stats 테이블 (일별 리워드 통계)
  db.run(`
    CREATE TABLE IF NOT EXISTS rewards_daily (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date DATE NOT NULL,
      reward_type VARCHAR(20) NOT NULL CHECK(reward_type IN ('visit', 'quiz', 'receipt')),
      total_rewards INTEGER DEFAULT 0,
      total_points INTEGER DEFAULT 0,
      unique_users INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(date, reward_type)
    )
  `, handleTableCreation("rewards_daily"));

  // 기본 데이터 생성
  setTimeout(createDefaultAdmin, 1000);
  setTimeout(createSampleData, 2000);
}

// 테이블 생성 결과 핸들러
function handleTableCreation(tableName: string) {
  return (err: Error | null) => {
    if (err) {
      console.error(`Error creating ${tableName} table:`, err);
    } else {
      console.log(`✅ ${tableName} table ready`);
    }
  };
}

function createDefaultAdmin() {
  const bcrypt = require("bcrypt");
  const hashedPassword = bcrypt.hashSync("admin123", 10);
  
  db.run(`
    INSERT OR IGNORE INTO admin_users (username, email, password_hash, role)
    VALUES (?, ?, ?, ?)
  `, ["admin", "admin@explorer.com", hashedPassword, "super_admin"], (err) => {
    if (err) {
      console.error("Error creating default admin:", err);
    } else {
      console.log("🔐 Default admin user ready: admin/admin123");
    }
  });
}

// 샘플 데이터 생성
function createSampleData() {
  console.log("Creating sample data...");
  
  // 샘플 앱 사용자 생성
  const sampleUsers = [
    { user_id: "explorer001", name: "김탐험", email: "kim@test.com", phone: "010-1234-5678", platform: "AOS" },
    { user_id: "explorer002", name: "이모험", email: "lee@test.com", phone: "010-2345-6789", platform: "iOS" },
    { user_id: "explorer003", name: "박여행", email: "park@test.com", phone: "010-3456-7890", platform: "AOS" },
    { user_id: "explorer004", name: "정산책", email: "jung@test.com", phone: "010-4567-8901", platform: "iOS" },
    { user_id: "explorer005", name: "최등반", email: "choi@test.com", phone: "010-5678-9012", platform: "AOS" }
  ];

  sampleUsers.forEach(user => {
    db.run(`
      INSERT OR IGNORE INTO users (user_id, name, email, phone, platform, level, points, marketing_consent)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [user.user_id, user.name, user.email, user.phone, user.platform, 
        Math.floor(Math.random() * 10) + 1, 
        Math.floor(Math.random() * 1000) + 100, 1]);
  });

  // 일별 가입자 수 샘플 데이터 생성 (최근 30일)
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // AOS 가입자
    db.run(`
      INSERT OR IGNORE INTO user_signups_daily (date, platform, signup_count)
      VALUES (?, ?, ?)
    `, [dateStr, 'AOS', Math.floor(Math.random() * 50) + 20]);
    
    // iOS 가입자
    db.run(`
      INSERT OR IGNORE INTO user_signups_daily (date, platform, signup_count)
      VALUES (?, ?, ?)
    `, [dateStr, 'iOS', Math.floor(Math.random() * 80) + 30]);
  }

  // 샘플 퀴즈 생성
  const sampleQuizzes = [
    {
      title: "한국의 국립공원",
      category: "지리",
      question: "다음 중 한국에서 가장 큰 국립공원은?",
      option1: "지리산국립공원", option2: "설악산국립공원", 
      option3: "한라산국립공원", option4: "태백산국립공원",
      correct_answer: 1, explanation: "지리산국립공원은 1967년 우리나라 최초로 지정된 국립공원입니다."
    },
    {
      title: "세계 문화유산",
      category: "문화",
      question: "경주 불국사와 석굴암이 유네스코 세계문화유산으로 등록된 연도는?",
      option1: "1995년", option2: "1997년", option3: "1995년", option4: "2000년",
      correct_answer: 1, explanation: "1995년에 유네스코 세계문화유산으로 등록되었습니다."
    }
  ];

  sampleQuizzes.forEach(quiz => {
    db.run(`
      INSERT OR IGNORE INTO quizzes 
      (title, category, question, option1, option2, option3, option4, correct_answer, explanation, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [quiz.title, quiz.category, quiz.question, quiz.option1, quiz.option2, 
        quiz.option3, quiz.option4, quiz.correct_answer, quiz.explanation, 1]);
  });

  // 샘플 광고 매장 생성
  const sampleAds = [
    { name: "제주 올레길 카페", address: "제주시 구좌읍 월정리 33-8", category: "카페", reward_points: 150 },
    { name: "부산 해운대 호텔", address: "부산시 해운대구 해운대해변로 264", category: "숙박", reward_points: 200 },
    { name: "서울 명동 한식당", address: "서울시 중구 명동길 14", category: "음식점", reward_points: 100 }
  ];

  sampleAds.forEach(ad => {
    db.run(`
      INSERT OR IGNORE INTO advertisements 
      (name, address, category, reward_points, total_budget, start_date, end_date, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [ad.name, ad.address, ad.category, ad.reward_points, 100000, '2024-08-01', '2024-12-31', 1]);
  });

  // 샘플 상품 생성
  const sampleProducts = [
    { name: "경험치 부스터", category: "부스터", description: "30분간 경험치 2배 획득", price_points: 500, stock: 100, rarity: "common" },
    { name: "포인트 배율기", category: "부스터", description: "1시간 동안 포인트 1.5배 획득", price_points: 800, stock: 50, rarity: "rare" },
    { name: "전설의 나침반", category: "도구", description: "숨겨진 장소를 찾는데 도움", price_points: 2000, stock: 10, rarity: "legendary" }
  ];

  sampleProducts.forEach(product => {
    db.run(`
      INSERT OR IGNORE INTO products 
      (name, category, description, price_points, stock_quantity, rarity, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [product.name, product.category, product.description, 
        product.price_points, product.stock, product.rarity, 1]);
  });

  // 일별 리워드 통계 생성
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    ['visit', 'quiz', 'receipt'].forEach(rewardType => {
      const totalRewards = Math.floor(Math.random() * 100) + 50;
      const totalPoints = totalRewards * (rewardType === 'visit' ? 50 : rewardType === 'quiz' ? 10 : 100);
      
      db.run(`
        INSERT OR IGNORE INTO rewards_daily (date, reward_type, total_rewards, total_points, unique_users)
        VALUES (?, ?, ?, ?, ?)
      `, [dateStr, rewardType, totalRewards, totalPoints, Math.floor(totalRewards * 0.8)]);
    });
  }

  console.log("📊 Sample data created successfully");
}

export default db;
