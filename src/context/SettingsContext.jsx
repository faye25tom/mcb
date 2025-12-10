import { createContext, useContext, useState, useEffect } from 'react'
import { storage } from '../utils/gameLogic'

const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
    const [settings, setSettings] = useState(() => storage.getSettings())

    useEffect(() => {
        storage.saveSettings(settings)
    }, [settings])

    const updateSetting = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }))
    }

    const toggleSetting = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }))
    }

    return (
        <SettingsContext.Provider value={{ settings, updateSetting, toggleSetting }}>
            {children}
        </SettingsContext.Provider>
    )
}

export function useSettings() {
    const context = useContext(SettingsContext)
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider')
    }
    return context
}
