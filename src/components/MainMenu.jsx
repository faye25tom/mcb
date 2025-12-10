import './MainMenu.css'

export default function MainMenu({ onNavigate }) {
    return (
        <div className="main-menu page-container">
            <div className="menu-content fade-in">
                {/* Logo 和标题 */}
                <div className="menu-header">
                    <div className="logo-container">
                        <div className="logo-blocks">
                            <div className="logo-block block-red"></div>
                            <div className="logo-block block-blue"></div>
                            <div className="logo-block block-green"></div>
                            <div className="logo-block block-yellow"></div>
                        </div>
                    </div>
                    <h1 className="title">记忆色块</h1>
                    <p className="subtitle">训练你的超级记忆力！</p>
                </div>

                {/* 主按钮 */}
                <div className="menu-buttons">
                    <button
                        className="btn btn-primary btn-large menu-btn"
                        onClick={() => onNavigate('difficulty')}
                    >
                        <span className="btn-icon-left">🎮</span>
                        难度选择
                    </button>

                    <button
                        className="btn btn-primary btn-large menu-btn challenge-btn"
                        onClick={() => onNavigate('challenge')}
                    >
                        <span className="btn-icon-left">🏆</span>
                        挑战模式
                    </button>

                    <button
                        className="btn btn-secondary btn-large menu-btn"
                        onClick={() => onNavigate('collection')}
                    >
                        <span className="btn-icon-left">🎴</span>
                        我的图卡
                    </button>
                </div>

                {/* 设置按钮 */}
                <button
                    className="settings-btn"
                    onClick={() => onNavigate('settings')}
                    aria-label="设置"
                >
                    ⚙️
                </button>
            </div>

            {/* 装饰性浮动色块 */}
            <div className="floating-blocks">
                <div className="float-block float-1 block-purple"></div>
                <div className="float-block float-2 block-orange"></div>
                <div className="float-block float-3 block-cyan"></div>
                <div className="float-block float-4 block-pink"></div>
            </div>
        </div>
    )
}
