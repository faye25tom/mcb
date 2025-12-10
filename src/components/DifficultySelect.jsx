import { DIFFICULTY_CONFIG } from '../data/animalCards'
import './DifficultySelect.css'

export default function DifficultySelect({ onSelect, onBack }) {
    const difficulties = Object.entries(DIFFICULTY_CONFIG)

    return (
        <div className="difficulty-select page-container">
            <div className="difficulty-content fade-in">
                <button className="back-btn" onClick={onBack}>
                    ← 返回
                </button>

                <h1 className="title">选择难度</h1>
                <p className="subtitle">挑战不同大小的网格</p>

                <div className="difficulty-cards">
                    {difficulties.map(([key, config], index) => (
                        <button
                            key={key}
                            className={`difficulty-card card ${key}`}
                            onClick={() => onSelect(key)}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="difficulty-emoji">{config.emoji}</div>
                            <div className="difficulty-name">{config.name}</div>
                            <div className="difficulty-grid">
                                <div
                                    className="mini-grid"
                                    style={{
                                        gridTemplateColumns: `repeat(${config.gridSize}, 1fr)`
                                    }}
                                >
                                    {Array.from({ length: config.gridSize * config.gridSize }).map((_, i) => (
                                        <div key={i} className="mini-cell"></div>
                                    ))}
                                </div>
                            </div>
                            <div className="difficulty-info">
                                <span>{config.gridSize}×{config.gridSize} 网格</span>
                                <span>记忆 {config.memoryTime} 秒</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
