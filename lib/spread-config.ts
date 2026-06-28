/**
 * 塔罗牌阵配置
 * 根据不同问题类型定义对应的牌阵和卡牌数量
 */

export type SpreadType = 
  | 'yes_no'           // Yes or No
  | 'single_card'      // One card reading
  | 'daily_fashion'    // 每日穿搭提示
  | 'reconciliation_starter' // 免费复合 starter
  | 'love_starter'      // 免费爱情 starter
  | 'career_starter'    // 免费事业 starter
  | 'decision_starter'  // 免费决策 starter
  | 'breakup_recovery' // 分手挽回
  | 'exam_fortune'     // 考试运势
  | 'shopping_decision'// 购物决策
  | 'love_connection'  // 桃花正缘
  | 'relationship'     // 关系预测
  | 'their_thoughts'   // TA 的想法和态度
  | 'job_opportunity'  // 求职机会
  | 'binary_choice'    // 二选一
  | 'interpersonal'    // 人际关系
  | 'triple_choice'    // 三选一
  | 'three_card'       // 默认三牌阵（过去、现在、未来）

export interface SpreadPosition {
  name: string       // 位置名称
  nameEn: string     // 英文名称
  description: string // 描述
}

export interface SpreadConfig {
  type: SpreadType
  name: string
  nameEn: string
  cardCount: number
  icon: string       // Compact label for UI badges
  description: string
  descriptionEn?: string
  positions: SpreadPosition[]
  keywords: string[] // 用于匹配用户问题的关键词
}

export const FREE_SPREAD_TYPES = new Set<SpreadType>([
  'yes_no',
  'single_card',
  'daily_fashion',
  'reconciliation_starter',
  'love_starter',
  'career_starter',
  'decision_starter',
  'shopping_decision',
  'binary_choice',
  'triple_choice',
  'three_card',
])

export type SpreadAccessTier = 'free' | 'member_depth'
export type SpreadUpgradeFeature = 'advanced_spread'

/**
 * 所有牌阵配置
 */
