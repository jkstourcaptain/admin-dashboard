export interface User {
  id: number;
  email: string;
  nickname: string;
  points: number;
  avatar_url?: string;
  introduce?: string;
  created_at: string;
  updated_at: string;
}

export interface StoreItem {
  id: number;
  title: string;
  category: string;
  description: string;
  benefits: string[];
  duration: string;
  price: number;
  background_color: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface UserItem {
  id: number;
  user_id: number;
  store_item_id: number;
  status: "active" | "used" | "expired";
  quantity: number;
  used_count: number;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PurchaseHistory {
  id: number;
  user_id: number;
  store_item_id: number;
  quantity: number;
  total_price: number;
  points_before: number;
  points_after: number;
  notes?: string;
  created_at: string;
}

export interface DailyStats {
  date: string;
  android_users: number;
  ios_users: number;
  total_users: number;
}

export interface RewardStats {
  date: string;
  actual_visits: number;
  mission_completion: number;
}

export interface WeeklyRewardStats {
  week: string;
  total_rewards: number;
}

export interface DashboardStats {
  today_signups: number;
  total_members: number;
  pending_receipts: number;
  pending_inquiries: number;
  daily_stats: DailyStats[];
  reward_stats: RewardStats[];
  weekly_reward_stats: WeeklyRewardStats[];
}

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: "super_admin" | "admin" | "moderator";
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}
