import { useState, useEffect } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeMenu, setActiveMenu] = useState(() => {
    // localStorage에서 저장된 활성 메뉴를 불러오기, 없으면 기본값 "관리자홈"
    return localStorage.getItem('activeMenu') || "관리자홈";
  });

  // activeMenu를 설정하면서 localStorage에도 저장하는 헬퍼 함수
  const updateActiveMenu = (menu: string) => {
    setActiveMenu(menu);
    localStorage.setItem('activeMenu', menu);
  };
  const [expandedMenu, setExpandedMenu] = useState<string | null>(() => {
    // localStorage에서 저장된 확장된 메뉴를 불러오기
    return localStorage.getItem('expandedMenu') || null;
  });

  // expandedMenu를 설정하면서 localStorage에도 저장하는 헬퍼 함수
  const updateExpandedMenu = (menu: string | null) => {
    setExpandedMenu(menu);
    if (menu) {
      localStorage.setItem('expandedMenu', menu);
    } else {
      localStorage.removeItem('expandedMenu');
    }
  };

  // 회원 관리 상태들을 업데이트하면서 localStorage에도 저장하는 헬퍼 함수들
  const updateIsCreatingAccount = (value: boolean) => {
    setIsCreatingAccount(value);
    localStorage.setItem('isCreatingAccount', value.toString());
  };

  const updateIsEditingUser = (value: boolean) => {
    setIsEditingUser(value);
    localStorage.setItem('isEditingUser', value.toString());
  };
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hoveredDataPoint, setHoveredDataPoint] = useState<{type: string, value: number, x: number, y: number} | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [quizStartDate, setQuizStartDate] = useState("");
  const [quizEndDate, setQuizEndDate] = useState("");
  const [quizKeyword, setQuizKeyword] = useState("");
  const [isCreatingQuiz, setIsCreatingQuiz] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState("");
  const [quizQuestions, setQuizQuestions] = useState<Array<{
    question: string;
    option1: string;
    option2: string;
    correctAnswer: number;
  }>>([]);
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [newMarkerName, setNewMarkerName] = useState("");
  const [newMarkerLatitude, setNewMarkerLatitude] = useState("");
  const [newMarkerLongitude, setNewMarkerLongitude] = useState("");
  const [quizDifficulty, setQuizDifficulty] = useState("보통");
  const [quizStatus, setQuizStatus] = useState("활성");
  const [markerList, setMarkerList] = useState([
    { name: "부산 해운대", latitude: 35.1587, longitude: 129.1603 },
    { name: "제주 성산일출봉", latitude: 33.4584, longitude: 126.9424 },
    { name: "경주 불국사", latitude: 35.7897, longitude: 129.3319 },
    { name: "전주 한옥마을", latitude: 35.8160, longitude: 127.1530 },
    { name: "서울 남산타워", latitude: 37.5512, longitude: 126.9882 },
    { name: "강릉 경포대", latitude: 37.7956, longitude: 128.8968 },
    { name: "여수 오동도", latitude: 34.7468, longitude: 127.7669 },
    { name: "인천 차이나타운", latitude: 37.4759, longitude: 126.6184 }
  ]);
  const [createdQuizzes, setCreatedQuizzes] = useState<Array<{
    title: string;
    category: string;
    difficulty: string;
    participants: number;
    status: string;
    createDate: string;
    marker: string;
    questions: Array<{
      question: string;
      option1: string;
      option2: string;
      correctAnswer: number;
    }>;
  }>>([]);
  const [adStartDate, setAdStartDate] = useState("");
  const [adEndDate, setAdEndDate] = useState("");
  const [adKeyword, setAdKeyword] = useState("");
  const [userStartDate, setUserStartDate] = useState("");
  const [userEndDate, setUserEndDate] = useState("");
  const [userKeyword, setUserKeyword] = useState("");
  const [productStartDate, setProductStartDate] = useState("");
  const [productEndDate, setProductEndDate] = useState("");
  const [productKeyword, setProductKeyword] = useState("");
  const [purchaseStartDate, setPurchaseStartDate] = useState("");
  const [purchaseEndDate, setPurchaseEndDate] = useState("");
  const [purchaseKeyword, setPurchaseKeyword] = useState("");
  const [showPurchaseDetail, setShowPurchaseDetail] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<any>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelingPurchase, setCancelingPurchase] = useState<any>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [purchases, setPurchases] = useState([
    { buyer: "김철수", product: "경험치 2배 부스터", quantity: 2, points: 1000, status: "완료", purchaseDate: "2024-08-19 14:23" },
    { buyer: "이영희", product: "전설급 무기 상자", quantity: 1, points: 5000, status: "완료", purchaseDate: "2024-08-19 13:45" },
    { buyer: "박민수", product: "골드 3배 부스터", quantity: 1, points: 800, status: "완료", purchaseDate: "2024-08-19 12:18" },
    { buyer: "최지은", product: "프리미엄 펫", quantity: 1, points: 4500, status: "완료", purchaseDate: "2024-08-19 11:32" },
    { buyer: "정한별", product: "체력 물약 세트", quantity: 5, points: 1000, status: "완료", purchaseDate: "2024-08-19 10:55" },
    { buyer: "장미라", product: "마나 물약 세트", quantity: 3, points: 750, status: "완료", purchaseDate: "2024-08-18 16:42" },
    { buyer: "윤동혁", product: "레어 마운트", quantity: 1, points: 8000, status: "완료", purchaseDate: "2024-08-18 15:28" },
    { buyer: "소민정", product: "전투력 증가 보석", quantity: 2, points: 3000, status: "완료", purchaseDate: "2024-08-18 14:15" },
    { buyer: "강태현", product: "희귀 캐릭터 스킨", quantity: 1, points: 3000, status: "취소", purchaseDate: "2024-08-18 13:07" },
    { buyer: "홍서영", product: "VIP 멤버십 30일", quantity: 1, points: 9900, status: "완료", purchaseDate: "2024-08-18 12:33" }
  ]);
  const [isWritingNotice, setIsWritingNotice] = useState(false);
  const [isEditingNotice, setIsEditingNotice] = useState(false);
  const [editingNoticeIndex, setEditingNoticeIndex] = useState(-1);
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeCategory, setNoticeCategory] = useState("공지");
  const [noticeContent, setNoticeContent] = useState("");
  const [isRegisteringProduct, setIsRegisteringProduct] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState("부스터");
  const [productPrice, setProductPrice] = useState("");
  const [productStock, setProductStock] = useState("");
  const [productStatus, setProductStatus] = useState("판매중");
  const [productImage, setProductImage] = useState<File | null>(null);
  const [adImages, setAdImages] = useState<File[]>([]);
  const [productImagePreview, setProductImagePreview] = useState("");
  const [isRegisteringAd, setIsRegisteringAd] = useState(false);
  const [isEditingAd, setIsEditingAd] = useState(false);
  const [editingAdIndex, setEditingAdIndex] = useState<number>(-1);
  const [adTitle, setAdTitle] = useState("");
  const [adType, setAdType] = useState("배너");
  const [adPosition, setAdPosition] = useState("상단");
  const [adStartDateReg, setAdStartDateReg] = useState("");
  const [adEndDateReg, setAdEndDateReg] = useState("");
  const [adTargetUrl, setAdTargetUrl] = useState("");
  const [adImagePreviews, setAdImagePreviews] = useState<string[]>([]);
  const [isViewingInquiry, setIsViewingInquiry] = useState(false);
  const [isAnsweringInquiry, setIsAnsweringInquiry] = useState(false);
  const [selectedInquiryIndex, setSelectedInquiryIndex] = useState<number>(-1);
  const [answerContent, setAnswerContent] = useState("");
  const [inquiryStartDate, setInquiryStartDate] = useState("");
  const [inquiryEndDate, setInquiryEndDate] = useState("");
  const [inquiryKeyword, setInquiryKeyword] = useState("");
  const [noticeStartDate, setNoticeStartDate] = useState("");
  const [noticeEndDate, setNoticeEndDate] = useState("");
  const [noticeKeyword, setNoticeKeyword] = useState("");
  
  // 영수증 관리 상태
  const [receipts, setReceipts] = useState<Array<{
    id: number;
    userId: string;
    userName: string;
    uploadDate: string;
    receiptImage: string;
    storeName: string;
    amount: number;
    status: string;
    points: number;
    approvalDate: string | null;
    rejectReason: string | null;
  }>>([
    {
      id: 1,
      userId: "user001",
      userName: "김철수",
      uploadDate: "2024-08-20 10:30",
      receiptImage: "receipt1.jpg",
      storeName: "스타벅스 강남점",
      amount: 15000,
      status: "승인대기",
      points: 150,
      approvalDate: null,
      rejectReason: null
    },
    {
      id: 2,
      userId: "user002", 
      userName: "이영희",
      uploadDate: "2024-08-20 09:15",
      receiptImage: "receipt2.jpg",
      storeName: "올리브영 홍대점",
      amount: 25000,
      status: "승인완료",
      points: 250,
      approvalDate: "2024-08-20 09:45",
      rejectReason: null
    },
    {
      id: 3,
      userId: "user003",
      userName: "박민수", 
      uploadDate: "2024-08-20 08:20",
      receiptImage: "receipt3.jpg",
      storeName: "GS25 서초점",
      amount: 8000,
      status: "반려",
      points: 0,
      approvalDate: null,
      rejectReason: "영수증이 불분명하여 확인이 어렵습니다"
    }
  ]);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [isViewingReceipt, setIsViewingReceipt] = useState(false);
  const [receiptFilter, setReceiptFilter] = useState("전체");
  const [receiptStartDate, setReceiptStartDate] = useState("");
  const [receiptEndDate, setReceiptEndDate] = useState("");
  const [receiptKeyword, setReceiptKeyword] = useState("");
  const [pointsToAward, setPointsToAward] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  
  // 유저 통계 상태
  const [userStatsStartDate, setUserStatsStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 6); // 7일 전부터 (오늘 포함 7일)
    return date.toISOString().split('T')[0];
  });
  const [userStatsEndDate, setUserStatsEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [userStatsData, setUserStatsData] = useState([
    { date: '2024-08-14', signups: 12 },
    { date: '2024-08-15', signups: 8 },
    { date: '2024-08-16', signups: 15 },
    { date: '2024-08-17', signups: 23 },
    { date: '2024-08-18', signups: 18 },
    { date: '2024-08-19', signups: 27 },
    { date: '2024-08-20', signups: 19 }
  ]);
  const [isCreatingAccount, setIsCreatingAccount] = useState(() => {
    // localStorage에서 계정 생성 상태를 불러오기
    return localStorage.getItem('isCreatingAccount') === 'true';
  });
  const [newAccountId, setNewAccountId] = useState("");
  const [newAccountPassword, setNewAccountPassword] = useState("");
  const [newAccountName, setNewAccountName] = useState("");
  const [newAccountEmail, setNewAccountEmail] = useState("");
  const [newAccountPhone, setNewAccountPhone] = useState("");
  const [newAccountRole, setNewAccountRole] = useState("일반");
  const [createdUsers, setCreatedUsers] = useState<Array<{
    id: string;
    name: string;
    phone: string;
    email: string;
    role: string;
    quizCount: number;
    points: number;
    marketing: boolean;
    joinDate: string;
  }>>([]);
  const [isEditingUser, setIsEditingUser] = useState(() => {
    // localStorage에서 사용자 편집 상태를 불러오기
    return localStorage.getItem('isEditingUser') === 'true';
  });
  const [editingUserIndex, setEditingUserIndex] = useState<number>(-1);
  const [editingUserType, setEditingUserType] = useState<"created" | "dummy">("created");
  const [editUserName, setEditUserName] = useState("");
  const [editUserPhone, setEditUserPhone] = useState("");
  const [editUserEmail, setEditUserEmail] = useState("");
  const [editUserRole, setEditUserRole] = useState("일반");
  const [editUserMarketing, setEditUserMarketing] = useState(false);
  const [ads, setAds] = useState<any[]>([
    { name: "제주 올레길 카페", address: "제주시 구좌읍 월정리 33-8", points: 150, todayVisits: 23, totalVisits: 2850, status: "활성", startDate: "2024-08-01", endDate: "2024-10-31", createDate: "2024-08-19", type: "배너", position: "상단", targetUrl: "https://jeju-cafe.com", images: [] },
    { name: "부산 해운대 호텔", address: "부산시 해운대구 해운대해변로 264", points: 200, todayVisits: 18, totalVisits: 4230, status: "활성", startDate: "2024-07-15", endDate: "2024-12-31", createDate: "2024-08-18", type: "팝업", position: "중앙", targetUrl: "https://busan-hotel.com", images: [] },
    { name: "서울 명동 한식당", address: "서울시 중구 명동길 14", points: 100, todayVisits: 35, totalVisits: 1820, status: "활성", startDate: "2024-08-10", endDate: "2024-11-30", createDate: "2024-08-17", type: "텍스트", position: "하단", targetUrl: "https://seoul-restaurant.com", images: [] },
    { name: "전주 한옥마을 게스트하우스", address: "전주시 완산구 기린대로 99", points: 120, todayVisits: 12, totalVisits: 3150, status: "비활성", startDate: "2024-06-01", endDate: "2024-08-31", createDate: "2024-08-16", type: "마커", position: "사이드", targetUrl: "https://jeonju-hanok.com", images: [] },
    { name: "안동 하회마을 전통찻집", address: "안동시 풍천면 하회종가길 69", points: 80, todayVisits: 8, totalVisits: 1450, status: "활성", startDate: "2024-08-05", endDate: "2024-10-05", createDate: "2024-08-15", type: "배너", position: "상단", targetUrl: "https://andong-tea.com", images: [] },
    { name: "강릉 바다펜션", address: "강릉시 사천면 해안로 1412", points: 180, todayVisits: 27, totalVisits: 3680, status: "활성", startDate: "2024-07-20", endDate: "2024-09-20", createDate: "2024-08-14", type: "배너", position: "하단", targetUrl: "https://gangneung-pension.com", images: [] }
  ]);
  const [inquiries, setInquiries] = useState([
    { id: 1, title: "퀴즈 정답이 틀린 것 같습니다", category: "게임 문의", user: "김유저", status: "대기중", createDate: "2024-08-19", content: "서울의 대표적인 궁궐 문제에서 정답이 경복궁이라고 되어있는데, 창덕궁도 맞는 답 아닌가요?", answer: "" },
    { id: 2, title: "포인트가 제대로 적립되지 않아요", category: "포인트 문의", user: "이유저", status: "답변 완료", createDate: "2024-08-18", content: "어제 퀴즈를 5개 맞췄는데 포인트가 50점만 들어왔어요. 원래는 100점이어야 하는 것 아닌가요?", answer: "안녕하세요. 확인 결과 일시적인 서버 오류로 인해 포인트 적립에 문제가 있었습니다. 누락된 포인트 50점을 계정에 추가로 지급해드렸습니다. 감사합니다." },
    { id: 3, title: "앱이 자꾸 꺼져요", category: "기술 문의", user: "박유저", status: "대기중", createDate: "2024-08-17", content: "아이폰 14에서 앱을 사용하다가 갑자기 꺼지는 현상이 자주 발생합니다. 특히 퀴즈 푸는 중에 많이 그러네요.", answer: "" },
    { id: 4, title: "상품 교환은 언제 가능한가요?", category: "상품 문의", user: "최유저", status: "답변 완료", createDate: "2024-08-16", content: "포인트로 상품 교환을 하고 싶은데 언제부터 가능한지 궁금합니다.", answer: "상품 교환 서비스는 9월 1일부터 시작될 예정입니다. 자세한 내용은 추후 공지사항을 통해 안내드리겠습니다." },
    { id: 5, title: "회원탈퇴는 어떻게 하나요?", category: "계정 문의", user: "정유저", status: "대기중", createDate: "2024-08-15", content: "더 이상 서비스를 이용하지 않아서 회원탈퇴를 하고 싶습니다. 어떻게 해야 하나요?", answer: "" }
  ]);
  const [notices, setNotices] = useState([
    { category: "이벤트", title: "8월 신규 캐릭터 출시 이벤트", views: 1532, status: "활성", registerDate: "2024-08-19" },
    { category: "업데이트", title: "v2.1.5 게임 업데이트 안내", views: 2431, status: "활성", registerDate: "2024-08-19" },
    { category: "점검", title: "8월 19일 정기 점검 안내", views: 987, status: "비활성", registerDate: "2024-08-18" },
    { category: "이벤트", title: "여름휴가 특별 보상 이벤트", views: 3214, status: "활성", registerDate: "2024-08-17" },
    { category: "공지", title: "게임 이용약관 변경 안내", views: 654, status: "활성", registerDate: "2024-08-16" },
    { category: "업데이트", title: "신규 던전 '화염의 성' 오픈", views: 4321, status: "활성", registerDate: "2024-08-15" },
    { category: "이벤트", title: "길드 대항전 시즌2 개최", views: 2876, status: "활성", registerDate: "2024-08-14" },
    { category: "점검", title: "8월 13일 임시점검 완료", views: 543, status: "비활성", registerDate: "2024-08-13" },
    { category: "공지", title: "부정이용 계정 제재 안내", views: 1234, status: "활성", registerDate: "2024-08-12" },
    { category: "업데이트", title: "PvP 밸런스 조정 내역", views: 1876, status: "활성", registerDate: "2024-08-11" },
    { category: "이벤트", title: "신규 유저 환영 이벤트", views: 5432, status: "활성", registerDate: "2024-08-10" },
    { category: "공지", title: "커뮤니티 운영정책 개선", views: 432, status: "비활성", registerDate: "2024-08-09" },
    { category: "업데이트", title: "모바일 앱 v1.8.2 출시", views: 3456, status: "활성", registerDate: "2024-08-08" },
    { category: "점검", title: "서버 안정성 개선 작업 완료", views: 789, status: "비활성", registerDate: "2024-08-07" },
    { category: "이벤트", title: "여름 특별 패키지 판매", views: 2987, status: "활성", registerDate: "2024-08-06" }
  ]);
  const [products, setProducts] = useState([
    { id: 1, name: "경험치 2배 부스터", category: "부스터", price: 500, stock: 999, sales: 2340, status: "판매중", registerDate: "2024-08-19" },
    { id: 2, name: "골드 3배 부스터", category: "부스터", price: 800, stock: 999, sales: 1890, status: "판매중", registerDate: "2024-08-18" },
    { id: 3, name: "전설급 무기 상자", category: "무기", price: 5000, stock: 50, sales: 234, status: "판매중", registerDate: "2024-08-17" },
    { id: 4, name: "희귀 캐릭터 스킨", category: "스킨", price: 3000, stock: 0, sales: 567, status: "품절", registerDate: "2024-08-16" },
    { id: 5, name: "체력 물약 세트", category: "소모품", price: 200, stock: 500, sales: 3456, status: "판매중", registerDate: "2024-08-15" },
    { id: 6, name: "마나 물약 세트", category: "소모품", price: 250, stock: 450, sales: 2890, status: "판매중", registerDate: "2024-08-14" },
    { id: 7, name: "프리미엄 펫", category: "펫", price: 4500, stock: 120, sales: 678, status: "판매중", registerDate: "2024-08-13" },
    { id: 8, name: "전투력 증가 보석", category: "강화", price: 1500, stock: 80, sales: 1234, status: "판매중", registerDate: "2024-08-12" },
    { id: 9, name: "순간이동 스크롤", category: "소모품", price: 100, stock: 0, sales: 4567, status: "품절", registerDate: "2024-08-11" },
    { id: 10, name: "에픽급 방어구 상자", category: "방어구", price: 3500, stock: 75, sales: 456, status: "판매중", registerDate: "2024-08-10" },
    { id: 11, name: "스킬 리셋 포션", category: "소모품", price: 1000, stock: 200, sales: 987, status: "판매중", registerDate: "2024-08-09" },
    { id: 12, name: "레어 마운트", category: "마운트", price: 8000, stock: 30, sales: 123, status: "판매중", registerDate: "2024-08-08" },
    { id: 13, name: "길드 보너스 부스터", category: "부스터", price: 600, stock: 0, sales: 789, status: "품절", registerDate: "2024-08-07" },
    { id: 14, name: "행운의 주사위", category: "소모품", price: 300, stock: 350, sales: 2345, status: "판매중", registerDate: "2024-08-06" },
    { id: 15, name: "신화급 액세서리", category: "액세서리", price: 12000, stock: 15, sales: 89, status: "판매중", registerDate: "2024-08-05" },
    { id: 16, name: "무한 화살통", category: "무기", price: 2500, stock: 60, sales: 345, status: "판매중", registerDate: "2024-08-04" },
    { id: 17, name: "부활 스크롤 묶음", category: "소모품", price: 800, stock: 0, sales: 1567, status: "품절", registerDate: "2024-08-03" },
    { id: 18, name: "엘리트 캐릭터 팩", category: "캐릭터", price: 6500, stock: 25, sales: 234, status: "판매중", registerDate: "2024-08-02" },
    { id: 19, name: "VIP 멤버십 30일", category: "멤버십", price: 9900, stock: 999, sales: 1890, status: "판매중", registerDate: "2024-08-01" },
    { id: 20, name: "초보자 스타터 팩", category: "패키지", price: 1200, stock: 0, sales: 567, status: "비활성", registerDate: "2024-07-31" }
  ]);
  const itemsPerPage = 10;

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const formatCurrentTime = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${month}월 ${day}일 ${hours}:${minutes} 기준`;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 현재 호스트를 기반으로 API URL 설정
      const apiBaseUrl =
        window.location.hostname === "localhost"
          ? "http://localhost:3001"
          : `http://${window.location.hostname}:3001`;

      const response = await fetch(`${apiBaseUrl}/api/admin/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("adminToken", data.token);
        setIsLoggedIn(true);
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please check if backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
  };

  // 상품 수정 함수
  const handleEditProduct = (product: any, index: number) => {
    setEditingProductId(product.id || index);
    setProductName(product.name);
    setProductCategory(product.category);
    setProductPrice(product.price.toString());
    setProductStock(product.stock.toString());
    setProductStatus(product.status);
    setIsEditingProduct(true);
    setIsRegisteringProduct(true); // 같은 폼을 재사용
  };

  // 상품 수정 저장 함수
  const handleSaveProduct = async () => {
    try {
      if (!productName || !productCategory || !productPrice || !productStock) {
        alert("모든 필수 필드를 입력해주세요.");
        return;
      }

      // 실제 API 호출 대신 로컬 state 업데이트
      if (isEditingProduct && editingProductId !== null) {
        const updatedProducts = products.map((product, index) => {
          if ((product.id && product.id === editingProductId) || index === editingProductId) {
            return {
              ...product,
              name: productName,
              category: productCategory,
              price: parseInt(productPrice),
              stock: parseInt(productStock),
              status: productStatus
            };
          }
          return product;
        });
        setProducts(updatedProducts);
        alert("상품이 성공적으로 수정되었습니다.");
      } else {
        // 새 상품 등록
        const newProduct = {
          id: Date.now(),
          name: productName,
          category: productCategory,
          price: parseInt(productPrice),
          stock: parseInt(productStock),
          sales: 0,
          status: productStatus,
          registerDate: new Date().toISOString().split('T')[0]
        };
        setProducts([newProduct, ...products]);
        alert("상품이 성공적으로 등록되었습니다.");
      }

      // 폼 초기화
      resetProductForm();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("상품 저장 중 오류가 발생했습니다.");
    }
  };

  // 상품 폼 초기화 함수
  const resetProductForm = () => {
    setIsRegisteringProduct(false);
    setIsEditingProduct(false);
    setEditingProductId(null);
    setProductName("");
    setProductCategory("부스터");
    setProductPrice("");
    setProductStock("");
    setProductStatus("판매중");
    setProductImage(null);
    setProductImagePreview("");
  };

  // 상품 삭제 함수
  const handleDeleteProduct = (index: number) => {
    if (confirm("정말로 이 상품을 삭제하시겠습니까?")) {
      const updatedProducts = products.filter((_, i) => i !== index);
      setProducts(updatedProducts);
      alert("상품이 성공적으로 삭제되었습니다.");
    }
  };

  // 구매 상세 보기 함수
  const handleViewPurchaseDetail = (purchase: any, index: number) => {
    // 상세 정보를 포함한 더미 데이터 생성
    const detailPurchase = {
      ...purchase,
      id: index + 1,
      paymentMethod: "포인트",
      deliveryInfo: "즉시 지급",
      deliveryDate: purchase.purchaseDate,
      buyerInfo: {
        userId: `user${String(index + 1).padStart(3, '0')}`,
        userName: purchase.buyer,
        email: `${purchase.buyer.toLowerCase().replace(/\s/g, '')}@example.com`,
        phone: `010-${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
        level: Math.floor(Math.random() * 50) + 1,
        totalPurchases: Math.floor(Math.random() * 20) + 1
      },
      productInfo: {
        productId: `P${String(index + 1).padStart(3, '0')}`,
        category: purchase.product.includes("부스터") ? "부스터" : 
                  purchase.product.includes("무기") ? "무기" :
                  purchase.product.includes("물약") ? "소모품" :
                  purchase.product.includes("스킨") ? "스킨" : "기타",
        description: `${purchase.product}에 대한 상세 설명입니다.`,
        effectDuration: purchase.product.includes("부스터") ? "1시간" : 
                       purchase.product.includes("물약") ? "즉시 사용" : "영구",
        rarity: purchase.points >= 5000 ? "전설" : 
                purchase.points >= 2000 ? "희귀" : "일반"
      },
      transactionInfo: {
        transactionId: `TXN${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(index + 1).padStart(4, '0')}`,
        beforePoints: purchase.points + Math.floor(Math.random() * 5000) + 1000,
        afterPoints: Math.floor(Math.random() * 5000),
        usedPoints: purchase.points
      }
    };
    
    setSelectedPurchase(detailPurchase);
    setShowPurchaseDetail(true);
  };

  // 구매 상세 모달 닫기
  const closePurchaseDetail = () => {
    setShowPurchaseDetail(false);
    setSelectedPurchase(null);
  };

  // 구매 취소 모달 열기
  const handleCancelPurchase = (purchase: any, index: number) => {
    const purchaseWithIndex = { ...purchase, originalIndex: index };
    setCancelingPurchase(purchaseWithIndex);
    setShowCancelModal(true);
    setCancelReason("");
  };

  // 구매 취소 확인
  const confirmCancelPurchase = async () => {
    try {
      if (!cancelReason.trim()) {
        alert("취소 사유를 입력해주세요.");
        return;
      }

      // 실제 API 호출 (현재는 주석 처리)
      // const response = await api.put(`/admin/purchases/${cancelingPurchase.id}/cancel`, {
      //   reason: cancelReason
      // });

      // 로컬 구매 내역에서 해당 구매의 상태를 "취소"로 변경
      const updatedPurchases = purchases.map((purchase, index) => {
        if (index === cancelingPurchase.originalIndex) {
          return {
            ...purchase,
            status: "취소",
            cancelReason: cancelReason,
            cancelDate: new Date().toISOString().split('T')[0]
          };
        }
        return purchase;
      });

      setPurchases(updatedPurchases);
      alert(`구매가 성공적으로 취소되었습니다.\n취소 사유: ${cancelReason}`);

      // 모달 닫기
      setShowCancelModal(false);
      setCancelingPurchase(null);
      setCancelReason("");
    } catch (error) {
      console.error("Error canceling purchase:", error);
      alert("구매 취소 중 오류가 발생했습니다.");
    }
  };

  // 구매 취소 모달 닫기
  const closeCancelModal = () => {
    setShowCancelModal(false);
    setCancelingPurchase(null);
    setCancelReason("");
  };

  // Check if already logged in on component mount
  useState(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setIsLoggedIn(true);
    }
    return false; // useState의 초기값 반환
  });

  if (isLoggedIn) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "white",
        }}
      >
        <header
          style={{
            backgroundColor: "#f97316",
            padding: "20px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingLeft: "20px",
              paddingRight: "20px",
            }}
          >
            <h1
              style={{
                margin: 0,
                color: "white",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              탐험대장 관리자 페이지
            </h1>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: "white",
                color: "#f97316",
                border: "none",
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              로그아웃
            </button>
          </div>
        </header>

        <div
          style={{
            display: "flex",
          }}
        >
          {/* Left Sidebar */}
          <div
            style={{
              width: "250px",
              backgroundColor: "#f8f9fa",
              padding: "24px",
              borderRight: "1px solid #e5e7eb",
              minHeight: "calc(100vh - 100px)",
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
            {["관리자홈", "회원 관리", "컨텐츠 관리", "포인트 관리", "서비스 관리", "통계"].map((menu) => (
              <div key={menu}>
                <button
                  onClick={() => {
                    if (menu === "컨텐츠 관리" || menu === "포인트 관리" || menu === "서비스 관리" || menu === "통계") {
                      updateExpandedMenu(expandedMenu === menu ? null : menu);
                    } else {
                      updateActiveMenu(menu);
                      updateExpandedMenu(null);
                      // 회원 관리 메뉴 클릭 시 계정 생성 및 수정 상태 리셋
                      if (menu === "회원 관리") {
                        updateIsCreatingAccount(false);
                        updateIsEditingUser(false);
                      }
                    }
                  }}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    textAlign: "left",
                    backgroundColor: activeMenu === menu || (menu === "컨텐츠 관리" && (activeMenu === "퀴즈 관리" || activeMenu === "광고 관리")) || (menu === "포인트 관리" && (activeMenu === "상품 관리" || activeMenu === "구매 내역")) || (menu === "서비스 관리" && (activeMenu === "문의사항" || activeMenu === "공지사항" || activeMenu === "영수증 관리")) || (menu === "통계" && (activeMenu === "유저 통계")) || (menu === "회원 관리" && (isCreatingAccount || isEditingUser)) ? "#fed7aa" : "transparent",
                    color: activeMenu === menu || (menu === "컨텐츠 관리" && (activeMenu === "퀴즈 관리" || activeMenu === "광고 관리")) || (menu === "포인트 관리" && (activeMenu === "상품 관리" || activeMenu === "구매 내역")) || (menu === "서비스 관리" && (activeMenu === "문의사항" || activeMenu === "공지사항" || activeMenu === "영수증 관리")) || (menu === "통계" && (activeMenu === "유저 통계")) || (menu === "회원 관리" && (isCreatingAccount || isEditingUser)) ? "#c2410c" : "#374151",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: activeMenu === menu || (menu === "컨텐츠 관리" && (activeMenu === "퀴즈 관리" || activeMenu === "광고 관리")) || (menu === "포인트 관리" && (activeMenu === "상품 관리" || activeMenu === "구매 내역")) || (menu === "서비스 관리" && (activeMenu === "문의사항" || activeMenu === "공지사항" || activeMenu === "영수증 관리")) || (menu === "통계" && (activeMenu === "유저 통계")) || (menu === "회원 관리" && (isCreatingAccount || isEditingUser)) ? "600" : "500",
                    transition: "all 0.2s ease",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>{menu}</span>
                  {(menu === "컨텐츠 관리" || menu === "포인트 관리" || menu === "서비스 관리" || menu === "통계") && (
                    <span style={{ fontSize: "12px", color: "#6b7280" }}>
                      {expandedMenu === menu ? "▼" : "▶"}
                    </span>
                  )}
                </button>
                
                {/* 컨텐츠 관리 하위 메뉴 */}
                {menu === "컨텐츠 관리" && expandedMenu === menu && (
                  <div style={{ marginLeft: "16px", marginTop: "4px" }}>
                    {["퀴즈 관리", "광고 관리"].map((subMenu) => (
                      <button
                        key={subMenu}
                        onClick={() => {
                          updateActiveMenu(subMenu);
                        }}
                        style={{
                          width: "100%",
                          padding: "10px 16px",
                          textAlign: "left",
                          backgroundColor: activeMenu === subMenu ? "#fed7aa" : "transparent",
                          color: activeMenu === subMenu ? "#c2410c" : "#6b7280",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "13px",
                          fontWeight: activeMenu === subMenu ? "600" : "400",
                          transition: "all 0.2s ease",
                          marginBottom: "2px",
                        }}
                        onMouseEnter={(e) => {
                          if (activeMenu !== subMenu) {
                            e.currentTarget.style.backgroundColor = "#f3f4f6";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (activeMenu !== subMenu) {
                            e.currentTarget.style.backgroundColor = "transparent";
                          }
                        }}
                      >
                        {subMenu}
                      </button>
                    ))}
                  </div>
                )}
                
                {/* 포인트 관리 하위 메뉴 */}
                {menu === "포인트 관리" && expandedMenu === menu && (
                  <div style={{ marginLeft: "16px", marginTop: "4px" }}>
                    {["상품 관리", "구매 내역"].map((subMenu) => (
                      <button
                        key={subMenu}
                        onClick={() => {
                          updateActiveMenu(subMenu);
                        }}
                        style={{
                          width: "100%",
                          padding: "10px 16px",
                          textAlign: "left",
                          backgroundColor: activeMenu === subMenu ? "#fed7aa" : "transparent",
                          color: activeMenu === subMenu ? "#c2410c" : "#6b7280",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "13px",
                          fontWeight: activeMenu === subMenu ? "600" : "400",
                          transition: "all 0.2s ease",
                          marginBottom: "2px",
                        }}
                        onMouseEnter={(e) => {
                          if (activeMenu !== subMenu) {
                            e.currentTarget.style.backgroundColor = "#f3f4f6";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (activeMenu !== subMenu) {
                            e.currentTarget.style.backgroundColor = "transparent";
                          }
                        }}
                      >
                        {subMenu}
                      </button>
                    ))}
                  </div>
                )}
                
                {/* 서비스 관리 하위 메뉴 */}
                {menu === "서비스 관리" && expandedMenu === menu && (
                  <div style={{ marginLeft: "16px", marginTop: "4px" }}>
                    {["문의사항", "공지사항", "영수증 관리"].map((subMenu) => (
                      <button
                        key={subMenu}
                        onClick={() => {
                          updateActiveMenu(subMenu);
                        }}
                        style={{
                          width: "100%",
                          padding: "10px 16px",
                          textAlign: "left",
                          backgroundColor: activeMenu === subMenu ? "#fed7aa" : "transparent",
                          color: activeMenu === subMenu ? "#c2410c" : "#6b7280",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "13px",
                          fontWeight: activeMenu === subMenu ? "600" : "400",
                          transition: "all 0.2s ease",
                          marginBottom: "2px",
                        }}
                        onMouseEnter={(e) => {
                          if (activeMenu !== subMenu) {
                            e.currentTarget.style.backgroundColor = "#f3f4f6";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (activeMenu !== subMenu) {
                            e.currentTarget.style.backgroundColor = "transparent";
                          }
                        }}
                      >
                        {subMenu}
                      </button>
                    ))}
                  </div>
                )}

                {/* 통계 하위 메뉴 */}
                {menu === "통계" && expandedMenu === menu && (
                  <div style={{ marginLeft: "16px", marginTop: "4px" }}>
                    {["유저 통계"].map((subMenu) => (
                      <button
                        key={subMenu}
                        onClick={() => {
                          updateActiveMenu(subMenu);
                        }}
                        style={{
                          width: "100%",
                          padding: "10px 16px",
                          textAlign: "left",
                          backgroundColor: activeMenu === subMenu ? "#fed7aa" : "transparent",
                          color: activeMenu === subMenu ? "#c2410c" : "#6b7280",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "13px",
                          fontWeight: activeMenu === subMenu ? "600" : "400",
                          transition: "all 0.2s ease",
                          marginBottom: "2px",
                        }}
                        onMouseEnter={(e) => {
                          if (activeMenu !== subMenu) {
                            e.currentTarget.style.backgroundColor = "#f3f4f6";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (activeMenu !== subMenu) {
                            e.currentTarget.style.backgroundColor = "transparent";
                          }
                        }}
                      >
                        {subMenu}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            </div>
          </div>

          {/* Main Content */}
          <div
            style={{
              flex: 1,
              padding: "40px 40px 20px 40px",
            }}
          >
            {activeMenu === "관리자홈" && (
              <>
                {/* Header Section */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "24px",
                  }}
                >
                  <h1
                    style={{
                      fontSize: "28px",
                      fontWeight: "bold",
                      color: "#1f2937",
                      margin: 0,
                    }}
                  >
                    탐험대장 Admin
                  </h1>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#6b7280",
                      fontWeight: "500",
                    }}
                  >
                    {formatCurrentTime(currentTime)}
                  </div>
                </div>

                {/* Top Action Cards Row */}
                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    marginBottom: "24px",
                  }}
                >
                  <button
                    onClick={() => {
                      updateActiveMenu("유저 통계");
                      updateExpandedMenu("통계");
                    }}
                    style={{
                      flex: 1,
                      backgroundColor: "#B46B00",
                      border: "none",
                      borderRadius: "12px",
                      padding: "20px",
                      cursor: "pointer",
                      boxShadow: "0 2px 8px rgba(249, 115, 22, 0.15)",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 4px 16px rgba(249, 115, 22, 0.25)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 2px 8px rgba(249, 115, 22, 0.15)";
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", flex: 1 }}>
                        {/* Left section - 오늘 신규 회원가입 */}
                        <div style={{ flex: 1, textAlign: "left" }}>
                          <div
                            style={{
                              fontSize: "14px",
                              color: "white",
                              fontWeight: "500",
                              marginBottom: "8px",
                            }}
                          >
                            오늘 신규 회원가입
                          </div>
                          <div
                            style={{
                              fontSize: "24px",
                              fontWeight: "bold",
                              color: "white",
                            }}
                          >
                            93명
                          </div>
                        </div>
                        
                        {/* Right section - 총회원 수 */}
                        <div style={{ flex: 1, textAlign: "left", paddingLeft: "20px", borderLeft: "1px solid white" }}>
                          <div
                            style={{
                              fontSize: "14px",
                              color: "white",
                              fontWeight: "500",
                              marginBottom: "8px",
                            }}
                          >
                            총회원 수
                          </div>
                          <div
                            style={{
                              fontSize: "24px",
                              fontWeight: "bold",
                              color: "white",
                            }}
                          >
                            2,292명
                          </div>
                        </div>
                      </div>
                      <div style={{ fontSize: "20px", color: "white", paddingLeft: "16px" }}>→</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      updateActiveMenu("영수증 관리");
                      updateExpandedMenu("서비스 관리");
                    }}
                    style={{
                      flex: 1,
                      backgroundColor: "#FF9800",
                      border: "none",
                      borderRadius: "12px",
                      padding: "20px",
                      cursor: "pointer",
                      boxShadow: "0 2px 8px rgba(251, 146, 60, 0.15)",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 4px 16px rgba(251, 146, 60, 0.25)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 2px 8px rgba(251, 146, 60, 0.15)";
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ textAlign: "left" }}>
                        <div
                          style={{
                            fontSize: "14px",
                            color: "white",
                            fontWeight: "500",
                            marginBottom: "8px",
                          }}
                        >
                          승인이 필요한 영수증
                        </div>
                        <div
                          style={{
                            fontSize: "24px",
                            fontWeight: "bold",
                            color: "white",
                          }}
                        >
                          32건
                        </div>
                      </div>
                      <div style={{ fontSize: "20px", color: "white" }}>→</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      updateActiveMenu("문의사항");
                      updateExpandedMenu("서비스 관리");
                    }}
                    style={{
                      flex: 1,
                      backgroundColor: "#FFD391",
                      border: "none",
                      borderRadius: "12px",
                      padding: "20px",
                      cursor: "pointer",
                      boxShadow: "0 2px 8px rgba(234, 88, 12, 0.15)",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 4px 16px rgba(234, 88, 12, 0.25)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 2px 8px rgba(234, 88, 12, 0.15)";
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ textAlign: "left" }}>
                        <div
                          style={{
                            fontSize: "14px",
                            color: "white",
                            fontWeight: "500",
                            marginBottom: "8px",
                          }}
                        >
                          현재 답변이 필요한 문의
                        </div>
                        <div
                          style={{
                            fontSize: "24px",
                            fontWeight: "bold",
                            color: "white",
                          }}
                        >
                          32건
                        </div>
                      </div>
                      <div style={{ fontSize: "20px", color: "white" }}>→</div>
                    </div>
                  </button>
                </div>

                {/* User Statistics Section */}
                <div style={{ marginTop: "48px", marginBottom: "32px" }}>
                  <h2
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: "#1f2937",
                      marginBottom: "16px",
                      margin: "0 0 16px 0",
                    }}
                  >
                    유저 통계
                  </h2>
                  <div
                    style={{
                      height: "2px",
                      backgroundColor: "#d1d5db",
                      marginBottom: "20px",
                    }}
                  ></div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "16px",
                      height: "400px",
                    }}
                  >
                    {/* Left side - Grid chart */}
                    <div
                      style={{
                        backgroundColor: "white",
                        borderRadius: "12px",
                        padding: "32px",
                        border: "1px solid #f3f4f6",
                        position: "relative",
                      }}
                    >
                      {/* Legend - 색상 구분 표시 */}
                      <div
                        style={{
                          position: "absolute",
                          top: "20px",
                          right: "48px",
                          display: "flex",
                          gap: "12px",
                          fontSize: "12px",
                          fontWeight: "500",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <div
                            style={{
                              width: "12px",
                              height: "12px",
                              backgroundColor: "#FF9800",
                              borderRadius: "2px",
                            }}
                          />
                          <span style={{ color: "#6b7280" }}>Android</span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <div
                            style={{
                              width: "12px",
                              height: "12px",
                              backgroundColor: "#FFD391",
                              borderRadius: "2px",
                            }}
                          />
                          <span style={{ color: "#6b7280" }}>iOS</span>
                        </div>
                      </div>
                      
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          height: "100%",
                          paddingTop: "30px",
                          paddingBottom: "5px",
                        }}
                      >
                        {/* Chart container with aligned labels and grid */}
                        <div
                          style={{
                            flex: 1,
                            height: "100%",
                            position: "relative",
                            display: "flex",
                          }}
                        >
                          {/* Y-axis labels */}
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              height: "100%",
                              marginLeft: "16px",
                              marginRight: "16px",
                              position: "relative",
                            }}
                          >
                            {[400, 300, 200, 100, 0].map((value, index) => (
                              <div
                                key={index}
                                style={{
                                  fontSize: "12px",
                                  color: "#6b7280",
                                  fontWeight: "500",
                                  textAlign: "right",
                                  width: "40px",
                                  lineHeight: "1px",
                                  transform: "translateY(0.5px)",
                                }}
                              >
                                {value}
                              </div>
                            ))}
                          </div>
                          
                          {/* Grid area */}
                          <div
                            style={{
                              flex: 1,
                              height: "100%",
                              position: "relative",
                              marginRight: "16px",
                            }}
                          >
                            {/* Horizontal grid lines */}
                            {[0, 25, 50, 75, 100].map((position, index) => (
                              <div
                                key={index}
                                style={{
                                  position: "absolute",
                                  left: 0,
                                  right: 0,
                                  bottom: `${position}%`,
                                  height: "1px",
                                  backgroundColor: "#e5e7eb",
                                  zIndex: 1,
                                }}
                              />
                            ))}
                            
                            {/* Bar chart */}
                            <div
                              style={{
                                display: "flex",
                                alignItems: "end",
                                justifyContent: "space-between",
                                height: "100%",
                                position: "relative",
                                zIndex: 2,
                                gap: "8px",
                                padding: "0 4px",
                              }}
                            >
                              {(() => {
                                // 더미 데이터: 7일간 AOS + iOS 가입자수
                                const dummyData = [
                                  { aos: 80, ios: 100 },   // 총 180
                                  { aos: 120, ios: 200 },  // 총 320
                                  { aos: 110, ios: 140 },  // 총 250
                                  { aos: 150, ios: 230 },  // 총 380
                                  { aos: 90, ios: 120 },   // 총 210
                                  { aos: 130, ios: 160 },  // 총 290
                                  { aos: 140, ios: 200 },  // 총 340
                                ];
                                
                                return dummyData.map((data, index) => {
                                  const total = data.aos + data.ios;
                                  const totalHeight = (total / 400) * 100;
                                  
                                  return (
                                    <div
                                      key={index}
                                      style={{
                                        flex: 1,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        height: "100%",
                                        justifyContent: "end",
                                      }}
                                    >
                                      <div
                                        style={{
                                          width: "55%",
                                          height: `${totalHeight}%`,
                                          display: "flex",
                                          flexDirection: "column",
                                          minHeight: "20px",
                                          position: "relative",
                                        }}
                                      >
                                        {/* iOS section (상단) */}
                                        <div
                                          style={{
                                            flex: data.ios,
                                            backgroundColor: "#FFD391",
                                            borderRadius: "4px 4px 0 0",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            minHeight: "10px",
                                          }}
                                        >
                                          <span
                                            style={{
                                              fontSize: "10px",
                                              fontWeight: "600",
                                              color: "#7c2d12",
                                              textShadow: "0 1px 2px rgba(255,255,255,0.3)",
                                            }}
                                          >
                                            {data.ios}
                                          </span>
                                        </div>
                                        {/* AOS section (하단) */}
                                        <div
                                          style={{
                                            flex: data.aos,
                                            backgroundColor: "#FF9800",
                                            borderRadius: "0 0 2px 2px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            minHeight: "10px",
                                          }}
                                        >
                                          <span
                                            style={{
                                              fontSize: "10px",
                                              fontWeight: "600",
                                              color: "white",
                                              textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                                            }}
                                          >
                                            {data.aos}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                });
                              })()}
                            </div>
                          </div>
                        </div>
                        
                        {/* X-axis date labels */}
                        <div
                          style={{
                            display: "flex",
                            marginTop: "8px",
                            paddingLeft: "72px", // Align with grid area (Y-axis width + margins)
                            paddingRight: "16px",
                          }}
                        >
                          {(() => {
                            const dates = [];
                            const today = new Date();
                            for (let i = 6; i >= 0; i--) {
                              const date = new Date(today);
                              date.setDate(today.getDate() - i);
                              const month = String(date.getMonth() + 1).padStart(2, '0');
                              const day = String(date.getDate()).padStart(2, '0');
                              dates.push(`${month}/${day}`);
                            }
                            return dates.map((date, index) => (
                              <div
                                key={index}
                                style={{
                                  flex: 1,
                                  textAlign: "center",
                                  fontSize: "14px",
                                  color: "#6b7280",
                                  fontWeight: "500",
                                }}
                              >
                                {date}
                              </div>
                            ));
                          })()}
                        </div>
                      </div>
                    </div>

                    {/* Right side - Merged cards 2&4 in 2x2 layout */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gridTemplateRows: "1fr 1fr",
                        gap: "8px",
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: "#F8F8F8",
                          borderRadius: "8px",
                          padding: "20px 32px 16px 32px",
                          border: "1px solid #f3f4f6",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div style={{ display: "flex", flex: 1, alignItems: "center" }}>
                          {/* Left section - 실시간 Android 가입 */}
                          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                            <div
                              style={{
                                fontSize: "20px",
                                color: "#6b7280",
                                fontWeight: "400",
                                marginBottom: "12px",
                              }}
                            >
                              실시간 AOS 가입
                            </div>
                            <div
                              style={{
                                fontSize: "30px",
                                fontWeight: "600",
                                color: "#1f2937",
                              }}
                            >
                              47명
                            </div>
                          </div>
                          
                          {/* Right section - 최근 일주일 평균 대비 */}
                          <div style={{ flex: 1, paddingLeft: "12px", borderLeft: "1px solid #d1d5db", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-end" }}>
                            <div
                              style={{
                                fontSize: "16px",
                                color: "#6b7280",
                                fontWeight: "400",
                                marginBottom: "6px",
                                textAlign: "right",
                              }}
                            >
                              최근 일주일 평균 대비
                            </div>
                            <div
                              style={{
                                fontSize: "23px",
                                fontWeight: "600",
                                color: "#1f2937",
                                textAlign: "right",
                              }}
                            >
                              ▲ 12%
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          backgroundColor: "#F8F8F8",
                          borderRadius: "8px",
                          padding: "20px 16px 16px 32px",
                          border: "1px solid #f3f4f6",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "20px",
                            color: "#6b7280",
                            fontWeight: "400",
                            marginBottom: "12px",
                          }}
                        >
                          오늘 가입
                        </div>
                        <div
                          style={{
                            fontSize: "30px",
                            fontWeight: "600",
                            color: "#1f2937",
                          }}
                        >
                          93명
                        </div>
                      </div>
                      <div
                        style={{
                          backgroundColor: "#F8F8F8",
                          borderRadius: "8px",
                          padding: "20px 32px 16px 32px",
                          border: "1px solid #f3f4f6",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div style={{ display: "flex", flex: 1, alignItems: "center" }}>
                          {/* Left section - 실시간 iOS 가입 */}
                          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                            <div
                              style={{
                                fontSize: "20px",
                                color: "#6b7280",
                                fontWeight: "400",
                                marginBottom: "12px",
                              }}
                            >
                              실시간 iOS 가입
                            </div>
                            <div
                              style={{
                                fontSize: "30px",
                                fontWeight: "600",
                                color: "#1f2937",
                              }}
                            >
                              128명
                            </div>
                          </div>
                          
                          {/* Right section - 최근 일주일 평균 대비 */}
                          <div style={{ flex: 1, paddingLeft: "12px", borderLeft: "1px solid #d1d5db", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-end" }}>
                            <div
                              style={{
                                fontSize: "16px",
                                color: "#6b7280",
                                fontWeight: "400",
                                marginBottom: "6px",
                                textAlign: "right",
                              }}
                            >
                              최근 일주일 평균 대비
                            </div>
                            <div
                              style={{
                                fontSize: "23px",
                                fontWeight: "600",
                                color: "#1f2937",
                                textAlign: "right",
                              }}
                            >
                              ▼ 8%
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          backgroundColor: "#F8F8F8",
                          borderRadius: "8px",
                          padding: "20px 16px 16px 32px",
                          border: "1px solid #f3f4f6",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "20px",
                            color: "#6b7280",
                            fontWeight: "400",
                            marginBottom: "12px",
                          }}
                        >
                          최근 일주일 기준 평균 가입
                        </div>
                        <div
                          style={{
                            fontSize: "30px",
                            fontWeight: "600",
                            color: "#1f2937",
                          }}
                        >
                          82명
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Second User Statistics Section (복제) */}
                <div style={{ marginTop: "48px", marginBottom: "32px" }}>
                  <h2
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: "#1f2937",
                      marginBottom: "16px",
                      margin: "0 0 16px 0",
                    }}
                  >
                    리워드 통계
                  </h2>
                  <div
                    style={{
                      height: "2px",
                      backgroundColor: "#d1d5db",
                      marginBottom: "20px",
                    }}
                  ></div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "16px",
                      height: "400px",
                    }}
                  >
                    {/* Left side - Grid chart */}
                    <div
                      style={{
                        backgroundColor: "white",
                        borderRadius: "12px",
                        padding: "32px",
                        border: "1px solid #f3f4f6",
                        position: "relative",
                      }}
                    >
                      {/* Legend - 색상 구분 표시 */}
                      <div
                        style={{
                          position: "absolute",
                          top: "20px",
                          right: "48px",
                          display: "flex",
                          gap: "12px",
                          fontSize: "12px",
                          fontWeight: "500",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <div
                            style={{
                              width: "12px",
                              height: "12px",
                              backgroundColor: "#FF9800",
                              borderRadius: "2px",
                            }}
                          />
                          <span style={{ color: "#6b7280" }}>실제 방문</span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <div
                            style={{
                              width: "12px",
                              height: "12px",
                              backgroundColor: "#FFD391",
                              borderRadius: "2px",
                            }}
                          />
                          <span style={{ color: "#6b7280" }}>미션 수행</span>
                        </div>
                      </div>
                      
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          height: "100%",
                          paddingTop: "30px",
                          paddingBottom: "5px",
                        }}
                      >
                        {/* Chart container with aligned labels and grid */}
                        <div
                          style={{
                            flex: 1,
                            height: "100%",
                            position: "relative",
                            display: "flex",
                          }}
                        >
                          {/* Y-axis labels */}
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              height: "100%",
                              marginLeft: "16px",
                              marginRight: "16px",
                              position: "relative",
                            }}
                          >
                            {[10000, 7500, 5000, 2500, 0].map((value, index) => (
                              <div
                                key={index}
                                style={{
                                  fontSize: "12px",
                                  color: "#6b7280",
                                  fontWeight: "500",
                                  textAlign: "right",
                                  width: "40px",
                                  lineHeight: "1px",
                                  transform: "translateY(0.5px)",
                                }}
                              >
                                {value}
                              </div>
                            ))}
                          </div>
                          
                          {/* Grid area */}
                          <div
                            style={{
                              flex: 1,
                              height: "100%",
                              position: "relative",
                              marginRight: "16px",
                            }}
                          >
                            {/* Horizontal grid lines */}
                            {[0, 25, 50, 75, 100].map((position, index) => (
                              <div
                                key={index}
                                style={{
                                  position: "absolute",
                                  left: 0,
                                  right: 0,
                                  bottom: `${position}%`,
                                  height: "1px",
                                  backgroundColor: "#e5e7eb",
                                  zIndex: 1,
                                }}
                              />
                            ))}
                            
                            {/* Line chart with data points */}
                            <div
                              style={{
                                position: "relative",
                                height: "100%",
                                zIndex: 2,
                                padding: "0 4px",
                              }}
                            >
                              {(() => {
                                // 리워드 데이터: 7일간 실제 방문 + 미션 수행
                                const dummyData = [
                                  { visit: 2800, mission: 2200 },   // 08/13
                                  { visit: 4500, mission: 7500 },   // 08/14
                                  { visit: 3100, mission: 2600 },   // 08/15
                                  { visit: 9200, mission: 4900 },   // 08/16
                                  { visit: 3700, mission: 6500 },   // 08/17
                                  { visit: 5800, mission: 4400 },   // 08/18
                                  { visit: 4900, mission: 3900 },   // 08/19
                                ];
                                
                                const maxValue = 10000;
                                const chartHeight = 100;
                                
                                // Calculate positions for SVG - match flex layout exactly
                                const visitPoints = dummyData.map((data, index) => {
                                  // Each flex item gets equal space: 100% / 7 items = ~14.28% each
                                  // Center of each item: (index * 14.28) + 7.14
                                  const x = (index + 0.5) * (100 / dummyData.length);
                                  const y = chartHeight - (data.visit / maxValue) * chartHeight;
                                  return { x, y };
                                });
                                
                                const missionPoints = dummyData.map((data, index) => {
                                  // Each flex item gets equal space: 100% / 7 items = ~14.28% each
                                  // Center of each item: (index * 14.28) + 7.14
                                  const x = (index + 0.5) * (100 / dummyData.length);
                                  const y = chartHeight - (data.mission / maxValue) * chartHeight;
                                  return { x, y };
                                });
                                
                                // Create path strings
                                const visitPath = visitPoints.map((point, index) => 
                                  `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
                                ).join(' ');
                                
                                const missionPath = missionPoints.map((point, index) => 
                                  `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
                                ).join(' ');
                                
                                return (
                                  <>
                                    {/* SVG Lines */}
                                    <svg
                                      style={{
                                        width: "calc(100% - 8px)",
                                        height: "100%",
                                        position: "absolute",
                                        top: 0,
                                        left: "4px",
                                      }}
                                      viewBox="0 0 100 100"
                                      preserveAspectRatio="none"
                                    >
                                      {/* Visit line */}
                                      <path
                                        d={visitPath}
                                        fill="none"
                                        stroke="#FF9800"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        vectorEffect="non-scaling-stroke"
                                      />
                                      {/* Mission line */}
                                      <path
                                        d={missionPath}
                                        fill="none"
                                        stroke="#FFD391"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        vectorEffect="non-scaling-stroke"
                                      />
                                    </svg>
                                    
                                    {/* Data Points Container */}
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "end",
                                        justifyContent: "space-between",
                                        height: "100%",
                                        position: "relative",
                                        gap: "8px",
                                      }}
                                    >
                                      {dummyData.map((data, index) => {
                                        const visitHeight = (data.visit / maxValue) * 100;
                                        const missionHeight = (data.mission / maxValue) * 100;
                                        
                                        return (
                                          <div
                                            key={index}
                                            style={{
                                              flex: 1,
                                              display: "flex",
                                              flexDirection: "column",
                                              alignItems: "center",
                                              height: "100%",
                                              justifyContent: "end",
                                              position: "relative",
                                            }}
                                          >
                                            {/* Visit data point */}
                                            <div
                                              style={{
                                                position: "absolute",
                                                bottom: `${visitHeight}%`,
                                                left: "50%",
                                                transform: "translateX(-50%)",
                                                width: "12px",
                                                height: "12px",
                                                backgroundColor: "white",
                                                border: "3px solid #FF9800",
                                                borderRadius: "50%",
                                                cursor: "pointer",
                                              }}
                                              onMouseEnter={(e) => {
                                                const rect = e.currentTarget.getBoundingClientRect();
                                                setHoveredDataPoint({
                                                  type: "실제 방문",
                                                  value: data.visit,
                                                  x: rect.left + rect.width / 2,
                                                  y: rect.top
                                                });
                                              }}
                                              onMouseLeave={() => setHoveredDataPoint(null)}
                                            />
                                            {/* Mission data point */}
                                            <div
                                              style={{
                                                position: "absolute",
                                                bottom: `${missionHeight}%`,
                                                left: "50%",
                                                transform: "translateX(-50%)",
                                                width: "12px",
                                                height: "12px",
                                                backgroundColor: "white",
                                                border: "3px solid #FFD391",
                                                borderRadius: "50%",
                                                cursor: "pointer",
                                              }}
                                              onMouseEnter={(e) => {
                                                const rect = e.currentTarget.getBoundingClientRect();
                                                setHoveredDataPoint({
                                                  type: "미션 수행",
                                                  value: data.mission,
                                                  x: rect.left + rect.width / 2,
                                                  y: rect.top
                                                });
                                              }}
                                              onMouseLeave={() => setHoveredDataPoint(null)}
                                            />
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </>
                                );
                              })()}
                            </div>
                          </div>
                        </div>
                        
                        {/* X-axis date labels */}
                        <div
                          style={{
                            display: "flex",
                            marginTop: "8px",
                            paddingLeft: "72px", // Align with grid area (Y-axis width + margins)
                            paddingRight: "16px",
                          }}
                        >
                          {(() => {
                            const dates = [];
                            const today = new Date();
                            for (let i = 6; i >= 0; i--) {
                              const date = new Date(today);
                              date.setDate(today.getDate() - i);
                              const month = String(date.getMonth() + 1).padStart(2, '0');
                              const day = String(date.getDate()).padStart(2, '0');
                              dates.push(`${month}/${day}`);
                            }
                            return dates.map((date, index) => (
                              <div
                                key={index}
                                style={{
                                  flex: 1,
                                  textAlign: "center",
                                  fontSize: "14px",
                                  color: "#6b7280",
                                  fontWeight: "500",
                                }}
                              >
                                {date}
                              </div>
                            ));
                          })()}
                        </div>
                      </div>
                    </div>

                    {/* Right side - Copy of left chart */}
                    <div
                      style={{
                        backgroundColor: "white",
                        borderRadius: "12px",
                        padding: "32px",
                        border: "1px solid #f3f4f6",
                        position: "relative",
                      }}
                    >
                      {/* Legend - 색상 구분 표시 */}
                      <div
                        style={{
                          position: "absolute",
                          top: "20px",
                          right: "48px",
                          display: "flex",
                          gap: "12px",
                          fontSize: "12px",
                          fontWeight: "500",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <div
                            style={{
                              width: "12px",
                              height: "12px",
                              backgroundColor: "#FFD391",
                              borderRadius: "2px",
                            }}
                          />
                          <span style={{ color: "#6b7280" }}>통합 리워드 획득</span>
                        </div>
                      </div>
                      
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          height: "100%",
                          paddingTop: "30px",
                          paddingBottom: "5px",
                        }}
                      >
                        {/* Chart container with aligned labels and grid */}
                        <div
                          style={{
                            flex: 1,
                            height: "100%",
                            position: "relative",
                            display: "flex",
                          }}
                        >
                          {/* Y-axis labels */}
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              height: "100%",
                              marginLeft: "16px",
                              marginRight: "16px",
                              position: "relative",
                            }}
                          >
                            {[12000, 9000, 6000, 3000, 0].map((value, index) => (
                              <div
                                key={index}
                                style={{
                                  fontSize: "12px",
                                  color: "#6b7280",
                                  fontWeight: "500",
                                  textAlign: "right",
                                  width: "40px",
                                  lineHeight: "1px",
                                  transform: "translateY(0.5px)",
                                }}
                              >
                                {value}
                              </div>
                            ))}
                          </div>
                          
                          {/* Grid area */}
                          <div
                            style={{
                              flex: 1,
                              height: "100%",
                              position: "relative",
                              marginRight: "16px",
                            }}
                          >
                            {/* Horizontal grid lines */}
                            {[0, 25, 50, 75, 100].map((position, index) => (
                              <div
                                key={index}
                                style={{
                                  position: "absolute",
                                  left: 0,
                                  right: 0,
                                  bottom: `${position}%`,
                                  height: "1px",
                                  backgroundColor: "#e5e7eb",
                                  zIndex: 1,
                                }}
                              />
                            ))}
                            
                            {/* Bar chart */}
                            <div
                              style={{
                                display: "flex",
                                alignItems: "end",
                                justifyContent: "space-between",
                                height: "100%",
                                position: "relative",
                                zIndex: 2,
                                gap: "8px",
                                padding: "0 4px",
                              }}
                            >
                              {(() => {
                                // 통합 리워드 획득 데이터: 4주간
                                const dummyData = [8500, 10200, 7800, 9600];
                                const maxValue = 12000;
                                
                                return dummyData.map((value, index) => {
                                  const barHeight = (value / maxValue) * 100;
                                  
                                  return (
                                    <div
                                      key={index}
                                      style={{
                                        flex: 1,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        height: "100%",
                                        justifyContent: "end",
                                      }}
                                    >
                                      <div
                                        style={{
                                          width: "45%",
                                          height: `${barHeight}%`,
                                          backgroundColor: "#FFD391",
                                          borderRadius: "4px",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          minHeight: "20px",
                                          cursor: "pointer",
                                        }}
                                        onMouseEnter={(e) => {
                                          const rect = e.currentTarget.getBoundingClientRect();
                                          setHoveredDataPoint({
                                            type: "통합 리워드 획득",
                                            value: value,
                                            x: rect.left + rect.width / 2,
                                            y: rect.top
                                          });
                                        }}
                                        onMouseLeave={() => setHoveredDataPoint(null)}
                                      >
                                        <span
                                          style={{
                                            fontSize: "11px",
                                            fontWeight: "600",
                                            color: "#7c2d12",
                                            textShadow: "0 1px 2px rgba(255,255,255,0.3)",
                                          }}
                                        >
                                          {value.toLocaleString()}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                });
                              })()}
                            </div>
                          </div>
                        </div>
                        
                        {/* X-axis week labels */}
                        <div
                          style={{
                            display: "flex",
                            marginTop: "8px",
                            paddingLeft: "72px", // Align with grid area (Y-axis width + margins)
                            paddingRight: "16px",
                          }}
                        >
                          {(() => {
                            const weeks = ["8월 1주", "8월 2주", "8월 3주", "8월 4주"];
                            return weeks.map((week, index) => (
                              <div
                                key={index}
                                style={{
                                  flex: 1,
                                  textAlign: "center",
                                  fontSize: "14px",
                                  color: "#6b7280",
                                  fontWeight: "500",
                                }}
                              >
                                {week}
                              </div>
                            ));
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>


              </>
            )}
            
            {activeMenu === "퀴즈 관리" && !isCreatingQuiz && (
              <>
                {/* Header Section */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "32px",
                  }}
                >
                  <h1
                    style={{
                      fontSize: "32px",
                      fontWeight: "bold",
                      color: "#1f2937",
                      margin: 0,
                    }}
                  >
                    퀴즈 관리
                  </h1>
                  <button
                    onClick={() => setIsCreatingQuiz(true)}
                    style={{
                      backgroundColor: "#F97316",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      padding: "8px 16px",
                      fontSize: "14px",
                      fontWeight: "500",
                      cursor: "pointer",
                      boxShadow: "0 2px 4px rgba(249, 115, 22, 0.15)",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#EA580C";
                      e.currentTarget.style.transform = "translateY(-1px)";
                      e.currentTarget.style.boxShadow = "0 4px 8px rgba(249, 115, 22, 0.25)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#F97316";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 2px 4px rgba(249, 115, 22, 0.15)";
                    }}
                  >
                    퀴즈 생성
                  </button>
                </div>
                
                {/* 필터 섹션 */}
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    padding: "24px",
                    border: "1px solid #f3f4f6",
                    marginBottom: "24px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    }}
                  >
                    {/* First row - 등록일 */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        justifyContent: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#374151",
                          minWidth: "60px",
                        }}
                      >
                        등록일
                      </div>
                      <input
                        type="text"
                        placeholder="시작일"
                        value={quizStartDate}
                        onChange={(e) => setQuizStartDate(e.target.value)}
                        onFocus={(e) => {
                          e.target.type = "date";
                          e.target.showPicker?.();
                        }}
                        onBlur={(e) => {
                          if (!e.target.value) {
                            e.target.type = "text";
                          }
                        }}
                        style={{
                          width: "150px",
                          padding: "8px 12px",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          fontSize: "14px",
                          color: "#374151",
                          backgroundColor: "white",
                        }}
                      />
                      <input
                        type="text"
                        placeholder="종료일"
                        value={quizEndDate}
                        onChange={(e) => setQuizEndDate(e.target.value)}
                        onFocus={(e) => {
                          e.target.type = "date";
                          e.target.showPicker?.();
                        }}
                        onBlur={(e) => {
                          if (!e.target.value) {
                            e.target.type = "text";
                          }
                        }}
                        style={{
                          width: "150px",
                          padding: "8px 12px",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          fontSize: "14px",
                          color: "#374151",
                          backgroundColor: "white",
                        }}
                      />
                    </div>

                    {/* Second row - 키워드, 검색창, 검색 버튼 */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        justifyContent: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#374151",
                          minWidth: "60px",
                        }}
                      >
                        키워드
                      </div>
                      <input
                        type="text"
                        placeholder="퀴즈 제목, 카테고리 등으로 검색"
                        value={quizKeyword}
                        onChange={(e) => setQuizKeyword(e.target.value)}
                        style={{
                          width: "300px",
                          padding: "8px 12px",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          fontSize: "14px",
                          color: "#374151",
                          backgroundColor: "white",
                        }}
                      />
                      <button
                        onClick={() => {
                          // 검색 실행 (상태가 실시간으로 업데이트되므로 별도 로직 불필요)
                          setCurrentPage(1); // 페이지를 1로 초기화
                        }}
                        style={{
                          backgroundColor: "#F97316",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          padding: "8px 16px",
                          fontSize: "14px",
                          fontWeight: "500",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          whiteSpace: "nowrap",
                          minWidth: "60px",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#EA580C";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#F97316";
                        }}
                      >
                        검색
                      </button>
                    </div>
                  </div>
                </div>

                {/* 퀴즈 리스트 섹션 */}
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    padding: "0",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#1f2937",
                      marginBottom: "20px",
                      margin: "24px 0 20px 0",
                    }}
                  >
                    총 30건
                  </h3>
                  
                  {/* 테이블 */}
                  <div
                    style={{
                      overflowX: "auto",
                      padding: "0",
                    }}
                  >
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "separate",
                        borderSpacing: "0",
                        fontSize: "14px",
                        borderRadius: "8px",
                        overflow: "hidden",
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      {/* 테이블 헤더 */}
                      <thead>
                        <tr>
                          <th
                            style={{
                              backgroundColor: "#f8f9fa",
                              padding: "12px 8px",
                              textAlign: "center",
                              fontWeight: "600",
                              color: "#374151",
                              borderRight: "1px solid #e5e7eb",
                              borderBottom: "1px solid #e5e7eb",
                              fontSize: "14px",
                            }}
                          >
                            번호
                          </th>
                          <th
                            style={{
                              backgroundColor: "#f8f9fa",
                              padding: "12px 16px",
                              textAlign: "left",
                              fontWeight: "600",
                              color: "#374151",
                              borderRight: "1px solid #e5e7eb",
                              borderBottom: "1px solid #e5e7eb",
                              fontSize: "14px",
                            }}
                          >
                            퀴즈 제목
                          </th>
                          <th
                            style={{
                              backgroundColor: "#f8f9fa",
                              padding: "12px 16px",
                              textAlign: "center",
                              fontWeight: "600",
                              color: "#374151",
                              borderRight: "1px solid #e5e7eb",
                              borderBottom: "1px solid #e5e7eb",
                              fontSize: "14px",
                            }}
                          >
                            카테고리
                          </th>
                          <th
                            style={{
                              backgroundColor: "#f8f9fa",
                              padding: "12px 12px",
                              textAlign: "center",
                              fontWeight: "600",
                              color: "#374151",
                              borderRight: "1px solid #e5e7eb",
                              borderBottom: "1px solid #e5e7eb",
                              fontSize: "14px",
                            }}
                          >
                            난이도
                          </th>
                          <th
                            style={{
                              backgroundColor: "#f8f9fa",
                              padding: "12px 12px",
                              textAlign: "center",
                              fontWeight: "600",
                              color: "#374151",
                              borderRight: "1px solid #e5e7eb",
                              borderBottom: "1px solid #e5e7eb",
                              fontSize: "14px",
                            }}
                          >
                            참여자 수
                          </th>
                          <th
                            style={{
                              backgroundColor: "#f8f9fa",
                              padding: "12px 12px",
                              textAlign: "center",
                              fontWeight: "600",
                              color: "#374151",
                              borderRight: "1px solid #e5e7eb",
                              borderBottom: "1px solid #e5e7eb",
                              fontSize: "14px",
                            }}
                          >
                            상태
                          </th>
                          <th
                            style={{
                              backgroundColor: "#f8f9fa",
                              padding: "12px 16px",
                              textAlign: "center",
                              fontWeight: "600",
                              color: "#374151",
                              borderRight: "1px solid #e5e7eb",
                              borderBottom: "1px solid #e5e7eb",
                              fontSize: "14px",
                            }}
                          >
                            등록일
                          </th>
                          <th
                            style={{
                              backgroundColor: "#f8f9fa",
                              padding: "12px 12px",
                              textAlign: "center",
                              fontWeight: "600",
                              color: "#374151",
                              borderBottom: "1px solid #e5e7eb",
                              fontSize: "14px",
                            }}
                          >
                            관리
                          </th>
                        </tr>
                      </thead>
                      
                      {/* 테이블 바디 */}
                      <tbody>
                        {(() => {
                          // 대한민국 관광지 퀴즈 더미 데이터 (30개) - 최신 등록일 순서대로 정렬
                          const dummyQuizzes = [
                            { title: "제주도 한라산 퀴즈", category: "제주도", difficulty: "쉬움", participants: 2150, status: "활성", createDate: "2024-08-19" },
                            { title: "서울 경복궁 퀴즈", category: "서울", difficulty: "보통", participants: 1850, status: "활성", createDate: "2024-08-18" },
                            { title: "부산 해운대 퀴즈", category: "부산", difficulty: "어려움", participants: 1450, status: "활성", createDate: "2024-08-17" },
                            { title: "전주 한옥마을 퀴즈", category: "전라도", difficulty: "쉬움", participants: 1920, status: "비활성", createDate: "2024-08-16" },
                            { title: "안동 하회마을 퀴즈", category: "경상도", difficulty: "보통", participants: 1320, status: "활성", createDate: "2024-08-15" },
                            { title: "강원도 설악산 퀴즈", category: "강원도", difficulty: "어려움", participants: 980, status: "활성", createDate: "2024-08-14" },
                            { title: "인천 차이나타운 퀴즈", category: "인천", difficulty: "쉬움", participants: 1680, status: "활성", createDate: "2024-08-13" },
                            { title: "경주 불국사 퀴즈", category: "경상도", difficulty: "어려움", participants: 1120, status: "비활성", createDate: "2024-08-12" },
                            { title: "여수 엑스포 퀴즈", category: "전라도", difficulty: "보통", participants: 1560, status: "활성", createDate: "2024-08-11" },
                            { title: "강원도 남이섬 퀴즈", category: "강원도", difficulty: "쉬움", participants: 2080, status: "활성", createDate: "2024-08-10" },
                            { title: "제주도 성산일출봉 퀴즈", category: "제주도", difficulty: "어려움", participants: 1280, status: "활성", createDate: "2024-08-09" },
                            { title: "광주 무등산 퀴즈", category: "전라도", difficulty: "보통", participants: 1420, status: "활성", createDate: "2024-08-08" },
                            { title: "대전 엑스포 과학공원 퀴즈", category: "대전", difficulty: "쉬움", participants: 1750, status: "비활성", createDate: "2024-08-07" },
                            { title: "경상도 울릉도 퀴즈", category: "경상도", difficulty: "보통", participants: 1190, status: "활성", createDate: "2024-08-06" },
                            { title: "통영 한산대첩 퀴즈", category: "경상도", difficulty: "어려움", participants: 890, status: "활성", createDate: "2024-08-05" },
                            { title: "춘천 닭갈비 거리 퀴즈", category: "강원도", difficulty: "쉬움", participants: 1980, status: "활성", createDate: "2024-08-04" },
                            { title: "담양 죽녹원 퀴즈", category: "전라도", difficulty: "보통", participants: 1360, status: "활성", createDate: "2024-08-03" },
                            { title: "포항 호미곶 퀴즈", category: "경상도", difficulty: "어려움", participants: 1050, status: "활성", createDate: "2024-08-02" },
                            { title: "수원 화성 퀴즈", category: "경기도", difficulty: "보통", participants: 1720, status: "활성", createDate: "2024-08-01" },
                            { title: "태안 꽃지 해수욕장 퀴즈", category: "충청도", difficulty: "쉬움", participants: 1590, status: "활성", createDate: "2024-07-31" },
                            { title: "보령 머드축제 퀴즈", category: "충청도", difficulty: "보통", participants: 1830, status: "활성", createDate: "2024-07-30" },
                            { title: "강릉 경포대 퀴즈", category: "강원도", difficulty: "어려움", participants: 920, status: "비활성", createDate: "2024-07-29" },
                            { title: "제천 청풍호 퀴즈", category: "충청도", difficulty: "보통", participants: 1240, status: "활성", createDate: "2024-07-28" },
                            { title: "거제도 바람의 언덕 퀴즈", category: "경상도", difficulty: "쉬움", participants: 1650, status: "활성", createDate: "2024-07-27" },
                            { title: "순천만 갈대밭 퀴즈", category: "전라도", difficulty: "어려움", participants: 1180, status: "활성", createDate: "2024-07-26" },
                            { title: "평창 알펜시아 퀴즈", category: "강원도", difficulty: "보통", participants: 1450, status: "활성", createDate: "2024-07-25" },
                            { title: "논산 관촉사 퀴즈", category: "충청도", difficulty: "어려움", participants: 780, status: "활성", createDate: "2024-07-24" },
                            { title: "목포 유달산 퀴즈", category: "전라도", difficulty: "보통", participants: 1370, status: "비활성", createDate: "2024-07-23" },
                            { title: "김해 수로왕릉 퀴즈", category: "경상도", difficulty: "어려움", participants: 950, status: "활성", createDate: "2024-07-22" },
                            { title: "파주 임진각 퀴즈", category: "경기도", difficulty: "쉬움", participants: 1520, status: "활성", createDate: "2024-07-21" }
                          ];

                          // 생성된 퀴즈와 더미 퀴즈 합치기 (최신순 정렬)
                          const allQuizzes = [...createdQuizzes, ...dummyQuizzes].sort((a, b) => 
                            new Date(b.createDate).getTime() - new Date(a.createDate).getTime()
                          );

                          // 퀴즈 필터링 함수
                          const filterQuizzes = () => {
                            return allQuizzes.filter((quiz: any) => {
                              // 날짜 필터링 (등록일 기준)
                              if (quizStartDate || quizEndDate) {
                                const quizDate = new Date(quiz.createDate);
                                const startDate = quizStartDate ? new Date(quizStartDate) : null;
                                const endDate = quizEndDate ? new Date(quizEndDate) : null;
                                
                                if (startDate && quizDate < startDate) return false;
                                if (endDate && quizDate > endDate) return false;
                              }
                              
                              // 키워드 검색 (퀴즈 제목, 카테고리)
                              if (quizKeyword) {
                                const keyword = quizKeyword.toLowerCase();
                                const title = quiz.title.toLowerCase();
                                const category = quiz.category.toLowerCase();
                                
                                if (!title.includes(keyword) && !category.includes(keyword)) {
                                  return false;
                                }
                              }
                              
                              return true;
                            });
                          };

                          const filteredQuizzes = filterQuizzes();
                          
                          // 페이지네이션 로직
                          const startIndex = (currentPage - 1) * itemsPerPage;
                          const endIndex = startIndex + itemsPerPage;
                          const currentQuizzes = filteredQuizzes.slice(startIndex, endIndex);
                          
                          return currentQuizzes.map((quiz: any, index: number) => (
                            <tr key={index}>
                              <td
                                style={{
                                  padding: "12px 8px",
                                  textAlign: "center",
                                  borderRight: "1px solid #e5e7eb",
                                  borderBottom: "1px solid #e5e7eb",
                                  color: "#374151",
                                }}
                              >
                                {filteredQuizzes.length - (startIndex + index)}
                              </td>
                              <td
                                style={{
                                  padding: "12px 16px",
                                  textAlign: "left",
                                  borderRight: "1px solid #e5e7eb",
                                  borderBottom: "1px solid #e5e7eb",
                                  color: "#374151",
                                  fontWeight: "500",
                                }}
                              >
                                {quiz.title}
                              </td>
                              <td
                                style={{
                                  padding: "12px 16px",
                                  textAlign: "center",
                                  borderRight: "1px solid #e5e7eb",
                                  borderBottom: "1px solid #e5e7eb",
                                  color: "#374151",
                                }}
                              >
                                {quiz.category}
                              </td>
                              <td
                                style={{
                                  padding: "12px 12px",
                                  textAlign: "center",
                                  borderRight: "1px solid #e5e7eb",
                                  borderBottom: "1px solid #e5e7eb",
                                }}
                              >
                                <span
                                  style={{
                                    display: "inline-block",
                                    padding: "4px 8px",
                                    borderRadius: "4px",
                                    fontSize: "12px",
                                    fontWeight: "500",
                                    backgroundColor: quiz.difficulty === "쉬움" ? "#dcfce7" : quiz.difficulty === "보통" ? "#fef3c7" : "#fee2e2",
                                    color: quiz.difficulty === "쉬움" ? "#166534" : quiz.difficulty === "보통" ? "#92400e" : "#991b1b",
                                  }}
                                >
                                  {quiz.difficulty}
                                </span>
                              </td>
                              <td
                                style={{
                                  padding: "12px 12px",
                                  textAlign: "center",
                                  borderRight: "1px solid #e5e7eb",
                                  borderBottom: "1px solid #e5e7eb",
                                  color: "#374151",
                                  fontWeight: "500",
                                }}
                              >
                                {quiz.participants.toLocaleString()}명
                              </td>
                              <td
                                style={{
                                  padding: "12px 12px",
                                  textAlign: "center",
                                  borderRight: "1px solid #e5e7eb",
                                  borderBottom: "1px solid #e5e7eb",
                                }}
                              >
                                <span
                                  style={{
                                    display: "inline-block",
                                    padding: "4px 8px",
                                    borderRadius: "4px",
                                    fontSize: "12px",
                                    fontWeight: "500",
                                    backgroundColor: quiz.status === "활성" ? "#dcfce7" : "#fee2e2",
                                    color: quiz.status === "활성" ? "#166534" : "#991b1b",
                                  }}
                                >
                                  {quiz.status}
                                </span>
                              </td>
                              <td
                                style={{
                                  padding: "12px 16px",
                                  textAlign: "center",
                                  borderRight: "1px solid #e5e7eb",
                                  borderBottom: "1px solid #e5e7eb",
                                  color: "#374151",
                                }}
                              >
                                {quiz.createDate}
                              </td>
                              <td
                                style={{
                                  padding: "12px 12px",
                                  textAlign: "center",
                                  borderBottom: "1px solid #e5e7eb",
                                }}
                              >
                                <button
                                  style={{
                                    backgroundColor: "#f3f4f6",
                                    color: "#374151",
                                    border: "none",
                                    borderRadius: "4px",
                                    padding: "6px 12px",
                                    fontSize: "12px",
                                    fontWeight: "500",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "#e5e7eb";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "#f3f4f6";
                                  }}
                                  onClick={() => {
                                    alert(`${quiz.title} 퀴즈를 수정합니다.`);
                                  }}
                                >
                                  수정
                                </button>
                              </td>
                            </tr>
                          ));
                        })()}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* 페이지네이션 */}
                  {(() => {
                    // 퀴즈 데이터 재정의 (페이지네이션에서 사용하기 위해)
                    const quizzes = [
                      { title: "제주도 한라산 퀴즈", category: "제주도", difficulty: "쉬움", participants: 2150, status: "활성", createDate: "2024-08-19" },
                      { title: "서울 경복궁 퀴즈", category: "서울", difficulty: "보통", participants: 1850, status: "활성", createDate: "2024-08-18" },
                      { title: "부산 해운대 퀴즈", category: "부산", difficulty: "어려움", participants: 1450, status: "활성", createDate: "2024-08-17" },
                      { title: "전주 한옥마을 퀴즈", category: "전라도", difficulty: "쉬움", participants: 1920, status: "비활성", createDate: "2024-08-16" },
                      { title: "안동 하회마을 퀴즈", category: "경상도", difficulty: "보통", participants: 1320, status: "활성", createDate: "2024-08-15" },
                      { title: "강원도 설악산 퀴즈", category: "강원도", difficulty: "어려움", participants: 980, status: "활성", createDate: "2024-08-14" },
                      { title: "인천 차이나타운 퀴즈", category: "인천", difficulty: "쉬움", participants: 1680, status: "활성", createDate: "2024-08-13" },
                      { title: "경주 불국사 퀴즈", category: "경상도", difficulty: "어려움", participants: 1120, status: "비활성", createDate: "2024-08-12" },
                      { title: "여수 엑스포 퀴즈", category: "전라도", difficulty: "보통", participants: 1560, status: "활성", createDate: "2024-08-11" },
                      { title: "강원도 남이섬 퀴즈", category: "강원도", difficulty: "쉬움", participants: 2080, status: "활성", createDate: "2024-08-10" },
                      { title: "제주도 성산일출봉 퀴즈", category: "제주도", difficulty: "어려움", participants: 1280, status: "활성", createDate: "2024-08-09" },
                      { title: "광주 무등산 퀴즈", category: "전라도", difficulty: "보통", participants: 1420, status: "활성", createDate: "2024-08-08" },
                      { title: "대전 엑스포 과학공원 퀴즈", category: "대전", difficulty: "쉬움", participants: 1750, status: "비활성", createDate: "2024-08-07" },
                      { title: "경상도 울릉도 퀴즈", category: "경상도", difficulty: "보통", participants: 1190, status: "활성", createDate: "2024-08-06" },
                      { title: "통영 한산대첩 퀴즈", category: "경상도", difficulty: "어려움", participants: 890, status: "활성", createDate: "2024-08-05" },
                      { title: "춘천 닭갈비 거리 퀴즈", category: "강원도", difficulty: "쉬움", participants: 1980, status: "활성", createDate: "2024-08-04" },
                      { title: "담양 죽녹원 퀴즈", category: "전라도", difficulty: "보통", participants: 1360, status: "활성", createDate: "2024-08-03" },
                      { title: "포항 호미곶 퀴즈", category: "경상도", difficulty: "어려움", participants: 1050, status: "활성", createDate: "2024-08-02" },
                      { title: "수원 화성 퀴즈", category: "경기도", difficulty: "보통", participants: 1720, status: "활성", createDate: "2024-08-01" },
                      { title: "태안 꽃지 해수욕장 퀴즈", category: "충청도", difficulty: "쉬움", participants: 1590, status: "활성", createDate: "2024-07-31" },
                      { title: "보령 머드축제 퀴즈", category: "충청도", difficulty: "보통", participants: 1830, status: "활성", createDate: "2024-07-30" },
                      { title: "강릉 경포대 퀴즈", category: "강원도", difficulty: "어려움", participants: 920, status: "비활성", createDate: "2024-07-29" },
                      { title: "제천 청풍호 퀴즈", category: "충청도", difficulty: "보통", participants: 1240, status: "활성", createDate: "2024-07-28" },
                      { title: "거제도 바람의 언덕 퀴즈", category: "경상도", difficulty: "쉬움", participants: 1650, status: "활성", createDate: "2024-07-27" },
                      { title: "순천만 갈대밭 퀴즈", category: "전라도", difficulty: "어려움", participants: 1180, status: "활성", createDate: "2024-07-26" },
                      { title: "평창 알펜시아 퀴즈", category: "강원도", difficulty: "보통", participants: 1450, status: "활성", createDate: "2024-07-25" },
                      { title: "논산 관촉사 퀴즈", category: "충청도", difficulty: "어려움", participants: 780, status: "활성", createDate: "2024-07-24" },
                      { title: "목포 유달산 퀴즈", category: "전라도", difficulty: "보통", participants: 1370, status: "비활성", createDate: "2024-07-23" },
                      { title: "김해 수로왕릉 퀴즈", category: "경상도", difficulty: "어려움", participants: 950, status: "활성", createDate: "2024-07-22" },
                      { title: "파주 임진각 퀴즈", category: "경기도", difficulty: "쉬움", participants: 1520, status: "활성", createDate: "2024-07-21" }
                    ];

                    // 필터링된 결과에 따라 페이지네이션 계산
                    const filterQuizzes = () => {
                      return quizzes.filter(quiz => {
                        // 날짜 필터링 (등록일 기준)
                        if (quizStartDate || quizEndDate) {
                          const quizDate = new Date(quiz.createDate);
                          const startDate = quizStartDate ? new Date(quizStartDate) : null;
                          const endDate = quizEndDate ? new Date(quizEndDate) : null;
                          
                          if (startDate && quizDate < startDate) return false;
                          if (endDate && quizDate > endDate) return false;
                        }
                        
                        // 키워드 검색 (퀴즈 제목, 카테고리)
                        if (quizKeyword) {
                          const keyword = quizKeyword.toLowerCase();
                          const title = quiz.title.toLowerCase();
                          const category = quiz.category.toLowerCase();
                          
                          if (!title.includes(keyword) && !category.includes(keyword)) {
                            return false;
                          }
                        }
                        
                        return true;
                      });
                    };
                    
                    const filteredQuizzes = filterQuizzes();
                    const totalQuizzes = filteredQuizzes.length;
                    const totalPages = Math.ceil(totalQuizzes / itemsPerPage);
                    
                    return (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          marginTop: "24px",
                          marginBottom: "24px",
                          gap: "8px",
                          padding: "0",
                        }}
                      >
                        <button
                          style={{
                            padding: "8px 12px",
                            border: "1px solid #d1d5db",
                            backgroundColor: currentPage === 1 ? "#f3f4f6" : "white",
                            color: currentPage === 1 ? "#9ca3af" : "#374151",
                            borderRadius: "4px",
                            fontSize: "14px",
                            cursor: currentPage === 1 ? "not-allowed" : "pointer",
                          }}
                          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          이전
                        </button>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                          <button
                            key={pageNumber}
                            style={{
                              padding: "8px 12px",
                              border: currentPage === pageNumber ? "1px solid #F97316" : "1px solid #d1d5db",
                              backgroundColor: currentPage === pageNumber ? "#F97316" : "white",
                              color: currentPage === pageNumber ? "white" : "#374151",
                              borderRadius: "4px",
                              fontSize: "14px",
                              cursor: "pointer",
                            }}
                            onClick={() => setCurrentPage(pageNumber)}
                          >
                            {pageNumber}
                          </button>
                        ))}
                        
                        <button
                          style={{
                            padding: "8px 12px",
                            border: "1px solid #d1d5db",
                            backgroundColor: currentPage === totalPages ? "#f3f4f6" : "white",
                            color: currentPage === totalPages ? "#9ca3af" : "#374151",
                            borderRadius: "4px",
                            fontSize: "14px",
                            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                          }}
                          onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          다음
                        </button>
                      </div>
                    );
                  })()}
                </div>
              </>
            )}

            {activeMenu === "퀴즈 관리" && isCreatingQuiz && (
              <>
                {/* Header Section */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "32px",
                  }}
                >
                  <h1
                    style={{
                      fontSize: "32px",
                      fontWeight: "bold",
                      color: "#1f2937",
                      margin: 0,
                    }}
                  >
                    퀴즈 생성
                  </h1>
                  <button
                    onClick={() => {
                      setIsCreatingQuiz(false);
                      setSelectedMarker("");
                      setQuizQuestions([]);
                      setQuizDifficulty("보통");
                      setQuizStatus("활성");
                      setIsAddingMarker(false);
                      setNewMarkerName("");
                      setNewMarkerLatitude("");
                      setNewMarkerLongitude("");
                    }}
                    style={{
                      backgroundColor: "#6b7280",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      padding: "8px 16px",
                      fontSize: "14px",
                      fontWeight: "500",
                      cursor: "pointer",
                    }}
                  >
                    목록으로
                  </button>
                </div>

                {/* 마커 선택 섹션 */}
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    padding: "24px",
                    border: "1px solid #f3f4f6",
                    marginBottom: "24px",
                  }}
                >
                  <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1f2937", marginBottom: "16px" }}>
                    마커 선택
                  </h3>
                  
                  <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                    <select
                      value={selectedMarker}
                      onChange={(e) => {
                        setSelectedMarker(e.target.value);
                        if (e.target.value) {
                          // 마커 선택 시 10개의 빈 퀴즈 문제 생성
                          const newQuestions = Array.from({ length: 10 }, () => ({
                            question: "",
                            option1: "",
                            option2: "",
                            correctAnswer: 1,
                          }));
                          setQuizQuestions(newQuestions);
                        } else {
                          setQuizQuestions([]);
                        }
                      }}
                      style={{
                        width: "300px",
                        padding: "12px 16px",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "14px",
                        backgroundColor: "white",
                      }}
                    >
                      <option value="">마커를 선택하세요</option>
                      {markerList.map((marker, index) => (
                        <option key={index} value={marker.name}>{marker.name}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => setIsAddingMarker(true)}
                      style={{
                        backgroundColor: "#3b82f6",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        padding: "12px 16px",
                        fontSize: "14px",
                        fontWeight: "500",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        whiteSpace: "nowrap",
                      }}
                    >
                      + 마커 추가
                    </button>
                  </div>

                  {/* 마커 추가 폼 */}
                  {isAddingMarker && (
                    <div
                      style={{
                        marginTop: "20px",
                        padding: "20px",
                        backgroundColor: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                      }}
                    >
                      <h4 style={{ fontSize: "16px", fontWeight: "600", color: "#1f2937", marginBottom: "16px" }}>
                        새 마커 추가
                      </h4>
                      
                      {/* 마커 이름 입력 */}
                      <div style={{ marginBottom: "16px" }}>
                        <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>
                          마커 이름 *
                        </label>
                        <input
                          type="text"
                          value={newMarkerName}
                          onChange={(e) => setNewMarkerName(e.target.value)}
                          placeholder="예: 경복궁, 한라산, 광안리 해수욕장"
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            border: "1px solid #d1d5db",
                            borderRadius: "6px",
                            fontSize: "14px",
                            backgroundColor: "white",
                          }}
                        />
                      </div>

                      {/* 위도/경도 입력 */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                        <div>
                          <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>
                            위도 (Latitude) *
                          </label>
                          <input
                            type="number"
                            step="0.000001"
                            value={newMarkerLatitude}
                            onChange={(e) => setNewMarkerLatitude(e.target.value)}
                            placeholder="예: 37.5665"
                            style={{
                              width: "100%",
                              padding: "12px 16px",
                              border: "1px solid #d1d5db",
                              borderRadius: "6px",
                              fontSize: "14px",
                              backgroundColor: "white",
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>
                            경도 (Longitude) *
                          </label>
                          <input
                            type="number"
                            step="0.000001"
                            value={newMarkerLongitude}
                            onChange={(e) => setNewMarkerLongitude(e.target.value)}
                            placeholder="예: 126.9780"
                            style={{
                              width: "100%",
                              padding: "12px 16px",
                              border: "1px solid #d1d5db",
                              borderRadius: "6px",
                              fontSize: "14px",
                              backgroundColor: "white",
                            }}
                          />
                        </div>
                      </div>

                      {/* 도움말 텍스트 */}
                      <div style={{ 
                        backgroundColor: "#f0f9ff", 
                        border: "1px solid #bae6fd", 
                        borderRadius: "6px", 
                        padding: "12px", 
                        marginBottom: "16px" 
                      }}>
                        <p style={{ 
                          fontSize: "13px", 
                          color: "#0369a1", 
                          margin: 0, 
                          lineHeight: "1.4" 
                        }}>
                          💡 <strong>좌표 찾기 팁:</strong> Google Maps에서 원하는 위치를 우클릭하면 위도와 경도를 확인할 수 있습니다.
                        </p>
                      </div>

                      {/* 버튼들 */}
                      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        <button
                          onClick={() => {
                            // 입력 값 유효성 검사
                            const name = newMarkerName.trim();
                            const lat = parseFloat(newMarkerLatitude);
                            const lng = parseFloat(newMarkerLongitude);
                            
                            if (!name) {
                              alert("마커 이름을 입력해주세요.");
                              return;
                            }
                            
                            if (!newMarkerLatitude.trim() || !newMarkerLongitude.trim()) {
                              alert("위도와 경도를 모두 입력해주세요.");
                              return;
                            }
                            
                            if (isNaN(lat) || isNaN(lng)) {
                              alert("위도와 경도는 숫자로 입력해주세요.");
                              return;
                            }
                            
                            // 위도 범위 검사 (-90 ~ 90)
                            if (lat < -90 || lat > 90) {
                              alert("위도는 -90도에서 90도 사이의 값이어야 합니다.");
                              return;
                            }
                            
                            // 경도 범위 검사 (-180 ~ 180)
                            if (lng < -180 || lng > 180) {
                              alert("경도는 -180도에서 180도 사이의 값이어야 합니다.");
                              return;
                            }
                            
                            // 중복 마커명 검사
                            if (markerList.some(marker => marker.name === name)) {
                              alert("이미 존재하는 마커입니다.");
                              return;
                            }
                            
                            // 새 마커 추가
                            const newMarker = {
                              name: name,
                              latitude: lat,
                              longitude: lng
                            };
                            
                            setMarkerList([...markerList, newMarker]);
                            setSelectedMarker(name);
                            
                            // 새 마커 선택 시 10개의 빈 퀴즈 문제 생성
                            const newQuestions = Array.from({ length: 10 }, () => ({
                              question: "",
                              option1: "",
                              option2: "",
                              correctAnswer: 1,
                            }));
                            setQuizQuestions(newQuestions);
                            
                            // 입력 폼 초기화
                            setNewMarkerName("");
                            setNewMarkerLatitude("");
                            setNewMarkerLongitude("");
                            setIsAddingMarker(false);
                          }}
                          style={{
                            backgroundColor: "#059669",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            padding: "12px 16px",
                            fontSize: "14px",
                            fontWeight: "500",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                          }}
                        >
                          추가
                        </button>
                        <button
                          onClick={() => {
                            setIsAddingMarker(false);
                            setNewMarkerName("");
                            setNewMarkerLatitude("");
                            setNewMarkerLongitude("");
                          }}
                          style={{
                            backgroundColor: "#6b7280",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            padding: "12px 16px",
                            fontSize: "14px",
                            fontWeight: "500",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                          }}
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 퀴즈 설정 섹션 */}
                  <div
                    style={{
                      marginTop: "24px",
                      padding: "20px",
                      backgroundColor: "#f8fafc",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#374151",
                        marginBottom: "16px",
                      }}
                    >
                      퀴즈 설정
                    </h3>
                    
                    <div
                      style={{
                        display: "flex",
                        gap: "24px",
                        alignItems: "center",
                      }}
                    >
                      {/* 난이도 설정 */}
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <label
                          style={{
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "#374151",
                            minWidth: "50px",
                          }}
                        >
                          난이도
                        </label>
                        <select
                          value={quizDifficulty}
                          onChange={(e) => setQuizDifficulty(e.target.value)}
                          style={{
                            width: "120px",
                            padding: "10px 12px",
                            border: "1px solid #d1d5db",
                            borderRadius: "6px",
                            fontSize: "14px",
                            color: "#374151",
                            backgroundColor: "white",
                            cursor: "pointer",
                          }}
                        >
                          <option value="쉬움">쉬움</option>
                          <option value="보통">보통</option>
                          <option value="어려움">어려움</option>
                        </select>
                      </div>

                      {/* 상태 설정 */}
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <label
                          style={{
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "#374151",
                            minWidth: "50px",
                          }}
                        >
                          상태
                        </label>
                        <select
                          value={quizStatus}
                          onChange={(e) => setQuizStatus(e.target.value)}
                          style={{
                            width: "120px",
                            padding: "10px 12px",
                            border: "1px solid #d1d5db",
                            borderRadius: "6px",
                            fontSize: "14px",
                            color: "#374151",
                            backgroundColor: "white",
                            cursor: "pointer",
                          }}
                        >
                          <option value="활성">활성</option>
                          <option value="비활성">비활성</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 퀴즈 문제 생성 섹션 */}
                {selectedMarker && quizQuestions.length > 0 && (
                  <div
                    style={{
                      backgroundColor: "white",
                      borderRadius: "12px",
                      padding: "24px",
                      border: "1px solid #f3f4f6",
                      marginBottom: "24px",
                    }}
                  >
                    <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1f2937", marginBottom: "16px" }}>
                      {selectedMarker} - 퀴즈 문제 (10개)
                    </h3>
                    
                    {quizQuestions.map((question, index) => (
                      <div
                        key={index}
                        style={{
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          padding: "20px",
                          marginBottom: "16px",
                          backgroundColor: "#f9fafb",
                        }}
                      >
                        <div style={{ marginBottom: "16px" }}>
                          <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>
                            문제 {index + 1}
                          </label>
                          <textarea
                            value={question.question}
                            onChange={(e) => {
                              const newQuestions = [...quizQuestions];
                              newQuestions[index].question = e.target.value;
                              setQuizQuestions(newQuestions);
                            }}
                            placeholder="퀴즈 문제를 입력하세요"
                            style={{
                              width: "100%",
                              minHeight: "80px",
                              padding: "12px",
                              border: "1px solid #d1d5db",
                              borderRadius: "6px",
                              fontSize: "14px",
                              resize: "vertical",
                            }}
                          />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                          <div>
                            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>
                              선택지 1
                            </label>
                            <input
                              type="text"
                              value={question.option1}
                              onChange={(e) => {
                                const newQuestions = [...quizQuestions];
                                newQuestions[index].option1 = e.target.value;
                                setQuizQuestions(newQuestions);
                              }}
                              placeholder="첫 번째 선택지"
                              style={{
                                width: "100%",
                                padding: "12px",
                                border: "1px solid #d1d5db",
                                borderRadius: "6px",
                                fontSize: "14px",
                              }}
                            />
                          </div>
                          <div>
                            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>
                              선택지 2
                            </label>
                            <input
                              type="text"
                              value={question.option2}
                              onChange={(e) => {
                                const newQuestions = [...quizQuestions];
                                newQuestions[index].option2 = e.target.value;
                                setQuizQuestions(newQuestions);
                              }}
                              placeholder="두 번째 선택지"
                              style={{
                                width: "100%",
                                padding: "12px",
                                border: "1px solid #d1d5db",
                                borderRadius: "6px",
                                fontSize: "14px",
                              }}
                            />
                          </div>
                        </div>

                        <div>
                          <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>
                            정답
                          </label>
                          <div style={{ display: "flex", gap: "16px" }}>
                            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                              <input
                                type="radio"
                                name={`correct-${index}`}
                                checked={question.correctAnswer === 1}
                                onChange={() => {
                                  const newQuestions = [...quizQuestions];
                                  newQuestions[index].correctAnswer = 1;
                                  setQuizQuestions(newQuestions);
                                }}
                              />
                              <span style={{ fontSize: "14px", color: "#374151" }}>선택지 1</span>
                            </label>
                            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                              <input
                                type="radio"
                                name={`correct-${index}`}
                                checked={question.correctAnswer === 2}
                                onChange={() => {
                                  const newQuestions = [...quizQuestions];
                                  newQuestions[index].correctAnswer = 2;
                                  setQuizQuestions(newQuestions);
                                }}
                              />
                              <span style={{ fontSize: "14px", color: "#374151" }}>선택지 2</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* 저장 버튼 */}
                    <div style={{ textAlign: "center", marginTop: "24px" }}>
                      <button
                        onClick={() => {
                          // 모든 문제가 완성되었는지 확인
                          const isComplete = quizQuestions.every(q => 
                            q.question.trim() && q.option1.trim() && q.option2.trim()
                          );
                          
                          if (isComplete) {
                            // 새 퀴즈 데이터 생성
                            const newQuiz = {
                              title: `${selectedMarker} 퀴즈`,
                              category: selectedMarker.includes("부산") ? "부산" : 
                                       selectedMarker.includes("제주") ? "제주도" :
                                       selectedMarker.includes("서울") ? "서울" :
                                       selectedMarker.includes("경주") ? "경상도" :
                                       selectedMarker.includes("전주") ? "전라도" :
                                       selectedMarker.includes("강릉") ? "강원도" :
                                       selectedMarker.includes("여수") ? "전라도" :
                                       selectedMarker.includes("인천") ? "인천" : "기타",
                              difficulty: quizDifficulty,
                              participants: 0,
                              status: quizStatus,
                              createDate: new Date().toISOString().split('T')[0],
                              marker: selectedMarker,
                              questions: [...quizQuestions]
                            };
                            
                            // 생성된 퀴즈 목록에 추가
                            setCreatedQuizzes(prev => [newQuiz, ...prev]);
                            
                            alert(`${selectedMarker} 마커의 퀴즈 10개가 성공적으로 생성되었습니다!`);
                            setIsCreatingQuiz(false);
                            setSelectedMarker("");
                            setQuizQuestions([]);
                            setQuizDifficulty("보통");
                            setQuizStatus("활성");
                          } else {
                            alert("모든 문제와 선택지를 입력해주세요.");
                          }
                        }}
                        style={{
                          backgroundColor: "#059669",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          padding: "12px 24px",
                          fontSize: "16px",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                      >
                        퀴즈 저장
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
            
            {activeMenu === "광고 관리" && !isRegisteringAd && !isEditingAd && (
              <>
                {/* Header Section */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "32px",
                  }}
                >
                  <h1
                    style={{
                      fontSize: "32px",
                      fontWeight: "bold",
                      color: "#1f2937",
                      margin: 0,
                    }}
                  >
                    광고 관리
                  </h1>
                  <button
                    onClick={() => setIsRegisteringAd(true)}
                    style={{
                      backgroundColor: "#F97316",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      padding: "8px 16px",
                      fontSize: "14px",
                      fontWeight: "500",
                      cursor: "pointer",
                      boxShadow: "0 2px 4px rgba(249, 115, 22, 0.15)",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#EA580C";
                      e.currentTarget.style.transform = "translateY(-1px)";
                      e.currentTarget.style.boxShadow = "0 4px 8px rgba(249, 115, 22, 0.25)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#F97316";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 2px 4px rgba(249, 115, 22, 0.15)";
                    }}
                  >
                    광고 등록
                  </button>
                </div>
                
                {/* 필터 섹션 */}
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    padding: "24px",
                    border: "1px solid #f3f4f6",
                    marginBottom: "24px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    }}
                  >
                    {/* First row - 진행 기간 */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        justifyContent: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#374151",
                          minWidth: "60px",
                        }}
                      >
                        진행 기간
                      </div>
                      <input
                        type="text"
                        placeholder="시작일"
                        value={adStartDate}
                        onChange={(e) => setAdStartDate(e.target.value)}
                        onFocus={(e) => {
                          e.target.type = "date";
                          e.target.showPicker?.();
                        }}
                        onBlur={(e) => {
                          if (!e.target.value) {
                            e.target.type = "text";
                          }
                        }}
                        style={{
                          width: "150px",
                          padding: "8px 12px",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          fontSize: "14px",
                          color: "#374151",
                          backgroundColor: "white",
                        }}
                      />
                      <input
                        type="text"
                        placeholder="종료일"
                        value={adEndDate}
                        onChange={(e) => setAdEndDate(e.target.value)}
                        onFocus={(e) => {
                          e.target.type = "date";
                          e.target.showPicker?.();
                        }}
                        onBlur={(e) => {
                          if (!e.target.value) {
                            e.target.type = "text";
                          }
                        }}
                        style={{
                          width: "150px",
                          padding: "8px 12px",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          fontSize: "14px",
                          color: "#374151",
                          backgroundColor: "white",
                        }}
                      />
                    </div>

                    {/* Second row - 키워드, 검색창, 검색 버튼 */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        justifyContent: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#374151",
                          minWidth: "60px",
                        }}
                      >
                        키워드
                      </div>
                      <input
                        type="text"
                        placeholder="광고명, 주소 등으로 검색"
                        value={adKeyword}
                        onChange={(e) => setAdKeyword(e.target.value)}
                        style={{
                          width: "300px",
                          padding: "8px 12px",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          fontSize: "14px",
                          color: "#374151",
                          backgroundColor: "white",
                        }}
                      />
                      <button
                        onClick={() => {
                          // 검색 실행 (상태가 실시간으로 업데이트되므로 별도 로직 불필요)
                          setCurrentPage(1); // 페이지를 1로 초기화
                        }}
                        style={{
                          backgroundColor: "#F97316",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          padding: "8px 16px",
                          fontSize: "14px",
                          fontWeight: "500",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          whiteSpace: "nowrap",
                          minWidth: "60px",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#EA580C";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#F97316";
                        }}
                      >
                        검색
                      </button>
                    </div>
                  </div>
                </div>

                {/* 광고 리스트 섹션 */}
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    padding: "0",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#1f2937",
                      marginBottom: "20px",
                      margin: "24px 0 20px 0",
                    }}
                  >
                    총 30건
                  </h3>
                  
                  {/* 테이블 */}
                  <div
                    style={{
                      overflowX: "auto",
                      padding: "0",
                    }}
                  >
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "separate",
                        borderSpacing: "0",
                        fontSize: "14px",
                        borderRadius: "8px",
                        overflow: "hidden",
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      {/* 테이블 헤더 */}
                      <thead>
                        <tr>
                          <th
                            style={{
                              backgroundColor: "#f8f9fa",
                              padding: "12px 8px",
                              textAlign: "center",
                              fontWeight: "600",
                              color: "#374151",
                              borderRight: "1px solid #e5e7eb",
                              borderBottom: "1px solid #e5e7eb",
                              fontSize: "14px",
                            }}
                          >
                            번호
                          </th>
                          <th
                            style={{
                              backgroundColor: "#f8f9fa",
                              padding: "12px 16px",
                              textAlign: "left",
                              fontWeight: "600",
                              color: "#374151",
                              borderRight: "1px solid #e5e7eb",
                              borderBottom: "1px solid #e5e7eb",
                              fontSize: "14px",
                            }}
                          >
                            이름
                          </th>
                          <th
                            style={{
                              backgroundColor: "#f8f9fa",
                              padding: "12px 16px",
                              textAlign: "left",
                              fontWeight: "600",
                              color: "#374151",
                              borderRight: "1px solid #e5e7eb",
                              borderBottom: "1px solid #e5e7eb",
                              fontSize: "14px",
                            }}
                          >
                            주소
                          </th>
                          <th
                            style={{
                              backgroundColor: "#f8f9fa",
                              padding: "12px 12px",
                              textAlign: "center",
                              fontWeight: "600",
                              color: "#374151",
                              borderRight: "1px solid #e5e7eb",
                              borderBottom: "1px solid #e5e7eb",
                              fontSize: "14px",
                            }}
                          >
                            부여 포인트
                          </th>
                          <th
                            style={{
                              backgroundColor: "#f8f9fa",
                              padding: "12px 12px",
                              textAlign: "center",
                              fontWeight: "600",
                              color: "#374151",
                              borderRight: "1px solid #e5e7eb",
                              borderBottom: "1px solid #e5e7eb",
                              fontSize: "14px",
                            }}
                          >
                            오늘 방문수
                          </th>
                          <th
                            style={{
                              backgroundColor: "#f8f9fa",
                              padding: "12px 12px",
                              textAlign: "center",
                              fontWeight: "600",
                              color: "#374151",
                              borderRight: "1px solid #e5e7eb",
                              borderBottom: "1px solid #e5e7eb",
                              fontSize: "14px",
                            }}
                          >
                            누적 방문수
                          </th>
                          <th
                            style={{
                              backgroundColor: "#f8f9fa",
                              padding: "12px 12px",
                              textAlign: "center",
                              fontWeight: "600",
                              color: "#374151",
                              borderRight: "1px solid #e5e7eb",
                              borderBottom: "1px solid #e5e7eb",
                              fontSize: "14px",
                            }}
                          >
                            상태
                          </th>
                          <th
                            style={{
                              backgroundColor: "#f8f9fa",
                              padding: "12px 16px",
                              textAlign: "center",
                              fontWeight: "600",
                              color: "#374151",
                              borderRight: "1px solid #e5e7eb",
                              borderBottom: "1px solid #e5e7eb",
                              fontSize: "14px",
                            }}
                          >
                            진행 기간
                          </th>
                          <th
                            style={{
                              backgroundColor: "#f8f9fa",
                              padding: "12px 16px",
                              textAlign: "center",
                              fontWeight: "600",
                              color: "#374151",
                              borderRight: "1px solid #e5e7eb",
                              borderBottom: "1px solid #e5e7eb",
                              fontSize: "14px",
                            }}
                          >
                            등록일
                          </th>
                          <th
                            style={{
                              backgroundColor: "#f8f9fa",
                              padding: "12px 12px",
                              textAlign: "center",
                              fontWeight: "600",
                              color: "#374151",
                              borderBottom: "1px solid #e5e7eb",
                              fontSize: "14px",
                            }}
                          >
                            관리
                          </th>
                        </tr>
                      </thead>
                      
                      {/* 테이블 바디 */}
                      <tbody>
                        {(() => {
                          // 광고 더미 데이터 (30개) - 최신 등록일 순서대로 정렬
                          const staticAds = ads.length > 0 ? [] : [
                            { name: "제주 올레길 카페", address: "제주시 구좌읍 월정리 33-8", points: 150, todayVisits: 23, totalVisits: 2850, status: "활성", startDate: "2024-08-01", endDate: "2024-10-31", createDate: "2024-08-19" },
                            { name: "부산 해운대 호텔", address: "부산시 해운대구 해운대해변로 264", points: 200, todayVisits: 18, totalVisits: 4230, status: "활성", startDate: "2024-07-15", endDate: "2024-12-31", createDate: "2024-08-18" },
                            { name: "서울 명동 한식당", address: "서울시 중구 명동길 14", points: 100, todayVisits: 35, totalVisits: 1820, status: "활성", startDate: "2024-08-10", endDate: "2024-11-30", createDate: "2024-08-17" },
                            { name: "전주 한옥마을 게스트하우스", address: "전주시 완산구 기린대로 99", points: 120, todayVisits: 12, totalVisits: 3150, status: "비활성", startDate: "2024-06-01", endDate: "2024-08-31", createDate: "2024-08-16" },
                            { name: "안동 하회마을 전통찻집", address: "안동시 풍천면 하회종가길 69", points: 80, todayVisits: 8, totalVisits: 1450, status: "활성", startDate: "2024-08-05", endDate: "2024-10-05", createDate: "2024-08-15" },
                            { name: "강릉 바다펜션", address: "강릉시 사천면 해안로 1412", points: 180, todayVisits: 27, totalVisits: 3680, status: "활성", startDate: "2024-07-20", endDate: "2024-09-20", createDate: "2024-08-14" },
                            { name: "인천 차이나타운 중식당", address: "인천시 중구 차이나타운로 64", points: 90, todayVisits: 41, totalVisits: 2240, status: "일시정지", startDate: "2024-08-01", endDate: "2024-10-01", createDate: "2024-08-13" },
                            { name: "경주 불국사 기념품점", address: "경주시 진현동 15-1", points: 70, todayVisits: 16, totalVisits: 1890, status: "활성", startDate: "2024-07-10", endDate: "2024-12-10", createDate: "2024-08-12" },
                            { name: "여수 돌산대교 맛집", address: "여수시 돌산읍 돌산로 3600", points: 110, todayVisits: 29, totalVisits: 2760, status: "활성", startDate: "2024-08-15", endDate: "2024-11-15", createDate: "2024-08-11" },
                            { name: "춘천 남이섬 레스토랑", address: "춘천시 남산면 남이섬길 1", points: 130, todayVisits: 33, totalVisits: 4120, status: "활성", startDate: "2024-07-25", endDate: "2024-10-25", createDate: "2024-08-10" },
                            { name: "순천만 갈대숲 카페", address: "순천시 순천만길 513-25", points: 95, todayVisits: 14, totalVisits: 1670, status: "비활성", startDate: "2024-06-15", endDate: "2024-08-15", createDate: "2024-08-09" },
                            { name: "대전 엑스포공원 푸드트럭", address: "대전시 유성구 대덕대로 480", points: 60, todayVisits: 22, totalVisits: 980, status: "활성", startDate: "2024-08-01", endDate: "2024-09-30", createDate: "2024-08-08" },
                            { name: "울릉도 독도박물관 기념품샵", address: "울릉군 울릉읍 독도박물관길 90", points: 85, todayVisits: 7, totalVisits: 520, status: "활성", startDate: "2024-07-01", endDate: "2024-10-31", createDate: "2024-08-07" },
                            { name: "통영 한산도 펜션", address: "통영시 한산면 한산일주로 112", points: 160, todayVisits: 11, totalVisits: 2340, status: "일시정지", startDate: "2024-07-15", endDate: "2024-09-15", createDate: "2024-08-06" },
                            { name: "포항 호미곶 횟집", address: "포항시 남구 호미곶면 대보리 123", points: 140, todayVisits: 19, totalVisits: 3210, status: "활성", startDate: "2024-08-10", endDate: "2024-11-10", createDate: "2024-08-05" },
                            { name: "수원 화성 한옥스테이", address: "수원시 팔달구 정조로 825", points: 170, todayVisits: 25, totalVisits: 2890, status: "활성", startDate: "2024-07-20", endDate: "2024-10-20", createDate: "2024-08-04" },
                            { name: "태안 꽃지해변 펜션", address: "태안군 안면읍 꽃지해안로 202", points: 190, todayVisits: 31, totalVisits: 4560, status: "활성", startDate: "2024-06-25", endDate: "2024-09-25", createDate: "2024-08-03" },
                            { name: "보령 머드축제 체험장", address: "보령시 신흑동 555", points: 120, todayVisits: 38, totalVisits: 5230, status: "비활성", startDate: "2024-06-01", endDate: "2024-08-31", createDate: "2024-08-02" },
                            { name: "평창 알펜시아 스키샵", address: "평창군 대관령면 솔봉로 325", points: 110, todayVisits: 5, totalVisits: 1340, status: "활성", startDate: "2024-08-01", endDate: "2024-12-31", createDate: "2024-08-01" },
                            { name: "거제도 바람의언덕 카페", address: "거제시 남부면 갈곶리 산14-47", points: 105, todayVisits: 21, totalVisits: 2680, status: "활성", startDate: "2024-07-10", endDate: "2024-10-10", createDate: "2024-07-31" },
                            { name: "담양 죽녹원 죽순요리집", address: "담양군 담양읍 죽녹원로 119", points: 75, todayVisits: 13, totalVisits: 1560, status: "일시정지", startDate: "2024-07-01", endDate: "2024-09-30", createDate: "2024-07-30" },
                            { name: "강릉 경포대 해변카페", address: "강릉시 강동면 경포해변로 365", points: 125, todayVisits: 28, totalVisits: 3450, status: "활성", startDate: "2024-06-20", endDate: "2024-09-20", createDate: "2024-07-29" },
                            { name: "제천 청풍호 유람선", address: "제천시 청풍면 청풍호로 2048", points: 150, todayVisits: 17, totalVisits: 2120, status: "활성", startDate: "2024-07-15", endDate: "2024-10-15", createDate: "2024-07-28" },
                            { name: "목포 유달산 전망대 카페", address: "목포시 죽교동 산 4-14", points: 90, todayVisits: 24, totalVisits: 1890, status: "비활성", startDate: "2024-06-10", endDate: "2024-08-10", createDate: "2024-07-27" },
                            { name: "김해 수로왕릉 문화센터", address: "김해시 가야의길 126", points: 65, todayVisits: 9, totalVisits: 780, status: "활성", startDate: "2024-07-20", endDate: "2024-10-20", createDate: "2024-07-26" },
                            { name: "파주 임진각 통일전망대", address: "파주시 문산읍 임진각로 177", points: 80, todayVisits: 15, totalVisits: 1450, status: "활성", startDate: "2024-08-01", endDate: "2024-11-01", createDate: "2024-07-25" },
                            { name: "논산 관촉사 템플스테이", address: "논산시 관촉동 18", points: 100, todayVisits: 6, totalVisits: 650, status: "일시정지", startDate: "2024-07-05", endDate: "2024-10-05", createDate: "2024-07-24" },
                            { name: "광주 무등산 산채정식", address: "광주시 동구 증심사길 30", points: 85, todayVisits: 20, totalVisits: 1720, status: "활성", startDate: "2024-07-10", endDate: "2024-10-10", createDate: "2024-07-23" },
                            { name: "속초 설악산 민박", address: "속초시 설악산로 1091", points: 135, todayVisits: 26, totalVisits: 3180, status: "활성", startDate: "2024-06-30", endDate: "2024-09-30", createDate: "2024-07-22" },
                            { name: "통도사 계곡 찜질방", address: "양산시 하북면 통도사로 108", points: 115, todayVisits: 12, totalVisits: 2040, status: "활성", startDate: "2024-07-25", endDate: "2024-10-25", createDate: "2024-07-21" }
                          ];

                          // 광고 필터링 함수
                          const filterAds = () => {
                            const allAds = [...ads, ...staticAds];
                            return allAds.filter(ad => {
                              // 날짜 필터링 (등록일 기준)
                              if (adStartDate || adEndDate) {
                                const adDate = new Date(ad.createDate);
                                const startDate = adStartDate ? new Date(adStartDate) : null;
                                const endDate = adEndDate ? new Date(adEndDate) : null;
                                
                                if (startDate && adDate < startDate) return false;
                                if (endDate && adDate > endDate) return false;
                              }
                              
                              // 키워드 검색 (광고명, 주소)
                              if (adKeyword) {
                                const keyword = adKeyword.toLowerCase();
                                const name = ad.name.toLowerCase();
                                const address = ad.address.toLowerCase();
                                
                                if (!name.includes(keyword) && !address.includes(keyword)) {
                                  return false;
                                }
                              }
                              
                              return true;
                            });
                          };

                          const filteredAds = filterAds();
                          
                          // 페이지네이션 로직
                          const startIndex = (currentPage - 1) * itemsPerPage;
                          const endIndex = startIndex + itemsPerPage;
                          const currentAds = filteredAds.slice(startIndex, endIndex);
                          
                          return currentAds.map((ad, index) => (
                            <tr key={index}>
                              <td
                                style={{
                                  padding: "12px 8px",
                                  textAlign: "center",
                                  borderRight: "1px solid #e5e7eb",
                                  borderBottom: "1px solid #e5e7eb",
                                  color: "#374151",
                                }}
                              >
                                {filteredAds.length - (startIndex + index)}
                              </td>
                              <td
                                style={{
                                  padding: "12px 16px",
                                  textAlign: "left",
                                  borderRight: "1px solid #e5e7eb",
                                  borderBottom: "1px solid #e5e7eb",
                                  color: "#374151",
                                  fontWeight: "500",
                                }}
                              >
                                {ad.name}
                              </td>
                              <td
                                style={{
                                  padding: "12px 16px",
                                  textAlign: "left",
                                  borderRight: "1px solid #e5e7eb",
                                  borderBottom: "1px solid #e5e7eb",
                                  color: "#374151",
                                  fontSize: "13px",
                                }}
                              >
                                {ad.address}
                              </td>
                              <td
                                style={{
                                  padding: "12px 12px",
                                  textAlign: "center",
                                  borderRight: "1px solid #e5e7eb",
                                  borderBottom: "1px solid #e5e7eb",
                                  color: "#374151",
                                  fontWeight: "500",
                                }}
                              >
                                {ad.points}P
                              </td>
                              <td
                                style={{
                                  padding: "12px 12px",
                                  textAlign: "center",
                                  borderRight: "1px solid #e5e7eb",
                                  borderBottom: "1px solid #e5e7eb",
                                  color: "#374151",
                                }}
                              >
                                {ad.todayVisits}명
                              </td>
                              <td
                                style={{
                                  padding: "12px 12px",
                                  textAlign: "center",
                                  borderRight: "1px solid #e5e7eb",
                                  borderBottom: "1px solid #e5e7eb",
                                  color: "#374151",
                                  fontWeight: "500",
                                }}
                              >
                                {ad.totalVisits.toLocaleString()}명
                              </td>
                              <td
                                style={{
                                  padding: "12px 12px",
                                  textAlign: "center",
                                  borderRight: "1px solid #e5e7eb",
                                  borderBottom: "1px solid #e5e7eb",
                                }}
                              >
                                <span
                                  style={{
                                    display: "inline-block",
                                    padding: "4px 8px",
                                    borderRadius: "4px",
                                    fontSize: "12px",
                                    fontWeight: "500",
                                    backgroundColor: ad.status === "활성" ? "#dcfce7" : ad.status === "비활성" ? "#fee2e2" : "#fef3c7",
                                    color: ad.status === "활성" ? "#166534" : ad.status === "비활성" ? "#991b1b" : "#92400e",
                                  }}
                                >
                                  {ad.status}
                                </span>
                              </td>
                              <td
                                style={{
                                  padding: "12px 16px",
                                  textAlign: "center",
                                  borderRight: "1px solid #e5e7eb",
                                  borderBottom: "1px solid #e5e7eb",
                                  color: "#374151",
                                  fontSize: "13px",
                                }}
                              >
                                {ad.startDate} ~ {ad.endDate}
                              </td>
                              <td
                                style={{
                                  padding: "12px 16px",
                                  textAlign: "center",
                                  borderRight: "1px solid #e5e7eb",
                                  borderBottom: "1px solid #e5e7eb",
                                  color: "#374151",
                                }}
                              >
                                {ad.createDate}
                              </td>
                              <td
                                style={{
                                  padding: "12px 12px",
                                  textAlign: "center",
                                  borderBottom: "1px solid #e5e7eb",
                                }}
                              >
                                <button
                                  style={{
                                    backgroundColor: "#f3f4f6",
                                    color: "#374151",
                                    border: "none",
                                    borderRadius: "4px",
                                    padding: "6px 12px",
                                    fontSize: "12px",
                                    fontWeight: "500",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "#e5e7eb";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "#f3f4f6";
                                  }}
                                  onClick={() => {
                                    const adIndex = ads.findIndex(a => a.name === ad.name && a.createDate === ad.createDate);
                                    if (adIndex !== -1) {
                                      setEditingAdIndex(adIndex);
                                      setAdTitle(ads[adIndex].name);
                                      setAdType(ads[adIndex].type || "배너");
                                      setAdPosition(ads[adIndex].position || "상단");
                                      setAdStartDateReg(ads[adIndex].startDate || "");
                                      setAdEndDateReg(ads[adIndex].endDate || "");
                                      setAdTargetUrl(ads[adIndex].targetUrl || "");
                                      setAdImagePreviews(ads[adIndex].images || []);
                                      setIsEditingAd(true);
                                    }
                                  }}
                                >
                                  수정
                                </button>
                              </td>
                            </tr>
                          ));
                        })()}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* 페이지네이션 */}
                  {(() => {
                    // 광고 데이터 재정의 (페이지네이션에서 사용하기 위해)
                    const ads = [
                      { name: "제주 올레길 카페", address: "제주시 구좌읍 월정리 33-8", points: 150, todayVisits: 23, totalVisits: 2850, status: "활성", startDate: "2024-08-01", endDate: "2024-10-31", createDate: "2024-08-19" },
                      { name: "부산 해운대 호텔", address: "부산시 해운대구 해운대해변로 264", points: 200, todayVisits: 18, totalVisits: 4230, status: "활성", startDate: "2024-07-15", endDate: "2024-12-31", createDate: "2024-08-18" },
                      { name: "서울 명동 한식당", address: "서울시 중구 명동길 14", points: 100, todayVisits: 35, totalVisits: 1820, status: "활성", startDate: "2024-08-10", endDate: "2024-11-30", createDate: "2024-08-17" },
                      { name: "전주 한옥마을 게스트하우스", address: "전주시 완산구 기린대로 99", points: 120, todayVisits: 12, totalVisits: 3150, status: "비활성", startDate: "2024-06-01", endDate: "2024-08-31", createDate: "2024-08-16" },
                      { name: "안동 하회마을 전통찻집", address: "안동시 풍천면 하회종가길 69", points: 80, todayVisits: 8, totalVisits: 1450, status: "활성", startDate: "2024-08-05", endDate: "2024-10-05", createDate: "2024-08-15" },
                      { name: "강릉 바다펜션", address: "강릉시 사천면 해안로 1412", points: 180, todayVisits: 27, totalVisits: 3680, status: "활성", startDate: "2024-07-20", endDate: "2024-09-20", createDate: "2024-08-14" },
                      { name: "인천 차이나타운 중식당", address: "인천시 중구 차이나타운로 64", points: 90, todayVisits: 41, totalVisits: 2240, status: "일시정지", startDate: "2024-08-01", endDate: "2024-10-01", createDate: "2024-08-13" },
                      { name: "경주 불국사 기념품점", address: "경주시 진현동 15-1", points: 70, todayVisits: 16, totalVisits: 1890, status: "활성", startDate: "2024-07-10", endDate: "2024-12-10", createDate: "2024-08-12" },
                      { name: "여수 돌산대교 맛집", address: "여수시 돌산읍 돌산로 3600", points: 110, todayVisits: 29, totalVisits: 2760, status: "활성", startDate: "2024-08-15", endDate: "2024-11-15", createDate: "2024-08-11" },
                      { name: "춘천 남이섬 레스토랑", address: "춘천시 남산면 남이섬길 1", points: 130, todayVisits: 33, totalVisits: 4120, status: "활성", startDate: "2024-07-25", endDate: "2024-10-25", createDate: "2024-08-10" },
                      { name: "순천만 갈대숲 카페", address: "순천시 순천만길 513-25", points: 95, todayVisits: 14, totalVisits: 1670, status: "비활성", startDate: "2024-06-15", endDate: "2024-08-15", createDate: "2024-08-09" },
                      { name: "대전 엑스포공원 푸드트럭", address: "대전시 유성구 대덕대로 480", points: 60, todayVisits: 22, totalVisits: 980, status: "활성", startDate: "2024-08-01", endDate: "2024-09-30", createDate: "2024-08-08" },
                      { name: "울릉도 독도박물관 기념품샵", address: "울릉군 울릉읍 독도박물관길 90", points: 85, todayVisits: 7, totalVisits: 520, status: "활성", startDate: "2024-07-01", endDate: "2024-10-31", createDate: "2024-08-07" },
                      { name: "통영 한산도 펜션", address: "통영시 한산면 한산일주로 112", points: 160, todayVisits: 11, totalVisits: 2340, status: "일시정지", startDate: "2024-07-15", endDate: "2024-09-15", createDate: "2024-08-06" },
                      { name: "포항 호미곶 횟집", address: "포항시 남구 호미곶면 대보리 123", points: 140, todayVisits: 19, totalVisits: 3210, status: "활성", startDate: "2024-08-10", endDate: "2024-11-10", createDate: "2024-08-05" },
                      { name: "수원 화성 한옥스테이", address: "수원시 팔달구 정조로 825", points: 170, todayVisits: 25, totalVisits: 2890, status: "활성", startDate: "2024-07-20", endDate: "2024-10-20", createDate: "2024-08-04" },
                      { name: "태안 꽃지해변 펜션", address: "태안군 안면읍 꽃지해안로 202", points: 190, todayVisits: 31, totalVisits: 4560, status: "활성", startDate: "2024-06-25", endDate: "2024-09-25", createDate: "2024-08-03" },
                      { name: "보령 머드축제 체험장", address: "보령시 신흑동 555", points: 120, todayVisits: 38, totalVisits: 5230, status: "비활성", startDate: "2024-06-01", endDate: "2024-08-31", createDate: "2024-08-02" },
                      { name: "평창 알펜시아 스키샵", address: "평창군 대관령면 솔봉로 325", points: 110, todayVisits: 5, totalVisits: 1340, status: "활성", startDate: "2024-08-01", endDate: "2024-12-31", createDate: "2024-08-01" },
                      { name: "거제도 바람의언덕 카페", address: "거제시 남부면 갈곶리 산14-47", points: 105, todayVisits: 21, totalVisits: 2680, status: "활성", startDate: "2024-07-10", endDate: "2024-10-10", createDate: "2024-07-31" },
                      { name: "담양 죽녹원 죽순요리집", address: "담양군 담양읍 죽녹원로 119", points: 75, todayVisits: 13, totalVisits: 1560, status: "일시정지", startDate: "2024-07-01", endDate: "2024-09-30", createDate: "2024-07-30" },
                      { name: "강릉 경포대 해변카페", address: "강릉시 강동면 경포해변로 365", points: 125, todayVisits: 28, totalVisits: 3450, status: "활성", startDate: "2024-06-20", endDate: "2024-09-20", createDate: "2024-07-29" },
                      { name: "제천 청풍호 유람선", address: "제천시 청풍면 청풍호로 2048", points: 150, todayVisits: 17, totalVisits: 2120, status: "활성", startDate: "2024-07-15", endDate: "2024-10-15", createDate: "2024-07-28" },
                      { name: "목포 유달산 전망대 카페", address: "목포시 죽교동 산 4-14", points: 90, todayVisits: 24, totalVisits: 1890, status: "비활성", startDate: "2024-06-10", endDate: "2024-08-10", createDate: "2024-07-27" },
                      { name: "김해 수로왕릉 문화센터", address: "김해시 가야의길 126", points: 65, todayVisits: 9, totalVisits: 780, status: "활성", startDate: "2024-07-20", endDate: "2024-10-20", createDate: "2024-07-26" },
                      { name: "파주 임진각 통일전망대", address: "파주시 문산읍 임진각로 177", points: 80, todayVisits: 15, totalVisits: 1450, status: "활성", startDate: "2024-08-01", endDate: "2024-11-01", createDate: "2024-07-25" },
                      { name: "논산 관촉사 템플스테이", address: "논산시 관촉동 18", points: 100, todayVisits: 6, totalVisits: 650, status: "일시정지", startDate: "2024-07-05", endDate: "2024-10-05", createDate: "2024-07-24" },
                      { name: "광주 무등산 산채정식", address: "광주시 동구 증심사길 30", points: 85, todayVisits: 20, totalVisits: 1720, status: "활성", startDate: "2024-07-10", endDate: "2024-10-10", createDate: "2024-07-23" },
                      { name: "속초 설악산 민박", address: "속초시 설악산로 1091", points: 135, todayVisits: 26, totalVisits: 3180, status: "활성", startDate: "2024-06-30", endDate: "2024-09-30", createDate: "2024-07-22" },
                      { name: "통도사 계곡 찜질방", address: "양산시 하북면 통도사로 108", points: 115, todayVisits: 12, totalVisits: 2040, status: "활성", startDate: "2024-07-25", endDate: "2024-10-25", createDate: "2024-07-21" }
                    ];

                    // 필터링된 결과에 따라 페이지네이션 계산
                    const filterAds = () => {
                      return ads.filter(ad => {
                        // 날짜 필터링 (등록일 기준)
                        if (adStartDate || adEndDate) {
                          const adDate = new Date(ad.createDate);
                          const startDate = adStartDate ? new Date(adStartDate) : null;
                          const endDate = adEndDate ? new Date(adEndDate) : null;
                          
                          if (startDate && adDate < startDate) return false;
                          if (endDate && adDate > endDate) return false;
                        }
                        
                        // 키워드 검색 (광고명, 주소)
                        if (adKeyword) {
                          const keyword = adKeyword.toLowerCase();
                          const name = ad.name.toLowerCase();
                          const address = ad.address.toLowerCase();
                          
                          if (!name.includes(keyword) && !address.includes(keyword)) {
                            return false;
                          }
                        }
                        
                        return true;
                      });
                    };
                    
                    const filteredAds = filterAds();
                    const totalAds = filteredAds.length;
                    const totalPages = Math.ceil(totalAds / itemsPerPage);
                    
                    return (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          marginTop: "24px",
                          marginBottom: "24px",
                          gap: "8px",
                          padding: "0",
                        }}
                      >
                        <button
                          style={{
                            padding: "8px 12px",
                            border: "1px solid #d1d5db",
                            backgroundColor: currentPage === 1 ? "#f3f4f6" : "white",
                            color: currentPage === 1 ? "#9ca3af" : "#374151",
                            borderRadius: "4px",
                            fontSize: "14px",
                            cursor: currentPage === 1 ? "not-allowed" : "pointer",
                          }}
                          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          이전
                        </button>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                          <button
                            key={pageNumber}
                            style={{
                              padding: "8px 12px",
                              border: currentPage === pageNumber ? "1px solid #F97316" : "1px solid #d1d5db",
                              backgroundColor: currentPage === pageNumber ? "#F97316" : "white",
                              color: currentPage === pageNumber ? "white" : "#374151",
                              borderRadius: "4px",
                              fontSize: "14px",
                              cursor: "pointer",
                            }}
                            onClick={() => setCurrentPage(pageNumber)}
                          >
                            {pageNumber}
                          </button>
                        ))}
                        
                        <button
                          style={{
                            padding: "8px 12px",
                            border: "1px solid #d1d5db",
                            backgroundColor: currentPage === totalPages ? "#f3f4f6" : "white",
                            color: currentPage === totalPages ? "#9ca3af" : "#374151",
                            borderRadius: "4px",
                            fontSize: "14px",
                            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                          }}
                          onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          다음
                        </button>
                      </div>
                    );
                  })()}
                </div>
              </>
            )}

            {/* 광고 등록 화면 */}
            {activeMenu === "광고 관리" && isRegisteringAd && (
              <>
                {/* Header Section */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "32px",
                  }}
                >
                  <h1
                    style={{
                      fontSize: "32px",
                      fontWeight: "bold",
                      color: "#1f2937",
                      margin: 0,
                    }}
                  >
                    광고 등록
                  </h1>
                  <button
                    onClick={() => {
                      setIsRegisteringAd(false);
                      setAdTitle("");
                      setAdType("배너");
                      setAdPosition("상단");
                      setAdStartDateReg("");
                      setAdEndDateReg("");
                      setAdTargetUrl("");
                      setAdImages([]);
                      setAdImagePreviews([]);
                    }}
                    style={{
                      backgroundColor: "#6b7280",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      padding: "8px 16px",
                      fontSize: "14px",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    목록으로
                  </button>
                </div>

                {/* 광고 등록 폼 */}
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    border: "1px solid #f3f4f6",
                    padding: "32px",
                  }}
                >
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!adTitle.trim() || !adTargetUrl.trim() || !adStartDateReg || !adEndDateReg) {
                        alert("모든 필드를 입력해주세요.");
                        return;
                      }
                      
                      const startDate = new Date(adStartDateReg);
                      const endDate = new Date(adEndDateReg);
                      
                      if (startDate >= endDate) {
                        alert("종료일은 시작일보다 늦어야 합니다.");
                        return;
                      }
                      
                      const today = new Date();
                      const dateString = today.getFullYear() + "-" + 
                        String(today.getMonth() + 1).padStart(2, '0') + "-" + 
                        String(today.getDate()).padStart(2, '0');
                      
                      const newAd = {
                        name: adTitle,
                        address: "등록된 주소",
                        points: 0,
                        todayVisits: 0,
                        totalVisits: 0,
                        type: adType,
                        position: adPosition,
                        startDate: adStartDateReg,
                        endDate: adEndDateReg,
                        targetUrl: adTargetUrl,
                        status: "활성",
                        createDate: dateString,
                        images: adImagePreviews
                      };
                      
                      // 광고 목록에 추가
                      setAds([newAd, ...ads]);
                      setIsRegisteringAd(false);
                      setAdTitle("");
                      setAdType("배너");
                      setAdPosition("상단");
                      setAdStartDateReg("");
                      setAdEndDateReg("");
                      setAdTargetUrl("");
                      setAdImages([]);
                      setAdImagePreviews([]);
                      
                      alert("광고가 등록되었습니다.");
                    }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "24px",
                    }}
                  >
                    {/* 광고 제목 */}
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#374151",
                          marginBottom: "8px",
                        }}
                      >
                        광고 제목
                      </label>
                      <input
                        type="text"
                        value={adTitle}
                        onChange={(e) => setAdTitle(e.target.value)}
                        placeholder="광고 제목을 입력하세요"
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          border: "1px solid #d1d5db",
                          borderRadius: "8px",
                          fontSize: "14px",
                          outline: "none",
                          transition: "border-color 0.2s ease",
                          backgroundColor: "white",
                        }}
                      />
                    </div>

                    {/* 광고 유형 */}
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#374151",
                          marginBottom: "8px",
                        }}
                      >
                        광고 유형
                      </label>
                      <select
                        value={adType}
                        onChange={(e) => setAdType(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          border: "1px solid #d1d5db",
                          borderRadius: "8px",
                          fontSize: "14px",
                          outline: "none",
                          transition: "border-color 0.2s ease",
                          backgroundColor: "white",
                        }}
                      >
                        <option value="배너">배너</option>
                        <option value="팝업">팝업</option>
                        <option value="텍스트">텍스트</option>
                        <option value="마커">마커</option>
                      </select>
                    </div>

                    {/* 배치 위치 */}
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#374151",
                          marginBottom: "8px",
                        }}
                      >
                        배치 위치
                      </label>
                      <select
                        value={adPosition}
                        onChange={(e) => setAdPosition(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          border: "1px solid #d1d5db",
                          borderRadius: "8px",
                          fontSize: "14px",
                          outline: "none",
                          transition: "border-color 0.2s ease",
                          backgroundColor: "white",
                        }}
                      >
                        <option value="상단">상단</option>
                        <option value="하단">하단</option>
                        <option value="사이드">사이드</option>
                        <option value="중앙">중앙</option>
                      </select>
                    </div>

                    {/* 광고 기간 */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#374151",
                            marginBottom: "8px",
                          }}
                        >
                          시작일
                        </label>
                        <input
                          type="date"
                          value={adStartDateReg}
                          onChange={(e) => setAdStartDateReg(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            border: "1px solid #d1d5db",
                            borderRadius: "8px",
                            fontSize: "14px",
                            outline: "none",
                            transition: "border-color 0.2s ease",
                            backgroundColor: "white",
                          }}
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#374151",
                            marginBottom: "8px",
                          }}
                        >
                          종료일
                        </label>
                        <input
                          type="date"
                          value={adEndDateReg}
                          onChange={(e) => setAdEndDateReg(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            border: "1px solid #d1d5db",
                            borderRadius: "8px",
                            fontSize: "14px",
                            outline: "none",
                            transition: "border-color 0.2s ease",
                            backgroundColor: "white",
                          }}
                        />
                      </div>
                    </div>

                    {/* 링크 URL */}
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#374151",
                          marginBottom: "8px",
                        }}
                      >
                        링크 URL
                      </label>
                      <input
                        type="url"
                        value={adTargetUrl}
                        onChange={(e) => setAdTargetUrl(e.target.value)}
                        placeholder="https://example.com"
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          border: "1px solid #d1d5db",
                          borderRadius: "8px",
                          fontSize: "14px",
                          outline: "none",
                          transition: "border-color 0.2s ease",
                          backgroundColor: "white",
                        }}
                      />
                    </div>

                    {/* 광고 이미지 업로드 */}
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#374151",
                          marginBottom: "8px",
                        }}
                      >
                        광고 이미지
                      </label>
                      <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
                        {/* 이미지 업로드 영역 */}
                        <div style={{ flex: 1 }}>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                  const newPreview = e.target?.result as string;
                                  setAdImages(prev => [...prev, file]);
                                  setAdImagePreviews(prev => [...prev, newPreview]);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            style={{
                              width: "100%",
                              padding: "12px",
                              border: "2px dashed #d1d5db",
                              borderRadius: "8px",
                              fontSize: "14px",
                              cursor: "pointer",
                              backgroundColor: "#f9fafb",
                              transition: "all 0.2s ease",
                            }}
                          />
                          <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px", marginBottom: "0" }}>
                            JPG, PNG, GIF 파일만 업로드 가능 (최대 5MB)
                          </p>
                        </div>

                      </div>

                      {/* 등록된 이미지 미리보기 목록 */}
                      {adImagePreviews.length > 0 && (
                        <div style={{ marginTop: "16px" }}>
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "12px",
                              justifyContent: "flex-start",
                            }}
                          >
                            {adImagePreviews.map((preview, index) => (
                              <div
                                key={index}
                                style={{
                                  width: "100px",
                                  height: "100px",
                                  position: "relative",
                                  borderRadius: "8px",
                                  overflow: "hidden",
                                }}
                              >
                                <img
                                  src={preview}
                                  alt={`광고 이미지 ${index + 1}`}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    border: "1px solid #e5e7eb",
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setAdImages(prev => prev.filter((_, i) => i !== index));
                                    setAdImagePreviews(prev => prev.filter((_, i) => i !== index));
                                  }}
                                  style={{
                                    position: "absolute",
                                    top: "4px",
                                    right: "4px",
                                    width: "20px",
                                    height: "20px",
                                    borderRadius: "50%",
                                    border: "none",
                                    backgroundColor: "#ef4444",
                                    color: "white",
                                    fontSize: "12px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 등록 버튼 */}
                    <div style={{ paddingTop: "16px" }}>
                      <button
                        type="submit"
                        style={{
                          backgroundColor: "#F97316",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          padding: "12px 24px",
                          fontSize: "16px",
                          fontWeight: "600",
                          cursor: "pointer",
                          width: "100%",
                          transition: "all 0.2s ease",
                        }}
                      >
                        광고 등록
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}

            {/* 광고 수정 화면 */}
            {activeMenu === "광고 관리" && isEditingAd && (
              <>
                {/* Header Section */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "32px",
                  }}
                >
                  <h1
                    style={{
                      fontSize: "32px",
                      fontWeight: "bold",
                      color: "#1f2937",
                      margin: 0,
                    }}
                  >
                    광고 수정
                  </h1>
                  <button
                    onClick={() => {
                      setIsEditingAd(false);
                      setEditingAdIndex(-1);
                      setAdTitle("");
                      setAdType("배너");
                      setAdPosition("상단");
                      setAdStartDateReg("");
                      setAdEndDateReg("");
                      setAdTargetUrl("");
                      setAdImages([]);
                      setAdImagePreviews([]);
                    }}
                    style={{
                      backgroundColor: "#6b7280",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      padding: "8px 16px",
                      fontSize: "14px",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    목록으로
                  </button>
                </div>

                {/* 광고 수정 폼 */}
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    border: "1px solid #f3f4f6",
                    padding: "32px",
                  }}
                >
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!adTitle.trim() || !adTargetUrl.trim() || !adStartDateReg || !adEndDateReg) {
                        alert("모든 필드를 입력해주세요.");
                        return;
                      }
                      
                      const startDate = new Date(adStartDateReg);
                      const endDate = new Date(adEndDateReg);
                      
                      if (startDate >= endDate) {
                        alert("종료일은 시작일보다 늦어야 합니다.");
                        return;
                      }
                      
                      const updatedAd = {
                        ...ads[editingAdIndex],
                        name: adTitle,
                        type: adType,
                        position: adPosition,
                        startDate: adStartDateReg,
                        endDate: adEndDateReg,
                        targetUrl: adTargetUrl,
                        images: adImagePreviews
                      };
                      
                      // 광고 목록에서 해당 광고 수정
                      const updatedAds = [...ads];
                      updatedAds[editingAdIndex] = updatedAd;
                      setAds(updatedAds);
                      
                      setIsEditingAd(false);
                      setEditingAdIndex(-1);
                      setAdTitle("");
                      setAdType("배너");
                      setAdPosition("상단");
                      setAdStartDateReg("");
                      setAdEndDateReg("");
                      setAdTargetUrl("");
                      setAdImages([]);
                      setAdImagePreviews([]);
                      
                      alert("광고가 수정되었습니다.");
                    }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "24px",
                    }}
                  >
                    {/* 광고 제목 */}
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#374151",
                          marginBottom: "8px",
                        }}
                      >
                        광고 제목
                      </label>
                      <input
                        type="text"
                        value={adTitle}
                        onChange={(e) => setAdTitle(e.target.value)}
                        placeholder="광고 제목을 입력하세요"
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          border: "1px solid #d1d5db",
                          borderRadius: "8px",
                          fontSize: "14px",
                          outline: "none",
                          transition: "border-color 0.2s ease",
                          backgroundColor: "white",
                        }}
                      />
                    </div>

                    {/* 광고 유형 */}
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#374151",
                          marginBottom: "8px",
                        }}
                      >
                        광고 유형
                      </label>
                      <select
                        value={adType}
                        onChange={(e) => setAdType(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          border: "1px solid #d1d5db",
                          borderRadius: "8px",
                          fontSize: "14px",
                          outline: "none",
                          transition: "border-color 0.2s ease",
                          backgroundColor: "white",
                        }}
                      >
                        <option value="배너">배너</option>
                        <option value="팝업">팝업</option>
                        <option value="텍스트">텍스트</option>
                        <option value="마커">마커</option>
                      </select>
                    </div>

                    {/* 배치 위치 */}
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#374151",
                          marginBottom: "8px",
                        }}
                      >
                        배치 위치
                      </label>
                      <select
                        value={adPosition}
                        onChange={(e) => setAdPosition(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          border: "1px solid #d1d5db",
                          borderRadius: "8px",
                          fontSize: "14px",
                          outline: "none",
                          transition: "border-color 0.2s ease",
                          backgroundColor: "white",
                        }}
                      >
                        <option value="상단">상단</option>
                        <option value="하단">하단</option>
                        <option value="사이드">사이드</option>
                        <option value="중앙">중앙</option>
                      </select>
                    </div>

                    {/* 광고 기간 */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#374151",
                            marginBottom: "8px",
                          }}
                        >
                          시작일
                        </label>
                        <input
                          type="date"
                          value={adStartDateReg}
                          onChange={(e) => setAdStartDateReg(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            border: "1px solid #d1d5db",
                            borderRadius: "8px",
                            fontSize: "14px",
                            outline: "none",
                            transition: "border-color 0.2s ease",
                            backgroundColor: "white",
                          }}
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#374151",
                            marginBottom: "8px",
                          }}
                        >
                          종료일
                        </label>
                        <input
                          type="date"
                          value={adEndDateReg}
                          onChange={(e) => setAdEndDateReg(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            border: "1px solid #d1d5db",
                            borderRadius: "8px",
                            fontSize: "14px",
                            outline: "none",
                            transition: "border-color 0.2s ease",
                            backgroundColor: "white",
                          }}
                        />
                      </div>
                    </div>

                    {/* 링크 URL */}
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#374151",
                          marginBottom: "8px",
                        }}
                      >
                        링크 URL
                      </label>
                      <input
                        type="url"
                        value={adTargetUrl}
                        onChange={(e) => setAdTargetUrl(e.target.value)}
                        placeholder="https://example.com"
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          border: "1px solid #d1d5db",
                          borderRadius: "8px",
                          fontSize: "14px",
                          outline: "none",
                          transition: "border-color 0.2s ease",
                          backgroundColor: "white",
                        }}
                      />
                    </div>

                    {/* 광고 이미지 업로드 */}
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#374151",
                          marginBottom: "8px",
                        }}
                      >
                        광고 이미지
                      </label>
                      <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
                        {/* 이미지 업로드 영역 */}
                        <div style={{ flex: 1 }}>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                  const newPreview = e.target?.result as string;
                                  setAdImages(prev => [...prev, file]);
                                  setAdImagePreviews(prev => [...prev, newPreview]);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            style={{
                              width: "100%",
                              padding: "12px",
                              border: "2px dashed #d1d5db",
                              borderRadius: "8px",
                              fontSize: "14px",
                              cursor: "pointer",
                              backgroundColor: "#f9fafb",
                              transition: "all 0.2s ease",
                            }}
                          />
                          <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px", marginBottom: "0" }}>
                            JPG, PNG, GIF 파일만 업로드 가능 (최대 5MB)
                          </p>
                        </div>

                      </div>

                      {/* 등록된 이미지 미리보기 목록 */}
                      {adImagePreviews.length > 0 && (
                        <div style={{ marginTop: "16px" }}>
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "12px",
                              justifyContent: "flex-start",
                            }}
                          >
                            {adImagePreviews.map((preview, index) => (
                              <div
                                key={index}
                                style={{
                                  width: "100px",
                                  height: "100px",
                                  position: "relative",
                                  borderRadius: "8px",
                                  overflow: "hidden",
                                }}
                              >
                                <img
                                  src={preview}
                                  alt={`광고 이미지 ${index + 1}`}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    border: "1px solid #e5e7eb",
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setAdImages(prev => prev.filter((_, i) => i !== index));
                                    setAdImagePreviews(prev => prev.filter((_, i) => i !== index));
                                  }}
                                  style={{
                                    position: "absolute",
                                    top: "4px",
                                    right: "4px",
                                    width: "20px",
                                    height: "20px",
                                    borderRadius: "50%",
                                    border: "none",
                                    backgroundColor: "#ef4444",
                                    color: "white",
                                    fontSize: "12px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 수정 버튼 */}
                    <div style={{ paddingTop: "16px" }}>
                      <button
                        type="submit"
                        style={{
                          backgroundColor: "#F97316",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          padding: "12px 24px",
                          fontSize: "16px",
                          fontWeight: "600",
                          cursor: "pointer",
                          width: "100%",
                          transition: "all 0.2s ease",
                        }}
                      >
                        광고 수정
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}

            {activeMenu === "회원 관리" && !isCreatingAccount && !isEditingUser && (
              <>
                {/* Header Section */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "32px",
                  }}
                >
                  <h1
                    style={{
                      fontSize: "32px",
                      fontWeight: "bold",
                      color: "#1f2937",
                      margin: 0,
                    }}
                  >
                    유저 리스트
                  </h1>
                  <button
                    style={{
                      backgroundColor: "#F97316",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      padding: "8px 16px",
                      fontSize: "14px",
                      fontWeight: "500",
                      cursor: "pointer",
                      boxShadow: "0 2px 4px rgba(249, 115, 22, 0.15)",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#EA580C";
                      e.currentTarget.style.transform = "translateY(-1px)";
                      e.currentTarget.style.boxShadow = "0 4px 8px rgba(249, 115, 22, 0.25)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#F97316";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 2px 4px rgba(249, 115, 22, 0.15)";
                    }}
                    onClick={() => updateIsCreatingAccount(true)}
                  >
                    계정 생성
                  </button>
                </div>
                
                {/* 필터 섹션 */}
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    padding: "24px",
                    border: "1px solid #f3f4f6",
                    marginBottom: "24px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    }}
                  >
                    {/* First row - 가입일 | 시작일 버튼 | 종료일 버튼 */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        justifyContent: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#374151",
                          minWidth: "60px",
                        }}
                      >
                        가입일
                      </div>
                      <input
                        type="text"
                        placeholder="시작일"
                        value={userStartDate}
                        onChange={(e) => setUserStartDate(e.target.value)}
                        onFocus={(e) => {
                          e.target.type = "date";
                          e.target.showPicker?.();
                        }}
                        onBlur={(e) => {
                          if (!e.target.value) {
                            e.target.type = "text";
                          }
                        }}
                        style={{
                          width: "150px",
                          padding: "8px 12px",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          fontSize: "14px",
                          color: "#374151",
                          backgroundColor: "white",
                        }}
                      />
                      <input
                        type="text"
                        placeholder="종료일"
                        value={userEndDate}
                        onChange={(e) => setUserEndDate(e.target.value)}
                        onFocus={(e) => {
                          e.target.type = "date";
                          e.target.showPicker?.();
                        }}
                        onBlur={(e) => {
                          if (!e.target.value) {
                            e.target.type = "text";
                          }
                        }}
                        style={{
                          width: "150px",
                          padding: "8px 12px",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          fontSize: "14px",
                          color: "#374151",
                          backgroundColor: "white",
                        }}
                      />
                    </div>

                    {/* Second row - 키워드 | 검색창 | 검색 버튼 */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        justifyContent: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#374151",
                          minWidth: "60px",
                        }}
                      >
                        키워드
                      </div>
                      <input
                        type="text"
                        placeholder="이름, 이메일, 전화번호 등으로 검색"
                        value={userKeyword}
                        onChange={(e) => setUserKeyword(e.target.value)}
                        style={{
                          width: "300px",
                          padding: "8px 12px",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          fontSize: "14px",
                          color: "#374151",
                          backgroundColor: "white",
                        }}
                      />
                      <button
                        onClick={() => {
                          // 검색 실행 (상태가 실시간으로 업데이트되므로 별도 로직 불필요)
                          setCurrentPage(1); // 페이지를 1로 초기화
                        }}
                        style={{
                          backgroundColor: "#F97316",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          padding: "8px 16px",
                          fontSize: "14px",
                          fontWeight: "500",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          whiteSpace: "nowrap",
                          minWidth: "60px",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#EA580C";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#F97316";
                        }}
                      >
                        검색
                      </button>
                    </div>
                  </div>
                </div>

                {/* 유저 리스트 섹션 */}
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    padding: "0",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#1f2937",
                      marginBottom: "20px",
                      margin: "24px 0 20px 0",
                    }}
                  >
                    총 50건
                  </h3>
                  
                  {/* 테이블 */}
                  <div
                    style={{
                      overflowX: "auto",
                      padding: "0",
                    }}
                  >
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "separate",
                        borderSpacing: "0",
                        fontSize: "14px",
                        borderRadius: "8px",
                        overflow: "hidden",
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      {/* 테이블 헤더 */}
                      <thead>
                        <tr>
                          <th
                            style={{
                              backgroundColor: "#f8f9fa",
                              padding: "12px 8px",
                              textAlign: "center",
                              fontWeight: "600",
                              color: "#374151",
                              borderRight: "1px solid #e5e7eb",
                              borderBottom: "1px solid #e5e7eb",
                              fontSize: "14px",
                            }}
                          >
                            번호
                          </th>
                          <th
                            style={{
                              backgroundColor: "#f8f9fa",
                              padding: "12px 16px",
                              textAlign: "left",
                              fontWeight: "600",
                              color: "#374151",
                              borderRight: "1px solid #e5e7eb",
                              borderBottom: "1px solid #e5e7eb",
                              fontSize: "14px",
                            }}
                          >
                            이름
                          </th>
                          <th
                            style={{
                              backgroundColor: "#f8f9fa",
                              padding: "12px 16px",
                              textAlign: "left",
                              fontWeight: "600",
                              color: "#374151",
                              borderRight: "1px solid #e5e7eb",
                              borderBottom: "1px solid #e5e7eb",
                              fontSize: "14px",
                            }}
                          >
                            휴대폰 번호
                          </th>
                          <th
                            style={{
                              backgroundColor: "#f8f9fa",
                              padding: "12px 12px",
                              textAlign: "center",
                              fontWeight: "600",
                              color: "#374151",
                              borderRight: "1px solid #e5e7eb",
                              borderBottom: "1px solid #e5e7eb",
                              fontSize: "14px",
                            }}
                          >
                            총 퀴즈 풀이 횟수
                          </th>
                          <th
                            style={{
                              backgroundColor: "#f8f9fa",
                              padding: "12px 12px",
                              textAlign: "center",
                              fontWeight: "600",
                              color: "#374151",
                              borderRight: "1px solid #e5e7eb",
                              borderBottom: "1px solid #e5e7eb",
                              fontSize: "14px",
                            }}
                          >
                            누적 획득 포인트
                          </th>
                          <th
                            style={{
                              backgroundColor: "#f8f9fa",
                              padding: "12px 12px",
                              textAlign: "center",
                              fontWeight: "600",
                              color: "#374151",
                              borderRight: "1px solid #e5e7eb",
                              borderBottom: "1px solid #e5e7eb",
                              fontSize: "14px",
                            }}
                          >
                            마케팅 동의
                          </th>
                          <th
                            style={{
                              backgroundColor: "#f8f9fa",
                              padding: "12px 16px",
                              textAlign: "center",
                              fontWeight: "600",
                              color: "#374151",
                              borderRight: "1px solid #e5e7eb",
                              borderBottom: "1px solid #e5e7eb",
                              fontSize: "14px",
                            }}
                          >
                            가입일
                          </th>
                          <th
                            style={{
                              backgroundColor: "#f8f9fa",
                              padding: "12px 12px",
                              textAlign: "center",
                              fontWeight: "600",
                              color: "#374151",
                              borderBottom: "1px solid #e5e7eb",
                              fontSize: "14px",
                            }}
                          >
                            관리
                          </th>
                        </tr>
                      </thead>
                      
                      {/* 테이블 바디 */}
                      <tbody>
                        {(() => {
                          // 더미 데이터 (50명) - 최신 가입일 순서대로 정렬
                          const dummyUsers = [
                            { name: "김철수", phone: "010-1234-5678", quizCount: 45, points: 12500, marketing: true, joinDate: "2024-08-19" },
                            { name: "이영희", phone: "010-9876-5432", quizCount: 32, points: 8900, marketing: false, joinDate: "2024-08-18" },
                            { name: "박민수", phone: "010-5555-1234", quizCount: 67, points: 18750, marketing: true, joinDate: "2024-08-17" },
                            { name: "최지은", phone: "010-7777-8888", quizCount: 23, points: 6200, marketing: false, joinDate: "2024-08-16" },
                            { name: "정한별", phone: "010-1111-2222", quizCount: 89, points: 25400, marketing: true, joinDate: "2024-08-15" },
                            { name: "장미라", phone: "010-3333-4444", quizCount: 54, points: 14200, marketing: false, joinDate: "2024-08-14" },
                            { name: "윤동혁", phone: "010-5555-6666", quizCount: 76, points: 21800, marketing: true, joinDate: "2024-08-13" },
                            { name: "소민정", phone: "010-7777-9999", quizCount: 41, points: 11300, marketing: true, joinDate: "2024-08-12" },
                            { name: "강태현", phone: "010-2222-8888", quizCount: 29, points: 7650, marketing: false, joinDate: "2024-08-11" },
                            { name: "홍서영", phone: "010-9999-1111", quizCount: 63, points: 17200, marketing: true, joinDate: "2024-08-10" },
                            { name: "조현우", phone: "010-1122-3344", quizCount: 58, points: 16800, marketing: true, joinDate: "2024-08-09" },
                            { name: "신예은", phone: "010-5566-7788", quizCount: 34, points: 9200, marketing: false, joinDate: "2024-08-08" },
                            { name: "이준호", phone: "010-9900-1122", quizCount: 72, points: 20500, marketing: true, joinDate: "2024-08-07" },
                            { name: "김소연", phone: "010-3344-5566", quizCount: 46, points: 13100, marketing: false, joinDate: "2024-08-06" },
                            { name: "박지훈", phone: "010-7788-9900", quizCount: 81, points: 23600, marketing: true, joinDate: "2024-08-05" },
                            { name: "정수빈", phone: "010-1357-2468", quizCount: 27, points: 7200, marketing: false, joinDate: "2024-08-04" },
                            { name: "한민지", phone: "010-8642-9753", quizCount: 65, points: 18400, marketing: true, joinDate: "2024-08-03" },
                            { name: "서준영", phone: "010-2468-1357", quizCount: 39, points: 10700, marketing: true, joinDate: "2024-08-02" },
                            { name: "오나연", phone: "010-9753-8642", quizCount: 52, points: 14900, marketing: false, joinDate: "2024-08-01" },
                            { name: "임재욱", phone: "010-4679-1234", quizCount: 91, points: 27300, marketing: true, joinDate: "2024-07-31" },
                            { name: "황유진", phone: "010-8520-7410", quizCount: 36, points: 9800, marketing: false, joinDate: "2024-07-30" },
                            { name: "노현석", phone: "010-1472-5836", quizCount: 69, points: 19600, marketing: true, joinDate: "2024-07-29" },
                            { name: "문채원", phone: "010-9630-2581", quizCount: 43, points: 12000, marketing: true, joinDate: "2024-07-28" },
                            { name: "조민서", phone: "010-7410-8520", quizCount: 56, points: 15700, marketing: false, joinDate: "2024-07-27" },
                            { name: "김태윤", phone: "010-5836-1472", quizCount: 84, points: 24200, marketing: true, joinDate: "2024-07-26" },
                            { name: "이다은", phone: "010-2581-9630", quizCount: 31, points: 8300, marketing: false, joinDate: "2024-07-25" },
                            { name: "박성호", phone: "010-3691-4702", quizCount: 77, points: 22100, marketing: true, joinDate: "2024-07-24" },
                            { name: "최윤아", phone: "010-7418-5296", quizCount: 48, points: 13600, marketing: false, joinDate: "2024-07-23" },
                            { name: "정민규", phone: "010-8529-6741", quizCount: 62, points: 17500, marketing: true, joinDate: "2024-07-22" },
                            { name: "한승우", phone: "010-1593-8642", quizCount: 35, points: 9500, marketing: true, joinDate: "2024-07-21" },
                            { name: "송지윤", phone: "010-4826-1759", quizCount: 73, points: 20900, marketing: false, joinDate: "2024-07-20" },
                            { name: "배현준", phone: "010-7159-4826", quizCount: 26, points: 6900, marketing: true, joinDate: "2024-07-19" },
                            { name: "오수진", phone: "010-9482-6173", quizCount: 59, points: 16200, marketing: false, joinDate: "2024-07-18" },
                            { name: "임도현", phone: "010-6173-9482", quizCount: 87, points: 25800, marketing: true, joinDate: "2024-07-17" },
                            { name: "권민지", phone: "010-2847-5931", quizCount: 42, points: 11800, marketing: false, joinDate: "2024-07-16" },
                            { name: "유준서", phone: "010-5931-2847", quizCount: 68, points: 19100, marketing: true, joinDate: "2024-07-15" },
                            { name: "신재민", phone: "010-8374-6159", quizCount: 38, points: 10200, marketing: true, joinDate: "2024-07-14" },
                            { name: "고은지", phone: "010-6159-8374", quizCount: 55, points: 15300, marketing: false, joinDate: "2024-07-13" },
                            { name: "장도영", phone: "010-4716-9283", quizCount: 80, points: 23000, marketing: true, joinDate: "2024-07-12" },
                            { name: "홍예린", phone: "010-9283-4716", quizCount: 33, points: 8700, marketing: false, joinDate: "2024-07-11" },
                            { name: "강민준", phone: "010-5028-7394", quizCount: 74, points: 21300, marketing: true, joinDate: "2024-07-10" },
                            { name: "안소영", phone: "010-7394-5028", quizCount: 47, points: 13400, marketing: true, joinDate: "2024-07-09" },
                            { name: "조우진", phone: "010-1685-9372", quizCount: 61, points: 17000, marketing: false, joinDate: "2024-07-08" },
                            { name: "이서현", phone: "010-9372-1685", quizCount: 44, points: 12300, marketing: true, joinDate: "2024-07-07" },
                            { name: "박준혁", phone: "010-2739-6148", quizCount: 86, points: 25100, marketing: false, joinDate: "2024-07-06" },
                            { name: "김나영", phone: "010-6148-2739", quizCount: 37, points: 9900, marketing: true, joinDate: "2024-07-05" },
                            { name: "정시우", phone: "010-8461-3527", quizCount: 71, points: 20200, marketing: false, joinDate: "2024-07-04" },
                            { name: "한지수", phone: "010-3527-8461", quizCount: 49, points: 14000, marketing: true, joinDate: "2024-07-03" },
                            { name: "최원빈", phone: "010-5794-1628", quizCount: 83, points: 24700, marketing: true, joinDate: "2024-07-02" },
                            { name: "서예지", phone: "010-1628-5794", quizCount: 40, points: 11200, marketing: false, joinDate: "2024-07-01" }
                          ];

                          // 생성된 회원과 더미 회원 합치기 (최신순 정렬)
                          const allUsers = [...createdUsers, ...dummyUsers].sort((a, b) => 
                            new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime()
                          );

                          // 회원 필터링 함수
                          const filterUsers = () => {
                            return allUsers.filter((user: any) => {
                              // 날짜 필터링 (가입일 기준)
                              if (userStartDate || userEndDate) {
                                const userDate = new Date(user.joinDate);
                                const startDate = userStartDate ? new Date(userStartDate) : null;
                                const endDate = userEndDate ? new Date(userEndDate) : null;
                                
                                if (startDate && userDate < startDate) return false;
                                if (endDate && userDate > endDate) return false;
                              }
                              
                              // 키워드 검색 (이름, 전화번호)
                              if (userKeyword) {
                                const keyword = userKeyword.toLowerCase();
                                const name = user.name.toLowerCase();
                                const phone = user.phone.toLowerCase();
                                
                                if (!name.includes(keyword) && !phone.includes(keyword)) {
                                  return false;
                                }
                              }
                              
                              return true;
                            });
                          };

                          const filteredUsers = filterUsers();
                          
                          // 페이지네이션 로직
                          const startIndex = (currentPage - 1) * itemsPerPage;
                          const endIndex = startIndex + itemsPerPage;
                          const currentUsers = filteredUsers.slice(startIndex, endIndex);
                          
                          return currentUsers.map((user: any, index: number) => (
                            <tr key={index}>
                              <td
                                style={{
                                  padding: "12px 8px",
                                  textAlign: "center",
                                  borderRight: "1px solid #e5e7eb",
                                  borderBottom: "1px solid #e5e7eb",
                                  color: "#374151",
                                }}
                              >
                                {50 - (startIndex + index)}
                              </td>
                              <td
                                style={{
                                  padding: "12px 16px",
                                  textAlign: "left",
                                  borderRight: "1px solid #e5e7eb",
                                  borderBottom: "1px solid #e5e7eb",
                                  color: "#374151",
                                  fontWeight: "500",
                                }}
                              >
                                {user.name}
                              </td>
                              <td
                                style={{
                                  padding: "12px 16px",
                                  textAlign: "left",
                                  borderRight: "1px solid #e5e7eb",
                                  borderBottom: "1px solid #e5e7eb",
                                  color: "#374151",
                                }}
                              >
                                {user.phone}
                              </td>
                              <td
                                style={{
                                  padding: "12px 12px",
                                  textAlign: "center",
                                  borderRight: "1px solid #e5e7eb",
                                  borderBottom: "1px solid #e5e7eb",
                                  color: "#374151",
                                }}
                              >
                                {user.quizCount}회
                              </td>
                              <td
                                style={{
                                  padding: "12px 12px",
                                  textAlign: "center",
                                  borderRight: "1px solid #e5e7eb",
                                  borderBottom: "1px solid #e5e7eb",
                                  color: "#374151",
                                  fontWeight: "500",
                                }}
                              >
                                {user.points.toLocaleString()}P
                              </td>
                              <td
                                style={{
                                  padding: "12px 12px",
                                  textAlign: "center",
                                  borderRight: "1px solid #e5e7eb",
                                  borderBottom: "1px solid #e5e7eb",
                                }}
                              >
                                <span
                                  style={{
                                    display: "inline-block",
                                    padding: "4px 8px",
                                    borderRadius: "4px",
                                    fontSize: "12px",
                                    fontWeight: "500",
                                    backgroundColor: user.marketing ? "#dcfce7" : "#fee2e2",
                                    color: user.marketing ? "#166534" : "#991b1b",
                                  }}
                                >
                                  {user.marketing ? "동의" : "거부"}
                                </span>
                              </td>
                              <td
                                style={{
                                  padding: "12px 16px",
                                  textAlign: "center",
                                  borderRight: "1px solid #e5e7eb",
                                  borderBottom: "1px solid #e5e7eb",
                                  color: "#374151",
                                }}
                              >
                                {user.joinDate}
                              </td>
                              <td
                                style={{
                                  padding: "12px 12px",
                                  textAlign: "center",
                                  borderBottom: "1px solid #e5e7eb",
                                }}
                              >
                                <button
                                  style={{
                                    backgroundColor: "#f3f4f6",
                                    color: "#374151",
                                    border: "none",
                                    borderRadius: "4px",
                                    padding: "6px 12px",
                                    fontSize: "12px",
                                    fontWeight: "500",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "#e5e7eb";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "#f3f4f6";
                                  }}
                                  onClick={() => {
                                    // 수정할 사용자 정보 설정
                                    const userInCreated = createdUsers.findIndex(u => u.name === user.name && u.phone === user.phone);
                                    
                                    if (userInCreated !== -1) {
                                      // 생성된 사용자인 경우
                                      setEditingUserType("created");
                                      setEditingUserIndex(userInCreated);
                                      const targetUser = createdUsers[userInCreated];
                                      setEditUserName(targetUser.name);
                                      setEditUserPhone(targetUser.phone);
                                      setEditUserEmail(targetUser.email || "");
                                      setEditUserRole(targetUser.role || "일반");
                                      setEditUserMarketing(targetUser.marketing);
                                    } else {
                                      // 더미 사용자인 경우 (수정 불가)
                                      alert("더미 데이터는 수정할 수 없습니다. 실제 생성된 계정만 수정 가능합니다.");
                                      return;
                                    }
                                    
                                    setIsEditingUser(true);
                                  }}
                                >
                                  수정
                                </button>
                              </td>
                            </tr>
                          ));
                        })()}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* 페이지네이션 */}
                  {(() => {
                    // 회원 데이터 재정의 (페이지네이션에서 사용하기 위해)
                    const dummyUsersForPagination = [
                      { name: "김철수", phone: "010-1234-5678", quizCount: 45, points: 12500, marketing: true, joinDate: "2024-08-19" },
                      { name: "이영희", phone: "010-9876-5432", quizCount: 32, points: 8900, marketing: false, joinDate: "2024-08-18" },
                      { name: "박민수", phone: "010-5555-1234", quizCount: 67, points: 18750, marketing: true, joinDate: "2024-08-17" },
                      { name: "최지은", phone: "010-7777-8888", quizCount: 23, points: 6200, marketing: false, joinDate: "2024-08-16" },
                      { name: "정한별", phone: "010-1111-2222", quizCount: 89, points: 25400, marketing: true, joinDate: "2024-08-15" },
                      { name: "장미라", phone: "010-3333-4444", quizCount: 54, points: 14200, marketing: false, joinDate: "2024-08-14" },
                      { name: "윤동혁", phone: "010-5555-6666", quizCount: 76, points: 21800, marketing: true, joinDate: "2024-08-13" },
                      { name: "소민정", phone: "010-7777-9999", quizCount: 41, points: 11300, marketing: true, joinDate: "2024-08-12" },
                      { name: "강태현", phone: "010-2222-8888", quizCount: 29, points: 7650, marketing: false, joinDate: "2024-08-11" },
                      { name: "홍서영", phone: "010-9999-1111", quizCount: 63, points: 17200, marketing: true, joinDate: "2024-08-10" },
                      { name: "조현우", phone: "010-1122-3344", quizCount: 58, points: 16800, marketing: true, joinDate: "2024-08-09" },
                      { name: "신예은", phone: "010-5566-7788", quizCount: 34, points: 9200, marketing: false, joinDate: "2024-08-08" },
                      { name: "이준호", phone: "010-9900-1122", quizCount: 72, points: 20500, marketing: true, joinDate: "2024-08-07" },
                      { name: "김소연", phone: "010-3344-5566", quizCount: 46, points: 13100, marketing: false, joinDate: "2024-08-06" },
                      { name: "박지훈", phone: "010-7788-9900", quizCount: 81, points: 23600, marketing: true, joinDate: "2024-08-05" },
                      { name: "정수빈", phone: "010-1357-2468", quizCount: 27, points: 7200, marketing: false, joinDate: "2024-08-04" },
                      { name: "한민지", phone: "010-8642-9753", quizCount: 65, points: 18400, marketing: true, joinDate: "2024-08-03" },
                      { name: "서준영", phone: "010-2468-1357", quizCount: 39, points: 10700, marketing: true, joinDate: "2024-08-02" },
                      { name: "오나연", phone: "010-9753-8642", quizCount: 52, points: 14900, marketing: false, joinDate: "2024-08-01" },
                      { name: "임재욱", phone: "010-4679-1234", quizCount: 91, points: 27300, marketing: true, joinDate: "2024-07-31" },
                      { name: "황유진", phone: "010-8520-7410", quizCount: 36, points: 9800, marketing: false, joinDate: "2024-07-30" },
                      { name: "노현석", phone: "010-1472-5836", quizCount: 69, points: 19600, marketing: true, joinDate: "2024-07-29" },
                      { name: "문채원", phone: "010-9630-2581", quizCount: 43, points: 12000, marketing: true, joinDate: "2024-07-28" },
                      { name: "조민서", phone: "010-7410-8520", quizCount: 56, points: 15700, marketing: false, joinDate: "2024-07-27" },
                      { name: "김태윤", phone: "010-5836-1472", quizCount: 84, points: 24200, marketing: true, joinDate: "2024-07-26" },
                      { name: "이다은", phone: "010-2581-9630", quizCount: 31, points: 8300, marketing: false, joinDate: "2024-07-25" },
                      { name: "박성호", phone: "010-3691-4702", quizCount: 77, points: 22100, marketing: true, joinDate: "2024-07-24" },
                      { name: "최윤아", phone: "010-7418-5296", quizCount: 48, points: 13600, marketing: false, joinDate: "2024-07-23" },
                      { name: "정민규", phone: "010-8529-6741", quizCount: 62, points: 17500, marketing: true, joinDate: "2024-07-22" },
                      { name: "한승우", phone: "010-1593-8642", quizCount: 35, points: 9500, marketing: true, joinDate: "2024-07-21" },
                      { name: "송지윤", phone: "010-4826-1759", quizCount: 73, points: 20900, marketing: false, joinDate: "2024-07-20" },
                      { name: "배현준", phone: "010-7159-4826", quizCount: 26, points: 6900, marketing: true, joinDate: "2024-07-19" },
                      { name: "오수진", phone: "010-9482-6173", quizCount: 59, points: 16200, marketing: false, joinDate: "2024-07-18" },
                      { name: "임도현", phone: "010-6173-9482", quizCount: 87, points: 25800, marketing: true, joinDate: "2024-07-17" },
                      { name: "권민지", phone: "010-2847-5931", quizCount: 42, points: 11800, marketing: false, joinDate: "2024-07-16" },
                      { name: "유준서", phone: "010-5931-2847", quizCount: 68, points: 19100, marketing: true, joinDate: "2024-07-15" },
                      { name: "신재민", phone: "010-8374-6159", quizCount: 38, points: 10200, marketing: true, joinDate: "2024-07-14" },
                      { name: "고은지", phone: "010-6159-8374", quizCount: 55, points: 15300, marketing: false, joinDate: "2024-07-13" },
                      { name: "장도영", phone: "010-4716-9283", quizCount: 80, points: 23000, marketing: true, joinDate: "2024-07-12" },
                      { name: "김예린", phone: "010-9283-4716", quizCount: 44, points: 12400, marketing: false, joinDate: "2024-07-11" },
                      { name: "이동건", phone: "010-6159-2738", quizCount: 61, points: 16900, marketing: true, joinDate: "2024-07-10" },
                      { name: "박수지", phone: "010-2738-6159", quizCount: 33, points: 8800, marketing: true, joinDate: "2024-07-09" },
                      { name: "정하늘", phone: "010-4815-9627", quizCount: 75, points: 21300, marketing: false, joinDate: "2024-07-08" },
                      { name: "김민석", phone: "010-9627-4815", quizCount: 47, points: 13000, marketing: true, joinDate: "2024-07-07" },
                      { name: "이수연", phone: "010-7394-1582", quizCount: 66, points: 18600, marketing: false, joinDate: "2024-07-06" },
                      { name: "박준혁", phone: "010-1582-7394", quizCount: 28, points: 7400, marketing: true, joinDate: "2024-07-05" },
                      { name: "정시우", phone: "010-8461-3527", quizCount: 71, points: 20200, marketing: false, joinDate: "2024-07-04" },
                      { name: "한지수", phone: "010-3527-8461", quizCount: 49, points: 14000, marketing: true, joinDate: "2024-07-03" },
                      { name: "최원빈", phone: "010-5794-1628", quizCount: 83, points: 24700, marketing: true, joinDate: "2024-07-02" },
                      { name: "서예지", phone: "010-1628-5794", quizCount: 40, points: 11200, marketing: false, joinDate: "2024-07-01" }
                    ];

                    // 생성된 회원과 더미 회원 합치기 (최신순 정렬) - 페이지네이션용
                    const allUsersForPagination = [...createdUsers, ...dummyUsersForPagination].sort((a, b) => 
                      new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime()
                    );

                    // 필터링된 결과에 따라 페이지네이션 계산
                    const filterUsers = () => {
                      return allUsersForPagination.filter((user: any) => {
                        // 날짜 필터링 (가입일 기준)
                        if (userStartDate || userEndDate) {
                          const userDate = new Date(user.joinDate);
                          const startDate = userStartDate ? new Date(userStartDate) : null;
                          const endDate = userEndDate ? new Date(userEndDate) : null;
                          
                          if (startDate && userDate < startDate) return false;
                          if (endDate && userDate > endDate) return false;
                        }
                        
                        // 키워드 검색 (이름, 전화번호)
                        if (userKeyword) {
                          const keyword = userKeyword.toLowerCase();
                          const name = user.name.toLowerCase();
                          const phone = user.phone.toLowerCase();
                          
                          if (!name.includes(keyword) && !phone.includes(keyword)) {
                            return false;
                          }
                        }
                        
                        return true;
                      });
                    };
                    
                    const filteredUsers = filterUsers();
                    const totalUsers = filteredUsers.length;
                    const totalPages = Math.ceil(totalUsers / itemsPerPage);
                    
                    return (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          marginTop: "24px",
                          marginBottom: "24px",
                          gap: "8px",
                          padding: "0",
                        }}
                      >
                        <button
                          style={{
                            padding: "8px 12px",
                            border: "1px solid #d1d5db",
                            backgroundColor: currentPage === 1 ? "#f3f4f6" : "white",
                            color: currentPage === 1 ? "#9ca3af" : "#374151",
                            borderRadius: "4px",
                            fontSize: "14px",
                            cursor: currentPage === 1 ? "not-allowed" : "pointer",
                          }}
                          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          이전
                        </button>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                          <button
                            key={pageNumber}
                            style={{
                              padding: "8px 12px",
                              border: currentPage === pageNumber ? "1px solid #F97316" : "1px solid #d1d5db",
                              backgroundColor: currentPage === pageNumber ? "#F97316" : "white",
                              color: currentPage === pageNumber ? "white" : "#374151",
                              borderRadius: "4px",
                              fontSize: "14px",
                              cursor: "pointer",
                            }}
                            onClick={() => setCurrentPage(pageNumber)}
                          >
                            {pageNumber}
                          </button>
                        ))}
                        
                        <button
                          style={{
                            padding: "8px 12px",
                            border: "1px solid #d1d5db",
                            backgroundColor: currentPage === totalPages ? "#f3f4f6" : "white",
                            color: currentPage === totalPages ? "#9ca3af" : "#374151",
                            borderRadius: "4px",
                            fontSize: "14px",
                            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                          }}
                          onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          다음
                        </button>
                      </div>
                    );
                  })()}
                </div>
              </>
            )}

            {isCreatingAccount && (
              <>
                {/* Header Section */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "32px",
                  }}
                >
                  <h1
                    style={{
                      fontSize: "32px",
                      fontWeight: "bold",
                      color: "#1f2937",
                      margin: 0,
                    }}
                  >
                    계정 생성
                  </h1>
                  <button
                    onClick={() => {
                      updateIsCreatingAccount(false);
                      updateActiveMenu("회원 관리");
                      setNewAccountId("");
                      setNewAccountPassword("");
                      setNewAccountName("");
                      setNewAccountEmail("");
                      setNewAccountPhone("");
                      setNewAccountRole("일반");
                    }}
                    style={{
                      backgroundColor: "#6b7280",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      padding: "12px 24px",
                      fontSize: "16px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#4b5563";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#6b7280";
                    }}
                  >
                    회원 관리로 돌아가기
                  </button>
                </div>

                {/* 계정 생성 폼 */}
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    padding: "32px",
                    border: "1px solid #f3f4f6",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      
                      // 유효성 검사
                      if (!newAccountId || !newAccountPassword || !newAccountName || !newAccountEmail || !newAccountPhone) {
                        alert("모든 필수 항목을 입력해주세요.");
                        return;
                      }

                      // 아이디 중복 검사 (간단한 예시)
                      const existingUser = createdUsers.find(user => user.id === newAccountId);
                      if (existingUser) {
                        alert("이미 존재하는 아이디입니다.");
                        return;
                      }

                      // 이메일 형식 검사
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      if (!emailRegex.test(newAccountEmail)) {
                        alert("올바른 이메일 형식을 입력해주세요.");
                        return;
                      }

                      // 전화번호 형식 검사
                      const phoneRegex = /^010-\d{4}-\d{4}$/;
                      if (!phoneRegex.test(newAccountPhone)) {
                        alert("전화번호는 010-0000-0000 형식으로 입력해주세요.");
                        return;
                      }

                      // 새 계정 생성
                      const newUser = {
                        id: newAccountId,
                        name: newAccountName,
                        phone: newAccountPhone,
                        email: newAccountEmail,
                        role: newAccountRole,
                        quizCount: 0,
                        points: 0,
                        marketing: false,
                        joinDate: new Date().toISOString().split('T')[0]
                      };

                      setCreatedUsers(prev => [newUser, ...prev]);
                      
                      alert(`${newAccountName}님의 계정이 성공적으로 생성되었습니다!`);
                      updateIsCreatingAccount(false);
                      updateActiveMenu("회원 관리");
                      setNewAccountId("");
                      setNewAccountPassword("");
                      setNewAccountName("");
                      setNewAccountEmail("");
                      setNewAccountPhone("");
                      setNewAccountRole("일반");
                    }}
                    style={{ display: "flex", flexDirection: "column", gap: "24px" }}
                  >
                    <h2
                      style={{
                        fontSize: "20px",
                        fontWeight: "600",
                        color: "#374151",
                        marginBottom: "8px",
                      }}
                    >
                      기본 정보
                    </h2>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                      {/* 아이디 */}
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "#374151",
                            marginBottom: "8px",
                          }}
                        >
                          아이디 *
                        </label>
                        <input
                          type="text"
                          value={newAccountId}
                          onChange={(e) => setNewAccountId(e.target.value)}
                          placeholder="사용자 아이디를 입력하세요"
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            border: "1px solid #d1d5db",
                            borderRadius: "8px",
                            fontSize: "14px",
                            color: "#374151",
                            backgroundColor: "white",
                          }}
                          required
                        />
                      </div>

                      {/* 비밀번호 */}
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "#374151",
                            marginBottom: "8px",
                          }}
                        >
                          비밀번호 *
                        </label>
                        <input
                          type="password"
                          value={newAccountPassword}
                          onChange={(e) => setNewAccountPassword(e.target.value)}
                          placeholder="비밀번호를 입력하세요"
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            border: "1px solid #d1d5db",
                            borderRadius: "8px",
                            fontSize: "14px",
                            color: "#374151",
                            backgroundColor: "white",
                          }}
                          required
                        />
                      </div>

                      {/* 이름 */}
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "#374151",
                            marginBottom: "8px",
                          }}
                        >
                          이름 *
                        </label>
                        <input
                          type="text"
                          value={newAccountName}
                          onChange={(e) => setNewAccountName(e.target.value)}
                          placeholder="사용자 이름을 입력하세요"
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            border: "1px solid #d1d5db",
                            borderRadius: "8px",
                            fontSize: "14px",
                            color: "#374151",
                            backgroundColor: "white",
                          }}
                          required
                        />
                      </div>

                      {/* 권한 */}
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "#374151",
                            marginBottom: "8px",
                          }}
                        >
                          권한
                        </label>
                        <select
                          value={newAccountRole}
                          onChange={(e) => setNewAccountRole(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            border: "1px solid #d1d5db",
                            borderRadius: "8px",
                            fontSize: "14px",
                            color: "#374151",
                            backgroundColor: "white",
                            cursor: "pointer",
                          }}
                        >
                          <option value="일반">일반</option>
                          <option value="VIP">VIP</option>
                          <option value="관리자">관리자</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                      {/* 이메일 */}
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "#374151",
                            marginBottom: "8px",
                          }}
                        >
                          이메일 *
                        </label>
                        <input
                          type="email"
                          value={newAccountEmail}
                          onChange={(e) => setNewAccountEmail(e.target.value)}
                          placeholder="example@email.com"
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            border: "1px solid #d1d5db",
                            borderRadius: "8px",
                            fontSize: "14px",
                            color: "#374151",
                            backgroundColor: "white",
                          }}
                          required
                        />
                      </div>

                      {/* 전화번호 */}
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "#374151",
                            marginBottom: "8px",
                          }}
                        >
                          전화번호 *
                        </label>
                        <input
                          type="tel"
                          value={newAccountPhone}
                          onChange={(e) => setNewAccountPhone(e.target.value)}
                          placeholder="010-0000-0000"
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            border: "1px solid #d1d5db",
                            borderRadius: "8px",
                            fontSize: "14px",
                            color: "#374151",
                            backgroundColor: "white",
                          }}
                          required
                        />
                      </div>
                    </div>

                    {/* 버튼 영역 */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "12px",
                        marginTop: "24px",
                        paddingTop: "24px",
                        borderTop: "1px solid #f3f4f6",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          updateIsCreatingAccount(false);
                          updateActiveMenu("회원 관리");
                          setNewAccountId("");
                          setNewAccountPassword("");
                          setNewAccountName("");
                          setNewAccountEmail("");
                          setNewAccountPhone("");
                          setNewAccountRole("일반");
                        }}
                        style={{
                          backgroundColor: "#6b7280",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          padding: "12px 24px",
                          fontSize: "14px",
                          fontWeight: "500",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                      >
                        취소
                      </button>
                      <button
                        type="submit"
                        style={{
                          backgroundColor: "#F97316",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          padding: "12px 24px",
                          fontSize: "14px",
                          fontWeight: "500",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                      >
                        계정 생성
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}

            {isEditingUser && (
              <>
                {/* Header Section */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "32px",
                  }}
                >
                  <h1
                    style={{
                      fontSize: "32px",
                      fontWeight: "bold",
                      color: "#1f2937",
                      margin: 0,
                    }}
                  >
                    회원 정보 수정
                  </h1>
                  <button
                    onClick={() => {
                      updateIsEditingUser(false);
                      updateActiveMenu("회원 관리");
                      setEditingUserIndex(-1);
                      setEditUserName("");
                      setEditUserPhone("");
                      setEditUserEmail("");
                      setEditUserRole("일반");
                      setEditUserMarketing(false);
                    }}
                    style={{
                      backgroundColor: "#6b7280",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      padding: "12px 24px",
                      fontSize: "16px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#4b5563";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#6b7280";
                    }}
                  >
                    회원 관리로 돌아가기
                  </button>
                </div>

                {/* 회원 수정 폼 */}
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    padding: "32px",
                    border: "1px solid #f3f4f6",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      
                      // 유효성 검사
                      if (!editUserName || !editUserPhone) {
                        alert("이름과 전화번호는 필수 항목입니다.");
                        return;
                      }

                      // 이메일 형식 검사 (입력된 경우에만)
                      if (editUserEmail) {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(editUserEmail)) {
                          alert("올바른 이메일 형식을 입력해주세요.");
                          return;
                        }
                      }

                      // 전화번호 형식 검사
                      const phoneRegex = /^010-\d{4}-\d{4}$/;
                      if (!phoneRegex.test(editUserPhone)) {
                        alert("전화번호는 010-0000-0000 형식으로 입력해주세요.");
                        return;
                      }

                      if (editingUserType === "created" && editingUserIndex !== -1) {
                        // 생성된 사용자 정보 수정
                        const updatedUsers = [...createdUsers];
                        updatedUsers[editingUserIndex] = {
                          ...updatedUsers[editingUserIndex],
                          name: editUserName,
                          phone: editUserPhone,
                          email: editUserEmail,
                          role: editUserRole,
                          marketing: editUserMarketing
                        };
                        setCreatedUsers(updatedUsers);
                        
                        alert(`${editUserName}님의 정보가 성공적으로 수정되었습니다!`);
                        updateIsEditingUser(false);
                        updateActiveMenu("회원 관리");
                        setEditingUserIndex(-1);
                        setEditUserName("");
                        setEditUserPhone("");
                        setEditUserEmail("");
                        setEditUserRole("일반");
                        setEditUserMarketing(false);
                      }
                    }}
                    style={{ display: "flex", flexDirection: "column", gap: "24px" }}
                  >
                    <h2
                      style={{
                        fontSize: "20px",
                        fontWeight: "600",
                        color: "#374151",
                        marginBottom: "8px",
                      }}
                    >
                      회원 정보
                    </h2>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                      {/* 이름 */}
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "#374151",
                            marginBottom: "8px",
                          }}
                        >
                          이름 *
                        </label>
                        <input
                          type="text"
                          value={editUserName}
                          onChange={(e) => setEditUserName(e.target.value)}
                          placeholder="회원 이름을 입력하세요"
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            border: "1px solid #d1d5db",
                            borderRadius: "8px",
                            fontSize: "14px",
                            color: "#374151",
                            backgroundColor: "white",
                          }}
                          required
                        />
                      </div>

                      {/* 권한 */}
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "#374151",
                            marginBottom: "8px",
                          }}
                        >
                          권한
                        </label>
                        <select
                          value={editUserRole}
                          onChange={(e) => setEditUserRole(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            border: "1px solid #d1d5db",
                            borderRadius: "8px",
                            fontSize: "14px",
                            color: "#374151",
                            backgroundColor: "white",
                            cursor: "pointer",
                          }}
                        >
                          <option value="일반">일반</option>
                          <option value="VIP">VIP</option>
                          <option value="관리자">관리자</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                      {/* 이메일 */}
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "#374151",
                            marginBottom: "8px",
                          }}
                        >
                          이메일
                        </label>
                        <input
                          type="email"
                          value={editUserEmail}
                          onChange={(e) => setEditUserEmail(e.target.value)}
                          placeholder="example@email.com"
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            border: "1px solid #d1d5db",
                            borderRadius: "8px",
                            fontSize: "14px",
                            color: "#374151",
                            backgroundColor: "white",
                          }}
                        />
                      </div>

                      {/* 전화번호 */}
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "#374151",
                            marginBottom: "8px",
                          }}
                        >
                          전화번호 *
                        </label>
                        <input
                          type="tel"
                          value={editUserPhone}
                          onChange={(e) => setEditUserPhone(e.target.value)}
                          placeholder="010-0000-0000"
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            border: "1px solid #d1d5db",
                            borderRadius: "8px",
                            fontSize: "14px",
                            color: "#374151",
                            backgroundColor: "white",
                          }}
                          required
                        />
                      </div>
                    </div>

                    {/* 마케팅 동의 */}
                    <div>
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={editUserMarketing}
                          onChange={(e) => setEditUserMarketing(e.target.checked)}
                          style={{
                            width: "16px",
                            height: "16px",
                            cursor: "pointer",
                          }}
                        />
                        <span
                          style={{
                            fontSize: "14px",
                            color: "#374151",
                          }}
                        >
                          마케팅 정보 수신 동의
                        </span>
                      </label>
                    </div>

                    {/* 버튼 영역 */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "12px",
                        marginTop: "24px",
                        paddingTop: "24px",
                        borderTop: "1px solid #f3f4f6",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          updateIsEditingUser(false);
                          updateActiveMenu("회원 관리");
                          setEditingUserIndex(-1);
                          setEditUserName("");
                          setEditUserPhone("");
                          setEditUserEmail("");
                          setEditUserRole("일반");
                          setEditUserMarketing(false);
                        }}
                        style={{
                          backgroundColor: "#6b7280",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          padding: "12px 24px",
                          fontSize: "14px",
                          fontWeight: "500",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                      >
                        취소
                      </button>
                      <button
                        type="submit"
                        style={{
                          backgroundColor: "#F97316",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          padding: "12px 24px",
                          fontSize: "14px",
                          fontWeight: "500",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                      >
                        정보 수정
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}

            {activeMenu === "상품 관리" && !isRegisteringProduct && (
              <>
                {/* Header Section */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "32px",
                  }}
                >
                  <h1
                    style={{
                      fontSize: "32px",
                      fontWeight: "bold",
                      color: "#1f2937",
                      margin: 0,
                    }}
                  >
                    상품 관리
                  </h1>
                  <button
                    onClick={() => setIsRegisteringProduct(true)}
                    style={{
                      backgroundColor: "#F97316",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      padding: "8px 16px",
                      fontSize: "14px",
                      fontWeight: "500",
                      cursor: "pointer",
                      boxShadow: "0 2px 4px rgba(249, 115, 22, 0.15)",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#EA580C";
                      e.currentTarget.style.transform = "translateY(-1px)";
                      e.currentTarget.style.boxShadow = "0 4px 8px rgba(249, 115, 22, 0.25)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#F97316";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 2px 4px rgba(249, 115, 22, 0.15)";
                    }}
                  >
                    상품 등록
                  </button>
                </div>

                {/* 상품 관리 필터 */}
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    padding: "24px",
                    border: "1px solid #f3f4f6",
                    marginBottom: "24px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    }}
                  >
                    {/* First row - 등록일 */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        justifyContent: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#374151",
                          minWidth: "60px",
                        }}
                      >
                        등록일
                      </div>
                      <input
                        type="text"
                        placeholder="시작일"
                        value={productStartDate}
                        onChange={(e) => setProductStartDate(e.target.value)}
                        onFocus={(e) => {
                          e.target.type = "date";
                          e.target.showPicker?.();
                        }}
                        onBlur={(e) => {
                          if (!e.target.value) {
                            e.target.type = "text";
                          }
                        }}
                        style={{
                          width: "150px",
                          padding: "8px 12px",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          fontSize: "14px",
                          color: "#374151",
                          backgroundColor: "white",
                        }}
                      />
                      <input
                        type="text"
                        placeholder="종료일"
                        value={productEndDate}
                        onChange={(e) => setProductEndDate(e.target.value)}
                        onFocus={(e) => {
                          e.target.type = "date";
                          e.target.showPicker?.();
                        }}
                        onBlur={(e) => {
                          if (!e.target.value) {
                            e.target.type = "text";
                          }
                        }}
                        style={{
                          width: "150px",
                          padding: "8px 12px",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          fontSize: "14px",
                          color: "#374151",
                          backgroundColor: "white",
                        }}
                      />
                    </div>

                    {/* Second row - 키워드, 검색창, 검색 버튼 */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        justifyContent: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#374151",
                          minWidth: "60px",
                        }}
                      >
                        키워드
                      </div>
                      <input
                        type="text"
                        placeholder="상품명, 카테고리 검색"
                        value={productKeyword}
                        onChange={(e) => setProductKeyword(e.target.value)}
                        style={{
                          width: "300px",
                          padding: "8px 12px",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          fontSize: "14px",
                          color: "#374151",
                          backgroundColor: "white",
                        }}
                      />
                      <button
                        onClick={() => {
                          // 검색 로직은 실시간으로 적용됨
                        }}
                        style={{
                          backgroundColor: "#3b82f6",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          padding: "8px 16px",
                          fontSize: "14px",
                          fontWeight: "500",
                          cursor: "pointer",
                          minWidth: "60px",
                        }}
                      >
                        검색
                      </button>
                    </div>
                  </div>
                </div>

                {/* 상품 통계 카드 */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "20px",
                    marginBottom: "32px",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#F8F8F8",
                      borderRadius: "12px",
                      padding: "24px",
                      border: "1px solid #f3f4f6",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>
                      전체 상품
                    </div>
                    <div style={{ fontSize: "28px", fontWeight: "bold", color: "#1f2937" }}>
                      45
                    </div>
                  </div>
                  <div
                    style={{
                      backgroundColor: "#F8F8F8",
                      borderRadius: "12px",
                      padding: "24px",
                      border: "1px solid #f3f4f6",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>
                      판매 중
                    </div>
                    <div style={{ fontSize: "28px", fontWeight: "bold", color: "#059669" }}>
                      32
                    </div>
                  </div>
                  <div
                    style={{
                      backgroundColor: "#F8F8F8",
                      borderRadius: "12px",
                      padding: "24px",
                      border: "1px solid #f3f4f6",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>
                      품절
                    </div>
                    <div style={{ fontSize: "28px", fontWeight: "bold", color: "#dc2626" }}>
                      8
                    </div>
                  </div>
                  <div
                    style={{
                      backgroundColor: "#F8F8F8",
                      borderRadius: "12px",
                      padding: "24px",
                      border: "1px solid #f3f4f6",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>
                      비활성
                    </div>
                    <div style={{ fontSize: "28px", fontWeight: "bold", color: "#9ca3af" }}>
                      5
                    </div>
                  </div>
                </div>
                
                {/* 상품 리스트 */}
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    border: "1px solid #f3f4f6",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: "20px 24px",
                      borderBottom: "1px solid #f3f4f6",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1f2937", margin: 0 }}>
                      상품 목록
                    </h2>
                  </div>
                  
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr>
                          <th style={{ backgroundColor: "#f8f9fa", padding: "12px 16px", textAlign: "center", fontWeight: "600", color: "#374151", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                            번호
                          </th>
                          <th style={{ backgroundColor: "#f8f9fa", padding: "12px 16px", textAlign: "center", fontWeight: "600", color: "#374151", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                            상품명
                          </th>
                          <th style={{ backgroundColor: "#f8f9fa", padding: "12px 16px", textAlign: "center", fontWeight: "600", color: "#374151", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                            카테고리
                          </th>
                          <th style={{ backgroundColor: "#f8f9fa", padding: "12px 16px", textAlign: "center", fontWeight: "600", color: "#374151", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                            가격(포인트)
                          </th>
                          <th style={{ backgroundColor: "#f8f9fa", padding: "12px 16px", textAlign: "center", fontWeight: "600", color: "#374151", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                            재고
                          </th>
                          <th style={{ backgroundColor: "#f8f9fa", padding: "12px 16px", textAlign: "center", fontWeight: "600", color: "#374151", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                            판매량
                          </th>
                          <th style={{ backgroundColor: "#f8f9fa", padding: "12px 16px", textAlign: "center", fontWeight: "600", color: "#374151", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                            상태
                          </th>
                          <th style={{ backgroundColor: "#f8f9fa", padding: "12px 16px", textAlign: "center", fontWeight: "600", color: "#374151", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                            등록일
                          </th>
                          <th style={{ backgroundColor: "#f8f9fa", padding: "12px 12px", textAlign: "center", fontWeight: "600", color: "#374151", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                            관리
                          </th>
                        </tr>
                      </thead>
                      
                      <tbody>
                        {(() => {
                          // 필터링 로직 적용
                          const filteredProducts = products.filter(product => {
                            // 날짜 필터링
                            if (productStartDate && product.registerDate < productStartDate) {
                              return false;
                            }
                            if (productEndDate && product.registerDate > productEndDate) {
                              return false;
                            }
                            
                            // 키워드 검색 (상품명, 카테고리)
                            if (productKeyword) {
                              const keyword = productKeyword.toLowerCase();
                              return product.name.toLowerCase().includes(keyword) || 
                                     product.category.toLowerCase().includes(keyword);
                            }
                            
                            return true;
                          });
                          
                          const startIndex = (currentPage - 1) * itemsPerPage;
                          const endIndex = startIndex + itemsPerPage;
                          const currentProducts = filteredProducts.slice(startIndex, endIndex);
                          
                          return currentProducts.map((product, index) => (
                            <tr key={index}>
                              <td style={{ padding: "12px 8px", textAlign: "center", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                                {filteredProducts.length - (startIndex + index)}
                              </td>
                              <td style={{ padding: "12px 16px", textAlign: "left", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                                {product.name}
                              </td>
                              <td style={{ padding: "12px 16px", textAlign: "center", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                                {product.category}
                              </td>
                              <td style={{ padding: "12px 16px", textAlign: "right", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                                {product.price.toLocaleString()}P
                              </td>
                              <td style={{ padding: "12px 16px", textAlign: "center", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                                {product.stock}개
                              </td>
                              <td style={{ padding: "12px 16px", textAlign: "center", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                                {product.sales}개
                              </td>
                              <td style={{ padding: "12px 16px", textAlign: "center", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                                <span style={{ 
                                  padding: "4px 8px", 
                                  borderRadius: "12px", 
                                  fontSize: "12px", 
                                  fontWeight: "500",
                                  backgroundColor: product.status === "판매중" ? "#dcfce7" : product.status === "품절" ? "#fee2e2" : "#f3f4f6",
                                  color: product.status === "판매중" ? "#166534" : product.status === "품절" ? "#dc2626" : "#6b7280"
                                }}>
                                  {product.status}
                                </span>
                              </td>
                              <td style={{ padding: "12px 16px", textAlign: "center", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                                {product.registerDate}
                              </td>
                              <td style={{ padding: "12px 12px", textAlign: "center", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                                <button 
                                  onClick={() => handleEditProduct(product, startIndex + index)}
                                  style={{ padding: "4px 8px", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "4px", fontSize: "12px", cursor: "pointer", marginRight: "4px" }}
                                >
                                  수정
                                </button>
                                <button 
                                  onClick={() => handleDeleteProduct(startIndex + index)}
                                  style={{ padding: "4px 8px", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}
                                >
                                  삭제
                                </button>
                              </td>
                            </tr>
                          ));
                        })()}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* 페이지네이션 */}
                  <div style={{ display: "flex", justifyContent: "center", padding: "20px", borderTop: "1px solid #f3f4f6" }}>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <button style={{ padding: "8px 12px", border: "1px solid #d1d5db", backgroundColor: currentPage === 1 ? "#f3f4f6" : "white", color: currentPage === 1 ? "#9ca3af" : "#374151", borderRadius: "4px", fontSize: "14px", cursor: currentPage === 1 ? "not-allowed" : "pointer" }}>
                        이전
                      </button>
                      {[1, 2].map((pageNumber) => (
                        <button key={pageNumber} style={{ padding: "8px 12px", border: currentPage === pageNumber ? "1px solid #F97316" : "1px solid #d1d5db", backgroundColor: currentPage === pageNumber ? "#F97316" : "white", color: currentPage === pageNumber ? "white" : "#374151", borderRadius: "4px", fontSize: "14px", cursor: "pointer" }}>
                          {pageNumber}
                        </button>
                      ))}
                      <button style={{ padding: "8px 12px", border: "1px solid #d1d5db", backgroundColor: currentPage === 2 ? "#f3f4f6" : "white", color: currentPage === 2 ? "#9ca3af" : "#374151", borderRadius: "4px", fontSize: "14px", cursor: currentPage === 2 ? "not-allowed" : "pointer" }}>
                        다음
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeMenu === "상품 관리" && isRegisteringProduct && (
              <>
                {/* Header Section */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "32px",
                  }}
                >
                  <h1
                    style={{
                      fontSize: "32px",
                      fontWeight: "bold",
                      color: "#1f2937",
                      margin: 0,
                    }}
                  >
                    {isEditingProduct ? "상품 수정" : "상품 등록"}
                  </h1>
                  <button
                    onClick={resetProductForm}
                    style={{
                      backgroundColor: "#6b7280",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      padding: "8px 16px",
                      fontSize: "14px",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    목록으로
                  </button>
                </div>

                {/* 상품 등록 폼 */}
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    border: "1px solid #f3f4f6",
                    padding: "32px",
                  }}
                >
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!productName.trim() || !productPrice.trim() || !productStock.trim()) {
                        alert("모든 필드를 입력해주세요.");
                        return;
                      }
                      
                      const price = parseInt(productPrice);
                      const stock = parseInt(productStock);
                      
                      if (isNaN(price) || price <= 0) {
                        alert("올바른 가격을 입력해주세요.");
                        return;
                      }
                      
                      if (isNaN(stock) || stock < 0) {
                        alert("올바른 재고량을 입력해주세요.");
                        return;
                      }
                      
                      const today = new Date();
                      const dateString = today.getFullYear() + "-" + 
                        String(today.getMonth() + 1).padStart(2, '0') + "-" + 
                        String(today.getDate()).padStart(2, '0');
                      
                      const newProduct = {
                        id: Date.now(),
                        name: productName,
                        category: productCategory,
                        price: price,
                        stock: stock,
                        sales: 0,
                        status: stock > 0 ? "판매중" : "품절",
                        registerDate: dateString,
                        image: productImagePreview
                      };
                      
                      setProducts([newProduct, ...products]);
                      setIsRegisteringProduct(false);
                      setProductName("");
                      setProductCategory("부스터");
                      setProductPrice("");
                      setProductStock("");
                      setProductImage(null);
                      setProductImagePreview("");
                      
                      alert("상품이 등록되었습니다.");
                    }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "24px",
                    }}
                  >
                    {/* 카테고리 선택 */}
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#374151",
                          marginBottom: "8px",
                        }}
                      >
                        카테고리
                      </label>
                      <select
                        value={productCategory}
                        onChange={(e) => setProductCategory(e.target.value)}
                        style={{
                          width: "200px",
                          padding: "12px 16px",
                          border: "1px solid #d1d5db",
                          borderRadius: "8px",
                          fontSize: "14px",
                          color: "#374151",
                          backgroundColor: "white",
                        }}
                      >
                        <option value="부스터">부스터</option>
                        <option value="무기">무기</option>
                        <option value="스킨">스킨</option>
                        <option value="소모품">소모품</option>
                        <option value="펫">펫</option>
                        <option value="강화">강화</option>
                        <option value="방어구">방어구</option>
                        <option value="마운트">마운트</option>
                        <option value="액세서리">액세서리</option>
                        <option value="캐릭터">캐릭터</option>
                        <option value="멤버십">멤버십</option>
                        <option value="패키지">패키지</option>
                      </select>
                    </div>

                    {/* 상품명 입력 */}
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#374151",
                          marginBottom: "8px",
                        }}
                      >
                        상품명
                      </label>
                      <input
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="상품명을 입력해주세요"
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          border: "1px solid #d1d5db",
                          borderRadius: "8px",
                          fontSize: "14px",
                          color: "#374151",
                          backgroundColor: "white",
                        }}
                      />
                    </div>

                    {/* 상품 이미지 업로드 */}
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#374151",
                          marginBottom: "8px",
                        }}
                      >
                        상품 이미지
                      </label>
                      <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
                        {/* 이미지 업로드 영역 */}
                        <div style={{ flex: 1 }}>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setProductImage(file);
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                  setProductImagePreview(e.target?.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            style={{
                              width: "100%",
                              padding: "12px 16px",
                              border: "2px dashed #d1d5db",
                              borderRadius: "8px",
                              fontSize: "14px",
                              color: "#374151",
                              backgroundColor: "#f9fafb",
                              cursor: "pointer",
                            }}
                          />
                          <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "8px", margin: "8px 0 0 0" }}>
                            JPG, PNG, GIF 파일을 업로드하세요 (최대 5MB)
                          </p>
                        </div>
                        
                        {/* 이미지 미리보기 */}
                        {productImagePreview && (
                          <div style={{ width: "120px", height: "120px", position: "relative" }}>
                            <img
                              src={productImagePreview}
                              alt="상품 미리보기"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: "8px",
                                border: "1px solid #e5e7eb"
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setProductImage(null);
                                setProductImagePreview("");
                              }}
                              style={{
                                position: "absolute",
                                top: "-8px",
                                right: "-8px",
                                width: "24px",
                                height: "24px",
                                borderRadius: "50%",
                                backgroundColor: "#ef4444",
                                color: "white",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "12px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              }}
                            >
                              ×
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 가격과 재고 */}
                    <div style={{ display: "flex", gap: "24px" }}>
                      <div style={{ flex: 1 }}>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#374151",
                            marginBottom: "8px",
                          }}
                        >
                          가격 (포인트)
                        </label>
                        <input
                          type="number"
                          value={productPrice}
                          onChange={(e) => setProductPrice(e.target.value)}
                          placeholder="가격을 입력해주세요"
                          min="1"
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            border: "1px solid #d1d5db",
                            borderRadius: "8px",
                            fontSize: "14px",
                            color: "#374151",
                            backgroundColor: "white",
                          }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#374151",
                            marginBottom: "8px",
                          }}
                        >
                          재고량
                        </label>
                        <input
                          type="number"
                          value={productStock}
                          onChange={(e) => setProductStock(e.target.value)}
                          placeholder="재고량을 입력해주세요"
                          min="0"
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            border: "1px solid #d1d5db",
                            borderRadius: "8px",
                            fontSize: "14px",
                            color: "#374151",
                            backgroundColor: "white",
                          }}
                        />
                      </div>
                    </div>

                    {/* 버튼 영역 */}
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        justifyContent: "flex-end",
                        paddingTop: "16px",
                        borderTop: "1px solid #f3f4f6",
                      }}
                    >
                      <button
                        type="button"
                        onClick={resetProductForm}
                        style={{
                          backgroundColor: "#f3f4f6",
                          color: "#374151",
                          border: "none",
                          borderRadius: "8px",
                          padding: "10px 20px",
                          fontSize: "14px",
                          fontWeight: "500",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                      >
                        취소
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveProduct}
                        style={{
                          backgroundColor: "#F97316",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          padding: "10px 20px",
                          fontSize: "14px",
                          fontWeight: "500",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {isEditingProduct ? "수정하기" : "등록하기"}
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}

            {activeMenu === "구매 내역" && (
              <>
                {/* Header Section */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "32px",
                  }}
                >
                  <h1
                    style={{
                      fontSize: "32px",
                      fontWeight: "bold",
                      color: "#1f2937",
                      margin: 0,
                    }}
                  >
                    구매 내역
                  </h1>
                </div>

                {/* 구매 내역 필터 */}
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    padding: "24px",
                    border: "1px solid #f3f4f6",
                    marginBottom: "24px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    }}
                  >
                    {/* First row - 구매일 */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        justifyContent: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#374151",
                          minWidth: "60px",
                        }}
                      >
                        구매일
                      </div>
                      <input
                        type="text"
                        placeholder="시작일"
                        value={purchaseStartDate}
                        onChange={(e) => setPurchaseStartDate(e.target.value)}
                        onFocus={(e) => {
                          e.target.type = "date";
                          e.target.showPicker?.();
                        }}
                        onBlur={(e) => {
                          if (!e.target.value) {
                            e.target.type = "text";
                          }
                        }}
                        style={{
                          width: "150px",
                          padding: "8px 12px",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          fontSize: "14px",
                          color: "#374151",
                          backgroundColor: "white",
                        }}
                      />
                      <input
                        type="text"
                        placeholder="종료일"
                        value={purchaseEndDate}
                        onChange={(e) => setPurchaseEndDate(e.target.value)}
                        onFocus={(e) => {
                          e.target.type = "date";
                          e.target.showPicker?.();
                        }}
                        onBlur={(e) => {
                          if (!e.target.value) {
                            e.target.type = "text";
                          }
                        }}
                        style={{
                          width: "150px",
                          padding: "8px 12px",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          fontSize: "14px",
                          color: "#374151",
                          backgroundColor: "white",
                        }}
                      />
                    </div>

                    {/* Second row - 키워드, 검색창, 검색 버튼 */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        justifyContent: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#374151",
                          minWidth: "60px",
                        }}
                      >
                        키워드
                      </div>
                      <input
                        type="text"
                        placeholder="구매자명, 상품명 검색"
                        value={purchaseKeyword}
                        onChange={(e) => setPurchaseKeyword(e.target.value)}
                        style={{
                          width: "300px",
                          padding: "8px 12px",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          fontSize: "14px",
                          color: "#374151",
                          backgroundColor: "white",
                        }}
                      />
                      <button
                        onClick={() => {
                          // 검색 로직은 실시간으로 적용됨
                        }}
                        style={{
                          backgroundColor: "#3b82f6",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          padding: "8px 16px",
                          fontSize: "14px",
                          fontWeight: "500",
                          cursor: "pointer",
                          minWidth: "60px",
                        }}
                      >
                        검색
                      </button>
                    </div>
                  </div>
                </div>

                {/* 구매 통계 카드 */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "20px",
                    marginBottom: "32px",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#F8F8F8",
                      borderRadius: "12px",
                      padding: "24px",
                      border: "1px solid #f3f4f6",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>
                      총 구매건수
                    </div>
                    <div style={{ fontSize: "28px", fontWeight: "bold", color: "#1f2937" }}>
                      1,248
                    </div>
                  </div>
                  <div
                    style={{
                      backgroundColor: "#F8F8F8",
                      borderRadius: "12px",
                      padding: "24px",
                      border: "1px solid #f3f4f6",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>
                      사용된 포인트
                    </div>
                    <div style={{ fontSize: "28px", fontWeight: "bold", color: "#dc2626" }}>
                      156,720P
                    </div>
                  </div>
                  <div
                    style={{
                      backgroundColor: "#F8F8F8",
                      borderRadius: "12px",
                      padding: "24px",
                      border: "1px solid #f3f4f6",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>
                      오늘 구매건수
                    </div>
                    <div style={{ fontSize: "28px", fontWeight: "bold", color: "#059669" }}>
                      23
                    </div>
                  </div>
                  <div
                    style={{
                      backgroundColor: "#F8F8F8",
                      borderRadius: "12px",
                      padding: "24px",
                      border: "1px solid #f3f4f6",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>
                      인기상품
                    </div>
                    <div style={{ fontSize: "18px", fontWeight: "bold", color: "#1f2937" }}>
                      경험치 부스터
                    </div>
                  </div>
                </div>
                
                {/* 구매 내역 리스트 */}
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    border: "1px solid #f3f4f6",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: "20px 24px",
                      borderBottom: "1px solid #f3f4f6",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1f2937", margin: 0 }}>
                      최근 구매 내역
                    </h2>
                  </div>
                  
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr>
                          <th style={{ backgroundColor: "#f8f9fa", padding: "12px 16px", textAlign: "center", fontWeight: "600", color: "#374151", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                            번호
                          </th>
                          <th style={{ backgroundColor: "#f8f9fa", padding: "12px 16px", textAlign: "center", fontWeight: "600", color: "#374151", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                            구매자
                          </th>
                          <th style={{ backgroundColor: "#f8f9fa", padding: "12px 16px", textAlign: "center", fontWeight: "600", color: "#374151", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                            상품명
                          </th>
                          <th style={{ backgroundColor: "#f8f9fa", padding: "12px 16px", textAlign: "center", fontWeight: "600", color: "#374151", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                            수량
                          </th>
                          <th style={{ backgroundColor: "#f8f9fa", padding: "12px 16px", textAlign: "center", fontWeight: "600", color: "#374151", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                            사용 포인트
                          </th>
                          <th style={{ backgroundColor: "#f8f9fa", padding: "12px 16px", textAlign: "center", fontWeight: "600", color: "#374151", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                            상태
                          </th>
                          <th style={{ backgroundColor: "#f8f9fa", padding: "12px 16px", textAlign: "center", fontWeight: "600", color: "#374151", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                            구매일시
                          </th>
                          <th style={{ backgroundColor: "#f8f9fa", padding: "12px 12px", textAlign: "center", fontWeight: "600", color: "#374151", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                            관리
                          </th>
                        </tr>
                      </thead>
                      
                      <tbody>
                        {(() => {
                          
                          // 필터링 로직 적용
                          const filteredPurchases = purchases.filter(purchase => {
                            // 날짜 필터링 (구매일시에서 날짜 부분만 추출)
                            const purchaseDate = purchase.purchaseDate.split(' ')[0];
                            if (purchaseStartDate && purchaseDate < purchaseStartDate) {
                              return false;
                            }
                            if (purchaseEndDate && purchaseDate > purchaseEndDate) {
                              return false;
                            }
                            
                            // 키워드 검색 (구매자명, 상품명)
                            if (purchaseKeyword) {
                              const keyword = purchaseKeyword.toLowerCase();
                              return purchase.buyer.toLowerCase().includes(keyword) || 
                                     purchase.product.toLowerCase().includes(keyword);
                            }
                            
                            return true;
                          });
                          
                          const startIndex = (currentPage - 1) * itemsPerPage;
                          const endIndex = startIndex + itemsPerPage;
                          const currentPurchases = filteredPurchases.slice(startIndex, endIndex);
                          
                          return currentPurchases.map((purchase, index) => (
                            <tr key={index}>
                              <td style={{ padding: "12px 8px", textAlign: "center", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                                {filteredPurchases.length - (startIndex + index)}
                              </td>
                              <td style={{ padding: "12px 16px", textAlign: "center", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                                {purchase.buyer}
                              </td>
                              <td style={{ padding: "12px 16px", textAlign: "left", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                                {purchase.product}
                              </td>
                              <td style={{ padding: "12px 16px", textAlign: "center", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                                {purchase.quantity}개
                              </td>
                              <td style={{ padding: "12px 16px", textAlign: "right", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                                {purchase.points.toLocaleString()}P
                              </td>
                              <td style={{ padding: "12px 16px", textAlign: "center", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                                <span style={{ 
                                  padding: "4px 8px", 
                                  borderRadius: "12px", 
                                  fontSize: "12px", 
                                  fontWeight: "500",
                                  backgroundColor: purchase.status === "완료" ? "#dcfce7" : "#fee2e2",
                                  color: purchase.status === "완료" ? "#166534" : "#dc2626"
                                }}>
                                  {purchase.status}
                                </span>
                              </td>
                              <td style={{ padding: "12px 16px", textAlign: "center", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                                {purchase.purchaseDate}
                              </td>
                              <td style={{ padding: "12px 12px", textAlign: "center", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                                <button 
                                  onClick={() => handleViewPurchaseDetail(purchase, startIndex + index)}
                                  style={{ padding: "4px 8px", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "4px", fontSize: "12px", cursor: "pointer", marginRight: "4px" }}
                                >
                                  상세
                                </button>
                                {purchase.status === "완료" && (
                                  <button 
                                    onClick={() => handleCancelPurchase(purchase, startIndex + index)}
                                    style={{ padding: "4px 8px", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}
                                  >
                                    취소
                                  </button>
                                )}
                              </td>
                            </tr>
                          ));
                        })()}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* 페이지네이션 */}
                  <div style={{ display: "flex", justifyContent: "center", padding: "20px", borderTop: "1px solid #f3f4f6" }}>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <button style={{ padding: "8px 12px", border: "1px solid #d1d5db", backgroundColor: currentPage === 1 ? "#f3f4f6" : "white", color: currentPage === 1 ? "#9ca3af" : "#374151", borderRadius: "4px", fontSize: "14px", cursor: currentPage === 1 ? "not-allowed" : "pointer" }}>
                        이전
                      </button>
                      {[1, 2, 3].map((pageNumber) => (
                        <button key={pageNumber} style={{ padding: "8px 12px", border: currentPage === pageNumber ? "1px solid #F97316" : "1px solid #d1d5db", backgroundColor: currentPage === pageNumber ? "#F97316" : "white", color: currentPage === pageNumber ? "white" : "#374151", borderRadius: "4px", fontSize: "14px", cursor: "pointer" }}>
                          {pageNumber}
                        </button>
                      ))}
                      <button style={{ padding: "8px 12px", border: "1px solid #d1d5db", backgroundColor: currentPage === 3 ? "#f3f4f6" : "white", color: currentPage === 3 ? "#9ca3af" : "#374151", borderRadius: "4px", fontSize: "14px", cursor: currentPage === 3 ? "not-allowed" : "pointer" }}>
                        다음
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* 구매 상세 모달 */}
            {showPurchaseDetail && selectedPurchase && (
              <div style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000
              }}>
                <div style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  padding: "32px",
                  width: "90%",
                  maxWidth: "800px",
                  maxHeight: "90vh",
                  overflowY: "auto",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}>
                  {/* 모달 헤더 */}
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "24px",
                    paddingBottom: "16px",
                    borderBottom: "1px solid #e5e7eb"
                  }}>
                    <h2 style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#1f2937",
                      margin: 0
                    }}>
                      구매 상세 정보
                    </h2>
                    <button
                      onClick={closePurchaseDetail}
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        fontSize: "24px",
                        cursor: "pointer",
                        color: "#6b7280",
                        padding: "4px"
                      }}
                    >
                      ×
                    </button>
                  </div>

                  {/* 기본 구매 정보 */}
                  <div style={{ marginBottom: "24px" }}>
                    <h3 style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "16px"
                    }}>
                      기본 정보
                    </h3>
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "16px",
                      backgroundColor: "#f9fafb",
                      padding: "16px",
                      borderRadius: "8px"
                    }}>
                      <div>
                        <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>구매자</div>
                        <div style={{ fontSize: "16px", fontWeight: "500", color: "#1f2937" }}>{selectedPurchase.buyer}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>상품명</div>
                        <div style={{ fontSize: "16px", fontWeight: "500", color: "#1f2937" }}>{selectedPurchase.product}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>수량</div>
                        <div style={{ fontSize: "16px", fontWeight: "500", color: "#1f2937" }}>{selectedPurchase.quantity}개</div>
                      </div>
                      <div>
                        <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>결제 포인트</div>
                        <div style={{ fontSize: "16px", fontWeight: "500", color: "#1f2937" }}>{selectedPurchase.points.toLocaleString()}P</div>
                      </div>
                      <div>
                        <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>구매일시</div>
                        <div style={{ fontSize: "16px", fontWeight: "500", color: "#1f2937" }}>{selectedPurchase.purchaseDate}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>상태</div>
                        <span style={{
                          padding: "4px 8px",
                          borderRadius: "12px",
                          fontSize: "14px",
                          fontWeight: "500",
                          backgroundColor: selectedPurchase.status === "완료" ? "#dcfce7" : "#fee2e2",
                          color: selectedPurchase.status === "완료" ? "#166534" : "#dc2626"
                        }}>
                          {selectedPurchase.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 구매자 정보 */}
                  <div style={{ marginBottom: "24px" }}>
                    <h3 style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "16px"
                    }}>
                      구매자 정보
                    </h3>
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "16px",
                      backgroundColor: "#f9fafb",
                      padding: "16px",
                      borderRadius: "8px"
                    }}>
                      <div>
                        <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>사용자 ID</div>
                        <div style={{ fontSize: "16px", fontWeight: "500", color: "#1f2937" }}>{selectedPurchase.buyerInfo?.userId}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>이메일</div>
                        <div style={{ fontSize: "16px", fontWeight: "500", color: "#1f2937" }}>{selectedPurchase.buyerInfo?.email}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>연락처</div>
                        <div style={{ fontSize: "16px", fontWeight: "500", color: "#1f2937" }}>{selectedPurchase.buyerInfo?.phone}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>레벨</div>
                        <div style={{ fontSize: "16px", fontWeight: "500", color: "#1f2937" }}>Lv. {selectedPurchase.buyerInfo?.level}</div>
                      </div>
                    </div>
                  </div>

                  {/* 상품 정보 */}
                  <div style={{ marginBottom: "24px" }}>
                    <h3 style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "16px"
                    }}>
                      상품 정보
                    </h3>
                    <div style={{
                      backgroundColor: "#f9fafb",
                      padding: "16px",
                      borderRadius: "8px"
                    }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                        <div>
                          <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>상품 ID</div>
                          <div style={{ fontSize: "16px", fontWeight: "500", color: "#1f2937" }}>{selectedPurchase.productInfo?.productId}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>카테고리</div>
                          <div style={{ fontSize: "16px", fontWeight: "500", color: "#1f2937" }}>{selectedPurchase.productInfo?.category}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>효과 지속시간</div>
                          <div style={{ fontSize: "16px", fontWeight: "500", color: "#1f2937" }}>{selectedPurchase.productInfo?.effectDuration}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>등급</div>
                          <div style={{ fontSize: "16px", fontWeight: "500", color: "#1f2937" }}>{selectedPurchase.productInfo?.rarity}</div>
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>상품 설명</div>
                        <div style={{ fontSize: "16px", color: "#1f2937" }}>{selectedPurchase.productInfo?.description}</div>
                      </div>
                    </div>
                  </div>

                  {/* 거래 정보 */}
                  <div style={{ marginBottom: "24px" }}>
                    <h3 style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "16px"
                    }}>
                      거래 정보
                    </h3>
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "16px",
                      backgroundColor: "#f9fafb",
                      padding: "16px",
                      borderRadius: "8px"
                    }}>
                      <div>
                        <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>거래 ID</div>
                        <div style={{ fontSize: "16px", fontWeight: "500", color: "#1f2937" }}>{selectedPurchase.transactionInfo?.transactionId}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>결제 방법</div>
                        <div style={{ fontSize: "16px", fontWeight: "500", color: "#1f2937" }}>{selectedPurchase.paymentMethod}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>구매 전 포인트</div>
                        <div style={{ fontSize: "16px", fontWeight: "500", color: "#1f2937" }}>{selectedPurchase.transactionInfo?.beforePoints?.toLocaleString()}P</div>
                      </div>
                      <div>
                        <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>구매 후 포인트</div>
                        <div style={{ fontSize: "16px", fontWeight: "500", color: "#1f2937" }}>{selectedPurchase.transactionInfo?.afterPoints?.toLocaleString()}P</div>
                      </div>
                    </div>
                  </div>

                  {/* 닫기 버튼 */}
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <button
                      onClick={closePurchaseDetail}
                      style={{
                        backgroundColor: "#6b7280",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        padding: "12px 24px",
                        fontSize: "14px",
                        fontWeight: "500",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#4b5563";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#6b7280";
                      }}
                    >
                      닫기
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 구매 취소 확인 모달 */}
            {showCancelModal && cancelingPurchase && (
              <div style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1001
              }}>
                <div style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  padding: "32px",
                  width: "90%",
                  maxWidth: "500px",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}>
                  {/* 모달 헤더 */}
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "24px",
                    paddingBottom: "16px",
                    borderBottom: "1px solid #e5e7eb"
                  }}>
                    <h2 style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: "#dc2626",
                      margin: 0
                    }}>
                      구매 취소 확인
                    </h2>
                    <button
                      onClick={closeCancelModal}
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        fontSize: "24px",
                        cursor: "pointer",
                        color: "#6b7280",
                        padding: "4px"
                      }}
                    >
                      ×
                    </button>
                  </div>

                  {/* 취소할 구매 정보 */}
                  <div style={{
                    backgroundColor: "#fef2f2",
                    padding: "16px",
                    borderRadius: "8px",
                    marginBottom: "24px",
                    border: "1px solid #fecaca"
                  }}>
                    <h3 style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#991b1b",
                      marginBottom: "12px"
                    }}>
                      취소할 구매 정보
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>구매자</div>
                        <div style={{ fontSize: "16px", fontWeight: "500", color: "#1f2937" }}>{cancelingPurchase.buyer}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>상품명</div>
                        <div style={{ fontSize: "16px", fontWeight: "500", color: "#1f2937" }}>{cancelingPurchase.product}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>수량</div>
                        <div style={{ fontSize: "16px", fontWeight: "500", color: "#1f2937" }}>{cancelingPurchase.quantity}개</div>
                      </div>
                      <div>
                        <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>결제 포인트</div>
                        <div style={{ fontSize: "16px", fontWeight: "500", color: "#1f2937" }}>{cancelingPurchase.points.toLocaleString()}P</div>
                      </div>
                    </div>
                  </div>

                  {/* 취소 사유 입력 */}
                  <div style={{ marginBottom: "24px" }}>
                    <label style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#374151",
                      marginBottom: "8px"
                    }}>
                      취소 사유 <span style={{ color: "#dc2626" }}>*</span>
                    </label>
                    <textarea
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      placeholder="구매 취소 사유를 입력해주세요..."
                      style={{
                        width: "100%",
                        minHeight: "100px",
                        padding: "12px",
                        border: "1px solid #d1d5db",
                        borderRadius: "8px",
                        fontSize: "14px",
                        resize: "vertical",
                        fontFamily: "inherit"
                      }}
                    />
                  </div>

                  {/* 경고 메시지 */}
                  <div style={{
                    backgroundColor: "#fef3c7",
                    padding: "12px",
                    borderRadius: "8px",
                    marginBottom: "24px",
                    border: "1px solid #fbbf24"
                  }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#92400e"
                    }}>
                      <span style={{ marginRight: "8px", fontSize: "16px" }}>⚠️</span>
                      구매를 취소하면 사용된 포인트가 구매자에게 환불됩니다. 이 작업은 되돌릴 수 없습니다.
                    </div>
                  </div>

                  {/* 버튼 영역 */}
                  <div style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "12px"
                  }}>
                    <button
                      onClick={closeCancelModal}
                      style={{
                        backgroundColor: "#f3f4f6",
                        color: "#374151",
                        border: "none",
                        borderRadius: "8px",
                        padding: "12px 20px",
                        fontSize: "14px",
                        fontWeight: "500",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#e5e7eb";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#f3f4f6";
                      }}
                    >
                      취소
                    </button>
                    <button
                      onClick={confirmCancelPurchase}
                      style={{
                        backgroundColor: "#dc2626",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        padding: "12px 20px",
                        fontSize: "14px",
                        fontWeight: "500",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#b91c1c";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#dc2626";
                      }}
                    >
                      구매 취소
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeMenu === "문의사항" && !isViewingInquiry && !isAnsweringInquiry && (
              <>
                {/* Header Section */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "32px",
                  }}
                >
                  <h1
                    style={{
                      fontSize: "32px",
                      fontWeight: "bold",
                      color: "#1f2937",
                      margin: 0,
                    }}
                  >
                    문의사항
                  </h1>
                </div>

                {/* 문의사항 필터 */}
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    padding: "24px",
                    border: "1px solid #f3f4f6",
                    marginBottom: "24px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    }}
                  >
                    {/* First row - 문의일 */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        justifyContent: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#374151",
                          minWidth: "60px",
                        }}
                      >
                        문의일
                      </div>
                      <input
                        type="text"
                        placeholder="시작일"
                        value={inquiryStartDate}
                        onChange={(e) => setInquiryStartDate(e.target.value)}
                        onFocus={(e) => {
                          e.target.type = "date";
                          e.target.showPicker?.();
                        }}
                        onBlur={(e) => {
                          if (!e.target.value) {
                            e.target.type = "text";
                          }
                        }}
                        style={{
                          width: "150px",
                          padding: "8px 12px",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          fontSize: "14px",
                          color: "#374151",
                          backgroundColor: "white",
                        }}
                      />
                      <input
                        type="text"
                        placeholder="종료일"
                        value={inquiryEndDate}
                        onChange={(e) => setInquiryEndDate(e.target.value)}
                        onFocus={(e) => {
                          e.target.type = "date";
                          e.target.showPicker?.();
                        }}
                        onBlur={(e) => {
                          if (!e.target.value) {
                            e.target.type = "text";
                          }
                        }}
                        style={{
                          width: "150px",
                          padding: "8px 12px",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          fontSize: "14px",
                          color: "#374151",
                          backgroundColor: "white",
                        }}
                      />
                    </div>
                    {/* Second row - 키워드, 검색창, 검색 버튼 */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        justifyContent: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#374151",
                          minWidth: "60px",
                        }}
                      >
                        키워드
                      </div>
                      <input
                        type="text"
                        placeholder="제목, 내용 검색"
                        value={inquiryKeyword}
                        onChange={(e) => setInquiryKeyword(e.target.value)}
                        style={{
                          width: "300px",
                          padding: "8px 12px",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          fontSize: "14px",
                          color: "#374151",
                          backgroundColor: "white",
                        }}
                      />
                      <button
                        style={{
                          backgroundColor: "#F97316",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          padding: "8px 16px",
                          fontSize: "14px",
                          fontWeight: "500",
                          cursor: "pointer",
                          minWidth: "60px",
                        }}
                      >
                        검색
                      </button>
                    </div>
                  </div>
                </div>

                {/* 문의 통계 카드 */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "20px",
                    marginBottom: "32px",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#F8F8F8",
                      borderRadius: "12px",
                      padding: "24px",
                      border: "1px solid #f3f4f6",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>
                      전체 문의
                    </div>
                    <div style={{ fontSize: "28px", fontWeight: "bold", color: "#1f2937" }}>
                      152
                    </div>
                  </div>
                  <div
                    style={{
                      backgroundColor: "#F8F8F8",
                      borderRadius: "12px",
                      padding: "24px",
                      border: "1px solid #f3f4f6",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>
                      답변 대기
                    </div>
                    <div style={{ fontSize: "28px", fontWeight: "bold", color: "#dc2626" }}>
                      23
                    </div>
                  </div>
                  <div
                    style={{
                      backgroundColor: "#F8F8F8",
                      borderRadius: "12px",
                      padding: "24px",
                      border: "1px solid #f3f4f6",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>
                      답변 완료
                    </div>
                    <div style={{ fontSize: "28px", fontWeight: "bold", color: "#059669" }}>
                      129
                    </div>
                  </div>
                  <div
                    style={{
                      backgroundColor: "#F8F8F8",
                      borderRadius: "12px",
                      padding: "24px",
                      border: "1px solid #f3f4f6",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>
                      오늘 문의
                    </div>
                    <div style={{ fontSize: "28px", fontWeight: "bold", color: "#1f2937" }}>
                      8
                    </div>
                  </div>
                </div>
                
                {/* 문의 리스트 */}
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    border: "1px solid #f3f4f6",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: "20px 24px",
                      borderBottom: "1px solid #f3f4f6",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1f2937", margin: 0 }}>
                      최근 문의사항
                    </h2>
                  </div>
                  
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr>
                          <th style={{ backgroundColor: "#f8f9fa", padding: "12px 16px", textAlign: "center", fontWeight: "600", color: "#374151", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                            번호
                          </th>
                          <th style={{ backgroundColor: "#f8f9fa", padding: "12px 16px", textAlign: "center", fontWeight: "600", color: "#374151", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                            문의자
                          </th>
                          <th style={{ backgroundColor: "#f8f9fa", padding: "12px 16px", textAlign: "center", fontWeight: "600", color: "#374151", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                            카테고리
                          </th>
                          <th style={{ backgroundColor: "#f8f9fa", padding: "12px 16px", textAlign: "center", fontWeight: "600", color: "#374151", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                            제목
                          </th>
                          <th style={{ backgroundColor: "#f8f9fa", padding: "12px 16px", textAlign: "center", fontWeight: "600", color: "#374151", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                            상태
                          </th>
                          <th style={{ backgroundColor: "#f8f9fa", padding: "12px 16px", textAlign: "center", fontWeight: "600", color: "#374151", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                            문의일시
                          </th>
                          <th style={{ backgroundColor: "#f8f9fa", padding: "12px 12px", textAlign: "center", fontWeight: "600", color: "#374151", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                            관리
                          </th>
                        </tr>
                      </thead>
                      
                      <tbody>
                        {(() => {
                          // 실제 문의사항 데이터와 더미 데이터 통합
                          const staticInquiries = inquiries.length > 0 ? [] : [
                            { inquirer: "김철수", category: "게임 오류", title: "로그인이 안되요", status: "답변대기", inquiryDate: "2024-08-19 14:23" },
                            { inquirer: "이영희", category: "결제 문의", title: "포인트 결제 취소 문의", status: "답변완료", inquiryDate: "2024-08-19 13:45" },
                            { inquirer: "박민수", category: "계정 문의", title: "비밀번호 변경 방법", status: "답변완료", inquiryDate: "2024-08-19 12:18" },
                            { inquirer: "최지은", category: "아이템 문의", title: "아이템이 사라졌어요", status: "답변대기", inquiryDate: "2024-08-19 11:32" },
                            { inquirer: "정한별", category: "게임 오류", title: "퀘스트 진행이 안됩니다", status: "답변완료", inquiryDate: "2024-08-19 10:55" }
                          ];
                          
                          // 실제 inquiries 상태와 정적 데이터를 결합하되, inquiries의 데이터 구조에 맞춤
                          const displayInquiries = [
                            ...inquiries.map(inq => ({
                              inquirer: inq.user,
                              category: inq.category,
                              title: inq.title,
                              status: inq.status,
                              inquiryDate: inq.createDate,
                              // 원본 데이터도 포함
                              id: inq.id,
                              user: inq.user,
                              content: inq.content,
                              answer: inq.answer,
                              createDate: inq.createDate
                            })),
                            ...staticInquiries
                          ];
                          
                          // 필터링 로직 적용
                          const filteredInquiries = displayInquiries.filter(inquiry => {
                            // 날짜 필터링 (문의일시에서 날짜 부분만 추출)
                            const inquiryDate = inquiry.inquiryDate.split(' ')[0];
                            if (inquiryStartDate && inquiryDate < inquiryStartDate) {
                              return false;
                            }
                            if (inquiryEndDate && inquiryDate > inquiryEndDate) {
                              return false;
                            }
                            
                            // 키워드 검색 (제목, 내용, 문의자명)
                            if (inquiryKeyword) {
                              const keyword = inquiryKeyword.toLowerCase();
                              const titleMatch = inquiry.title.toLowerCase().includes(keyword);
                              const inquirerMatch = inquiry.inquirer.toLowerCase().includes(keyword);
                              // content가 있는 경우만 검색 (실제 문의사항 데이터)
                              const contentMatch = (inquiry as any).content ? (inquiry as any).content.toLowerCase().includes(keyword) : false;
                              return titleMatch || inquirerMatch || contentMatch;
                            }
                            
                            return true;
                          });
                          
                          const startIndex = (currentPage - 1) * itemsPerPage;
                          const endIndex = startIndex + itemsPerPage;
                          const currentInquiries = filteredInquiries.slice(startIndex, endIndex);
                          
                          return currentInquiries.map((inquiry, index) => (
                            <tr key={index}>
                              <td style={{ padding: "12px 8px", textAlign: "center", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                                {filteredInquiries.length - (startIndex + index)}
                              </td>
                              <td style={{ padding: "12px 16px", textAlign: "center", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                                {inquiry.inquirer}
                              </td>
                              <td style={{ padding: "12px 16px", textAlign: "center", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                                {inquiry.category}
                              </td>
                              <td style={{ padding: "12px 16px", textAlign: "left", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                                {inquiry.title}
                              </td>
                              <td style={{ padding: "12px 16px", textAlign: "center", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                                <span style={{ 
                                  padding: "4px 8px", 
                                  borderRadius: "12px", 
                                  fontSize: "12px", 
                                  fontWeight: "500",
                                  backgroundColor: inquiry.status === "답변완료" || inquiry.status === "답변 완료" ? "#dcfce7" : 
                                                   inquiry.status === "답변대기" || inquiry.status === "대기중" ? "#fecaca" : "#fef3c7",
                                  color: inquiry.status === "답변완료" || inquiry.status === "답변 완료" ? "#166534" : 
                                         inquiry.status === "답변대기" || inquiry.status === "대기중" ? "#dc2626" : "#d97706"
                                }}>
                                  {inquiry.status}
                                </span>
                              </td>
                              <td style={{ padding: "12px 16px", textAlign: "center", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                                {inquiry.inquiryDate}
                              </td>
                              <td style={{ padding: "12px 12px", textAlign: "center", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                                <button 
                                  onClick={() => {
                                    const realIndex = (inquiry as any).id ? inquiries.findIndex(inq => inq.id === (inquiry as any).id) : -1;
                                    if (realIndex !== -1) {
                                      setSelectedInquiryIndex(realIndex);
                                      setAnswerContent((inquiry as any).answer || inquiries[realIndex]?.answer || "");
                                      setIsAnsweringInquiry(true);
                                    }
                                  }}
                                  style={{ padding: "4px 8px", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "4px", fontSize: "12px", cursor: "pointer", marginRight: "4px" }}
                                >
                                  답변
                                </button>
                                <button 
                                  onClick={() => {
                                    const realIndex = (inquiry as any).id ? inquiries.findIndex(inq => inq.id === (inquiry as any).id) : -1;
                                    if (realIndex !== -1) {
                                      setSelectedInquiryIndex(realIndex);
                                      setIsViewingInquiry(true);
                                    }
                                  }}
                                  style={{ padding: "4px 8px", backgroundColor: "#6b7280", color: "white", border: "none", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}
                                >
                                  상세
                                </button>
                              </td>
                            </tr>
                          ));
                        })()}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* 페이지네이션 */}
                  <div style={{ display: "flex", justifyContent: "center", padding: "20px", borderTop: "1px solid #f3f4f6" }}>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <button style={{ padding: "8px 12px", border: "1px solid #d1d5db", backgroundColor: currentPage === 1 ? "#f3f4f6" : "white", color: currentPage === 1 ? "#9ca3af" : "#374151", borderRadius: "4px", fontSize: "14px", cursor: currentPage === 1 ? "not-allowed" : "pointer" }}>
                        이전
                      </button>
                      {[1, 2].map((pageNumber) => (
                        <button key={pageNumber} style={{ padding: "8px 12px", border: currentPage === pageNumber ? "1px solid #F97316" : "1px solid #d1d5db", backgroundColor: currentPage === pageNumber ? "#F97316" : "white", color: currentPage === pageNumber ? "white" : "#374151", borderRadius: "4px", fontSize: "14px", cursor: "pointer" }}>
                          {pageNumber}
                        </button>
                      ))}
                      <button style={{ padding: "8px 12px", border: "1px solid #d1d5db", backgroundColor: currentPage === 2 ? "#f3f4f6" : "white", color: currentPage === 2 ? "#9ca3af" : "#374151", borderRadius: "4px", fontSize: "14px", cursor: currentPage === 2 ? "not-allowed" : "pointer" }}>
                        다음
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* 문의사항 상세보기 화면 */}
            {activeMenu === "문의사항" && isViewingInquiry && (
              <>
                {/* Header Section */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "32px",
                  }}
                >
                  <h1
                    style={{
                      fontSize: "32px",
                      fontWeight: "bold",
                      color: "#1f2937",
                      margin: 0,
                    }}
                  >
                    문의사항 상세보기
                  </h1>
                  <button
                    onClick={() => {
                      setIsViewingInquiry(false);
                      setSelectedInquiryIndex(-1);
                    }}
                    style={{
                      backgroundColor: "#6b7280",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      padding: "8px 16px",
                      fontSize: "14px",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    목록으로
                  </button>
                </div>

                {/* 문의사항 상세 내용 */}
                {selectedInquiryIndex >= 0 && inquiries[selectedInquiryIndex] && (
                  <div
                    style={{
                      backgroundColor: "white",
                      borderRadius: "12px",
                      border: "1px solid #f3f4f6",
                      padding: "32px",
                    }}
                  >
                    {/* 문의 정보 */}
                    <div style={{ marginBottom: "32px" }}>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "120px 1fr",
                          gap: "16px",
                          marginBottom: "16px",
                        }}
                      >
                        <div style={{ fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                          제목:
                        </div>
                        <div style={{ fontSize: "14px", color: "#1f2937" }}>
                          {inquiries[selectedInquiryIndex].title}
                        </div>
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "120px 1fr",
                          gap: "16px",
                          marginBottom: "16px",
                        }}
                      >
                        <div style={{ fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                          문의자:
                        </div>
                        <div style={{ fontSize: "14px", color: "#1f2937" }}>
                          {inquiries[selectedInquiryIndex].user}
                        </div>
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "120px 1fr",
                          gap: "16px",
                          marginBottom: "16px",
                        }}
                      >
                        <div style={{ fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                          카테고리:
                        </div>
                        <div style={{ fontSize: "14px", color: "#1f2937" }}>
                          {inquiries[selectedInquiryIndex].category}
                        </div>
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "120px 1fr",
                          gap: "16px",
                          marginBottom: "16px",
                        }}
                      >
                        <div style={{ fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                          상태:
                        </div>
                        <div style={{ fontSize: "14px" }}>
                          <span
                            style={{
                              padding: "4px 8px",
                              borderRadius: "12px",
                              fontSize: "12px",
                              fontWeight: "500",
                              backgroundColor: inquiries[selectedInquiryIndex].status === "답변 완료" ? "#dcfce7" : "#fef3c7",
                              color: inquiries[selectedInquiryIndex].status === "답변 완료" ? "#166534" : "#d97706"
                            }}
                          >
                            {inquiries[selectedInquiryIndex].status}
                          </span>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "120px 1fr",
                          gap: "16px",
                          marginBottom: "16px",
                        }}
                      >
                        <div style={{ fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                          문의일:
                        </div>
                        <div style={{ fontSize: "14px", color: "#1f2937" }}>
                          {inquiries[selectedInquiryIndex].createDate}
                        </div>
                      </div>
                    </div>

                    {/* 문의 내용 */}
                    <div style={{ marginBottom: "32px" }}>
                      <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1f2937", marginBottom: "16px" }}>
                        문의 내용
                      </h3>
                      <div
                        style={{
                          backgroundColor: "#f9fafb",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          padding: "16px",
                          fontSize: "14px",
                          color: "#374151",
                          lineHeight: "1.6",
                          minHeight: "100px",
                        }}
                      >
                        {inquiries[selectedInquiryIndex].content}
                      </div>
                    </div>

                    {/* 답변 내용 */}
                    {inquiries[selectedInquiryIndex].answer && (
                      <div>
                        <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1f2937", marginBottom: "16px" }}>
                          답변 내용
                        </h3>
                        <div
                          style={{
                            backgroundColor: "#f0f9ff",
                            border: "1px solid #bae6fd",
                            borderRadius: "8px",
                            padding: "16px",
                            fontSize: "14px",
                            color: "#374151",
                            lineHeight: "1.6",
                            minHeight: "100px",
                          }}
                        >
                          {inquiries[selectedInquiryIndex].answer}
                        </div>
                      </div>
                    )}

                    {/* 답변하기 버튼 */}
                    <div style={{ paddingTop: "32px", textAlign: "right" }}>
                      <button
                        onClick={() => {
                          setAnswerContent(inquiries[selectedInquiryIndex].answer || "");
                          setIsViewingInquiry(false);
                          setIsAnsweringInquiry(true);
                        }}
                        style={{
                          backgroundColor: "#3b82f6",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          padding: "12px 24px",
                          fontSize: "16px",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                      >
                        답변하기
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* 문의사항 답변 화면 */}
            {activeMenu === "문의사항" && isAnsweringInquiry && (
              <>
                {/* Header Section */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "32px",
                  }}
                >
                  <h1
                    style={{
                      fontSize: "32px",
                      fontWeight: "bold",
                      color: "#1f2937",
                      margin: 0,
                    }}
                  >
                    문의사항 답변
                  </h1>
                  <button
                    onClick={() => {
                      setIsAnsweringInquiry(false);
                      setSelectedInquiryIndex(-1);
                      setAnswerContent("");
                    }}
                    style={{
                      backgroundColor: "#6b7280",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      padding: "8px 16px",
                      fontSize: "14px",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    목록으로
                  </button>
                </div>

                {/* 답변 작성 폼 */}
                {selectedInquiryIndex >= 0 && inquiries[selectedInquiryIndex] && (
                  <div
                    style={{
                      backgroundColor: "white",
                      borderRadius: "12px",
                      border: "1px solid #f3f4f6",
                      padding: "32px",
                    }}
                  >
                    {/* 문의 요약 정보 */}
                    <div style={{ backgroundColor: "#f9fafb", borderRadius: "8px", padding: "20px", marginBottom: "32px" }}>
                      <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1f2937", marginBottom: "12px" }}>
                        문의 내용
                      </h3>
                      <div style={{ fontSize: "14px", color: "#374151", marginBottom: "8px" }}>
                        <strong>제목:</strong> {inquiries[selectedInquiryIndex].title}
                      </div>
                      <div style={{ fontSize: "14px", color: "#374151", marginBottom: "8px" }}>
                        <strong>문의자:</strong> {inquiries[selectedInquiryIndex].user}
                      </div>
                      <div style={{ fontSize: "14px", color: "#374151", marginBottom: "12px" }}>
                        <strong>카테고리:</strong> {inquiries[selectedInquiryIndex].category}
                      </div>
                      <div style={{ fontSize: "14px", color: "#374151", lineHeight: "1.6" }}>
                        {inquiries[selectedInquiryIndex].content}
                      </div>
                    </div>

                    {/* 답변 작성 */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!answerContent.trim()) {
                          alert("답변 내용을 입력해주세요.");
                          return;
                        }

                        // 문의사항 답변 업데이트
                        const updatedInquiries = [...inquiries];
                        updatedInquiries[selectedInquiryIndex] = {
                          ...updatedInquiries[selectedInquiryIndex],
                          answer: answerContent,
                          status: "답변 완료"
                        };
                        setInquiries(updatedInquiries);

                        setIsAnsweringInquiry(false);
                        setSelectedInquiryIndex(-1);
                        setAnswerContent("");

                        alert("답변이 등록되었습니다.");
                      }}
                    >
                      <div style={{ marginBottom: "24px" }}>
                        <label
                          style={{
                            display: "block",
                            fontSize: "16px",
                            fontWeight: "600",
                            color: "#374151",
                            marginBottom: "12px",
                          }}
                        >
                          답변 내용
                        </label>
                        <textarea
                          value={answerContent}
                          onChange={(e) => setAnswerContent(e.target.value)}
                          placeholder="문의사항에 대한 답변을 입력해주세요."
                          style={{
                            width: "100%",
                            minHeight: "200px",
                            padding: "16px",
                            border: "1px solid #d1d5db",
                            borderRadius: "8px",
                            fontSize: "14px",
                            outline: "none",
                            transition: "border-color 0.2s ease",
                            backgroundColor: "white",
                            resize: "vertical",
                            lineHeight: "1.6",
                          }}
                        />
                      </div>

                      {/* 답변 등록 버튼 */}
                      <div style={{ textAlign: "right" }}>
                        <button
                          type="submit"
                          style={{
                            backgroundColor: "#3b82f6",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            padding: "12px 24px",
                            fontSize: "16px",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                        >
                          답변 등록
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </>
            )}

            {activeMenu === "공지사항" && !isWritingNotice && !isEditingNotice && (
              <>
                {/* Header Section */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "32px",
                  }}
                >
                  <h1
                    style={{
                      fontSize: "32px",
                      fontWeight: "bold",
                      color: "#1f2937",
                      margin: 0,
                    }}
                  >
                    공지사항
                  </h1>
                  <button
                    onClick={() => setIsWritingNotice(true)}
                    style={{
                      backgroundColor: "#059669",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      padding: "8px 16px",
                      fontSize: "14px",
                      fontWeight: "500",
                      cursor: "pointer",
                      boxShadow: "0 2px 4px rgba(5, 150, 105, 0.15)",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#047857";
                      e.currentTarget.style.transform = "translateY(-1px)";
                      e.currentTarget.style.boxShadow = "0 4px 8px rgba(5, 150, 105, 0.25)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#059669";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 2px 4px rgba(5, 150, 105, 0.15)";
                    }}
                  >
                    공지 작성
                  </button>
                </div>

                {/* 공지사항 필터 */}
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    padding: "24px",
                    border: "1px solid #f3f4f6",
                    marginBottom: "24px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    }}
                  >
                    {/* First row - 등록일 */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        justifyContent: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#374151",
                          minWidth: "60px",
                        }}
                      >
                        등록일
                      </div>
                      <input
                        type="text"
                        placeholder="시작일"
                        value={noticeStartDate}
                        onChange={(e) => setNoticeStartDate(e.target.value)}
                        onFocus={(e) => {
                          e.target.type = "date";
                          e.target.showPicker?.();
                        }}
                        onBlur={(e) => {
                          if (!e.target.value) {
                            e.target.type = "text";
                          }
                        }}
                        style={{
                          width: "150px",
                          padding: "8px 12px",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          fontSize: "14px",
                          color: "#374151",
                          backgroundColor: "white",
                        }}
                      />
                      <input
                        type="text"
                        placeholder="종료일"
                        value={noticeEndDate}
                        onChange={(e) => setNoticeEndDate(e.target.value)}
                        onFocus={(e) => {
                          e.target.type = "date";
                          e.target.showPicker?.();
                        }}
                        onBlur={(e) => {
                          if (!e.target.value) {
                            e.target.type = "text";
                          }
                        }}
                        style={{
                          width: "150px",
                          padding: "8px 12px",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          fontSize: "14px",
                          color: "#374151",
                          backgroundColor: "white",
                        }}
                      />
                    </div>
                    {/* Second row - 키워드, 검색창, 검색 버튼 */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        justifyContent: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#374151",
                          minWidth: "60px",
                        }}
                      >
                        키워드
                      </div>
                      <input
                        type="text"
                        placeholder="제목, 카테고리 검색"
                        value={noticeKeyword}
                        onChange={(e) => setNoticeKeyword(e.target.value)}
                        style={{
                          width: "300px",
                          padding: "8px 12px",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          fontSize: "14px",
                          color: "#374151",
                          backgroundColor: "white",
                        }}
                      />
                      <button
                        style={{
                          backgroundColor: "#F97316",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          padding: "8px 16px",
                          fontSize: "14px",
                          fontWeight: "500",
                          cursor: "pointer",
                          minWidth: "60px",
                        }}
                      >
                        검색
                      </button>
                    </div>
                  </div>
                </div>

                {/* 공지 통계 카드 */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "20px",
                    marginBottom: "32px",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#F8F8F8",
                      borderRadius: "12px",
                      padding: "24px",
                      border: "1px solid #f3f4f6",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>
                      전체 공지
                    </div>
                    <div style={{ fontSize: "28px", fontWeight: "bold", color: "#1f2937" }}>
                      28
                    </div>
                  </div>
                  <div
                    style={{
                      backgroundColor: "#F8F8F8",
                      borderRadius: "12px",
                      padding: "24px",
                      border: "1px solid #f3f4f6",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>
                      활성 공지
                    </div>
                    <div style={{ fontSize: "28px", fontWeight: "bold", color: "#059669" }}>
                      15
                    </div>
                  </div>
                  <div
                    style={{
                      backgroundColor: "#F8F8F8",
                      borderRadius: "12px",
                      padding: "24px",
                      border: "1px solid #f3f4f6",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>
                      비활성
                    </div>
                    <div style={{ fontSize: "28px", fontWeight: "bold", color: "#9ca3af" }}>
                      13
                    </div>
                  </div>
                  <div
                    style={{
                      backgroundColor: "#F8F8F8",
                      borderRadius: "12px",
                      padding: "24px",
                      border: "1px solid #f3f4f6",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>
                      오늘 등록
                    </div>
                    <div style={{ fontSize: "28px", fontWeight: "bold", color: "#1f2937" }}>
                      2
                    </div>
                  </div>
                </div>
                
                {/* 공지사항 리스트 */}
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    border: "1px solid #f3f4f6",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: "20px 24px",
                      borderBottom: "1px solid #f3f4f6",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1f2937", margin: 0 }}>
                      공지사항 목록
                    </h2>
                  </div>
                  
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr>
                          <th style={{ backgroundColor: "#f8f9fa", padding: "12px 16px", textAlign: "center", fontWeight: "600", color: "#374151", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                            번호
                          </th>
                          <th style={{ backgroundColor: "#f8f9fa", padding: "12px 16px", textAlign: "center", fontWeight: "600", color: "#374151", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                            카테고리
                          </th>
                          <th style={{ backgroundColor: "#f8f9fa", padding: "12px 16px", textAlign: "center", fontWeight: "600", color: "#374151", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                            제목
                          </th>
                          <th style={{ backgroundColor: "#f8f9fa", padding: "12px 16px", textAlign: "center", fontWeight: "600", color: "#374151", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                            조회수
                          </th>
                          <th style={{ backgroundColor: "#f8f9fa", padding: "12px 16px", textAlign: "center", fontWeight: "600", color: "#374151", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                            상태
                          </th>
                          <th style={{ backgroundColor: "#f8f9fa", padding: "12px 16px", textAlign: "center", fontWeight: "600", color: "#374151", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                            등록일
                          </th>
                          <th style={{ backgroundColor: "#f8f9fa", padding: "12px 12px", textAlign: "center", fontWeight: "600", color: "#374151", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                            관리
                          </th>
                        </tr>
                      </thead>
                      
                      <tbody>
                        {(() => {
                          // 필터링 로직 적용
                          const filteredNotices = notices.filter(notice => {
                            // 날짜 필터링 (등록일에서 날짜 부분만 추출)
                            const noticeDate = notice.registerDate;
                            if (noticeStartDate && noticeDate < noticeStartDate) {
                              return false;
                            }
                            if (noticeEndDate && noticeDate > noticeEndDate) {
                              return false;
                            }
                            
                            // 키워드 검색 (제목, 카테고리)
                            if (noticeKeyword) {
                              const keyword = noticeKeyword.toLowerCase();
                              const titleMatch = notice.title.toLowerCase().includes(keyword);
                              const categoryMatch = notice.category.toLowerCase().includes(keyword);
                              return titleMatch || categoryMatch;
                            }
                            
                            return true;
                          });
                          
                          const startIndex = (currentPage - 1) * itemsPerPage;
                          const endIndex = startIndex + itemsPerPage;
                          const currentNotices = filteredNotices.slice(startIndex, endIndex);
                          
                          return currentNotices.map((notice, index) => (
                            <tr key={index}>
                              <td style={{ padding: "12px 8px", textAlign: "center", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                                {filteredNotices.length - (startIndex + index)}
                              </td>
                              <td style={{ padding: "12px 16px", textAlign: "center", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                                <span style={{ 
                                  padding: "4px 8px", 
                                  borderRadius: "12px", 
                                  fontSize: "12px", 
                                  fontWeight: "500",
                                  backgroundColor: notice.category === "이벤트" ? "#dbeafe" : notice.category === "업데이트" ? "#dcfce7" : notice.category === "점검" ? "#fef3c7" : "#f3f4f6",
                                  color: notice.category === "이벤트" ? "#1d4ed8" : notice.category === "업데이트" ? "#166534" : notice.category === "점검" ? "#d97706" : "#6b7280"
                                }}>
                                  {notice.category}
                                </span>
                              </td>
                              <td style={{ padding: "12px 16px", textAlign: "left", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                                {notice.title}
                              </td>
                              <td style={{ padding: "12px 16px", textAlign: "center", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                                {notice.views.toLocaleString()}
                              </td>
                              <td style={{ padding: "12px 16px", textAlign: "center", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                                <span style={{ 
                                  padding: "4px 8px", 
                                  borderRadius: "12px", 
                                  fontSize: "12px", 
                                  fontWeight: "500",
                                  backgroundColor: notice.status === "활성" ? "#dcfce7" : "#f3f4f6",
                                  color: notice.status === "활성" ? "#166534" : "#6b7280"
                                }}>
                                  {notice.status}
                                </span>
                              </td>
                              <td style={{ padding: "12px 16px", textAlign: "center", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                                {notice.registerDate}
                              </td>
                              <td style={{ padding: "12px 12px", textAlign: "center", borderBottom: "1px solid #e5e7eb", fontSize: "14px" }}>
                                <button 
                                  onClick={() => {
                                    const realIndex = startIndex + index;
                                    setEditingNoticeIndex(realIndex);
                                    setNoticeTitle(notice.title);
                                    setNoticeCategory(notice.category);
                                    setNoticeContent(""); // 내용은 실제 데이터에 없으므로 빈 문자열
                                    setIsEditingNotice(true);
                                  }}
                                  style={{ padding: "4px 8px", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "4px", fontSize: "12px", cursor: "pointer", marginRight: "4px" }}
                                >
                                  수정
                                </button>
                                <button 
                                  onClick={() => {
                                    if (window.confirm("정말로 이 공지사항을 삭제하시겠습니까?")) {
                                      const realIndex = startIndex + index;
                                      const updatedNotices = notices.filter((_, i) => i !== realIndex);
                                      setNotices(updatedNotices);
                                    }
                                  }}
                                  style={{ padding: "4px 8px", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}
                                >
                                  삭제
                                </button>
                              </td>
                            </tr>
                          ));
                        })()}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* 페이지네이션 */}
                  <div style={{ display: "flex", justifyContent: "center", padding: "20px", borderTop: "1px solid #f3f4f6" }}>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <button style={{ padding: "8px 12px", border: "1px solid #d1d5db", backgroundColor: currentPage === 1 ? "#f3f4f6" : "white", color: currentPage === 1 ? "#9ca3af" : "#374151", borderRadius: "4px", fontSize: "14px", cursor: currentPage === 1 ? "not-allowed" : "pointer" }}>
                        이전
                      </button>
                      {[1, 2].map((pageNumber) => (
                        <button key={pageNumber} style={{ padding: "8px 12px", border: currentPage === pageNumber ? "1px solid #F97316" : "1px solid #d1d5db", backgroundColor: currentPage === pageNumber ? "#F97316" : "white", color: currentPage === pageNumber ? "white" : "#374151", borderRadius: "4px", fontSize: "14px", cursor: "pointer" }}>
                          {pageNumber}
                        </button>
                      ))}
                      <button style={{ padding: "8px 12px", border: "1px solid #d1d5db", backgroundColor: currentPage === 2 ? "#f3f4f6" : "white", color: currentPage === 2 ? "#9ca3af" : "#374151", borderRadius: "4px", fontSize: "14px", cursor: currentPage === 2 ? "not-allowed" : "pointer" }}>
                        다음
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeMenu === "공지사항" && isWritingNotice && (
              <>
                {/* Header Section */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "32px",
                  }}
                >
                  <h1
                    style={{
                      fontSize: "32px",
                      fontWeight: "bold",
                      color: "#1f2937",
                      margin: 0,
                    }}
                  >
                    공지 작성
                  </h1>
                  <button
                    onClick={() => {
                      setIsWritingNotice(false);
                      setNoticeTitle("");
                      setNoticeCategory("공지");
                      setNoticeContent("");
                    }}
                    style={{
                      backgroundColor: "#6b7280",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      padding: "8px 16px",
                      fontSize: "14px",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    목록으로
                  </button>
                </div>

                {/* 공지 작성 폼 */}
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    border: "1px solid #f3f4f6",
                    padding: "32px",
                  }}
                >
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!noticeTitle.trim() || !noticeContent.trim()) {
                        alert("제목과 내용을 모두 입력해주세요.");
                        return;
                      }
                      
                      const today = new Date();
                      const dateString = today.getFullYear() + "-" + 
                        String(today.getMonth() + 1).padStart(2, '0') + "-" + 
                        String(today.getDate()).padStart(2, '0');
                      
                      const newNotice = {
                        category: noticeCategory,
                        title: noticeTitle,
                        views: 0,
                        status: "활성",
                        registerDate: dateString
                      };
                      
                      setNotices([newNotice, ...notices]);
                      setIsWritingNotice(false);
                      setNoticeTitle("");
                      setNoticeCategory("공지");
                      setNoticeContent("");
                      
                      alert("공지사항이 등록되었습니다.");
                    }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "24px",
                    }}
                  >
                    {/* 카테고리 선택 */}
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#374151",
                          marginBottom: "8px",
                        }}
                      >
                        카테고리
                      </label>
                      <select
                        value={noticeCategory}
                        onChange={(e) => setNoticeCategory(e.target.value)}
                        style={{
                          width: "200px",
                          padding: "12px 16px",
                          border: "1px solid #d1d5db",
                          borderRadius: "8px",
                          fontSize: "14px",
                          color: "#374151",
                          backgroundColor: "white",
                        }}
                      >
                        <option value="공지">공지</option>
                        <option value="이벤트">이벤트</option>
                        <option value="업데이트">업데이트</option>
                        <option value="점검">점검</option>
                      </select>
                    </div>

                    {/* 제목 입력 */}
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#374151",
                          marginBottom: "8px",
                        }}
                      >
                        제목
                      </label>
                      <input
                        type="text"
                        value={noticeTitle}
                        onChange={(e) => setNoticeTitle(e.target.value)}
                        placeholder="공지사항 제목을 입력해주세요"
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          border: "1px solid #d1d5db",
                          borderRadius: "8px",
                          fontSize: "14px",
                          color: "#374151",
                          backgroundColor: "white",
                        }}
                      />
                    </div>

                    {/* 내용 입력 */}
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#374151",
                          marginBottom: "8px",
                        }}
                      >
                        내용
                      </label>
                      <textarea
                        value={noticeContent}
                        onChange={(e) => setNoticeContent(e.target.value)}
                        placeholder="공지사항 내용을 입력해주세요"
                        rows={10}
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          border: "1px solid #d1d5db",
                          borderRadius: "8px",
                          fontSize: "14px",
                          color: "#374151",
                          backgroundColor: "white",
                          resize: "vertical",
                          fontFamily: "inherit",
                        }}
                      />
                    </div>

                    {/* 버튼 영역 */}
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        justifyContent: "flex-end",
                        paddingTop: "16px",
                        borderTop: "1px solid #f3f4f6",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setIsWritingNotice(false);
                          setNoticeTitle("");
                          setNoticeCategory("공지");
                          setNoticeContent("");
                        }}
                        style={{
                          backgroundColor: "#f3f4f6",
                          color: "#374151",
                          border: "none",
                          borderRadius: "8px",
                          padding: "10px 20px",
                          fontSize: "14px",
                          fontWeight: "500",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                      >
                        취소
                      </button>
                      <button
                        type="submit"
                        style={{
                          backgroundColor: "#059669",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          padding: "10px 20px",
                          fontSize: "14px",
                          fontWeight: "500",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                      >
                        등록하기
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}

            {activeMenu === "공지사항" && isEditingNotice && (
              <>
                {/* Header Section */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "32px",
                  }}
                >
                  <h1
                    style={{
                      fontSize: "32px",
                      fontWeight: "bold",
                      color: "#1f2937",
                      margin: 0,
                    }}
                  >
                    공지 수정
                  </h1>
                  <button
                    onClick={() => {
                      setIsEditingNotice(false);
                      setEditingNoticeIndex(-1);
                      setNoticeTitle("");
                      setNoticeCategory("공지");
                      setNoticeContent("");
                    }}
                    style={{
                      backgroundColor: "#6b7280",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      padding: "8px 16px",
                      fontSize: "14px",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    목록으로
                  </button>
                </div>

                {/* 공지 수정 폼 */}
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    border: "1px solid #f3f4f6",
                    padding: "32px",
                  }}
                >
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!noticeTitle.trim() || !noticeContent.trim()) {
                        alert("제목과 내용을 모두 입력해주세요.");
                        return;
                      }
                      
                      const updatedNotices = [...notices];
                      updatedNotices[editingNoticeIndex] = {
                        ...updatedNotices[editingNoticeIndex],
                        category: noticeCategory,
                        title: noticeTitle,
                      };
                      
                      setNotices(updatedNotices);
                      setIsEditingNotice(false);
                      setEditingNoticeIndex(-1);
                      setNoticeTitle("");
                      setNoticeCategory("공지");
                      setNoticeContent("");
                      
                      alert("공지사항이 수정되었습니다.");
                    }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "24px",
                    }}
                  >
                    {/* 카테고리 선택 */}
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#374151",
                          marginBottom: "8px",
                        }}
                      >
                        카테고리
                      </label>
                      <select
                        value={noticeCategory}
                        onChange={(e) => setNoticeCategory(e.target.value)}
                        style={{
                          width: "200px",
                          padding: "12px 16px",
                          border: "1px solid #d1d5db",
                          borderRadius: "8px",
                          fontSize: "14px",
                          color: "#374151",
                          backgroundColor: "white",
                        }}
                      >
                        <option value="공지">공지</option>
                        <option value="이벤트">이벤트</option>
                        <option value="업데이트">업데이트</option>
                        <option value="점검">점검</option>
                      </select>
                    </div>

                    {/* 제목 입력 */}
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#374151",
                          marginBottom: "8px",
                        }}
                      >
                        제목
                      </label>
                      <input
                        type="text"
                        value={noticeTitle}
                        onChange={(e) => setNoticeTitle(e.target.value)}
                        placeholder="공지사항 제목을 입력해주세요"
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          border: "1px solid #d1d5db",
                          borderRadius: "8px",
                          fontSize: "14px",
                          color: "#374151",
                          backgroundColor: "white",
                        }}
                      />
                    </div>

                    {/* 내용 입력 */}
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#374151",
                          marginBottom: "8px",
                        }}
                      >
                        내용
                      </label>
                      <textarea
                        value={noticeContent}
                        onChange={(e) => setNoticeContent(e.target.value)}
                        placeholder="공지사항 내용을 입력해주세요"
                        rows={10}
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          border: "1px solid #d1d5db",
                          borderRadius: "8px",
                          fontSize: "14px",
                          color: "#374151",
                          backgroundColor: "white",
                          resize: "vertical",
                          fontFamily: "inherit",
                        }}
                      />
                    </div>

                    {/* 버튼 영역 */}
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        justifyContent: "flex-end",
                        paddingTop: "16px",
                        borderTop: "1px solid #f3f4f6",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingNotice(false);
                          setEditingNoticeIndex(-1);
                          setNoticeTitle("");
                          setNoticeCategory("공지");
                          setNoticeContent("");
                        }}
                        style={{
                          backgroundColor: "#f3f4f6",
                          color: "#374151",
                          border: "none",
                          borderRadius: "8px",
                          padding: "10px 20px",
                          fontSize: "14px",
                          fontWeight: "500",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                      >
                        취소
                      </button>
                      <button
                        type="submit"
                        style={{
                          backgroundColor: "#3b82f6",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          padding: "10px 20px",
                          fontSize: "14px",
                          fontWeight: "500",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                      >
                        수정하기
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}

            {/* 영수증 관리 탭 */}
            {activeMenu === "영수증 관리" && (
              <>
                {/* Header Section */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "24px",
                    padding: "20px 0",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  <div>
                    <h1
                      style={{
                        fontSize: "24px",
                        fontWeight: "700",
                        color: "#1f2937",
                        margin: 0,
                        marginBottom: "4px",
                      }}
                    >
                      영수증 관리
                    </h1>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#6b7280",
                        margin: 0,
                      }}
                    >
                      유저가 업로드한 영수증을 검토하고 포인트를 지급할 수 있습니다
                    </p>
                  </div>
                </div>

                {/* 영수증 관리 필터 */}
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    padding: "24px",
                    border: "1px solid #f3f4f6",
                    marginBottom: "24px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    }}
                  >
                    {/* First row - 상태, 업로드일 */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        justifyContent: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#374151",
                          minWidth: "60px",
                        }}
                      >
                        상태
                      </div>
                      <select
                        value={receiptFilter}
                        onChange={(e) => setReceiptFilter(e.target.value)}
                        style={{
                          width: "150px",
                          padding: "8px 12px",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          fontSize: "14px",
                          color: "#374151",
                          backgroundColor: "white",
                        }}
                      >
                        <option value="전체">전체</option>
                        <option value="승인대기">승인대기</option>
                        <option value="승인완료">승인완료</option>
                        <option value="반려">반려</option>
                      </select>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#374151",
                          minWidth: "60px",
                          marginLeft: "20px",
                        }}
                      >
                        업로드일
                      </div>
                      <input
                        type="text"
                        placeholder="시작일"
                        value={receiptStartDate}
                        onChange={(e) => setReceiptStartDate(e.target.value)}
                        onFocus={(e) => {
                          e.target.type = "date";
                          e.target.showPicker?.();
                        }}
                        onBlur={(e) => {
                          if (!e.target.value) {
                            e.target.type = "text";
                          }
                        }}
                        style={{
                          width: "150px",
                          padding: "8px 12px",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          fontSize: "14px",
                          color: "#374151",
                          backgroundColor: "white",
                        }}
                      />
                      <input
                        type="text"
                        placeholder="종료일"
                        value={receiptEndDate}
                        onChange={(e) => setReceiptEndDate(e.target.value)}
                        onFocus={(e) => {
                          e.target.type = "date";
                          e.target.showPicker?.();
                        }}
                        onBlur={(e) => {
                          if (!e.target.value) {
                            e.target.type = "text";
                          }
                        }}
                        style={{
                          width: "150px",
                          padding: "8px 12px",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          fontSize: "14px",
                          color: "#374151",
                          backgroundColor: "white",
                        }}
                      />
                    </div>
                    {/* Second row - 키워드, 검색창, 검색 버튼 */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        justifyContent: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#374151",
                          minWidth: "60px",
                        }}
                      >
                        키워드
                      </div>
                      <input
                        type="text"
                        placeholder="사용자명, 상점명 검색"
                        value={receiptKeyword}
                        onChange={(e) => setReceiptKeyword(e.target.value)}
                        style={{
                          width: "300px",
                          padding: "8px 12px",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          fontSize: "14px",
                          color: "#374151",
                          backgroundColor: "white",
                        }}
                      />
                      <button
                        style={{
                          backgroundColor: "#F97316",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          padding: "8px 16px",
                          fontSize: "14px",
                          fontWeight: "500",
                          cursor: "pointer",
                          minWidth: "60px",
                        }}
                      >
                        검색
                      </button>
                    </div>
                  </div>
                </div>

                {/* Receipt List Table */}
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      overflowX: "auto",
                    }}
                  >
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ backgroundColor: "#f9fafb" }}>
                          <th
                            style={{
                              padding: "12px 16px",
                              textAlign: "left",
                              fontSize: "13px",
                              fontWeight: "600",
                              color: "#374151",
                              borderBottom: "1px solid #e5e7eb",
                              width: "60px",
                            }}
                          >
                            번호
                          </th>
                          <th
                            style={{
                              padding: "12px 16px",
                              textAlign: "left",
                              fontSize: "13px",
                              fontWeight: "600",
                              color: "#374151",
                              borderBottom: "1px solid #e5e7eb",
                              width: "100px",
                            }}
                          >
                            사용자명
                          </th>
                          <th
                            style={{
                              padding: "12px 16px",
                              textAlign: "left",
                              fontSize: "13px",
                              fontWeight: "600",
                              color: "#374151",
                              borderBottom: "1px solid #e5e7eb",
                              width: "150px",
                            }}
                          >
                            상점명
                          </th>
                          <th
                            style={{
                              padding: "12px 16px",
                              textAlign: "right",
                              fontSize: "13px",
                              fontWeight: "600",
                              color: "#374151",
                              borderBottom: "1px solid #e5e7eb",
                              width: "100px",
                            }}
                          >
                            금액
                          </th>
                          <th
                            style={{
                              padding: "12px 16px",
                              textAlign: "center",
                              fontSize: "13px",
                              fontWeight: "600",
                              color: "#374151",
                              borderBottom: "1px solid #e5e7eb",
                              width: "100px",
                            }}
                          >
                            상태
                          </th>
                          <th
                            style={{
                              padding: "12px 16px",
                              textAlign: "right",
                              fontSize: "13px",
                              fontWeight: "600",
                              color: "#374151",
                              borderBottom: "1px solid #e5e7eb",
                              width: "80px",
                            }}
                          >
                            포인트
                          </th>
                          <th
                            style={{
                              padding: "12px 16px",
                              textAlign: "center",
                              fontSize: "13px",
                              fontWeight: "600",
                              color: "#374151",
                              borderBottom: "1px solid #e5e7eb",
                              width: "140px",
                            }}
                          >
                            업로드일
                          </th>
                          <th
                            style={{
                              padding: "12px 16px",
                              textAlign: "center",
                              fontSize: "13px",
                              fontWeight: "600",
                              color: "#374151",
                              borderBottom: "1px solid #e5e7eb",
                              width: "120px",
                            }}
                          >
                            관리
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {receipts
                          .filter((receipt) => {
                            if (receiptFilter === "전체") return true;
                            return receipt.status === receiptFilter;
                          })
                          .filter((receipt) => {
                            if (!receiptKeyword) return true;
                            return receipt.userName.toLowerCase().includes(receiptKeyword.toLowerCase()) ||
                                   receipt.storeName.toLowerCase().includes(receiptKeyword.toLowerCase());
                          })
                          .map((receipt) => (
                            <tr
                              key={receipt.id}
                              style={{
                                borderBottom: "1px solid #e5e7eb",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#f9fafb";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "transparent";
                              }}
                            >
                              <td
                                style={{
                                  padding: "16px",
                                  fontSize: "14px",
                                  color: "#374151",
                                  textAlign: "left",
                                }}
                              >
                                {receipt.id}
                              </td>
                              <td
                                style={{
                                  padding: "16px",
                                  fontSize: "14px",
                                  color: "#374151",
                                  fontWeight: "500",
                                }}
                              >
                                {receipt.userName}
                              </td>
                              <td
                                style={{
                                  padding: "16px",
                                  fontSize: "14px",
                                  color: "#374151",
                                }}
                              >
                                {receipt.storeName}
                              </td>
                              <td
                                style={{
                                  padding: "16px",
                                  fontSize: "14px",
                                  color: "#374151",
                                  textAlign: "right",
                                  fontWeight: "500",
                                }}
                              >
                                {receipt.amount.toLocaleString()}원
                              </td>
                              <td
                                style={{
                                  padding: "16px",
                                  fontSize: "12px",
                                  textAlign: "center",
                                }}
                              >
                                <span
                                  style={{
                                    padding: "4px 8px",
                                    borderRadius: "12px",
                                    fontWeight: "500",
                                    backgroundColor:
                                      receipt.status === "승인완료"
                                        ? "#dcfce7"
                                        : receipt.status === "승인대기"
                                        ? "#fef3c7"
                                        : "#fee2e2",
                                    color:
                                      receipt.status === "승인완료"
                                        ? "#166534"
                                        : receipt.status === "승인대기"
                                        ? "#92400e"
                                        : "#dc2626",
                                  }}
                                >
                                  {receipt.status}
                                </span>
                              </td>
                              <td
                                style={{
                                  padding: "16px",
                                  fontSize: "14px",
                                  color: "#374151",
                                  textAlign: "right",
                                  fontWeight: "500",
                                }}
                              >
                                {receipt.points}P
                              </td>
                              <td
                                style={{
                                  padding: "16px",
                                  fontSize: "13px",
                                  color: "#6b7280",
                                  textAlign: "center",
                                }}
                              >
                                {receipt.uploadDate}
                              </td>
                              <td
                                style={{
                                  padding: "16px",
                                  textAlign: "center",
                                }}
                              >
                                <button
                                  onClick={() => {
                                    setSelectedReceipt(receipt);
                                    setIsViewingReceipt(true);
                                  }}
                                  style={{
                                    padding: "6px 12px",
                                    backgroundColor: "#3b82f6",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    fontSize: "12px",
                                    fontWeight: "500",
                                    cursor: "pointer",
                                    marginRight: "4px",
                                  }}
                                >
                                  상세
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* 영수증 상세보기 모달 */}
            {isViewingReceipt && selectedReceipt && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1000,
                }}
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setIsViewingReceipt(false);
                    setSelectedReceipt(null);
                  }
                }}
              >
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    padding: "24px",
                    maxWidth: "600px",
                    width: "90%",
                    maxHeight: "80vh",
                    overflowY: "auto",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "20px",
                    }}
                  >
                    <h2
                      style={{
                        fontSize: "18px",
                        fontWeight: "600",
                        color: "#1f2937",
                        margin: 0,
                      }}
                    >
                      영수증 상세정보
                    </h2>
                    <button
                      onClick={() => {
                        setIsViewingReceipt(false);
                        setSelectedReceipt(null);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        fontSize: "20px",
                        cursor: "pointer",
                        color: "#6b7280",
                      }}
                    >
                      ×
                    </button>
                  </div>

                  <div style={{ display: "flex", gap: "24px" }}>
                    {/* 영수증 이미지 */}
                    <div style={{ flex: "1" }}>
                      <h3
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#374151",
                          marginBottom: "8px",
                        }}
                      >
                        영수증 이미지
                      </h3>
                      <div
                        style={{
                          width: "100%",
                          height: "300px",
                          backgroundColor: "#f3f4f6",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px solid #e5e7eb",
                        }}
                      >
                        <span style={{ color: "#6b7280", fontSize: "14px" }}>
                          영수증 이미지: {selectedReceipt.receiptImage}
                        </span>
                      </div>
                    </div>

                    {/* 영수증 정보 */}
                    <div style={{ flex: "1" }}>
                      <h3
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#374151",
                          marginBottom: "16px",
                        }}
                      >
                        영수증 정보
                      </h3>

                      <div style={{ marginBottom: "12px" }}>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#6b7280",
                            marginBottom: "4px",
                          }}
                        >
                          사용자명
                        </div>
                        <div
                          style={{
                            fontSize: "14px",
                            color: "#374151",
                            fontWeight: "500",
                          }}
                        >
                          {selectedReceipt.userName} ({selectedReceipt.userId})
                        </div>
                      </div>

                      <div style={{ marginBottom: "12px" }}>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#6b7280",
                            marginBottom: "4px",
                          }}
                        >
                          상점명
                        </div>
                        <div
                          style={{
                            fontSize: "14px",
                            color: "#374151",
                            fontWeight: "500",
                          }}
                        >
                          {selectedReceipt.storeName}
                        </div>
                      </div>

                      <div style={{ marginBottom: "12px" }}>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#6b7280",
                            marginBottom: "4px",
                          }}
                        >
                          결제 금액
                        </div>
                        <div
                          style={{
                            fontSize: "14px",
                            color: "#374151",
                            fontWeight: "500",
                          }}
                        >
                          {selectedReceipt.amount.toLocaleString()}원
                        </div>
                      </div>

                      <div style={{ marginBottom: "12px" }}>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#6b7280",
                            marginBottom: "4px",
                          }}
                        >
                          상태
                        </div>
                        <span
                          style={{
                            padding: "4px 8px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: "500",
                            backgroundColor:
                              selectedReceipt.status === "승인완료"
                                ? "#dcfce7"
                                : selectedReceipt.status === "승인대기"
                                ? "#fef3c7"
                                : "#fee2e2",
                            color:
                              selectedReceipt.status === "승인완료"
                                ? "#166534"
                                : selectedReceipt.status === "승인대기"
                                ? "#92400e"
                                : "#dc2626",
                          }}
                        >
                          {selectedReceipt.status}
                        </span>
                      </div>

                      <div style={{ marginBottom: "12px" }}>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#6b7280",
                            marginBottom: "4px",
                          }}
                        >
                          업로드일
                        </div>
                        <div
                          style={{
                            fontSize: "14px",
                            color: "#374151",
                          }}
                        >
                          {selectedReceipt.uploadDate}
                        </div>
                      </div>

                      {selectedReceipt.status === "승인완료" && (
                        <div style={{ marginBottom: "12px" }}>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#6b7280",
                              marginBottom: "4px",
                            }}
                          >
                            승인일
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              color: "#374151",
                            }}
                          >
                            {selectedReceipt.approvalDate}
                          </div>
                        </div>
                      )}

                      {selectedReceipt.status === "반려" && (
                        <div style={{ marginBottom: "12px" }}>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#6b7280",
                              marginBottom: "4px",
                            }}
                          >
                            반려 사유
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              color: "#dc2626",
                              padding: "8px",
                              backgroundColor: "#fee2e2",
                              borderRadius: "4px",
                            }}
                          >
                            {selectedReceipt.rejectReason}
                          </div>
                        </div>
                      )}

                      {/* 포인트 지급/반려 액션 */}
                      {selectedReceipt.status === "승인대기" && (
                        <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid #e5e7eb" }}>
                          <div style={{ marginBottom: "16px" }}>
                            <div
                              style={{
                                fontSize: "12px",
                                color: "#6b7280",
                                marginBottom: "4px",
                              }}
                            >
                              지급할 포인트
                            </div>
                            <input
                              type="number"
                              value={pointsToAward}
                              onChange={(e) => setPointsToAward(e.target.value)}
                              placeholder={`권장: ${Math.floor(selectedReceipt.amount * 0.01)}P`}
                              style={{
                                width: "100%",
                                padding: "8px 12px",
                                border: "1px solid #d1d5db",
                                borderRadius: "6px",
                                fontSize: "14px",
                              }}
                            />
                          </div>

                          <div style={{ marginBottom: "16px" }}>
                            <div
                              style={{
                                fontSize: "12px",
                                color: "#6b7280",
                                marginBottom: "4px",
                              }}
                            >
                              반려 사유 (반려 시에만)
                            </div>
                            <textarea
                              value={rejectReason}
                              onChange={(e) => setRejectReason(e.target.value)}
                              placeholder="반려 사유를 입력하세요"
                              style={{
                                width: "100%",
                                padding: "8px 12px",
                                border: "1px solid #d1d5db",
                                borderRadius: "6px",
                                fontSize: "14px",
                                minHeight: "60px",
                                resize: "vertical",
                              }}
                            />
                          </div>

                          <div style={{ display: "flex", gap: "8px" }}>
                            <button
                              onClick={() => {
                                // 포인트 지급 로직
                                const updatedReceipts = receipts.map(receipt => 
                                  receipt.id === selectedReceipt.id 
                                    ? {
                                        ...receipt,
                                        status: "승인완료",
                                        points: parseInt(pointsToAward) || Math.floor(selectedReceipt.amount * 0.01),
                                        approvalDate: new Date().toISOString().slice(0, 16).replace('T', ' ')
                                      }
                                    : receipt
                                );
                                setReceipts(updatedReceipts);
                                setIsViewingReceipt(false);
                                setSelectedReceipt(null);
                                setPointsToAward("");
                                setRejectReason("");
                              }}
                              style={{
                                flex: 1,
                                padding: "10px",
                                backgroundColor: "#10b981",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                fontSize: "14px",
                                fontWeight: "500",
                                cursor: "pointer",
                              }}
                            >
                              승인 및 포인트 지급
                            </button>
                            <button
                              onClick={() => {
                                // 반려 로직
                                if (!rejectReason.trim()) {
                                  alert("반려 사유를 입력해주세요.");
                                  return;
                                }
                                const updatedReceipts = receipts.map(receipt => 
                                  receipt.id === selectedReceipt.id 
                                    ? {
                                        ...receipt,
                                        status: "반려",
                                        points: 0,
                                        rejectReason: rejectReason.trim()
                                      }
                                    : receipt
                                );
                                setReceipts(updatedReceipts);
                                setIsViewingReceipt(false);
                                setSelectedReceipt(null);
                                setPointsToAward("");
                                setRejectReason("");
                              }}
                              style={{
                                flex: 1,
                                padding: "10px",
                                backgroundColor: "#ef4444",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                fontSize: "14px",
                                fontWeight: "500",
                                cursor: "pointer",
                              }}
                            >
                              반려
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 유저 통계 탭 */}
            {activeMenu === "유저 통계" && (
              <>
                {/* Header Section */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "24px",
                    padding: "20px 0",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  <div>
                    <h1
                      style={{
                        fontSize: "24px",
                        fontWeight: "700",
                        color: "#1f2937",
                        margin: 0,
                        marginBottom: "4px",
                      }}
                    >
                      유저 통계
                    </h1>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#6b7280",
                        margin: 0,
                      }}
                    >
                      기간별 유저 가입 현황을 확인할 수 있습니다
                    </p>
                  </div>
                </div>

                {/* 기간 조회 필터 */}
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    padding: "24px",
                    border: "1px solid #f3f4f6",
                    marginBottom: "24px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      justifyContent: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#374151",
                        minWidth: "60px",
                      }}
                    >
                      기간
                    </div>
                    <input
                      type="text"
                      placeholder="시작일"
                      value={userStatsStartDate}
                      onChange={(e) => setUserStatsStartDate(e.target.value)}
                      onFocus={(e) => {
                        e.target.type = "date";
                        e.target.showPicker?.();
                      }}
                      onBlur={(e) => {
                        if (!e.target.value) {
                          e.target.type = "text";
                        }
                      }}
                      style={{
                        width: "150px",
                        padding: "8px 12px",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "14px",
                        color: "#374151",
                        backgroundColor: "white",
                      }}
                    />
                    <input
                      type="text"
                      placeholder="종료일"
                      value={userStatsEndDate}
                      onChange={(e) => setUserStatsEndDate(e.target.value)}
                      onFocus={(e) => {
                        e.target.type = "date";
                        e.target.showPicker?.();
                      }}
                      onBlur={(e) => {
                        if (!e.target.value) {
                          e.target.type = "text";
                        }
                      }}
                      style={{
                        width: "150px",
                        padding: "8px 12px",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "14px",
                        color: "#374151",
                        backgroundColor: "white",
                      }}
                    />
                    <button
                      onClick={() => {
                        // 임시 데이터 업데이트 (실제로는 API 호출)
                        const generateStatsData = () => {
                          const startDate = new Date(userStatsStartDate);
                          const endDate = new Date(userStatsEndDate);
                          const data = [];
                          
                          for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                            data.push({
                              date: d.toISOString().split('T')[0],
                              signups: Math.floor(Math.random() * 30) + 5 // 5-34 랜덤
                            });
                          }
                          return data;
                        };
                        setUserStatsData(generateStatsData());
                      }}
                      style={{
                        backgroundColor: "#F97316",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        padding: "8px 16px",
                        fontSize: "14px",
                        fontWeight: "500",
                        cursor: "pointer",
                        minWidth: "60px",
                      }}
                    >
                      조회
                    </button>
                    <button
                      onClick={() => {
                        const today = new Date();
                        const sevenDaysAgo = new Date();
                        sevenDaysAgo.setDate(today.getDate() - 6);
                        
                        setUserStatsStartDate(sevenDaysAgo.toISOString().split('T')[0]);
                        setUserStatsEndDate(today.toISOString().split('T')[0]);
                        
                        // 기본 7일 데이터로 초기화
                        setUserStatsData([
                          { date: '2024-08-14', signups: 12 },
                          { date: '2024-08-15', signups: 8 },
                          { date: '2024-08-16', signups: 15 },
                          { date: '2024-08-17', signups: 23 },
                          { date: '2024-08-18', signups: 18 },
                          { date: '2024-08-19', signups: 27 },
                          { date: '2024-08-20', signups: 19 }
                        ]);
                      }}
                      style={{
                        backgroundColor: "#6b7280",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        padding: "8px 16px",
                        fontSize: "14px",
                        fontWeight: "500",
                        cursor: "pointer",
                        minWidth: "80px",
                      }}
                    >
                      최근 7일
                    </button>
                  </div>
                </div>

                {/* 통계 요약 카드 */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "20px",
                    marginBottom: "32px",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#F8F8F8",
                      borderRadius: "12px",
                      padding: "24px",
                      border: "1px solid #f3f4f6",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>
                      총 가입자수
                    </div>
                    <div style={{ fontSize: "32px", fontWeight: "700", color: "#1f2937" }}>
                      {(() => {
                        const generateDailyData = (startDate: string, endDate: string) => {
                          const start = new Date(startDate);
                          const end = new Date(endDate);
                          const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                          const daysToShow = Math.min(daysDiff, 30);
                          
                          return Array.from({ length: daysToShow }, (_, index) => {
                            const currentDate = new Date(start);
                            currentDate.setDate(start.getDate() + index);
                            const dayOfWeek = currentDate.getDay();
                            const dateNum = currentDate.getDate();
                            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                            const baseAos = isWeekend ? 120 + (dateNum % 3) * 20 : 80 + (dateNum % 4) * 15;
                            const baseIos = isWeekend ? 160 + (dateNum % 3) * 25 : 100 + (dateNum % 4) * 20;
                            const seed = dateNum + index;
                            const aosVariation = (seed % 7) * 10 - 30;
                            const iosVariation = (seed % 5) * 15 - 35;
                            return {
                              aos: Math.max(20, baseAos + aosVariation),
                              ios: Math.max(30, baseIos + iosVariation),
                              date: currentDate.toISOString().split('T')[0],
                              signups: Math.max(50, baseAos + aosVariation + baseIos + iosVariation)
                            };
                          });
                        };
                        const data = generateDailyData(userStatsStartDate, userStatsEndDate);
                        return data.reduce((sum, item) => sum + item.signups, 0);
                      })()}
                    </div>
                  </div>
                  <div
                    style={{
                      backgroundColor: "#F8F8F8",
                      borderRadius: "12px",
                      padding: "24px",
                      border: "1px solid #f3f4f6",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>
                      일평균 가입자
                    </div>
                    <div style={{ fontSize: "32px", fontWeight: "700", color: "#1f2937" }}>
                      {Math.round(userStatsData.reduce((sum, item) => sum + item.signups, 0) / userStatsData.length)}
                    </div>
                  </div>
                  <div
                    style={{
                      backgroundColor: "#F8F8F8",
                      borderRadius: "12px",
                      padding: "24px",
                      border: "1px solid #f3f4f6",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>
                      최대 가입자수
                    </div>
                    <div style={{ fontSize: "32px", fontWeight: "700", color: "#1f2937" }}>
                      {(() => {
                        const generateDailyData = (startDate: string, endDate: string) => {
                          const start = new Date(startDate);
                          const end = new Date(endDate);
                          const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                          const daysToShow = Math.min(daysDiff, 30);
                          
                          return Array.from({ length: daysToShow }, (_, index) => {
                            const currentDate = new Date(start);
                            currentDate.setDate(start.getDate() + index);
                            const dayOfWeek = currentDate.getDay();
                            const dateNum = currentDate.getDate();
                            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                            const baseAos = isWeekend ? 120 + (dateNum % 3) * 20 : 80 + (dateNum % 4) * 15;
                            const baseIos = isWeekend ? 160 + (dateNum % 3) * 25 : 100 + (dateNum % 4) * 20;
                            const seed = dateNum + index;
                            const aosVariation = (seed % 7) * 10 - 30;
                            const iosVariation = (seed % 5) * 15 - 35;
                            return {
                              aos: Math.max(20, baseAos + aosVariation),
                              ios: Math.max(30, baseIos + iosVariation),
                              date: currentDate.toISOString().split('T')[0],
                              signups: Math.max(50, baseAos + aosVariation + baseIos + iosVariation)
                            };
                          });
                        };
                        const data = generateDailyData(userStatsStartDate, userStatsEndDate);
                        return Math.max(...data.map(item => item.signups));
                      })()}
                    </div>
                  </div>
                </div>

                {/* 막대그래프 차트 */}
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    padding: "32px",
                    border: "1px solid #f3f4f6",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                    <h3
                      style={{
                        fontSize: "18px",
                        fontWeight: "600",
                        color: "#1f2937",
                        margin: 0,
                      }}
                    >
                      일별 가입자 수
                    </h3>
                    {/* 범례 */}
                    <div style={{ display: "flex", gap: "16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <div
                          style={{
                            width: "12px",
                            height: "12px",
                            backgroundColor: "#FF9800",
                            borderRadius: "2px",
                          }}
                        />
                        <span style={{ color: "#6b7280", fontSize: "12px" }}>AOS</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <div
                          style={{
                            width: "12px",
                            height: "12px",
                            backgroundColor: "#FFD391",
                            borderRadius: "2px",
                          }}
                        />
                        <span style={{ color: "#6b7280", fontSize: "12px" }}>iOS</span>
                      </div>
                    </div>
                  </div>
                  
                  {(() => {
                    // 선택된 기간에 따라 동적으로 데이터 생성
                    const generateDailyData = (startDate: string, endDate: string) => {
                      const start = new Date(startDate);
                      const end = new Date(endDate);
                      const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                      
                      // 최대 30일까지만 표시
                      const daysToShow = Math.min(daysDiff, 30);
                      
                      return Array.from({ length: daysToShow }, (_, index) => {
                        const currentDate = new Date(start);
                        currentDate.setDate(start.getDate() + index);
                        
                        // 날짜별로 다양한 패턴의 가입자 수 생성
                        const dayOfWeek = currentDate.getDay();
                        const dateNum = currentDate.getDate();
                        
                        // 주말(토요일, 일요일)에는 가입자가 많고, 평일에는 적당히
                        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                        const baseAos = isWeekend ? 120 + (dateNum % 3) * 20 : 80 + (dateNum % 4) * 15;
                        const baseIos = isWeekend ? 160 + (dateNum % 3) * 25 : 100 + (dateNum % 4) * 20;
                        
                        // 약간의 랜덤성 추가 (시드 기반으로 일관성 유지)
                        const seed = dateNum + index;
                        const aosVariation = (seed % 7) * 10 - 30;
                        const iosVariation = (seed % 5) * 15 - 35;
                        
                        return {
                          aos: Math.max(20, baseAos + aosVariation),
                          ios: Math.max(30, baseIos + iosVariation),
                          date: currentDate.toISOString().split('T')[0]
                        };
                      });
                    };
                    
                    const dailyData = generateDailyData(userStatsStartDate, userStatsEndDate);
                    const maxTotal = Math.max(...dailyData.map(data => data.aos + data.ios), 400);

                    return (
                      <div
                        style={{
                          height: "440px",
                          position: "relative",
                          padding: "20px 0 0 60px",
                        }}
                      >
                        {/* Y축 라벨들 */}
                        <div
                          style={{
                            position: "absolute",
                            left: 0,
                            top: "20px",
                            bottom: "80px",
                            width: "50px",
                            display: "flex",
                            flexDirection: "column-reverse",
                            justifyContent: "space-between",
                            fontSize: "12px",
                            color: "#6b7280",
                            textAlign: "right",
                            paddingRight: "10px",
                          }}
                        >
                          {Array.from({ length: 5 }, (_, i) => {
                            const value = Math.round((maxTotal / 4) * i);
                            return <span key={i}>{value}</span>;
                          })}
                        </div>

                    {/* 차트 컨테이너 */}
                    <div
                      style={{
                        height: "360px",
                        display: "flex",
                        alignItems: "end",
                        justifyContent: "space-around",
                        borderLeft: "1px solid #e5e7eb",
                        borderBottom: "1px solid #e5e7eb",
                        position: "relative",
                        marginLeft: "50px",
                      }}
                    >
                      {/* 가로 격자선들 */}
                      {Array.from({ length: 5 }, (_, i) => (
                        <div
                          key={i}
                          style={{
                            position: "absolute",
                            left: 0,
                            right: 0,
                            bottom: `${(i + 1) * 20}%`,
                            height: "1px",
                            backgroundColor: "#f3f4f6",
                          }}
                        />
                      ))}

                        {/* 막대그래프 */}
                        {(() => {
                        
                        return dailyData.map((data, index) => {
                          const total = data.aos + data.ios;
                          const totalHeight = (total / maxTotal) * 100;
                          
                          return (
                            <div
                              key={index}
                              style={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                height: "100%",
                                justifyContent: "end",
                                maxWidth: "60px",
                              }}
                            >
                              <div
                                style={{
                                  width: "40px",
                                  height: `${totalHeight}%`,
                                  display: "flex",
                                  flexDirection: "column",
                                  minHeight: "20px",
                                  position: "relative",
                                }}
                              >
                                {/* iOS section (상단) */}
                                <div
                                  style={{
                                    flex: data.ios,
                                    backgroundColor: "#FFD391",
                                    borderRadius: "4px 4px 0 0",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    minHeight: "10px",
                                    position: "relative",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "10px",
                                      fontWeight: "600",
                                      color: "#7c2d12",
                                      textShadow: "0 1px 2px rgba(255,255,255,0.3)",
                                    }}
                                  >
                                    {data.ios}
                                  </span>
                                  {/* 총합 표시 */}
                                  <div
                                    style={{
                                      position: "absolute",
                                      top: "-25px",
                                      left: "50%",
                                      transform: "translateX(-50%)",
                                      fontSize: "11px",
                                      fontWeight: "600",
                                      color: "#374151",
                                      backgroundColor: "white",
                                      padding: "2px 4px",
                                      borderRadius: "3px",
                                      border: "1px solid #e5e7eb",
                                    }}
                                  >
                                    {total}
                                  </div>
                                </div>
                                {/* AOS section (하단) */}
                                <div
                                  style={{
                                    flex: data.aos,
                                    backgroundColor: "#FF9800",
                                    borderRadius: "0 0 4px 4px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    minHeight: "10px",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "10px",
                                      fontWeight: "600",
                                      color: "white",
                                      textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                                    }}
                                  >
                                    {data.aos}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                    
                    {/* X축 라벨들 (격자선 바깥) */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                        marginLeft: "50px",
                        marginTop: "8px",
                      }}
                    >
                      {dailyData.map((data, index) => (
                        <div
                          key={index}
                          style={{
                            flex: 1,
                            maxWidth: "60px",
                            fontSize: "11px",
                            color: "#6b7280",
                            textAlign: "center",
                          }}
                        >
                          {new Date(data.date).toLocaleDateString('ko-KR', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                      ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Custom Tooltip */}
        {hoveredDataPoint && (
          <div
            style={{
              position: "fixed",
              left: `${hoveredDataPoint.x}px`,
              top: `${hoveredDataPoint.y - 40}px`,
              transform: "translateX(-50%)",
              backgroundColor: "#1f2937",
              color: "white",
              padding: "6px 12px",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: "500",
              whiteSpace: "nowrap",
              zIndex: 1000,
              pointerEvents: "none",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            {hoveredDataPoint.type}: {hoveredDataPoint.value.toLocaleString()}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "8px",
          border: "1px solid #e5e7eb",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#1f2937",
              marginBottom: "8px",
            }}
          >
            탐험대장 관리자 페이지
          </h1>
          <p style={{ color: "#6b7280", fontSize: "16px" }}>
            관리자 계정으로 로그인하세요
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#374151",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              사용자명
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "16px",
              }}
              placeholder="admin"
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#374151",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "16px",
              }}
              placeholder="admin123"
            />
          </div>

          {error && (
            <div
              style={{
                backgroundColor: "#fee2e2",
                border: "1px solid #fecaca",
                color: "#991b1b",
                padding: "12px",
                borderRadius: "6px",
                marginBottom: "20px",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              backgroundColor: loading ? "#9ca3af" : "#2563eb",
              color: "white",
              border: "none",
              padding: "12px",
              borderRadius: "6px",
              fontSize: "16px",
              fontWeight: "500",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div
          style={{
            marginTop: "24px",
            padding: "16px",
            backgroundColor: "#f3f4f6",
            borderRadius: "6px",
            textAlign: "center",
          }}
        >
          <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>
            기본 계정: <strong>admin</strong> / <strong>admin123</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
