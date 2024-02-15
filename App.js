import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScoreContext from './context/scoreContext';
import Home from './components/Home';
import Game from './components/Game';
import Instructions from './components/Instructions';
import ClearData from './components/ClearData';
import colours from './defaults/colours';
const headerStyles = {
    headerStyle: {
        backgroundColor: colours.primaryColour,
      },
    headerTintColor: colours.lightText,
};

const Stack = createNativeStackNavigator();

export default function App() {
    const [highScore, setHighScore] = useState(0);

    const getHighScore = async () => {
        try {
            const jsonData = await AsyncStorage.getItem('@triSquareData');
            const allData = JSON.parse(jsonData);

            if (value !== null) {
                setHighScore(allData.normalHighScore);
            }
        } catch (e) {
            // error reading value
        }
    };

    useEffect(() => {
        getHighScore()
    }, []);

    return (
        <ScoreContext.Provider value={{highScore: highScore, setHighScore: setHighScore}}>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Home"
                        component={Home}
                        options={{headerShown: false, ...headerStyles}} />
                    <Stack.Screen name="Game"
                        component={Game}
                        options={{headerShown: false, ...headerStyles}} />
                    <Stack.Screen name="Instructions"
                        component={Instructions}
                        options={{...headerStyles, animation: 'slide_from_right'}} />
                    <Stack.Screen name="ClearData"
                        component={ClearData}
                        options={{title: 'Clear data', ...headerStyles, animation: 'slide_from_right'}} />
                </Stack.Navigator>
            </NavigationContainer>
            <StatusBar style="auto" />
        </ScoreContext.Provider>
    );
}
