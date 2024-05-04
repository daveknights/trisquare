import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ColourButton from './ColourButton';
import GameContext from '../context/gameContext';
import containerStyles from '../defaults/containerStyles';
import textStyles from '../defaults/textStyles';
import colours from '../defaults/colours';
import layoutStyles from '../defaults/layoutStyles';

export default function ClearData({ navigation }) {
    const [dataCleared, setDataCleared] = useState(false);
    const gameContext = useContext(GameContext);
    const theme = gameContext.theme;

    textStyles.heading.color = theme.textColour;
    textStyles.text.color = theme.textColour;

    useEffect(() => {
        if(dataCleared) {
            gameContext.setHighScore(0);
            gameContext.setQuickPlayHighScore(0);
            gameContext.setAchievements({});
            gameContext.setGameType('blue');
            gameContext.setVioletUnlocked(false);
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

    const handleHomePress = () => navigation.navigate('Home');

    return (
        <View style={{...containerStyles, backgroundColor: theme.bgColour}}>
            <View style={{...layoutStyles.flexOne, ...layoutStyles.startWrapper}}>
                <Text style={{...textStyles.heading}}>Clear game data</Text>
                <Text style={{...textStyles.text}}>Please be aware that this will remove all the game data from your device
                    until you next play TriSquare and can't be undone.</Text>
                <Text style={{...textStyles.text}}>This includes your high score, levels unlocked and rewards.</Text>
                <View style={styles.highScoreInfo}>
                    <Text style={{...textStyles.text}}>Your current high score is: </Text>
                    <Text style={{...textStyles.text, fontWeight: 'bold'}}>{gameContext.highScore}</Text>
                </View>
                {gameContext.quickPlayHighScore > 0 && <View style={styles.highScoreInfo}>
                    <Text style={{...textStyles.text}}>Your current quick play high score is: </Text>
                    <Text style={{...textStyles.text, fontWeight: 'bold'}}>{gameContext.quickPlayHighScore}</Text>
                </View>}
                <View style={styles.buttons}>
                    <ColourButton
                        text="Clear"
                        bgColour="red"
                        onPress={clearUserData} />
                    <ColourButton
                        text="Home"
                        bgColour="yellow"
                        onPress={handleHomePress} />
                    {dataCleared && <Text style={styles.dataCleared}>All data has been removed.</Text>}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    highScoreInfo: {
        flexDirection: 'row',
        width: '100%',
    },
    buttons: {
        marginTop: 50,
    },
    dataCleared: {
        backgroundColor: colours.messageBg,
        borderColor: colours.green,
        borderWidth: 2,
        color: colours.primary,
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        paddingBottom: 8,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 8,
        textAlign: 'center',
        width: Dimensions.get('window').width - 140,
    },
});