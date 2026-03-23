import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: `${API_BASE}/api/v1`,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

// Attach JWT token from localStorage on every request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("finai_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("finai_token");
      localStorage.removeItem("finai_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ── Auth ─────────────────────────────────────────────────────────────────────

export interface RegisterPayload {
  email: string;
  password: string;
  full_name: string;
  age: number;
  salary: number;
  monthly_expenses: number;
  risk_tolerance: "conservative" | "moderate" | "aggressive";
  financial_goals?: string;
}

export interface LoginPayload {
  username: string; // email used as username
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface UserResponse {
  id: number;
  email: string;
  full_name: string;
  age?: number;
  salary?: number;
  monthly_expenses?: number;
  risk_tolerance?: string;
  financial_goals?: string;
  is_active: boolean;
  created_at: string;
}

export const authApi = {
  register: (data: RegisterPayload) =>
    api.post<UserResponse>("/auth/register", data),

  login: (data: LoginPayload) => {
    const form = new URLSearchParams();
    form.append("username", data.username);
    form.append("password", data.password);
    return api.post<TokenResponse>("/auth/login", form, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
  },

  getProfile: (userId: number) =>
    api.get<UserResponse>(`/user-profile/${userId}`),

  updateProfile: (userId: number, data: Partial<RegisterPayload>) =>
    api.put<UserResponse>(`/user-profile/${userId}`, data),
};

// ── Chat ─────────────────────────────────────────────────────────────────────

export interface ChatRequest {
  message: string;
  user_id: number;
  user_data?: Record<string, unknown>;
  conversation_id?: string;
  stream?: boolean;
}

export interface FinancialAdvice {
  summary: string;
  detailed_advice: string;
  action_items: string[];
  warnings: string[];
  confidence_score: number;
  next_review_date: string;
}

export interface ChatResponse {
  response: string;
  conversation_id: string;
  agent_outputs: {
    user_profile?: Record<string, unknown>;
    market_analysis?: Record<string, unknown>;
    risk_analysis?: Record<string, unknown>;
    investment_strategy?: Record<string, unknown>;
  };
  financial_advice?: FinancialAdvice;
}

export const chatApi = {
  send: (data: ChatRequest) => api.post<ChatResponse>("/chat", data),
  getHistory: (userId: number) =>
    api.get<{ user_id: number; history: ChatResponse[]; count: number }>(
      `/chat/history/${userId}`
    ),
};

// ── Portfolio ─────────────────────────────────────────────────────────────────

export interface PortfolioItem {
  id: number;
  user_id: number;
  asset_name: string;
  asset_type: string;
  quantity: number;
  purchase_price: number;
  current_price: number;
  sector?: string;
  value: number;
  gain_loss: number;
  gain_loss_pct: number;
}

export interface PortfolioSummary {
  user_id: number;
  total_value: number;
  total_cost: number;
  total_gain_loss: number;
  total_gain_loss_pct: number;
  allocation: Record<string, number>;
  items_count: number;
}

export interface PortfolioItemCreate {
  asset_name: string;
  asset_type: string;
  quantity: number;
  purchase_price: number;
  current_price: number;
  sector?: string;
}

export const portfolioApi = {
  getSummary: (userId: number) =>
    api.get<PortfolioSummary>(`/portfolio/${userId}`),

  getItems: (userId: number) =>
    api.get<PortfolioItem[]>(`/portfolio/${userId}/items`),

  addItem: (userId: number, item: PortfolioItemCreate) =>
    api.post<PortfolioItem>(`/portfolio/${userId}/item`, item),

  deleteItem: (userId: number, itemId: number) =>
    api.delete(`/portfolio/${userId}/item/${itemId}`),

  getRebalancing: (userId: number) =>
    api.get(`/portfolio/${userId}/rebalancing`),
};

// ── Market ─────────────────────────────────────────────────────────────────────

export interface MarketInsights {
  sentiment: {
    sentiment: string;
    score: number;
    description?: string;
  };
  news: Array<{
    title: string;
    description?: string;
    url?: string;
    publishedAt?: string;
    source?: string;
  }>;
  trending_topics: string[];
}

export const marketApi = {
  getInsights: () => api.get<MarketInsights>("/market-insights"),
  getSymbols: (symbols: string) =>
    api.get(`/market-insights/symbols?symbols=${symbols}`),
  getSentiment: () => api.get("/market-insights/sentiment"),
  getNews: (query?: string) =>
    api.get(`/market-insights/news${query ? `?query=${encodeURIComponent(query)}` : ""}`),
};

// ── Upload ─────────────────────────────────────────────────────────────────────

export const uploadApi = {
  uploadFile: (file: File, dataType: string, userId: number) => {
    const form = new FormData();
    form.append("file", file);
    form.append("data_type", dataType);
    form.append("user_id", String(userId));
    return api.post("/upload/financial-data", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
