import { useSettings } from '../context/SettingsContext'
import './SettingsScreen.css'

export default function SettingsScreen({ onBack }) {
    const { settings, toggleSetting } = useSettings()

    const settingsItems = [
        {
            key: 'sfx',
            label: '游戏音效',
            description: '操作和反馈的声音效果',
            icon: '🔊'
        },
        {
            key: 'bgm',
            label: '背景音乐',
            description: '游戏中的背景音乐',
            icon: '🎵'
        },
        {
            key: 'instantFeedback',
            label: '即时反馈',
            description: '放置色块时显示对错提示',
            icon: '✨'
        }
    ]

    return (
        <div className="settings-screen page-container">
            <div className="settings-content fade-in">
                <button className="back-btn" onClick={onBack}>
                    ← 返回
                </button>

                <h1 className="title">设置</h1>

                <div className="settings-list">
                    {settingsItems.map(item => (
                        <div key={item.key} className="settings-item card">
                            <div className="setting-info">
                                <span className="setting-icon">{item.icon}</span>
                                <div className="setting-text">
                                    <span className="setting-label">{item.label}</span>
                                    <span className="setting-description">{item.description}</span>
                                </div>
                            </div>
                            <button
                                className={`toggle ${settings[item.key] ? 'active' : ''}`}
                                onClick={() => toggleSetting(item.key)}
                                aria-label={`${item.label} ${settings[item.key] ? '开启' : '关闭'}`}
                            />
                        </div>
                    ))}
                </div>

                {/* 关于信息 */}
                <div className="about-section card">
                    <h3 className="about-title">关于游戏</h3>
                    <p className="about-text">
                        记忆色块是一款专为儿童设计的记忆力训练游戏。
                        通过记忆和还原色块位置，锻炼观察力和记忆力。
                    </p>
                    <div className="about-version">
                        版本 1.0.0
                    </div>
                </div>
            </div>
        </div>
    )
}
