import { useEffect, useContext, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameContext } from '../context/gameContext';
import colour from "../defaults/colour";

export default function QuickPlayScore({ score, gameOver, quickPlayWasStarted }) {
    const [currentQPHighScore, setCurrentQPHighScore] = useState('');
    const gameContext = useContext(GameContext);

    useEffect(() => {
        async function saveData() {
            try {
                const triSquareData = await AsyncStorage.getItem('@triSquareData');
                const updatedData = JSON.parse(triSquareData) || {};

                updatedData.quickPlayHighScore = score;
                gameContext.setQuickPlayHighScore(score);

                await AsyncStorage.setItem('@triSquareData', JSON.stringify(updatedData));
            } catch (error) {
                console.log('There has been a problem saving: ' + error.message);
            }
        }

        if (quickPlayWasStarted && gameOver && score > currentQPHighScore) {
            saveData(score);
        }

        if (!gameOver && score === 0) {
            setCurrentQPHighScore(gameContext.quickPlayHighScore);
        }
    }, [gameOver, score]);

    return (
        <View style={styles.quickPlayScoreView}>
            <Text style={{...styles.quickPlayScoreHeading, fontSize: gameOver ? 18 : 15, paddingBottom: gameOver ? 5 : 3, paddingTop: gameOver ? 3 : 0}}>{gameOver && score > currentQPHighScore ? 'Hi-Score' : 'Score'}</Text>
            <Text style={{...styles.quickPlayScore, fontSize: gameOver ? 32 : 24}}>{score}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    quickPlayScoreView: {
        borderColor: colour.style.primary,
        borderRadius: 8,
        borderWidth: 1,
        overflow: 'hidden',
    },
    quickPlayScoreHeading: {
        backgroundColor: colour.style.green,
        borderColor: colour.style.primary,
        borderBottomWidth: 1,
        color: colour.style.primary,
        textAlign: 'center',
        width: 100,
    },
    quickPlayScore: {
        backgroundColor: colour.style.lightBlue,
        color: colour.style.primary,
        fontWeight: 'bold',
        paddingBottom: 5,
        paddingTop: 3,
        textAlign: 'center',
        width: 100,
    },
});