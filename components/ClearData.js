import { StyleSheet, Text, View } from 'react-native';
import { useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ColourButton from './ColourButton';
import ScoreContext from '../context/scoreContext';
import containerStyles from '../defaults/containerStyles';
import textStyles from '../defaults/textStyles';
import colours from '../defaults/colours';

export default function ClearData() {
    const [dataCleared, setDataCleared] = useState(false);
    const scoreContext = useContext(ScoreContext);

    useEffect(() => {
        dataCleared && scoreContext.setHighScore(0);
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
        <View style={{...containerStyles}}>
             <Text style={{...textStyles.heading}}>Clear high score</Text>
             <Text style={{...textStyles.text}}>Please be aware that this will remove the high score data from your device
                until you next play TriSquare and can't be undone.</Text>
            <View style={styles.highScoreInfo}>
                <Text style={{...textStyles.text}}>Your current high score is: </Text>
                <Text style={{...textStyles.text, fontWeight: 'bold', marginBottom: 200}}>{scoreContext.highScore}</Text>
            </View>
            <ColourButton
                text="Clear"
                bgColour="red"
                textColour="primaryColour"
                action="clearData"
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
        backgroundColor: colours.tileGrads.green[0],
        borderColor: colours.green,
        borderWidth: 2,
        color: colours.primaryColour,
        fontSize: 16,
        marginTop: 20,
        padding: 10,
        width: '100%',
    },
});