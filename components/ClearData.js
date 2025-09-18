import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ColourButton from './ColourButton';
import { GameContext } from '../context/gameContext';
import container from '../defaults/container';
import text from '../defaults/text';
import colour from '../defaults/colour';
import layout from '../defaults/layout';

export default function ClearData({ navigation }) {
    const [dataCleared, setDataCleared] = useState(false);
    const gameContext = useContext(GameContext);
    const theme = gameContext.theme;

    text.style.heading.color = theme.textColour;
    text.style.text.color = theme.textColour;

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
        <View style={{...container.style, backgroundColor: theme.bgColour}}>
            <View style={{...layout.style.flexOne, ...layout.style.startWrapper}}>
                <Text style={{...text.style.heading}}>Clear game data</Text>
                <Text style={{...text.style.text}}>Please be aware that this will remove all the game data from your device
                    until you next play TriSquare and can't be undone.</Text>
                <Text style={{...text.style.text}}>This includes your high score, levels unlocked and rewards.</Text>
                <View style={styles.highScoreInfo}>
                    <Text style={{...text.style.text}}>Your current high score is: </Text>
                    <Text style={{...text.style.text, fontWeight: 'bold'}}>{gameContext.highScore}</Text>
                </View>
                {gameContext.quickPlayHighScore > 0 && <View style={styles.highScoreInfo}>
                    <Text style={{...text.style.text}}>Your current quick play high score is: </Text>
                    <Text style={{...text.style.text, fontWeight: 'bold'}}>{gameContext.quickPlayHighScore}</Text>
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
        backgroundColor: colour.style.messageBg,
        borderColor: colour.style.green,
        borderWidth: 2,
        color: colour.style.primary,
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