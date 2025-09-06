import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GameContext from './context/gameContext';
import Home from './components/Home';
import Game from './components/Game';
import Rewards from './components/Rewards';
import Instructions from './components/Instructions';
import Options from './components/Options';
import ClearData from './components/ClearData';
import { darkTheme, lightTheme } from './defaults/themes';

const Stack = createNativeStackNavigator();

export default function App() {
    const [mode, setMode] = useState('dark');
    const [theme, setTheme] = useState(darkTheme);
    const [plays, setPlays] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [achievements, setAchievements] = useState({});
    const [violetUnlocked, setVioletUnlocked] = useState(false);
    const [quickPlayHighScore, setQuickPlayHighScore] = useState(0);
    const [sfx, setSfx] = useState(true);
    const [gameType, setGameType] = useState('blue');
    const statusBarColour = mode === 'dark' ? 'light' : 'dark';

    const headerStyles = {
        headerStyle: {
            backgroundColor: theme.bgColour,
          },
        headerTintColor: theme.textColour,
    };

    const getUserData = async () => {
        try {
            const jsonData = await AsyncStorage.getItem('@triSquareData');
            const allData = JSON.parse(jsonData);

            if (allData !== null) {
                allData.plays && setPlays(allData.plays)
                allData.highScore && setHighScore(allData.highScore);
                allData.quickPlayHighScore && setQuickPlayHighScore(allData.quickPlayHighScore);

                allData.violetUnlocked && setVioletUnlocked(true);

                if (allData.mode) {
                    allData.mode === 'light' ? setTheme(lightTheme) : setTheme(darkTheme);

                    setMode(allData.mode);
                }

                if (allData.sfx === false) {
                    setSfx(allData.sfx);
                }

                allData.achievements && setAchievements(allData.achievements);
            }
        } catch (e) {
            // error reading value
        }
    };

    useEffect(() => {
        getUserData();
    }, []);

    return (
    <View style={{backgroundColor: theme.bgColour, flex: 1}}>
        <GameContext.Provider value={{mode: mode, setMode: setMode,
                                    theme: theme, setTheme: setTheme,
                                    plays: plays,
                                    setPlays: setPlays,
                                    highScore: highScore,
                                    setHighScore: setHighScore,
                                    violetUnlocked: violetUnlocked,
                                    setVioletUnlocked: setVioletUnlocked,
                                    quickPlayHighScore: quickPlayHighScore,
                                    setQuickPlayHighScore: setQuickPlayHighScore,
                                    achievements: achievements,
                                    setAchievements: setAchievements,
                                    sfx: sfx,
                                    setSfx: setSfx,
                                    gameType: gameType,
                                    setGameType: setGameType}}>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Home"
                        component={Home}
                        options={{headerShown: false, animation: 'fade'}} />
                    <Stack.Screen name="Game"
                        component={Game}
                        options={{headerShown: false, animation: 'fade'}} />
                    <Stack.Screen name="Rewards"
                        component={Rewards}
                        options={{...headerStyles, animation: 'slide_from_right'}} />
                    <Stack.Screen name="Options"
                        component={Options}
                        options={{headerShown: false, animation: 'fade'}} />
                    <Stack.Screen name="Instructions"
                        component={Instructions}
                        options={{...headerStyles, animation: 'slide_from_right'}} />
                    <Stack.Screen name="ClearData"
                        component={ClearData}
                        options={{title: 'Clear data', ...headerStyles, animation: 'slide_from_right'}} />
                </Stack.Navigator>
            </NavigationContainer>
            <StatusBar style={statusBarColour} />
        </GameContext.Provider>
    </View>
    );
}
