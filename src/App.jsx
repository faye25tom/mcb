import { useState, useCallback } from 'react'
import { SettingsProvider } from './context/SettingsContext'
import { useGameState } from './hooks/useGameState'
import MainMenu from './components/MainMenu'
import DifficultySelect from './components/DifficultySelect'
import GameScreen from './components/GameScreen'
import ResultScreen from './components/ResultScreen'
import CollectionScreen from './components/CollectionScreen'
import SettingsScreen from './components/SettingsScreen'
import './App.css'

function App() {
    return (
        <SettingsProvider>
            <GameApp />
        </SettingsProvider>
    )
}

function GameApp() {
    const [screen, setScreen] = useState('menu')
    const { state: gameState, actions } = useGameState()

    // 导航处理
    const handleNavigate = useCallback((target) => {
        if (target === 'challenge') {
            // 直接开始挑战模式
            actions.startGame('challenge', null)
            setScreen('game')
        } else {
            setScreen(target)
        }
    }, [actions])

    // 选择难度后开始游戏
    const handleSelectDifficulty = useCallback((difficulty) => {
        actions.startGame('normal', difficulty)
        setScreen('game')
    }, [actions])

    // 返回主菜单
    const handleBackToMenu = useCallback(() => {
        actions.reset()
        setScreen('menu')
    }, [actions])

    // 完成游戏
    const handleFinishGame = useCallback(() => {
        actions.finishGame()
        setScreen('result')
    }, [actions])

    // 重玩
    const handleReplay = useCallback(() => {
        const { mode, difficulty } = gameState
        actions.startGame(mode, difficulty)
        setScreen('game')
    }, [gameState, actions])

    // 下一关（挑战模式）
    const handleNextLevel = useCallback(() => {
        actions.nextLevel()
        setScreen('game')
    }, [actions])

    // 从游戏返回
    const handleBackFromGame = useCallback(() => {
        if (gameState.mode === 'challenge') {
            // 挑战模式退出，如果已有进度则显示结果
            if (gameState.phase === 'playing' && gameState.level > 1) {
                actions.finishGame()
                setScreen('result')
                return
            }
        }
        actions.reset()
        setScreen('menu')
    }, [gameState, actions])

    // 渲染当前屏幕
    const renderScreen = () => {
        switch (screen) {
            case 'menu':
                return <MainMenu onNavigate={handleNavigate} />

            case 'difficulty':
                return (
                    <DifficultySelect
                        onSelect={handleSelectDifficulty}
                        onBack={handleBackToMenu}
                    />
                )

            case 'game':
                return (
                    <GameScreen
                        gameState={gameState}
                        actions={actions}
                        onFinish={handleFinishGame}
                        onBack={handleBackFromGame}
                    />
                )

            case 'result':
                return (
                    <ResultScreen
                        result={gameState.result}
                        onReplay={handleReplay}
                        onNextLevel={handleNextLevel}
                        onHome={handleBackToMenu}
                    />
                )

            case 'collection':
                return <CollectionScreen onBack={handleBackToMenu} />

            case 'settings':
                return <SettingsScreen onBack={handleBackToMenu} />

            default:
                return <MainMenu onNavigate={handleNavigate} />
        }
    }

    return (
        <div className="app">
            {renderScreen()}
        </div>
    )
}

export default App
