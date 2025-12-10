// 动物图卡数据
export const ANIMAL_CARDS = [
    // 普通 - 初级难度
    {
        id: 'snail',
        name: '小蜗牛',
        emoji: '🐌',
        rarity: 'common',
        requirement: { difficulty: 'easy', accuracy: 50, maxTime: null },
        description: '慢慢来，也能到终点'
    },
    {
        id: 'turtle',
        name: '小乌龟',
        emoji: '🐢',
        rarity: 'common',
        requirement: { difficulty: 'easy', accuracy: 75, maxTime: 30 },
        description: '稳扎稳打的智者'
    },
    {
        id: 'rabbit',
        name: '小兔子',
        emoji: '🐰',
        rarity: 'rare',
        requirement: { difficulty: 'easy', accuracy: 100, maxTime: 20 },
        description: '蹦蹦跳跳真开心'
    },

    // 普通/稀有 - 中级难度
    {
        id: 'cat',
        name: '聪明小猫',
        emoji: '🐱',
        rarity: 'common',
        requirement: { difficulty: 'medium', accuracy: 75, maxTime: 30 },
        description: '好奇心满满的小家伙'
    },
    {
        id: 'squirrel',
        name: '敏捷小松鼠',
        emoji: '🐿️',
        rarity: 'rare',
        requirement: { difficulty: 'medium', accuracy: 100, maxTime: 15 },
        description: '快如闪电的坚果收集者'
    },
    {
        id: 'bee',
        name: '勤劳小蜜蜂',
        emoji: '🐝',
        rarity: 'epic',
        requirement: { difficulty: 'medium', accuracy: 100, maxTime: 10 },
        description: '嗡嗡嗡，勤劳的代名词'
    },

    // 稀有/史诗 - 高级难度
    {
        id: 'fox',
        name: '机智狐狸',
        emoji: '🦊',
        rarity: 'rare',
        requirement: { difficulty: 'hard', accuracy: 80, maxTime: 40 },
        description: '聪明绝顶的森林精灵'
    },
    {
        id: 'owl',
        name: '智慧猫头鹰',
        emoji: '🦉',
        rarity: 'epic',
        requirement: { difficulty: 'hard', accuracy: 100, maxTime: 30 },
        description: '夜晚的智者'
    },
    {
        id: 'elephant',
        name: '记忆大师象',
        emoji: '🐘',
        rarity: 'legendary',
        requirement: { difficulty: 'hard', accuracy: 100, maxTime: 20 },
        description: '大象永远不会忘记'
    },

    // 传说/神话 - 挑战模式
    {
        id: 'cheetah',
        name: '闪电豹',
        emoji: '🐆',
        rarity: 'legendary',
        requirement: { mode: 'challenge', level: 10 },
        description: '速度与智慧的完美结合'
    },
    {
        id: 'dragon',
        name: '神龙',
        emoji: '🐉',
        rarity: 'mythic',
        requirement: { mode: 'challenge', level: 20 },
        description: '传说中的记忆之王'
    },
    {
        id: 'unicorn',
        name: '独角兽',
        emoji: '🦄',
        rarity: 'mythic',
        requirement: { mode: 'challenge', level: 30 },
        description: '魔法与智慧的化身'
    }
]

// 游戏颜色配置
export const GAME_COLORS = [
    { id: 'red', name: '红色', class: 'block-red', hex: '#ef4444' },
    { id: 'blue', name: '蓝色', class: 'block-blue', hex: '#3b82f6' },
    { id: 'green', name: '绿色', class: 'block-green', hex: '#22c55e' },
    { id: 'yellow', name: '黄色', class: 'block-yellow', hex: '#eab308' },
    { id: 'purple', name: '紫色', class: 'block-purple', hex: '#a855f7' },
    { id: 'orange', name: '橙色', class: 'block-orange', hex: '#f97316' },
    { id: 'pink', name: '粉色', class: 'block-pink', hex: '#ec4899' },
    { id: 'cyan', name: '青色', class: 'block-cyan', hex: '#06b6d4' }
]

// 难度配置
export const DIFFICULTY_CONFIG = {
    easy: {
        name: '初级',
        gridSize: 2,
        colorCount: 3,
        memoryTime: 5,
        emoji: '🌟'
    },
    medium: {
        name: '中级',
        gridSize: 3,
        colorCount: 4,
        memoryTime: 5,
        emoji: '⭐'
    },
    hard: {
        name: '高级',
        gridSize: 4,
        colorCount: 5,
        memoryTime: 4,
        emoji: '🌟🌟'
    }
}

// 挑战模式难度递增配置
export const CHALLENGE_LEVELS = [
    // 1-3关
    { minLevel: 1, maxLevel: 3, gridSize: 2, colorCount: 3, memoryTime: 5, distraction: false },
    // 4-7关
    { minLevel: 4, maxLevel: 7, gridSize: 3, colorCount: 4, memoryTime: 5, distraction: false },
    // 8-12关
    { minLevel: 8, maxLevel: 12, gridSize: 3, colorCount: 5, memoryTime: 4, distraction: false },
    // 13+关
    { minLevel: 13, maxLevel: Infinity, gridSize: 4, colorCount: 6, memoryTime: 4, distraction: true }
]

// 获取挑战模式的关卡配置
export function getChallengeConfig(level) {
    const config = CHALLENGE_LEVELS.find(c => level >= c.minLevel && level <= c.maxLevel)
    return config || CHALLENGE_LEVELS[CHALLENGE_LEVELS.length - 1]
}

// 评估获得的动物图卡
export function evaluateReward(difficulty, accuracy, timeSpent, mode = 'normal', level = 0) {
    const eligibleCards = ANIMAL_CARDS.filter(card => {
        const req = card.requirement

        // 挑战模式特殊图卡
        if (req.mode === 'challenge') {
            return mode === 'challenge' && level >= req.level && accuracy === 100
        }

        // 普通难度图卡
        if (req.difficulty !== difficulty) return false
        if (accuracy < req.accuracy) return false
        if (req.maxTime && timeSpent > req.maxTime) return false

        return true
    })

    // 返回最高稀有度的图卡
    const rarityOrder = ['mythic', 'legendary', 'epic', 'rare', 'common']
    eligibleCards.sort((a, b) => rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity))

    return eligibleCards[0] || null
}
