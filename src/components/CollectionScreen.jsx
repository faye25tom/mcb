import { useState, useEffect } from 'react'
import { ANIMAL_CARDS } from '../data/animalCards'
import { storage } from '../utils/gameLogic'
import './CollectionScreen.css'

export default function CollectionScreen({ onBack }) {
    const [collectedIds, setCollectedIds] = useState([])
    const [selectedCard, setSelectedCard] = useState(null)

    useEffect(() => {
        setCollectedIds(storage.getCollectedCards())
    }, [])

    const collectedCount = collectedIds.length
    const totalCount = ANIMAL_CARDS.length

    const getRarityName = (rarity) => {
        const names = {
            common: '普通',
            rare: '稀有',
            epic: '史诗',
            legendary: '传说',
            mythic: '神话'
        }
        return names[rarity] || rarity
    }

    return (
        <div className="collection-screen page-container">
            <div className="collection-content">
                <button className="back-btn" onClick={onBack}>
                    ← 返回
                </button>

                <h1 className="title">我的图卡</h1>
                <p className="subtitle">
                    已收集 <span className="collected-count">{collectedCount}</span> / {totalCount}
                </p>

                {/* 进度条 */}
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${(collectedCount / totalCount) * 100}%` }}
                    />
                </div>

                {/* 图卡网格 */}
                <div className="cards-grid">
                    {ANIMAL_CARDS.map((card, index) => {
                        const isCollected = collectedIds.includes(card.id)

                        return (
                            <div
                                key={card.id}
                                className={`animal-card ${card.rarity} ${isCollected ? '' : 'locked'}`}
                                onClick={() => isCollected && setSelectedCard(card)}
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <div className="rarity-border"></div>
                                <div className="card-inner">
                                    {isCollected ? (
                                        <>
                                            <span className="card-emoji">{card.emoji}</span>
                                            <span className="card-name">{card.name}</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="card-emoji locked-emoji">❓</span>
                                            <span className="card-name">???</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* 图卡详情弹窗 */}
                {selectedCard && (
                    <div className="card-modal" onClick={() => setSelectedCard(null)}>
                        <div className="modal-content card" onClick={e => e.stopPropagation()}>
                            <button
                                className="modal-close"
                                onClick={() => setSelectedCard(null)}
                            >
                                ✕
                            </button>

                            <div className={`modal-card ${selectedCard.rarity}`}>
                                <span className="modal-emoji">{selectedCard.emoji}</span>
                            </div>

                            <h2 className="modal-name">{selectedCard.name}</h2>
                            <span className={`modal-rarity ${selectedCard.rarity}`}>
                                {getRarityName(selectedCard.rarity)}
                            </span>
                            <p className="modal-description">{selectedCard.description}</p>

                            <div className="modal-requirement">
                                <span className="requirement-label">解锁条件</span>
                                <span className="requirement-value">
                                    {formatRequirement(selectedCard.requirement)}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

function formatRequirement(req) {
    if (req.mode === 'challenge') {
        return `挑战模式通过 ${req.level} 关`
    }

    const difficultyNames = { easy: '初级', medium: '中级', hard: '高级' }
    let text = `${difficultyNames[req.difficulty]}难度`

    if (req.accuracy) {
        text += ` · 正确率 ≥${req.accuracy}%`
    }

    if (req.maxTime) {
        text += ` · 用时 ≤${req.maxTime}秒`
    }

    return text
}
