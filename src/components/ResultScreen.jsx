import { useEffect, useState } from 'react'
import { ANIMAL_CARDS, evaluateReward } from '../data/animalCards'
import { storage, formatTime } from '../utils/gameLogic'
import './ResultScreen.css'

export default function ResultScreen({
    result,
    onReplay,
    onNextLevel,
    onHome
}) {
    const [earnedCard, setEarnedCard] = useState(null)
    const [isNewCard, setIsNewCard] = useState(false)
    const [showConfetti, setShowConfetti] = useState(false)

    const { correct, total, accuracy, isPerfect, timeSpent, difficulty, mode, level } = result

    useEffect(() => {
        // 评估获得的图卡
        const card = evaluateReward(difficulty, accuracy, timeSpent, mode, level)

        if (card) {
            const collectedCards = storage.getCollectedCards()
            const alreadyHas = collectedCards.includes(card.id)

            if (!alreadyHas) {
                storage.addCollectedCard(card.id)
                setIsNewCard(true)
                setShowConfetti(true)
            }

            setEarnedCard(card)
        }

        // 挑战模式记录最高分
        if (mode === 'challenge' && isPerfect) {
            storage.setChallengeHighScore(level)
        }
    }, [result])

    // 获取评价语
    const getEvaluation = () => {
        if (accuracy === 100) {
            if (timeSpent <= 10) return { text: '完美！闪电般的速度！', emoji: '⚡' }
            if (timeSpent <= 20) return { text: '太棒了！记忆大师！', emoji: '🌟' }
            return { text: '全部正确！做得好！', emoji: '✨' }
        }
        if (accuracy >= 80) return { text: '很不错！继续加油！', emoji: '👍' }
        if (accuracy >= 50) return { text: '还可以，再试试！', emoji: '💪' }
        return { text: '别灰心，多练习！', emoji: '🤗' }
    }

    const evaluation = getEvaluation()
    const canContinue = mode === 'challenge' && isPerfect

    return (
        <div className="result-screen page-container">
            {showConfetti && <div className="confetti-container" />}

            <div className="result-content fade-in">
                {/* 评价标题 */}
                <div className="result-header">
                    <span className="result-emoji pop-in">{evaluation.emoji}</span>
                    <h1 className="result-title">{evaluation.text}</h1>
                </div>

                {/* 成绩卡片 */}
                <div className="result-card card">
                    <div className="score-section">
                        <div className="score-item">
                            <span className="score-label">正确数</span>
                            <span className="score-value">
                                <span className="score-correct">{correct}</span>
                                <span className="score-separator">/</span>
                                <span className="score-total">{total}</span>
                            </span>
                        </div>

                        <div className="score-item">
                            <span className="score-label">正确率</span>
                            <span className={`score-value accuracy ${accuracy === 100 ? 'perfect' : ''}`}>
                                {accuracy}%
                            </span>
                        </div>

                        <div className="score-item">
                            <span className="score-label">用时</span>
                            <span className="score-value time">{formatTime(timeSpent)}</span>
                        </div>
                    </div>

                    {mode === 'challenge' && (
                        <div className="level-result">
                            {isPerfect ? (
                                <span className="level-pass">🎉 第 {level} 关通过！</span>
                            ) : (
                                <span className="level-fail">挑战结束于第 {level} 关</span>
                            )}
                        </div>
                    )}
                </div>

                {/* 获得的图卡 */}
                {earnedCard && (
                    <div className={`reward-section ${isNewCard ? 'new-card' : ''}`}>
                        <div className="reward-label">
                            {isNewCard ? '🎁 获得新图卡！' : '获得头衔'}
                        </div>
                        <div className={`reward-card animal-card ${earnedCard.rarity}`}>
                            <div className="rarity-border"></div>
                            <div className="card-content">
                                <span className="card-emoji">{earnedCard.emoji}</span>
                                <span className="card-name">{earnedCard.name}</span>
                                <span className="card-rarity">{getRarityName(earnedCard.rarity)}</span>
                            </div>
                        </div>
                        <p className="card-description">{earnedCard.description}</p>
                    </div>
                )}

                {/* 操作按钮 */}
                <div className="result-actions">
                    {canContinue && (
                        <button
                            className="btn btn-primary btn-large"
                            onClick={onNextLevel}
                        >
                            🚀 下一关
                        </button>
                    )}

                    <button
                        className="btn btn-secondary btn-large"
                        onClick={onReplay}
                    >
                        🔄 再玩一次
                    </button>

                    <button
                        className="btn btn-secondary btn-large"
                        onClick={onHome}
                    >
                        🏠 返回主页
                    </button>
                </div>
            </div>
        </div>
    )
}

function getRarityName(rarity) {
    const names = {
        common: '普通',
        rare: '稀有',
        epic: '史诗',
        legendary: '传说',
        mythic: '神话'
    }
    return names[rarity] || rarity
}
