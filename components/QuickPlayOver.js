import { useEffect, useContext, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import GameContext from '../context/gameContext';

export default function QuickPlayOver({ gridSize, score, finishText }) {
    const [currentQPHighScore, setCurrentQPHighScore] = useState('');
    const gameContext = useContext(GameContext);

    useEffect(() => {
        setCurrentQPHighScore(gameContext.quickPlayHighScore);
    }, []);

    useEffect(() => {
        async function saveData() {
            try {
                const triSquareData = await AsyncStorage.getItem('@triSquareData');
                const updatedData = JSON.parse(triSquareData) || {};

                if (gameContext.gameType === 'quickplay') {
                    if (score > gameContext.quickPlayHighScore) {
                        updatedData.quickPlayHighScore = score;
                        gameContext.setQuickPlayHighScore(score);

                        await AsyncStorage.setItem('@triSquareData', JSON.stringify(updatedData));
                    }
                }
            } catch (error) {
                console.log('There has been a problem saving: ' + error.message);
            }
        }

        saveData(score);
    }, []);

    return (
        <View style={{...styles.quickPlayOver, height: gridSize, width: gridSize}}>
            <View style={styles.quickPlayOverBG}>
                <Text style={styles.text}>{finishText}</Text>
                <Text style={{...styles.quickPlayScore, marginTop: 40}}>{score > currentQPHighScore ? 'High score' : 'You scored'}</Text>
                <Text style={styles.quickPlayScore}>{score}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    quickPlayOver: {
        backgroundColor: 'rgba(0,4,6,0.7)',
        borderRadius: 15,
        padding: 30,
        position: 'absolute',
        zIndex: 1,
    },
    quickPlayOverBG: {
        alignItems: 'center',
        backgroundColor: colours.lightBlue,
        borderRadius: 12,
        height: '100%',
        overflow: 'hidden',
        width: '100%',
    },
    text: {
        backgroundColor: colours.green,
        borderBottomColor: colours.primary,
        borderBottomWidth: 1,
        color: colours.primary,
        fontSize: 20,
        fontWeight: 'bold',
        paddingBottom: 12,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 12,
        textAlign: 'center',
        width: '100%',
    },
    quickPlayScore: {
        color: colours.primary,
        fontSize: 40,
        paddingLeft: 20,
        paddingRight: 20,
        textAlign: 'center',
    },
});