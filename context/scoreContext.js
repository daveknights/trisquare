import React from "react";

export default scoreContext = React.createContext({
    score: 0,
    highScore: 0,
    setHighScore: () => {},
});
