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
    const styles = createStyles(gameContext.theme);

    textStyles.heading.color = gameContext.theme.textColour;
    textStyles.text.color = gameContext.theme.textColour;

    useEffect(() => {
        dataCleared && gameContext.setHighScore(0);
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
        <View style={styles.container}>
             <Text style={{...textStyles.heading}}>Clear high score</Text>
             <Text style={{...textStyles.text}}>Please be aware that this will remove the high score data from your device
                until you next play TriSquare and can't be undone.</Text>
            <View style={styles.highScoreInfo}>
                <Text style={{...textStyles.text}}>Your current high score is: </Text>
                <Text style={{...textStyles.text, fontWeight: 'bold', marginBottom: 200}}>{gameContext.highScore}</Text>
            </View>
            <ColourButton
                text="Clear"
                bgColour="red"
                action="clearData"
                onPress={clearUserData} />
            {dataCleared && <Text style={styles.dataCleared}>Your high score data has been removed.</Text>}
        </View>
    );
};

const createStyles = theme => StyleSheet.create({
    container: {
        backgroundColor: theme.bgColour,
        ...containerStyles,
    },
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