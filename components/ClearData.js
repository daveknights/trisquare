import { StyleSheet, Text, View } from 'react-native';
import { useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ColourButton from './ColourButton';
import GameContext from '../context/gameContext';
import containerStyles from '../defaults/containerStyles';
import textStyles from '../defaults/textStyles';
import colours from '../defaults/colours';

export default function ClearData() {
    const [dataCleared, setDataCleared] = useState(false);
    const gameContext = useContext(GameContext);
    const theme = gameContext.theme;

    textStyles.heading.color = theme.textColour;
    textStyles.text.color = theme.textColour;

    useEffect(() => {
        if(dataCleared) {
            gameContext.setHighScore(0);
            gameContext.setAchievements({});
        }
    }, [dataCleared]);

    const clearUserData = async () => {
        try {
            await AsyncStorage.removeItem('@triSquareData');

            setDataCleared(true);
        } catch(e) {
          // remove error
        }
    };

    return (
        <View style={{...containerStyles, backgroundColor: theme.bgColour}}>
             <Text style={{...textStyles.heading}}>Clear high score</Text>
             <Text style={{...textStyles.text}}>Please be aware that this will remove all the game data from your device
                until you next play TriSquare and can't be undone.</Text>
            <Text style={{...textStyles.text}}>This includes your high score, mode choice and levels unlocked.</Text>
            <View style={styles.highScoreInfo}>
                <Text style={{...textStyles.text}}>Your current high score is: </Text>
                <Text style={{...textStyles.text, fontWeight: 'bold', marginBottom: 200}}>{gameContext.highScore}</Text>
            </View>
            <ColourButton
                text="Clear"
                bgColour="red"
                onPress={clearUserData} />
            {dataCleared && <Text style={styles.dataCleared}>Your high score data has been removed.</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    highScoreInfo: {
        flexDirection: 'row',
        width: '100%',
    },
    dataCleared: {
        alignSelf: 'flex-start',
        backgroundColor: colours.messageBg,
        borderColor: colours.green,
        borderWidth: 2,
        color: colours.primary,
        fontSize: 16,
        marginTop: 20,
        padding: 10,
        width: '100%',
    },
});