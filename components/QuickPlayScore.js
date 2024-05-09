import { useEffect, useContext, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import GameContext from '../context/gameContext';
import colours from "../defaults/colours";

export default function QuickPlayScore({ score, gameOver }) {
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

        if (gameOver && score > currentQPHighScore) {
            saveData(score);
        }
    }, [gameOver]);

    return (
        <View style={styles.quickPlayScoreView}>
            <Text style={{...styles.quickPlayScoreHeading, paddingBottom: gameOver ? 5 : 0, paddingTop: gameOver ? 5 : 0}}>{gameOver && score > currentQPHighScore ? 'High score' : 'score'}</Text>
            <Text style={{...styles.quickPlayScore, fontSize: gameOver ? 32 : 24}}>{score}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    quickPlayScoreView: {
        borderColor: colours.primary,
        borderRadius: 8,
        borderWidth: 1,
        overflow: 'hidden',
        position: 'absolute',
    },
    quickPlayScoreHeading: {
        backgroundColor: colours.green,
        borderColor: colours.primary,
        borderBottomWidth: 1,
        color: colours.primary,
        textAlign: 'center',
        width: 100,
    },
    quickPlayScore: {
        backgroundColor: colours.lightBlue,
        color: colours.primary,
        fontWeight: 'bold',
        paddingBottom: 4,
        paddingTop: 4,
        textAlign: 'center',
        width: 100,
    },
});