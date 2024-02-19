import { StyleSheet, Text, View, Image } from 'react-native';
import { useContext } from 'react';
import ColourButton from './ColourButton';
import IconButton from './IconButton';
import TextButton from './TextButton';
import GameContext from '../context/gameContext';
import containerStyles from '../defaults/containerStyles';

export default function Home({ navigation }) {
    const gameContext = useContext(GameContext);
    const theme = gameContext.theme;

    const handlePlayPress = () => navigation.navigate('Game');

    const handleOptionsPress = () => navigation.navigate('Options');

    const handleInfoPress = () => navigation.navigate('Instructions');

    const handleLinkToClearData = () => navigation.navigate('ClearData');

    return (
        <View style={{...styles.container, backgroundColor: theme.bgColour}}>
            <Image
                style={styles.homescreenLogo}
                source={require('../assets/homescreen-logo.png')}
            />
            <View style={styles.bestScoreArea}>
                <Text style={{...styles.best, color: theme.textColour}}>Best: </Text>
                <Text style={{...styles.bestScore, color: theme.textColour}}>{gameContext.highScore}</Text>
            </View>
            <ColourButton
                text="Play"
                bgColour="green"
                action="playGame"
                onPress={handlePlayPress}
            />
            <View style={styles.optionsInfo}>
                <IconButton
                    path={require('../assets/options-icon.png')}
                    bgColour="yellow"
                    onPress={handleOptionsPress}
                />
                <IconButton
                    path={require('../assets/info-icon.png')}
                    bgColour="lightBlue"
                    onPress={handleInfoPress}
                />
            </View>
            <TextButton
                text="Clear high score"
                textColour={gameContext.theme.linkColour}
                onPress={handleLinkToClearData}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 100,
        ...containerStyles,
    },
    homescreenLogo: {
        height: 146,
        width: 168,
    },
    bestScoreArea: {
        flexDirection: 'row',
        marginBottom: 100,
        marginTop: 90,
    },
    best: {
        fontSize: 20,
    },
    bestScore: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    optionsInfo: {
        flexDirection: 'row',
        gap: 20,
    },
});