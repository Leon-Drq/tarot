// 塔罗牌数据 - 78张完整牌组
// 大阿尔卡纳 (Major Arcana): 0-21
// 小阿尔卡纳 (Minor Arcana): 22-77

export interface TarotCard {
  id: number
  name: string
  nameEn: string
  nameJa?: string
  nameKo?: string
  image: string
  meaning: {
    upright: string
    reversed: string
  }
}

export interface DrawnCard extends TarotCard {
  isReversed: boolean
}

export const TAROT_CARDS: TarotCard[] = [
  // ===== 大阿尔卡纳 (Major Arcana) =====
  {
    id: 0,
    name: "愚者",
    nameEn: "The Fool",
    nameJa: "愚者",
    nameKo: "바보",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/0.png",
    meaning: {
      upright: "新的开始、冒险、自由、天真、自发性",
      reversed: "鲁莽、冒险、不负责任、停滞",
    },
  },
  {
    id: 1,
    name: "魔术师",
    nameEn: "The Magician",
    nameJa: "魔術師",
    nameKo: "마법사",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/1.png",
    meaning: {
      upright: "意志力、创造力、技能、自信、专注",
      reversed: "欺骗、操纵、技能不足、缺乏方向",
    },
  },
  {
    id: 2,
    name: "女祭司",
    nameEn: "The High Priestess",
    nameJa: "女教皇",
    nameKo: "여사제",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/2.png",
    meaning: {
      upright: "直觉、神秘、内在智慧、潜意识",
      reversed: "隐藏的动机、表面化、忽视直觉",
    },
  },
  {
    id: 3,
    name: "女皇",
    nameEn: "The Empress",
    nameJa: "女帝",
    nameKo: "여제",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/3.png",
    meaning: {
      upright: "丰饶、母性、自然、创造力、美",
      reversed: "依赖、空虚、过度保护、创造力受阻",
    },
  },
  {
    id: 4,
    name: "皇帝",
    nameEn: "The Emperor",
    nameJa: "皇帝",
    nameKo: "황제",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/4.png",
    meaning: {
      upright: "权威、结构、控制、父性、稳定",
      reversed: "专制、僵化、缺乏纪律、滥用权力",
    },
  },
  {
    id: 5,
    name: "教皇",
    nameEn: "The Hierophant",
    nameJa: "法王",
    nameKo: "교황",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/5.png",
    meaning: {
      upright: "传统、信仰、教育、指导、仪式",
      reversed: "叛逆、打破传统、非传统、个人信仰",
    },
  },
  {
    id: 6,
    name: "恋人",
    nameEn: "The Lovers",
    nameJa: "恋人",
    nameKo: "연인",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/6.png",
    meaning: {
      upright: "爱情、和谐、关系、选择、价值观",
      reversed: "失衡、不和谐、错误选择、价值观冲突",
    },
  },
  {
    id: 7,
    name: "战车",
    nameEn: "The Chariot",
    nameJa: "戦車",
    nameKo: "전차",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/7.png",
    meaning: {
      upright: "意志力、胜利、决心、控制、行动",
      reversed: "失控、攻击性、缺乏方向、挫败",
    },
  },
  // ===== 新添加的牌 (8-15 大阿尔卡纳) =====
  {
    id: 8,
    name: "力量",
    nameEn: "Strength",
    nameJa: "力",
    nameKo: "힘",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/8.png",
    meaning: {
      upright: "勇气、耐心、内在力量、慈悲、自信",
      reversed: "自我怀疑、软弱、不安全感、缺乏勇气",
    },
  },
  {
    id: 9,
    name: "隐士",
    nameEn: "The Hermit",
    nameJa: "隠者",
    nameKo: "은둔자",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/9.png",
    meaning: {
      upright: "内省、独处、指引、智慧、寻找真理",
      reversed: "孤立、孤独、退缩、迷失方向",
    },
  },
  {
    id: 10,
    name: "命运之轮",
    nameEn: "Wheel of Fortune",
    nameJa: "運命の輪",
    nameKo: "운명의 수레바퀴",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/10.png",
    meaning: {
      upright: "命运、转变、周期、好运、转折点",
      reversed: "厄运、抗拒改变、打破循环",
    },
  },
  {
    id: 11,
    name: "正义",
    nameEn: "Justice",
    nameJa: "正義",
    nameKo: "정의",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/11.png",
    meaning: {
      upright: "公正、真理、因果、法律、平衡",
      reversed: "不公正、逃避责任、不诚实",
    },
  },
  {
    id: 12,
    name: "倒吊人",
    nameEn: "The Hanged Man",
    nameJa: "吊られた男",
    nameKo: "매달린 사람",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/12.png",
    meaning: {
      upright: "牺牲、放手、新视角、等待、顺从",
      reversed: "拖延、抗拒、固执、无谓牺牲",
    },
  },
  {
    id: 13,
    name: "死神",
    nameEn: "Death",
    nameJa: "死神",
    nameKo: "죽음",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/13.png",
    meaning: {
      upright: "结束、转变、过渡、放下、新生",
      reversed: "抗拒改变、停滞、无法放下",
    },
  },
  {
    id: 14,
    name: "节制",
    nameEn: "Temperance",
    nameJa: "節制",
    nameKo: "절제",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/14.png",
    meaning: {
      upright: "平衡、节制、耐心、和谐、适度",
      reversed: "失衡、过度、缺乏耐心、冲突",
    },
  },
  {
    id: 15,
    name: "恶魔",
    nameEn: "The Devil",
    nameJa: "悪魔",
    nameKo: "악마",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/15.png",
    meaning: {
      upright: "束缚、诱惑、物质主义、阴影面、依赖",
      reversed: "解脱、打破束缚、重获自由",
    },
  },
  // ===== 添加16-21号大阿尔卡纳牌数据 =====
  {
    id: 16,
    name: "塔",
    nameEn: "The Tower",
    nameJa: "塔",
    nameKo: "탑",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/16.png",
    meaning: {
      upright: "突变、崩塌、启示、剧变、觉醒",
      reversed: "逃避灾难、恐惧改变、延迟崩塌",
    },
  },
  {
    id: 17,
    name: "星星",
    nameEn: "The Star",
    nameJa: "星",
    nameKo: "별",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/17.png",
    meaning: {
      upright: "希望、灵感、宁静、疗愈、信心",
      reversed: "绝望、失去信心、断开连接",
    },
  },
  {
    id: 18,
    name: "月亮",
    nameEn: "The Moon",
    nameJa: "月",
    nameKo: "달",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/18.png",
    meaning: {
      upright: "幻觉、直觉、潜意识、恐惧、迷惑",
      reversed: "释放恐惧、真相揭示、内心清明",
    },
  },
  {
    id: 19,
    name: "太阳",
    nameEn: "The Sun",
    nameJa: "太陽",
    nameKo: "태양",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/19.png",
    meaning: {
      upright: "喜悦、成功、活力、乐观、光明",
      reversed: "暂时受挫、过度乐观、缺乏清晰",
    },
  },
  {
    id: 20,
    name: "审判",
    nameEn: "Judgement",
    nameJa: "審判",
    nameKo: "심판",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/20.png",
    meaning: {
      upright: "觉醒、重生、召唤、反思、救赎",
      reversed: "自我怀疑、拒绝召唤、自我批判",
    },
  },
  {
    id: 21,
    name: "世界",
    nameEn: "The World",
    nameJa: "世界",
    nameKo: "세계",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/21.png",
    meaning: {
      upright: "完成、整合、成就、旅程终点、圆满",
      reversed: "未完成、缺乏结局、延迟成功",
    },
  },
  // ===== 小阿尔卡纳 (Minor Arcana) =====
  // ===== 权杖 (Wands) 22-35 =====
  {
    id: 22,
    name: "权杖王牌",
    nameEn: "Ace of Wands",
    nameJa: "ワンドのエース",
    nameKo: "완드 에이스",
    image: "/images/22.png",
    meaning: {
      upright: "灵感、行动力、新计划、创造火花、成长机会",
      reversed: "延迟、缺乏动力、创意受阻、方向不明",
    },
  },
  {
    id: 23,
    name: "权杖二",
    nameEn: "Two of Wands",
    nameJa: "ワンドの2",
    nameKo: "완드 2",
    image: "/images/23.png",
    meaning: {
      upright: "计划、远见、选择、探索、个人力量",
      reversed: "害怕未知、计划不足、犹豫、视野受限",
    },
  },
  {
    id: 24,
    name: "权杖三",
    nameEn: "Three of Wands",
    nameJa: "ワンドの3",
    nameKo: "완드 3",
    image: "/images/24.png",
    meaning: {
      upright: "扩展、远方机会、等待成果、合作、前景开阔",
      reversed: "延误、缺乏远见、合作受阻、机会缩小",
    },
  },
  {
    id: 25,
    name: "权杖四",
    nameEn: "Four of Wands",
    nameJa: "ワンドの4",
    nameKo: "완드 4",
    image: "/images/25.png",
    meaning: {
      upright: "庆祝、稳定、归属感、家庭喜悦、阶段完成",
      reversed: "不稳定、归属感不足、庆祝延迟、家庭紧张",
    },
  },
  {
    id: 26,
    name: "权杖五",
    nameEn: "Five of Wands",
    nameJa: "ワンドの5",
    nameKo: "완드 5",
    image: "/images/26.png",
    meaning: {
      upright: "竞争、冲突、磨合、观点碰撞、挑战",
      reversed: "避免冲突、内耗、紧张缓和、目标分散",
    },
  },
  {
    id: 27,
    name: "权杖六",
    nameEn: "Six of Wands",
    nameJa: "ワンドの6",
    nameKo: "완드 6",
    image: "/images/27.png",
    meaning: {
      upright: "胜利、认可、公开成功、自信、进展",
      reversed: "自我怀疑、缺乏认可、骄傲、暂时失利",
    },
  },
  {
    id: 28,
    name: "权杖七",
    nameEn: "Seven of Wands",
    nameJa: "ワンドの7",
    nameKo: "완드 7",
    image: "/images/28.png",
    meaning: {
      upright: "坚持立场、防守、勇气、竞争压力、守护成果",
      reversed: "放弃、防御过度、压力过大、信心动摇",
    },
  },
  {
    id: 29,
    name: "权杖八",
    nameEn: "Eight of Wands",
    nameJa: "ワンドの8",
    nameKo: "완드 8",
    image: "/images/29.png",
    meaning: {
      upright: "快速进展、消息、旅行、进展加速、事情推进",
      reversed: "延迟、沟通混乱、急躁、节奏失控",
    },
  },
  {
    id: 30,
    name: "权杖九",
    nameEn: "Nine of Wands",
    nameJa: "ワンドの9",
    nameKo: "완드 9",
    image: "/images/30.png",
    meaning: {
      upright: "韧性、边界、坚持、警觉、最后考验",
      reversed: "疲惫、防备过度、旧伤触发、难以坚持",
    },
  },
  {
    id: 31,
    name: "权杖十",
    nameEn: "Ten of Wands",
    nameJa: "ワンドの10",
    nameKo: "완드 10",
    image: "/images/31.png",
    meaning: {
      upright: "负担、责任、压力、坚持完成、过度承担",
      reversed: "释放负担、委派、压力过载、放下责任",
    },
  },
  {
    id: 32,
    name: "权杖侍从",
    nameEn: "Page of Wands",
    nameJa: "ワンドのペイジ",
    nameKo: "완드 페이지",
    image: "/images/32.png",
    meaning: {
      upright: "热情、探索、创意消息、冒险精神、新鲜灵感",
      reversed: "冲动、缺乏计划、坏消息、热情不稳",
    },
  },
  {
    id: 33,
    name: "权杖骑士",
    nameEn: "Knight of Wands",
    nameJa: "ワンドのナイト",
    nameKo: "완드 나이트",
    image: "/images/33.png",
    meaning: {
      upright: "行动、热情、冒险、魅力、快速推进",
      reversed: "鲁莽、冲动、焦躁、半途而废",
    },
  },
  {
    id: 34,
    name: "权杖王后",
    nameEn: "Queen of Wands",
    nameJa: "ワンドのクイーン",
    nameKo: "완드 퀸",
    image: "/images/34.png",
    meaning: {
      upright: "魅力、自信、独立、热情领导、创造力",
      reversed: "嫉妒、控制欲、自我怀疑、精力分散",
    },
  },
  {
    id: 35,
    name: "权杖国王",
    nameEn: "King of Wands",
    nameJa: "ワンドのキング",
    nameKo: "완드 킹",
    image: "/images/35.png",
    meaning: {
      upright: "愿景、领导力、创业精神、胆识、长期方向",
      reversed: "专断、冲动决策、野心失衡、缺乏耐心",
    },
  },
  // ===== 圣杯 (Cups) 36-49 =====
  {
    id: 36,
    name: "圣杯王牌",
    nameEn: "Ace of Cups",
    nameJa: "カップのエース",
    nameKo: "컵 에이스",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/36.png",
    meaning: {
      upright: "新的感情、爱的开始、情感丰盛、直觉、灵性觉醒",
      reversed: "情感压抑、空虚、爱的阻塞、创意枯竭",
    },
  },
  {
    id: 37,
    name: "圣杯二",
    nameEn: "Two of Cups",
    nameJa: "カップの2",
    nameKo: "컵 2",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/37.png",
    meaning: {
      upright: "伴侣关系、结合、吸引、和谐、相互尊重",
      reversed: "失衡的关系、分离、误解、缺乏信任",
    },
  },
  {
    id: 38,
    name: "圣杯三",
    nameEn: "Three of Cups",
    nameJa: "カップの3",
    nameKo: "컵 3",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/38.png",
    meaning: {
      upright: "庆祝、友谊、社交、合作、欢乐聚会",
      reversed: "过度放纵、孤立、流言蜚语、社交疲惫",
    },
  },
  {
    id: 39,
    name: "圣杯四",
    nameEn: "Four of Cups",
    nameJa: "カップの4",
    nameKo: "컵 4",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/39.png",
    meaning: {
      upright: "冥想、重新评估、消极、厌倦、错失机会",
      reversed: "觉醒、新机会、走出消沉、重燃热情",
    },
  },
  {
    id: 40,
    name: "圣杯五",
    nameEn: "Five of Cups",
    nameJa: "カップの5",
    nameKo: "컵 5",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/40.png",
    meaning: {
      upright: "失落、悲伤、悔恨、专注于负面、失望",
      reversed: "接受、走出悲伤、宽恕、前进、希望",
    },
  },
  {
    id: 41,
    name: "圣杯六",
    nameEn: "Six of Cups",
    nameJa: "カップの6",
    nameKo: "컵 6",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/41.png",
    meaning: {
      upright: "怀旧、童年回忆、纯真、重逢、善意",
      reversed: "活在过去、不切实际、童年创伤",
    },
  },
  {
    id: 42,
    name: "圣杯七",
    nameEn: "Seven of Cups",
    nameJa: "カップの7",
    nameKo: "컵 7",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/42.png",
    meaning: {
      upright: "幻想、选择、白日梦、诱惑、想象力",
      reversed: "清醒、做出选择、脚踏实地、打破幻想",
    },
  },
  {
    id: 43,
    name: "圣杯八",
    nameEn: "Eight of Cups",
    nameJa: "カップの8",
    nameKo: "컵 8",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/43.png",
    meaning: {
      upright: "离开、放下、寻找更深意义、转变、旅程",
      reversed: "逃避、恐惧改变、漫无目的、犹豫不决",
    },
  },
  {
    id: 44,
    name: "圣杯九",
    nameEn: "Nine of Cups",
    nameJa: "カップの9",
    nameKo: "컵 9",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/44.png",
    meaning: {
      upright: "满足、愿望成真、幸福、满意、感恩",
      reversed: "贪婪、不满足、物质主义、浅薄的快乐",
    },
  },
  {
    id: 45,
    name: "圣杯十",
    nameEn: "Ten of Cups",
    nameJa: "カップの10",
    nameKo: "컵 10",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/45.png",
    meaning: {
      upright: "家庭幸福、和谐、圆满、情感满足、祝福",
      reversed: "家庭不和、价值观冲突、破碎的梦想",
    },
  },
  {
    id: 46,
    name: "圣杯侍从",
    nameEn: "Page of Cups",
    nameJa: "カップのペイジ",
    nameKo: "컵 페이지",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/46.png",
    meaning: {
      upright: "创意信息、直觉、新感情、好奇心、敏感",
      reversed: "情感不成熟、创意阻塞、逃避现实",
    },
  },
  {
    id: 47,
    name: "圣杯骑士",
    nameEn: "Knight of Cups",
    nameJa: "カップのナイト",
    nameKo: "컵 나이트",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/47.png",
    meaning: {
      upright: "浪漫、魅力、想象力、追求梦想、邀请",
      reversed: "情绪化、不切实际、嫉妒、失望",
    },
  },
  {
    id: 48,
    name: "圣杯王后",
    nameEn: "Queen of Cups",
    nameJa: "カップのクイーン",
    nameKo: "컵 퀸",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/48.png",
    meaning: {
      upright: "慈悲、关怀、情感安全、直觉、温柔",
      reversed: "情感依赖、过度敏感、殉道者心态",
    },
  },
  {
    id: 49,
    name: "圣杯国王",
    nameEn: "King of Cups",
    nameJa: "カップのキング",
    nameKo: "컵 킹",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/49.png",
    meaning: {
      upright: "情感平衡、慷慨、外交、冷静、智慧",
      reversed: "情感操控、喜怒无常、压抑情感",
    },
  },
  // ===== 添加钱币 (Pentacles) 50-63 =====
  // ===== 钱币 (Pentacles) 50-63 =====
  {
    id: 50,
    name: "钱币Ace",
    nameEn: "Ace of Pentacles",
    nameJa: "ペンタクルのエース",
    nameKo: "펜타클 에이스",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/50.png",
    meaning: {
      upright: "新的财富、物质基础、机遇、繁荣",
      reversed: "错失机会、财务困难、缺乏方向",
    },
  },
  {
    id: 51,
    name: "钱币二",
    nameEn: "Two of Pentacles",
    nameJa: "ペンタクルの2",
    nameKo: "펜타클 2",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/51.png",
    meaning: {
      upright: "平衡、适应、时间管理、灵活、多任务",
      reversed: "失衡、过度扩张、财务压力、混乱",
    },
  },
  {
    id: 52,
    name: "钱币三",
    nameEn: "Three of Pentacles",
    nameJa: "ペンタクルの3",
    nameKo: "펜타클 3",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/52.png",
    meaning: {
      upright: "团队合作、技艺、协作、学习、品质",
      reversed: "缺乏合作、孤军奋战、质量差、冲突",
    },
  },
  {
    id: 53,
    name: "钱币四",
    nameEn: "Four of Pentacles",
    nameJa: "ペンタクルの4",
    nameKo: "펜타클 4",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/53.png",
    meaning: {
      upright: "安全感、保守、控制、储蓄、物质主义",
      reversed: "贪婪、吝啬、过度消费、失去控制",
    },
  },
  {
    id: 54,
    name: "钱币五",
    nameEn: "Five of Pentacles",
    nameJa: "ペンタクルの5",
    nameKo: "펜타클 5",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/54.png",
    meaning: {
      upright: "贫困、困难、孤立、疾病、物质匮乏",
      reversed: "恢复、精神贫困的结束、重新找到信仰",
    },
  },
  {
    id: 55,
    name: "钱币六",
    nameEn: "Six of Pentacles",
    nameJa: "ペンタクルの6",
    nameKo: "펜타클 6",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/55.png",
    meaning: {
      upright: "慷慨、慈善、分享财富、给予与接受",
      reversed: "债务、自私、施舍的附加条件",
    },
  },
  {
    id: 56,
    name: "钱币七",
    nameEn: "Seven of Pentacles",
    nameJa: "ペンタクルの7",
    nameKo: "펜타클 7",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/56.png",
    meaning: {
      upright: "耐心等待、长期投资、评估进展、收获在望",
      reversed: "缺乏耐心、投资失败、急于求成",
    },
  },
  {
    id: 57,
    name: "钱币八",
    nameEn: "Eight of Pentacles",
    nameJa: "ペンタクルの8",
    nameKo: "펜타클 8",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/57.png",
    meaning: {
      upright: "技艺精进、勤奋工作、专注学习、匠人精神",
      reversed: "缺乏专注、完美主义、工作倦怠",
    },
  },
  {
    id: 58,
    name: "钱币九",
    nameEn: "Nine of Pentacles",
    nameJa: "ペンタクルの9",
    nameKo: "펜타클 9",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/58.png",
    meaning: {
      upright: "独立、富足、自给自足、优雅生活、成就",
      reversed: "过度工作、肤浅、财务挫折",
    },
  },
  {
    id: 59,
    name: "钱币十",
    nameEn: "Ten of Pentacles",
    nameJa: "ペンタクルの10",
    nameKo: "펜타클 10",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/59.png",
    meaning: {
      upright: "家族财富、遗产、长久成功、传承、稳定",
      reversed: "家庭纷争、财务损失、短视近利",
    },
  },
  {
    id: 60,
    name: "钱币侍从",
    nameEn: "Page of Pentacles",
    nameJa: "ペンタクルのペイジ",
    nameKo: "펜타클 페이지",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/60.png",
    meaning: {
      upright: "学习机会、新技能、勤奋、目标明确、脚踏实地",
      reversed: "缺乏进展、拖延、错失机会",
    },
  },
  {
    id: 61,
    name: "钱币骑士",
    nameEn: "Knight of Pentacles",
    nameJa: "ペンタクルのナイト",
    nameKo: "펜타클 나이트",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/61.png",
    meaning: {
      upright: "勤勉、可靠、耐心、稳健前进、责任心",
      reversed: "固执、无聊、过于保守、停滞不前",
    },
  },
  {
    id: 62,
    name: "钱币王后",
    nameEn: "Queen of Pentacles",
    nameJa: "ペンタクルのクイーン",
    nameKo: "펜타클 퀸",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/62.png",
    meaning: {
      upright: "务实、滋养、富足、家庭关怀、财务稳定",
      reversed: "工作与生活失衡、过度依赖、吝啬",
    },
  },
  {
    id: 63,
    name: "钱币国王",
    nameEn: "King of Pentacles",
    nameJa: "ペンタクルのキング",
    nameKo: "펜타클 킹",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/63.png",
    meaning: {
      upright: "财富成就、商业成功、稳定领导、物质保障",
      reversed: "贪婪、唯利是图、工作狂、僵化",
    },
  },
  // ===== 宝剑 (Swords) 64-77 =====
  {
    id: 64,
    name: "宝剑王牌",
    nameEn: "Ace of Swords",
    nameJa: "ソードのエース",
    nameKo: "소드 에이스",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/64.png",
    meaning: {
      upright: "清晰、真相、新想法、决断、突破",
      reversed: "混乱、误判、沟通受阻、真相不明",
    },
  },
  {
    id: 65,
    name: "宝剑二",
    nameEn: "Two of Swords",
    nameJa: "ソードの2",
    nameKo: "소드 2",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/65.png",
    meaning: {
      upright: "僵局、选择、理性权衡、暂时回避、内在平衡",
      reversed: "犹豫加剧、信息过载、逃避决定、压力释放",
    },
  },
  {
    id: 66,
    name: "宝剑三",
    nameEn: "Three of Swords",
    nameJa: "ソードの3",
    nameKo: "소드 3",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/66.png",
    meaning: {
      upright: "心碎、悲伤、真相刺痛、分离、情绪释放",
      reversed: "疗愈、宽恕、走出伤痛、压抑悲伤",
    },
  },
  {
    id: 67,
    name: "宝剑四",
    nameEn: "Four of Swords",
    nameJa: "ソードの4",
    nameKo: "소드 4",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/67.png",
    meaning: {
      upright: "休息、恢复、静养、沉思、暂停行动",
      reversed: "倦怠、无法休息、重新行动、压力回归",
    },
  },
  {
    id: 68,
    name: "宝剑五",
    nameEn: "Five of Swords",
    nameJa: "ソードの5",
    nameKo: "소드 5",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/68.png",
    meaning: {
      upright: "冲突、输赢执念、争执、代价、紧张关系",
      reversed: "和解、放下争斗、羞愧、修复关系",
    },
  },
  {
    id: 69,
    name: "宝剑六",
    nameEn: "Six of Swords",
    nameJa: "ソードの6",
    nameKo: "소드 6",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/69.png",
    meaning: {
      upright: "过渡、离开困境、疗愈旅程、前往平静、转移",
      reversed: "困在过去、抗拒转变、旅程延迟、情绪包袱",
    },
  },
  {
    id: 70,
    name: "宝剑七",
    nameEn: "Seven of Swords",
    nameJa: "ソードの7",
    nameKo: "소드 7",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/70.png",
    meaning: {
      upright: "策略、隐瞒、独立行动、机智、避免正面冲突",
      reversed: "坦白、被揭穿、自欺、重新承担责任",
    },
  },
  {
    id: 71,
    name: "宝剑八",
    nameEn: "Eight of Swords",
    nameJa: "ソードの8",
    nameKo: "소드 8",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/71.png",
    meaning: {
      upright: "受限、自我束缚、焦虑、看不见出口、恐惧",
      reversed: "释放限制、看见选择、重获力量、走出焦虑",
    },
  },
  {
    id: 72,
    name: "宝剑九",
    nameEn: "Nine of Swords",
    nameJa: "ソードの9",
    nameKo: "소드 9",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/72.png",
    meaning: {
      upright: "焦虑、噩梦、担忧、内疚、精神压力",
      reversed: "希望重现、寻求支持、释放恐惧、停止自责",
    },
  },
  {
    id: 73,
    name: "宝剑十",
    nameEn: "Ten of Swords",
    nameJa: "ソードの10",
    nameKo: "소드 10",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/73.png",
    meaning: {
      upright: "结束、背叛、最低点、痛苦完成、新阶段前夜",
      reversed: "复原、避免终结、逐渐好转、伤口愈合",
    },
  },
  {
    id: 74,
    name: "宝剑侍从",
    nameEn: "Page of Swords",
    nameJa: "ソードのペイジ",
    nameKo: "소드 페이지",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/74.png",
    meaning: {
      upright: "好奇、观察、学习、消息、思维敏捷",
      reversed: "流言、冲动发言、缺乏经验、信息混乱",
    },
  },
  {
    id: 75,
    name: "宝剑骑士",
    nameEn: "Knight of Swords",
    nameJa: "ソードのナイト",
    nameKo: "소드 나이트",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/75.png",
    meaning: {
      upright: "快速行动、决心、直接沟通、野心、勇往直前",
      reversed: "鲁莽、言语伤人、冲动、缺乏策略",
    },
  },
  {
    id: 76,
    name: "宝剑王后",
    nameEn: "Queen of Swords",
    nameJa: "ソードのクイーン",
    nameKo: "소드 퀸",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/76.png",
    meaning: {
      upright: "清醒、独立、诚实、边界、理性判断",
      reversed: "冷酷、尖锐、防御心强、情绪隔离",
    },
  },
  {
    id: 77,
    name: "宝剑国王",
    nameEn: "King of Swords",
    nameJa: "ソードのキング",
    nameKo: "소드 킹",
    image: "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/77.png",
    meaning: {
      upright: "权威、理性、公正、战略、清晰判断",
      reversed: "滥用权力、冷漠、操控、判断偏差",
    },
  },
  // ===== 添加其他小阿尔卡纳牌数据 =====
]

