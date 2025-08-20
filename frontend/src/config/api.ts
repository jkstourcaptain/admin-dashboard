// API 기본 URL 설정
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// API 엔드포인트들
export const API_ENDPOINTS = {
  // Admin endpoints
  admin: {
    auth: `${API_BASE_URL}/api/admin/auth`,
    dashboard: `${API_BASE_URL}/api/admin/dashboard`,
    products: `${API_BASE_URL}/api/admin/products`,
    purchases: `${API_BASE_URL}/api/admin/purchases`,
    receipts: `${API_BASE_URL}/api/admin/receipts`,
  },
  
  // App endpoints  
  app: {
    users: `${API_BASE_URL}/api/app/users`,
    content: `${API_BASE_URL}/api/app/content`,
    support: `${API_BASE_URL}/api/app/support`,
  }
};

// API 호출을 위한 기본 헤더
export const getApiHeaders = (token?: string) => ({
  'Content-Type': 'application/json',
  ...(token && { 'Authorization': `Bearer ${token}` })
});