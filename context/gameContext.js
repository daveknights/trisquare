import React from "react";

export default scoreContext = React.createContext({
    mode: '',
    setMode: () => {},
    theme: {},
    setTheme: () => {},
    highScore: 0,
    setHighScore: () => {},
});
