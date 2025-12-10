import { GAME_COLORS, getChallengeConfig, DIFFICULTY_CONFIG } from '../data/animalCards'

// 生成随机颜色布局
export function generateColorLayout(gridSize, colorCount) {
    const totalCells = gridSize * gridSize
    const availableColors = GAME_COLORS.slice(0, Math.min(colorCount, GAME_COLORS.length))

    const layout = []
    for (let i = 0; i < totalCells; i++) {
        const randomColor = availableColors[Math.floor(Math.random() * availableColors.length)]
        layout.push({
            id: i,
            color: randomColor,
            position: i
        })
    }

    return layout
}

// 打乱色块顺序
export function shuffleBlocks(blocks) {
    const shuffled = [...blocks]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled.map((block, index) => ({
        ...block,
        shuffledPosition: index
    }))
}

// 添加干扰色块
export function addDistraction(blocks, colorCount) {
    const usedColorIds = new Set(blocks.map(b => b.color.id))
    const availableColors = GAME_COLORS.filter(c => !usedColorIds.has(c.id))

    if (availableColors.length === 0) return blocks

    const distractionColor = availableColors[Math.floor(Math.random() * availableColors.length)]

    return [...blocks, {
        id: blocks.length,
        color: distractionColor,
        position: -1, // 干扰色块没有正确位置
        isDistraction: true
    }]
}

// 检查答案正确性
export function checkAnswer(originalLayout, placedBlocks) {
    let correct = 0
    let total = originalLayout.length

    const results = originalLayout.map(original => {
        const placed = placedBlocks.find(p => p.position === original.position)
        const isCorrect = placed && placed.color.id === original.color.id
        if (isCorrect) correct++
        return {
            position: original.position,
            expected: original.color,
            actual: placed?.color || null,
            isCorrect
        }
    })

    return {
        correct,
        total,
        accuracy: Math.round((correct / total) * 100),
        isPerfect: correct === total,
        results
    }
}

// 获取游戏配置
export function getGameConfig(mode, difficulty, level = 1) {
    if (mode === 'challenge') {
        const config = getChallengeConfig(level)
        return {
            gridSize: config.gridSize,
            colorCount: config.colorCount,
            memoryTime: config.memoryTime,
            hasDistraction: config.distraction && Math.random() > 0.5
        }
    }

    const config = DIFFICULTY_CONFIG[difficulty]
    return {
        gridSize: config.gridSize,
        colorCount: config.colorCount,
        memoryTime: config.memoryTime,
        hasDistraction: false
    }
}

// 格式化时间显示
export function formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    if (mins > 0) {
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }
    return `${secs}s`
}

// 本地存储工具
export const storage = {
    getCollectedCards() {
        try {
            const data = localStorage.getItem('mcb_collected_cards')
            return data ? JSON.parse(data) : []
        } catch {
            return []
        }
    },

    addCollectedCard(cardId) {
        const cards = this.getCollectedCards()
        if (!cards.includes(cardId)) {
            cards.push(cardId)
            localStorage.setItem('mcb_collected_cards', JSON.stringify(cards))
        }
        return cards
    },

    getSettings() {
        try {
            const data = localStorage.getItem('mcb_settings')
            return data ? JSON.parse(data) : {
                sfx: true,
                bgm: true,
                instantFeedback: true
            }
        } catch {
            return { sfx: true, bgm: true, instantFeedback: true }
        }
    },

    saveSettings(settings) {
        localStorage.setItem('mcb_settings', JSON.stringify(settings))
    },

    getChallengeHighScore() {
        try {
            return parseInt(localStorage.getItem('mcb_challenge_high') || '0', 10)
        } catch {
            return 0
        }
    },

    setChallengeHighScore(level) {
        const current = this.getChallengeHighScore()
        if (level > current) {
            localStorage.setItem('mcb_challenge_high', level.toString())
            return true
        }
        return false
    }
}