export const SPREAD_CONFIGS: Record<SpreadType, SpreadConfig> = {
  yes_no: {
    type: 'yes_no',
    name: 'Yes or No',
    nameEn: 'Yes or No',
    cardCount: 1,
    icon: 'YN',
    description: '简单明了的是非问题，一张牌给你答案',
    descriptionEn: 'A direct one-card spread for a clear yes-or-no question.',
    positions: [
      { name: '答案', nameEn: 'Answer', description: '正位代表"是"，逆位代表"否"或"需要等待"' }
    ],
    keywords: ['是否', '会不会', '能不能', '可不可以', '要不要', '行不行', 'yes', 'no', 'yes or no', '是或否']
  },

  single_card: {
    type: 'single_card',
    name: '一张牌解读',
    nameEn: 'One Card Reading',
    cardCount: 1,
    icon: '1',
    description: '用一张牌抓住当前问题的核心讯息和下一步建议',
    descriptionEn: 'A focused one-card spread for the core message, present energy, and one useful next step.',
    positions: [
      { name: '核心讯息', nameEn: 'Core Message', description: '当前问题里最需要看清的主题、能量或建议' }
    ],
    keywords: ['一张牌', '单张牌', '一个牌', 'one card', 'single card', 'quick tarot', 'card of the moment']
  },

  daily_fashion: {
    type: 'daily_fashion',
    name: '每日穿搭提示',
    nameEn: 'Daily Fashion Tips',
    cardCount: 1,
    icon: 'STYLE',
    description: '让塔罗指引你今天的穿搭风格',
    descriptionEn: "A light daily card for style, color, and mood cues.",
    positions: [
      { name: '今日风格', nameEn: 'Today\'s Style', description: '今天适合的穿搭风格和颜色' }
    ],
    keywords: ['穿什么', '穿搭', '穿衣', '搭配', '衣服', '风格', '今天穿', 'fashion', '造型']
  },

  reconciliation_starter: {
    type: 'reconciliation_starter',
    name: '复合免费起始牌阵',
    nameEn: 'Free Reconciliation Starter',
    cardCount: 3,
    icon: 'EX',
    description: '先用三张牌免费查看复合线索、阻碍和健康下一步',
    descriptionEn: 'A free three-card starter for reconciliation signals, blocks, and the healthiest next step.',
    positions: [
      { name: '仍在延续的能量', nameEn: 'What Remains', description: '这段关系里仍然活跃的情绪、牵挂或未完成主题' },
      { name: '真正的阻碍', nameEn: 'Real Block', description: '阻止联系、修复或放下的关键因素' },
      { name: '健康下一步', nameEn: 'Healthiest Next Step', description: '现在最能保护你、也最有建设性的行动' },
    ],
    keywords: [],
  },

  love_starter: {
    type: 'love_starter',
    name: '爱情免费起始牌阵',
    nameEn: 'Free Love Starter',
    cardCount: 3,
    icon: 'LOVE3',
    description: '先用三张牌免费查看感情能量、对方信号和你的下一步',
    descriptionEn: 'A free three-card starter for love energy, the other person’s signal, and your next step.',
    positions: [
      { name: '当前感情能量', nameEn: 'Current Love Energy', description: '这段感情或吸引力现在最明显的状态' },
      { name: '对方信号', nameEn: 'Their Signal', description: '对方行为、情绪或可观察信号的核心倾向' },
      { name: '你的下一步', nameEn: 'Your Next Step', description: '你可以采取的更清醒、更自尊的行动' },
    ],
    keywords: [],
  },

  career_starter: {
    type: 'career_starter',
    name: '事业免费起始牌阵',
    nameEn: 'Free Career Starter',
    cardCount: 3,
    icon: 'JOB3',
    description: '先用三张牌免费查看工作压力、机会和现实行动',
    descriptionEn: 'A free three-card starter for work pressure, opportunity, and one practical move.',
    positions: [
      { name: '当前压力', nameEn: 'Current Pressure', description: '工作、求职或事业方向里最需要看清的压力' },
      { name: '可用机会', nameEn: 'Available Opportunity', description: '现在可以利用的资源、优势或窗口' },
      { name: '现实行动', nameEn: 'Practical Move', description: '接下来最稳妥、最可执行的一步' },
    ],
    keywords: [],
  },

  decision_starter: {
    type: 'decision_starter',
    name: '决策免费起始牌阵',
    nameEn: 'Free Decision Starter',
    cardCount: 3,
    icon: 'ACT',
    description: '先用三张牌免费查看核心选择、隐藏代价和下一步行动',
    descriptionEn: 'A free three-card starter for the core choice, hidden cost, and next action.',
    positions: [
      { name: '核心选择', nameEn: 'Core Choice', description: '这个问题真正要求你选择或承认的部分' },
      { name: '隐藏代价', nameEn: 'Hidden Cost', description: '如果继续拖延或冲动行动，容易忽视的代价' },
      { name: '下一步行动', nameEn: 'Next Action', description: '现在最能带来清晰度的实际动作' },
    ],
    keywords: [],
  },

  breakup_recovery: {
    type: 'breakup_recovery',
    name: '分手挽回',
    nameEn: 'Breakup Recovery',
    cardCount: 5,
    icon: 'BR',
    description: '深入分析分手原因，挽回的可能性和建议',
    descriptionEn: 'A five-card spread for breakup causes, remaining energy, recovery advice, and next direction.',
    positions: [
      { name: '分手原因', nameEn: 'Reason', description: '导致分手的核心原因' },
      { name: '你的状态', nameEn: 'Your State', description: '你目前的心理状态' },
      { name: 'TA的状态', nameEn: 'Their State', description: '对方目前的心理状态' },
      { name: '挽回建议', nameEn: 'Advice', description: '如何行动的建议' },
      { name: '未来走向', nameEn: 'Future', description: '关系的未来发展' }
    ],
    keywords: ['分手', '挽回', '复合', '前任', '前男友', '前女友', '分开', '离开', '还爱', '回来', 'ex', 'breakup', 'break up', 'come back', 'return', 'reconcile', 'reconciliation', 'get back together']
  },

  exam_fortune: {
    type: 'exam_fortune',
    name: '考试运势',
    nameEn: 'Exam Fortune',
    cardCount: 4,
    icon: 'EXAM',
    description: '预测考试运势，找到复习重点和注意事项',
    descriptionEn: 'A study and exam spread for preparation, strengths, cautions, and likely outcome.',
    positions: [
      { name: '当前状态', nameEn: 'Current State', description: '你目前的准备状态' },
      { name: '优势', nameEn: 'Strength', description: '你的优势和可以发挥的地方' },
      { name: '注意事项', nameEn: 'Caution', description: '需要特别注意的方面' },
      { name: '结果预测', nameEn: 'Outcome', description: '考试结果的趋势' }
    ],
    keywords: ['考试', '面试', '笔试', '答辩', '考研', '高考', '中考', '期末', '资格证', '驾照', '成绩']
  },

  shopping_decision: {
    type: 'shopping_decision',
    name: '购物决策',
    nameEn: 'Shopping Decision',
    cardCount: 3,
    icon: 'BUY',
    description: '帮你做出更好的购物决定',
    descriptionEn: 'A practical spread for purchase desire, real value, and buying advice.',
    positions: [
      { name: '购买欲望', nameEn: 'Desire', description: '你真正需要它吗？' },
      { name: '实际价值', nameEn: 'Value', description: '这个购买是否物有所值' },
      { name: '建议', nameEn: 'Advice', description: '是否应该购买' }
    ],
    keywords: ['买', '购买', '购物', '花钱', '消费', '值得', '划算', '下单', '入手']
  },

  love_connection: {
    type: 'love_connection',
    name: '桃花正缘',
    nameEn: 'Love Connection',
    cardCount: 4,
    icon: 'LOVE',
    description: '探索你的感情运势和正缘特征',
    descriptionEn: 'A love-potential spread for dating energy, soulmate traits, timing, and advice.',
    positions: [
      { name: '桃花运势', nameEn: 'Love Fortune', description: '近期的桃花运如何' },
      { name: '正缘特征', nameEn: 'Soulmate Traits', description: '你的正缘是什么样的人' },
      { name: '相遇时机', nameEn: 'Timing', description: '可能的相遇时间和场合' },
      { name: '行动建议', nameEn: 'Advice', description: '如何增加遇到正缘的机会' }
    ],
    keywords: ['桃花', '正缘', '脱单', '单身', '遇到', '另一半', '姻缘', '缘分', '爱情', '恋爱', 'single', 'dating', 'crush', 'soulmate', 'new love', 'meet someone']
  },

  relationship: {
    type: 'relationship',
    name: '关系预测',
    nameEn: 'Relationship Prediction',
    cardCount: 5,
    icon: 'REL',
    description: '全面分析你们的感情关系走向',
    descriptionEn: 'A relationship spread for the current bond, both sides, challenges, and likely direction.',
    positions: [
      { name: '关系现状', nameEn: 'Current State', description: '目前关系的状态' },
      { name: '你的感受', nameEn: 'Your Feelings', description: '你在这段关系中的真实感受' },
      { name: 'TA的感受', nameEn: 'Their Feelings', description: '对方在这段关系中的感受' },
      { name: '挑战', nameEn: 'Challenge', description: '你们需要面对的挑战' },
      { name: '未来发展', nameEn: 'Future', description: '关系的未来走向' }
    ],
    keywords: ['关系', '感情', '在一起', '发展', '未来', '我们', '这段', '走向', '结婚', '长久', 'relationship', 'between us', 'together', 'commitment', 'marriage', 'future together']
  },

  their_thoughts: {
    type: 'their_thoughts',
    name: 'TA 的想法和态度',
    nameEn: 'Their Thoughts & Attitude',
    cardCount: 5,
    icon: 'MIND',
    description: '深入了解对方的内心想法和对你的态度',
    descriptionEn: 'A five-card spread for their impression, thoughts, attitude, concerns, and likely action.',
    positions: [
      { name: '对你的印象', nameEn: 'Impression', description: 'TA对你的整体印象' },
      { name: '内心想法', nameEn: 'Thoughts', description: 'TA内心真实的想法' },
      { name: '对你的态度', nameEn: 'Attitude', description: 'TA对你的态度' },
      { name: '顾虑', nameEn: 'Concerns', description: 'TA的顾虑和担心' },
      { name: '可能的行动', nameEn: 'Possible Actions', description: 'TA接下来可能的行动' }
    ],
    keywords: ['他', '她', 'TA', '对方', '想法', '态度', '喜欢我', '怎么想', '心里', '看我', 'does he love', 'does she love', 'he love', 'she love', 'his feelings', 'her feelings', 'feelings for me', 'mixed signals', 'think of me', 'attitude toward me']
  },

  job_opportunity: {
    type: 'job_opportunity',
    name: '求职机会',
    nameEn: 'Job Opportunity',
    cardCount: 4,
    icon: 'JOB',
    description: '分析求职运势和工作机会',
    descriptionEn: 'A career spread for opportunities, strengths, cautions, and the next professional opening.',
    positions: [
      { name: '求职运势', nameEn: 'Job Fortune', description: '近期的求职运势' },
      { name: '你的优势', nameEn: 'Your Strength', description: '你在求职中的优势' },
      { name: '需要注意', nameEn: 'Caution', description: '求职过程中需要注意的事项' },
      { name: '机会预测', nameEn: 'Opportunity', description: '工作机会的预测' }
    ],
    keywords: ['工作', '求职', '跳槽', '离职', '入职', 'offer', '招聘', '职位', '岗位', '找工作', '换工作', 'job', 'career', 'work', 'quit', 'resign', 'interview', 'promotion', 'salary', 'business', 'workplace']
  },

  binary_choice: {
    type: 'binary_choice',
    name: '二选一',
    nameEn: 'Binary Choice',
    cardCount: 2,
    icon: 'A/B',
    description: '面对两个选择时，帮你看清每个选项的能量',
    descriptionEn: 'A two-option spread for comparing the energy and outcome of each choice.',
    positions: [
      { name: '选项A', nameEn: 'Option A', description: '第一个选项的能量和结果' },
      { name: '选项B', nameEn: 'Option B', description: '第二个选项的能量和结果' }
    ],
    keywords: ['选择', '二选一', '还是', '或者', 'A还是B', '哪个', '左右为难', '纠结', 'choose', 'choice', 'option', 'which one', 'stay or leave', 'a or b']
  },

  interpersonal: {
    type: 'interpersonal',
    name: '人际关系',
    nameEn: 'Interpersonal Relations',
    cardCount: 5,
    icon: 'SOC',
    description: '分析人际关系中的问题和改善方向',
    descriptionEn: 'A social dynamics spread for current tension, your role, feedback, problems, and repair.',
    positions: [
      { name: '关系现状', nameEn: 'Current State', description: '目前的人际关系状态' },
      { name: '你的表现', nameEn: 'Your Performance', description: '你在人际关系中的表现' },
      { name: '对方反馈', nameEn: 'Their Feedback', description: '他人对你的看法' },
      { name: '问题所在', nameEn: 'Problem', description: '人际关系中存在的问题' },
      { name: '改善建议', nameEn: 'Improvement', description: '如何改善人际关系' }
    ],
    keywords: ['人际', '朋友', '同事', '社交', '相处', '友情', '友谊', '闺蜜', '兄弟', '室友']
  },

  triple_choice: {
    type: 'triple_choice',
    name: '三选一',
    nameEn: 'Triple Choice',
    cardCount: 3,
    icon: 'A/B/C',
    description: '面对三个选择时，看清每个选项的能量',
    descriptionEn: 'A three-option spread for comparing multiple directions clearly.',
    positions: [
      { name: '选项A', nameEn: 'Option A', description: '第一个选项的能量和结果' },
      { name: '选项B', nameEn: 'Option B', description: '第二个选项的能量和结果' },
      { name: '选项C', nameEn: 'Option C', description: '第三个选项的能量和结果' }
    ],
    keywords: ['三选一', '三个选择', '三个方向']
  },

  three_card: {
    type: 'three_card',
    name: '时间之流',
    nameEn: 'Past Present Future',
    cardCount: 3,
    icon: '3',
    description: '经典的三牌阵，从过去、现在、未来三个维度解读',
    descriptionEn: 'Classic three-card spread, reading from past, present, and future perspectives.',
    positions: [
      { name: '过去', nameEn: 'Past', description: '过去发生的事情和影响' },
      { name: '现在', nameEn: 'Present', description: '当前的状态和处境' },
      { name: '未来', nameEn: 'Future', description: '未来的趋势和发展' }
    ],
    keywords: []  // 作为默认牌阵，不需要关键词匹配
  }
}

