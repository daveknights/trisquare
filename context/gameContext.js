import { createContext } from "react"

export const GameContext = createContext({
    mode: '',
    setMode: () => {},
    theme: {},
    setTheme: () => {},
    plays: 0,
    setPlays: () => {},
    highScore: 0,
    setHighScore: () => {},
    violetUnlocked: false,
    setVioletUnlocked: () => {},
    quickPlayHighScore: 0,
    setQuickPlayHighScore: () => {},
    achievements: {},
    setAchievements: () => {},
    sfx: true,
    setSfx: () => {},
    gameType: '',
    setGameType: () => {},
});
