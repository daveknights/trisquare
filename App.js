import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GameContext from './context/gameContext';
import Home from './components/Home';
import Game from './components/Game';
import Instructions from './components/Instructions';
import Options from './components/Options';
import ClearData from './components/ClearData';
import { darkTheme, lightTheme } from './defaults/themes';

const Stack = createNativeStackNavigator();

export default function App() {
    const [mode, setMode] = useState('dark');
    const [theme, setTheme] = useState(darkTheme);
    const [highScore, setHighScore] = useState(0);

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
                allData.normalHighScore && setHighScore(allData.normalHighScore);

                if (allData.mode) {
                    allData.mode === 'light' ? setTheme(lightTheme) : setTheme(darkTheme);

                    setMode(allData.mode);
                }
            }
        } catch (e) {
            // error reading value
        }
    };

    useEffect(() => {
        getUserData();
    }, []);

    return (
        <GameContext.Provider value={{mode: mode, setMode: setMode, theme: theme, setTheme: setTheme, highScore: highScore, setHighScore: setHighScore}}>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Home"
                        component={Home}
                        options={{headerShown: false, ...headerStyles}} />
                    <Stack.Screen name="Game"
                        component={Game}
                        options={{headerShown: false, ...headerStyles}} />
                    <Stack.Screen name="Options"
                        component={Options}
                        options={{title: 'Options', ...headerStyles, animation: 'slide_from_right'}} />
                    <Stack.Screen name="Instructions"
                        component={Instructions}
                        options={{...headerStyles, animation: 'slide_from_right'}} />
                    <Stack.Screen name="ClearData"
                        component={ClearData}
                        options={{title: 'Clear data', ...headerStyles, animation: 'slide_from_right'}} />
                </Stack.Navigator>
            </NavigationContainer>
            <StatusBar style="auto" />
        </GameContext.Provider>
    );
}