// 获取随机牌
export function getRandomCards(count: number): DrawnCard[] {
  const shuffled = [...TAROT_CARDS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count).map((card) => ({
    ...card,
    isReversed: Math.random() < 0.5, // 50%概率逆位
  }))
}

// 根据ID获取牌
export function getCardById(id: number): TarotCard | undefined {
  return TAROT_CARDS.find((card) => card.id === id)
}

// 根据多个ID获取牌
export function getCardsByIds(ids: number[]): TarotCard[] {
  return ids.map((id) => getCardById(id)).filter((card): card is TarotCard => card !== undefined)
}

// 根据语言获取卡牌名称
export function getCardName(card: TarotCard, lang: string = 'zh'): string {
  switch (lang) {
    case 'zh':
      return card.name
    case 'en':
      return card.nameEn
    case 'ja':
      return card.nameJa || card.nameEn
    case 'ko':
      return card.nameKo || card.nameEn
    default:
      return card.nameEn
  }
}

// 获取大阿尔卡纳牌（22张，id 0-21）
export function getMajorArcana(): TarotCard[] {
  return TAROT_CARDS.filter(card => card.id >= 0 && card.id <= 21)
}

// 获取全部牌组（78张）
export function getFullDeck(): TarotCard[] {
  return TAROT_CARDS
}

// 根据牌组类型获取牌
export function getDeckByType(deckType: 'major' | 'full'): TarotCard[] {
  return deckType === 'major' ? getMajorArcana() : getFullDeck()
}
