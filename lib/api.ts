/**
 * POPTarot API 客户端
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

// Token 管理
let accessToken: string | null = null

export function setAccessToken(token: string | null) {
  accessToken = token
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('access_token', token)
    } else {
      localStorage.removeItem('access_token')
    }
  }
}

export function getAccessToken(): string | null {
  if (accessToken) return accessToken
  if (typeof window !== 'undefined') {
    accessToken = localStorage.getItem('access_token')
  }
  return accessToken
}

// 通用请求函数
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const apiEndpoint = endpoint.startsWith('/api/') ? endpoint : `/api${endpoint}`
  const url = `${API_BASE_URL}${apiEndpoint}`
  const token = getAccessToken()
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }
  
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'Request failed')
  }
  
  return data
}

// ========== Auth API ==========

export interface User {
  id: string
  email: string | null
  nickname: string
  avatar_url?: string
  credits: number
  is_member: boolean
  member_type?: string
  member_expire_at?: string
  is_partner: boolean
  referral_code: string
  is_anonymous?: boolean
  birthday?: string
}

export interface LoginResponse {
  message: string
  access_token: string
  user: User
}

export interface RegisterResponse {
  message: string
  access_token: string
  user: {
    id: string
    email: string
    nickname: string
    referral_code: string
  }
}

export const authApi = {
  // 登录
  login: async (email: string, password: string): Promise<LoginResponse> => {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },
  
  // 注册
  register: async (
    email: string,
    password: string,
    nickname?: string,
    referralCode?: string
  ): Promise<RegisterResponse> => {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        nickname,
        referral_code: referralCode,
      }),
    })
  },
  
  // 匿名注册
  registerAnonymous: async (): Promise<LoginResponse> => {
    return request('/auth/register-anonymous', {
      method: 'POST',
      body: JSON.stringify({}),
    })
  },
  
  // 绑定邮箱（匿名用户转正式用户）
  bindEmail: async (
    email: string,
    password: string,
    nickname?: string
  ): Promise<{ message: string; user: { id: string; email: string; nickname: string } }> => {
    return request('/auth/bind-email', {
      method: 'POST',
      body: JSON.stringify({ email, password, nickname }),
    })
  },
  
  // 获取当前用户信息
  getCurrentUser: async (): Promise<User> => {
    return request('/auth/me')
  },
}

// ========== Member API ==========

export interface MemberPlan {
  id: string
  plan_type: string
  name: string
  price: number
  original_price?: number
  duration_days: number
  credits_gift: number
  description?: string
  features?: string
}

export interface MemberStatus {
  is_member: boolean
  member_type?: string
  member_expire_at?: string
  is_partner: boolean
  partner_expire_at?: string
}

export interface PartnerStats {
  referral_count: number
  total_orders: number
  total_amount: number
  total_commission: number
}

export const memberApi = {
  // 获取会员套餐列表（支持多语言）
  getPlans: async (lang: string = 'zh'): Promise<{ plans: MemberPlan[] }> => {
    return request(`/member/plans?lang=${lang}`)
  },
  
  // 获取会员状态
  getStatus: async (): Promise<MemberStatus> => {
    return request('/member/status')
  },
  
  // 获取合伙人统计
  getPartnerStats: async (): Promise<PartnerStats> => {
    return request('/member/partner/stats')
  },
}

// ========== Payment API ==========

export interface CreateOrderResponse {
  order_no: string
  pay_url: string
  amount: number
  product_name: string
}

export interface OrderStatusResponse {
  paid: boolean
  status?: string
  message?: string
  order?: {
    order_no: string
    trade_no: string
    amount: number
    product_name?: string
    paid_at?: string
  }
}

export interface Order {
  order_no: string
  product_type: string
  product_name: string
  amount: number
  status: string
  paid_at?: string
  created_at: string
}

export interface Product {
  type: string
  name: string
  price: number
  days: number
  credits: number
  stripe_enabled: boolean
}

export const paymentApi = {
  // 获取产品列表
  getProducts: async (): Promise<{ products: Product[] }> => {
    return request('/payment/products')
  },
  
  // 创建支付订单
  createOrder: async (
    productType: 'member_week' | 'member_month' | 'member_year' | 'partner',
    payType: 'alipay' | 'wxpay' | 'stripe' = 'alipay'
  ): Promise<CreateOrderResponse> => {
    return request('/payment/create', {
      method: 'POST',
      body: JSON.stringify({
        product_type: productType,
        pay_type: payType,
      }),
    })
  },
  
  // 检查订单状态
  checkStatus: async (orderNo: string): Promise<OrderStatusResponse> => {
    return request(`/payment/check-status?order_no=${orderNo}`)
  },
  
  // 获取订单列表
  getOrders: async (): Promise<{ orders: Order[] }> => {
    return request('/payment/orders')
  },
}

// ========== Analytics API ==========

export type AnalyticsEventName =
  | 'page_view'
  | 'question_submitted'
  | 'cards_selected'
  | 'reading_completed'
  | 'share_created'
  | 'share_session_only'
  | 'share_template_copied'
  | 'payment_started'
  | 'payment_completed'

export interface AnalyticsSummary {
  range_days: number
  totals: {
    page_views: number
    sessions: number
    questions: number
    cards_selected: number
    readings_completed: number
    shares_created: number
    share_templates_copied: number
    payment_started: number
    payment_completed: number
  }
  rates: {
    card_selection_rate: number
    reading_completion_rate: number
    payment_start_rate: number
    payment_conversion_rate: number
  }
  top_sources: Array<{ label: string; count: number }>
  top_keywords: Array<{ label: string; count: number }>
  daily: Array<{
    date: string
    page_view: number
    question_submitted: number
    reading_completed: number
    payment_completed: number
  }>
}

export const analyticsApi = {
  track: async (
    eventName: AnalyticsEventName,
    payload: Record<string, unknown> = {}
  ): Promise<void> => {
    try {
      await request('/analytics/event', {
        method: 'POST',
        body: JSON.stringify({
          event_name: eventName,
          ...payload,
        }),
      })
    } catch (error) {
      console.warn('[Analytics] track failed:', error)
    }
  },

  getSummary: async (days: number = 30): Promise<AnalyticsSummary> => {
    return request(`/analytics/summary?days=${days}`)
  },
}

// ========== Daily Tarot API ==========

export interface DailyTarotEntry {
  id?: string
  entry_date: string
  card_id: number
  card_name: string
  is_reversed: boolean
  question: string
  interpretation?: string | null
  journal?: string | null
  mood?: string | null
  streak_count: number
  reminder_enabled: boolean
  reminder_email?: string | null
  reminder_time: string
  reminder_timezone: string
}

export interface DailyReminderCapability {
  email_delivery_enabled: boolean
  can_send_email_reminders?: boolean
  calendar_reminder_available?: boolean
  setup_required?: boolean
  scheduled_delivery_enabled?: boolean
  email_provider_configured?: boolean
  service_database_configured?: boolean
  unsubscribe_configured?: boolean
  reminder_database_access_mode?: "cron_secret_rpc" | "unavailable"
  cron_authorization_configured?: boolean
  cron_path_configured?: boolean
  missing_capabilities?: string[]
  delivery_status?: "ready" | "setup_required"
  next_setup_step?: string
}

export const dailyTarotApi = {
  getToday: async (date?: string): Promise<{ entry: DailyTarotEntry | null; streak_count: number; recent_entries?: DailyTarotEntry[] }> => {
    return request(`/daily-tarot${date ? `?date=${encodeURIComponent(date)}` : ''}`)
  },

  getReminderCapability: async (): Promise<DailyReminderCapability> => {
    return request('/daily-tarot/reminder-capability')
  },

  saveEntry: async (payload: Partial<DailyTarotEntry> & {
    entry_date: string
    card_id: number
    is_reversed: boolean
    question: string
  }): Promise<{ entry: DailyTarotEntry; recent_entries?: DailyTarotEntry[] }> => {
    return request('/daily-tarot', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  updateEntry: async (payload: Partial<DailyTarotEntry> & { entry_date: string }): Promise<{ entry: DailyTarotEntry }> => {
    return request('/daily-tarot', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
  },
}

// ========== Monthly Tarot Report API ==========

export interface MonthlyReportTheme {
  key: string
  title: string
  summary: string
  score: number
  evidence: string[]
}

export interface MonthlyReportCardSummary {
  label: string
  count: number
  upright: number
  reversed: number
}

export interface MonthlyTarotReport {
  month_label: string
  generated_at: string
  period: {
    start_date: string
    end_date: string
  }
  is_empty: boolean
  totals: {
    readings: number
    daily_entries: number
    journal_notes: number
    unique_cards: number
    current_streak: number
  }
  top_cards: MonthlyReportCardSummary[]
  themes: MonthlyReportTheme[]
  spread_mix: Array<{ label: string; count: number }>
  daily_notes: Array<{ date: string; card: string; note: string }>
  next_month_prompts: string[]
}

export const monthlyReportApi = {
  get: async (lang: string = 'en', month?: string): Promise<MonthlyTarotReport> => {
    const params = new URLSearchParams({ lang })
    if (month) params.set('month', month)
    return request(`/monthly-tarot-report?${params.toString()}`)
  },
}

// ========== Reading API ==========

export interface CardData {
  name: string
  position?: string
  isReversed: boolean
  meaning: {
    upright: string
    reversed: string
  }
}

export interface SpreadPosition {
  name: string
  nameEn: string
  nameJa?: string
  nameKo?: string
  description: string
}

export type DeckType = 'major' | 'full'

export interface SpreadConfig {
  name: string
  nameEn: string
  nameJa?: string
  nameKo?: string
  cardCount: number
  icon: string
  description: string
  descriptionEn?: string
  descriptionJa?: string
  descriptionKo?: string
  deckType?: DeckType  // 牌组类型: major=大阿尔卡纳22张, full=全部78张
  is_advanced?: boolean
  positions: SpreadPosition[]
}

export interface QuestionClassificationResponse {
  spread_type: string
  deck_type: DeckType  // AI推荐的牌组类型
  confidence: number
  reason: string
  is_advanced?: boolean
  spread_config: SpreadConfig
}

export interface CreateReadingResponse {
  reading_id: string
  credits_used: number
  message: string
}

export interface ReadingRecord {
  id: string
  question: string
  cards: CardData[]
  interpretation?: string
  spread_type: string
  is_ai_analyzed: boolean
  created_at: string
}

export interface ReadingShareCard {
  id?: number
  name: string
  nameEn?: string
  image?: string
  isReversed: boolean
}

export interface ReadingShare {
  slug: string
  question: string
  cards: ReadingShareCard[]
  spread_type: string
  interpretation_excerpt: string
  created_at: string
}

export interface ReadingHistoryResponse {
  readings: ReadingRecord[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

export const readingApi = {
  // 分析问题类型，返回推荐的牌阵
  classifyQuestion: async (
    question: string,
    lang: string = 'zh'
  ): Promise<QuestionClassificationResponse> => {
    return request('/reading/classify-question', {
      method: 'POST',
      body: JSON.stringify({ question, lang }),
    })
  },
  
  // 获取所有牌阵配置
  getSpreads: async (lang: string = 'zh'): Promise<{ spreads: Array<SpreadConfig & { type: string }> }> => {
    return request(`/reading/spreads?lang=${lang}`)
  },

  // 创建解读记录
  create: async (
    question: string,
    cards: CardData[],
    spreadType: string = 'three_card',
    lang?: string
  ): Promise<CreateReadingResponse> => {
    return request('/reading/create', {
      method: 'POST',
      body: JSON.stringify({
        question,
        cards,
        spread_type: spreadType,
        lang,
      }),
    })
  },
  
  // AI 解读（流式输出）
  interpret: async (
    question: string,
    cards: any[],
    isFollowUp: boolean = false,
    followUpQuestion?: string,
    previousMessages?: string[],
    lang?: string,
    spreadType?: string
  ): Promise<Response> => {
    const token = getAccessToken()
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    if (token) {
      ;(headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
    }

    return fetch('/api/reading', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        question,
        cards,
        isFollowUp,
        followUpQuestion,
        previousMessages,
        lang: lang || 'zh',
        spread_type: spreadType || 'three_card',
      }),
    })
  },

  // 保存 AI 解读结果
  saveInterpretation: async (
    readingId: string,
    interpretation: string,
    lang?: string
  ): Promise<{ message: string }> => {
    return request('/reading/save-interpretation', {
      method: 'POST',
      body: JSON.stringify({
        reading_id: readingId,
        interpretation,
        lang,
      }),
    })
  },

  // 创建公开分享快照
  createShare: async (payload: {
    reading_id?: string
    question: string
    cards: unknown[]
    interpretation?: string
    spread_type?: string
  }): Promise<{ slug: string; url: string }> => {
    return request('/reading/share', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  // 获取公开分享快照
  getShare: async (slug: string): Promise<ReadingShare> => {
    return request(`/reading/share/${slug}`)
  },
  
  // 获取解读历史
  getHistory: async (
    page: number = 1,
    perPage: number = 20
  ): Promise<ReadingHistoryResponse> => {
    return request(`/reading/history?page=${page}&per_page=${perPage}`)
  },
  
  // 获取解读详情
  getDetail: async (readingId: string): Promise<ReadingRecord> => {
    return request(`/reading/${readingId}`)
  },
  
  // 删除解读记录
  delete: async (readingId: string): Promise<{ message: string }> => {
    return request(`/reading/${readingId}`, {
      method: 'DELETE',
    })
  },
  
  // 生成追问建议
  generateFollowupQuestions: async (
    question: string,
    cards: CardData[],
    history?: Array<{ question: string; content: string }>,
    lang?: string
  ): Promise<{ questions: string[] }> => {
    return request('/reading/generate-followup-questions', {
      method: 'POST',
      body: JSON.stringify({
        question,
        cards,
        history,
        lang: lang || 'zh',
      }),
    })
  },
}

// ========== User API ==========

export interface UserProfile {
  id: string
  email: string
  nickname: string
  avatar_url?: string
  credits: number
  is_member: boolean
  member_type?: string
  member_expire_at?: string
  is_partner: boolean
  referral_code: string
  referral_count: number
}

export interface CreditHistory {
  id: string
  amount: number
  type: string
  description: string
  created_at: string
}

export interface Referral {
  id: string
  invitee_nickname: string
  invitee_email: string
  reward_days: number
  created_at: string
}

export const userApi = {
  // 获取用户资料
  getProfile: async (): Promise<UserProfile> => {
    return request('/user/profile')
  },
  
  // 更新用户资料
  updateProfile: async (data: {
    nickname?: string
    avatar_url?: string
    birthday?: string
  }): Promise<{ message: string }> => {
    return request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
  
  // 获取积分余额
  getCredits: async (): Promise<{ credits: number }> => {
    return request('/user/credits')
  },
  
  // 获取积分历史
  getCreditsHistory: async (
    page: number = 1,
    perPage: number = 20
  ): Promise<{ history: CreditHistory[]; total: number }> => {
    return request(`/user/credits/history?page=${page}&per_page=${perPage}`)
  },
  
  // 获取邀请记录
  getReferrals: async (): Promise<{ referrals: Referral[]; total: number }> => {
    return request('/user/referrals')
  },
}
