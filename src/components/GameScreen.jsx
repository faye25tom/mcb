import { useEffect, useMemo } from 'react'
import { useTimer } from '../hooks/useTimer'
import { useDragAndDrop } from '../hooks/useDragAndDrop'
import { useSettings } from '../context/SettingsContext'
import { formatTime } from '../utils/gameLogic'
import './GameScreen.css'

export default function GameScreen({
    gameState,
    actions,
    onFinish,
    onBack
}) {
    const { settings } = useSettings()
    const {
        phase,
        mode,
        level,
        gridSize,
        originalLayout,
        shuffledBlocks,
        placedBlocks,
        availableBlocks,
        memoryTimeLeft,
        gameTime,
        feedback
    } = gameState

    // 记忆阶段计时器
    useTimer(phase === 'memory', actions.memoryTick, 1000)

    // 游戏阶段计时器
    useTimer(phase === 'playing', actions.gameTick, 1000)

    // 拖拽处理
    const {
        handleDragStart,
        handleDragEnd,
        handleDragOver,
        handleDragEnter,
        handleDragLeave,
        handleDrop,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd
    } = useDragAndDrop(actions.placeBlock)

    // 检查是否所有格子都已填满
    const allFilled = placedBlocks.length === gridSize * gridSize

    // 获取位置的反馈状态
    const getFeedbackClass = (position) => {
        if (!settings.instantFeedback) return ''
        const fb = feedback.find(f => f.position === position)
        if (!fb) return ''
        return fb.isCorrect ? 'correct' : 'wrong'
    }

    // 获取可用的色块
    const availableBlocksData = useMemo(() => {
        return shuffledBlocks.filter(block => availableBlocks.includes(block.id))
    }, [shuffledBlocks, availableBlocks])

    // 获取已放置的色块按位置
    const getPlacedBlock = (position) => {
        return placedBlocks.find(p => p.position === position)
    }

    return (
        <div className="game-screen page-container">
            <div className="game-content">
                {/* 顶部信息栏 */}
                <div className="game-header">
                    <button className="back-btn" onClick={onBack}>
                        ✕
                    </button>

                    {mode === 'challenge' && (
                        <div className="level-info">
                            第 {level} 关
                        </div>
                    )}

                    <div className={`timer ${phase === 'memory' && memoryTimeLeft <= 2 ? 'warning' : ''}`}>
                        {phase === 'memory' ? (
                            <>
                                <span className="timer-label">请记忆</span>
                                <span className="timer-value">{memoryTimeLeft}s</span>
                            </>
                        ) : (
                            <>
                                <span className="timer-icon">⏱️</span>
                                <span className="timer-value">{formatTime(gameTime)}</span>
                            </>
                        )}
                    </div>
                </div>

                {/* 主游戏区域 */}
                <div className="game-main">
                    {/* 中央网格区 */}
                    <div className="grid-container">
                        <div
                            className="game-grid"
                            style={{
                                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                                gridTemplateRows: `repeat(${gridSize}, 1fr)`
                            }}
                        >
                            {Array.from({ length: gridSize * gridSize }).map((_, index) => {
                                const placedBlock = getPlacedBlock(index)
                                const originalBlock = originalLayout.find(o => o.position === index)

                                // 记忆阶段显示原始布局
                                if (phase === 'memory' && originalBlock) {
                                    return (
                                        <div
                                            key={index}
                                            className={`grid-cell filled color-block ${originalBlock.color.class} pop-in`}
                                            style={{ animationDelay: `${index * 0.05}s` }}
                                        />
                                    )
                                }

                                // 游戏阶段
                                if (placedBlock) {
                                    return (
                                        <div
                                            key={index}
                                            data-position={index}
                                            className={`grid-cell filled color-block ${placedBlock.color.class} ${getFeedbackClass(index)}`}
                                            onClick={() => actions.removeBlock(index)}
                                            onDragOver={handleDragOver}
                                            onDragEnter={handleDragEnter}
                                            onDragLeave={handleDragLeave}
                                            onDrop={(e) => handleDrop(e, index)}
                                        />
                                    )
                                }

                                return (
                                    <div
                                        key={index}
                                        data-position={index}
                                        className="grid-cell"
                                        onDragOver={handleDragOver}
                                        onDragEnter={handleDragEnter}
                                        onDragLeave={handleDragLeave}
                                        onDrop={(e) => handleDrop(e, index)}
                                    />
                                )
                            })}
                        </div>
                    </div>

                    {/* 右侧素材区 */}
                    {phase === 'playing' && (
                        <div className="blocks-container fade-in">
                            <div className="blocks-title">色块</div>
                            <div className="blocks-area">
                                {availableBlocksData.map((block) => (
                                    <div
                                        key={block.id}
                                        className={`color-block draggable-block ${block.color.class} ${block.isDistraction ? 'distraction' : ''}`}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, block.id)}
                                        onDragEnd={handleDragEnd}
                                        onTouchStart={(e) => handleTouchStart(e, block.id, block.color)}
                                        onTouchMove={handleTouchMove}
                                        onTouchEnd={(e) => handleTouchEnd(e)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* 完成按钮 */}
                {phase === 'playing' && allFilled && (
                    <button
                        className="btn btn-primary btn-large confirm-btn pop-in"
                        onClick={onFinish}
                    >
                        ✓ 确认完成
                    </button>
                )}
            </div>
        </div>
    )
}
