import { StyleSheet, Text, View, Image } from 'react-native';
import { useContext } from 'react';
import ColourButton from './ColourButton';
import IconButton from './IconButton';
import TextButton from './TextButton';
import GameContext from '../context/gameContext';
import containerStyles from '../defaults/containerStyles';

export default function Home({ navigation }) {
    const gameContext = useContext(GameContext);
    const styles = createStyles(gameContext.theme);

    const handlePlayPress = () => navigation.navigate('Game');

    const handleOptionsPress = () => navigation.navigate('Options');

    const handleInfoPress = () => navigation.navigate('Instructions');

    const handleLinkToClearData = () => navigation.navigate('ClearData');

    return (
        <View style={styles.container}>
            <Image
                style={styles.homescreenLogo}
                source={require('../assets/homescreen-logo.png')}
            />
            <View style={styles.bestScoreArea}>
                <Text style={styles.best}>Best: </Text>
                <Text style={styles.bestScore}>{gameContext.highScore}</Text>
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

const createStyles = theme => StyleSheet.create({
    container: {
        backgroundColor: theme.bgColour,
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
        color: theme.textColour,
        fontSize: 20,
    },
    bestScore: {
        color: theme.textColour,
        fontSize: 20,
        fontWeight: 'bold',
    },
    optionsInfo: {
        flexDirection: 'row',
        gap: 20,
    },
});