/**
 * 获取牌阵配置
 */
export function getSpreadConfig(type: SpreadType): SpreadConfig {
  return SPREAD_CONFIGS[type] || SPREAD_CONFIGS.three_card
}

export function isKnownSpreadType(value: string | null | undefined): value is SpreadType {
  return !!value && Object.prototype.hasOwnProperty.call(SPREAD_CONFIGS, value)
}

export function isAdvancedSpreadType(value: string | null | undefined): value is SpreadType {
  if (!isKnownSpreadType(value)) return false
  return !FREE_SPREAD_TYPES.has(value)
}

const FREE_STARTER_FALLBACKS: Partial<Record<SpreadType, SpreadType>> = {
  breakup_recovery: 'reconciliation_starter',
  relationship: 'love_starter',
  their_thoughts: 'love_starter',
  love_connection: 'love_starter',
  job_opportunity: 'career_starter',
  exam_fortune: 'career_starter',
  interpersonal: 'decision_starter',
}

export function getFreeSpreadFallback(type?: string | null): SpreadConfig {
  if (isKnownSpreadType(type)) {
    return SPREAD_CONFIGS[FREE_STARTER_FALLBACKS[type] || 'three_card']
  }
  return SPREAD_CONFIGS.three_card
}

export function getSpreadAccessTier(value: string | null | undefined): SpreadAccessTier {
  return isAdvancedSpreadType(value) ? 'member_depth' : 'free'
}

export function getSpreadUpgradeFeature(value: string | null | undefined): SpreadUpgradeFeature | null {
  return isAdvancedSpreadType(value) ? 'advanced_spread' : null
}

/**
 * 获取所有牌阵列表（用于展示）
 */
export function getAllSpreads(): SpreadConfig[] {
  return Object.values(SPREAD_CONFIGS)
}

/**
 * 根据语言获取牌阵名称
 */
export function getSpreadName(config: SpreadConfig, lang: string = 'zh'): string {
  return lang === 'en' ? config.nameEn : config.name
}

/**
 * 根据语言获取位置名称
 */
export function getPositionName(position: SpreadPosition, lang: string = 'zh'): string {
  return lang === 'en' ? position.nameEn : position.name
}

/**
 * 问题分类结果接口
 */
export interface QuestionClassification {
  spreadType: SpreadType
  confidence: number  // 0-1 的置信度
  reason: string      // 分类原因说明
}
