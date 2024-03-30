import React from "react";

export default scoreContext = React.createContext({
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
    playViolet: false,
    setPlayViolet: () => {},
    achievements: {},
    setAchievements: () => {},
    sfx: true,
    setSfx: () => {},
});
