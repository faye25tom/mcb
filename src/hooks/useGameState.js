import { useReducer, useCallback } from 'react'
import {
    generateColorLayout,
    shuffleBlocks,
    addDistraction,
    checkAnswer,
    getGameConfig
} from '../utils/gameLogic'

const initialState = {
    phase: 'idle', // idle, memory, playing, finished
    mode: null, // 'normal' | 'challenge'
    difficulty: null, // 'easy' | 'medium' | 'hard'
    level: 1,
    gridSize: 2,
    originalLayout: [],
    shuffledBlocks: [],
    placedBlocks: [], // { position, color, blockId }
    availableBlocks: [],
    memoryTimeLeft: 5,
    gameTime: 0,
    result: null,
    feedback: [] // { position, isCorrect }
}

function gameReducer(state, action) {
    switch (action.type) {
        case 'START_GAME': {
            const { mode, difficulty, level = 1 } = action.payload
            const config = getGameConfig(mode, difficulty, level)
            const layout = generateColorLayout(config.gridSize, config.colorCount)

            return {
                ...initialState,
                phase: 'memory',
                mode,
                difficulty,
                level,
                gridSize: config.gridSize,
                originalLayout: layout,
                memoryTimeLeft: config.memoryTime
            }
        }

        case 'MEMORY_TICK': {
            const newTime = state.memoryTimeLeft - 1
            if (newTime <= 0) {
                // 记忆阶段结束，开始游戏
                const config = getGameConfig(state.mode, state.difficulty, state.level)
                let blocks = shuffleBlocks(state.originalLayout)
                if (config.hasDistraction) {
                    blocks = addDistraction(blocks, config.colorCount)
                }
                return {
                    ...state,
                    phase: 'playing',
                    memoryTimeLeft: 0,
                    shuffledBlocks: blocks,
                    availableBlocks: blocks.map(b => b.id),
                    placedBlocks: [],
                    gameTime: 0
                }
            }
            return { ...state, memoryTimeLeft: newTime }
        }

        case 'GAME_TICK': {
            return { ...state, gameTime: state.gameTime + 1 }
        }

        case 'PLACE_BLOCK': {
            const { blockId, position } = action.payload
            const block = state.shuffledBlocks.find(b => b.id === blockId)
            if (!block) return state

            // 检查位置是否已有方块
            const existingBlockIndex = state.placedBlocks.findIndex(p => p.position === position)
            let newPlacedBlocks = [...state.placedBlocks]
            let newAvailableBlocks = [...state.availableBlocks]

            // 如果位置已有方块，将其放回可用区
            if (existingBlockIndex !== -1) {
                const existingBlock = newPlacedBlocks[existingBlockIndex]
                newAvailableBlocks.push(existingBlock.blockId)
                newPlacedBlocks.splice(existingBlockIndex, 1)
            }

            // 放置新方块
            newPlacedBlocks.push({
                position,
                color: block.color,
                blockId: block.id
            })
            newAvailableBlocks = newAvailableBlocks.filter(id => id !== blockId)

            // 检查即时反馈
            const original = state.originalLayout.find(o => o.position === position)
            const isCorrect = original && original.color.id === block.color.id
            const newFeedback = [...state.feedback.filter(f => f.position !== position)]
            newFeedback.push({ position, isCorrect })

            return {
                ...state,
                placedBlocks: newPlacedBlocks,
                availableBlocks: newAvailableBlocks,
                feedback: newFeedback
            }
        }

        case 'REMOVE_BLOCK': {
            const { position } = action.payload
            const block = state.placedBlocks.find(p => p.position === position)
            if (!block) return state

            return {
                ...state,
                placedBlocks: state.placedBlocks.filter(p => p.position !== position),
                availableBlocks: [...state.availableBlocks, block.blockId],
                feedback: state.feedback.filter(f => f.position !== position)
            }
        }

        case 'FINISH_GAME': {
            const result = checkAnswer(state.originalLayout, state.placedBlocks)
            return {
                ...state,
                phase: 'finished',
                result: {
                    ...result,
                    timeSpent: state.gameTime,
                    difficulty: state.difficulty,
                    mode: state.mode,
                    level: state.level
                }
            }
        }

        case 'NEXT_LEVEL': {
            const nextLevel = state.level + 1
            const config = getGameConfig('challenge', null, nextLevel)
            const layout = generateColorLayout(config.gridSize, config.colorCount)

            return {
                ...initialState,
                phase: 'memory',
                mode: 'challenge',
                level: nextLevel,
                gridSize: config.gridSize,
                originalLayout: layout,
                memoryTimeLeft: config.memoryTime
            }
        }

        case 'RESET': {
            return initialState
        }

        default:
            return state
    }
}

export function useGameState() {
    const [state, dispatch] = useReducer(gameReducer, initialState)

    const startGame = useCallback((mode, difficulty) => {
        dispatch({ type: 'START_GAME', payload: { mode, difficulty, level: 1 } })
    }, [])

    const memoryTick = useCallback(() => {
        dispatch({ type: 'MEMORY_TICK' })
    }, [])

    const gameTick = useCallback(() => {
        dispatch({ type: 'GAME_TICK' })
    }, [])

    const placeBlock = useCallback((blockId, position) => {
        dispatch({ type: 'PLACE_BLOCK', payload: { blockId, position } })
    }, [])

    const removeBlock = useCallback((position) => {
        dispatch({ type: 'REMOVE_BLOCK', payload: { position } })
    }, [])

    const finishGame = useCallback(() => {
        dispatch({ type: 'FINISH_GAME' })
    }, [])

    const nextLevel = useCallback(() => {
        dispatch({ type: 'NEXT_LEVEL' })
    }, [])

    const reset = useCallback(() => {
        dispatch({ type: 'RESET' })
    }, [])

    return {
        state,
        actions: {
            startGame,
            memoryTick,
            gameTick,
            placeBlock,
            removeBlock,
            finishGame,
            nextLevel,
            reset
        }
    }
}
