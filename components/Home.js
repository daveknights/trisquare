import { StyleSheet, Text, View, Image } from 'react-native';
import { useContext } from 'react';
import ColourButton from './ColourButton';
import TextButton from './TextButton';
import GameContext from '../context/gameContext';
import containerStyles from '../defaults/containerStyles';

export default function Home({ navigation }) {
    const gameContext = useContext(GameContext);
    const styles = createStyles(gameContext.theme);

    return (
        <View style={styles.container}>
            <Image
                style={styles.homescreenLogo}
                source={require('../assets/homescreen-logo.png')}
            />
            <Text style={styles.gameName}>TriSquare</Text>
            <View style={styles.bestScoreArea}>
                <Text style={styles.best}>Best: </Text>
                <Text style={styles.bestScore}>{gameContext.highScore}</Text>
            </View>
            <ColourButton
                text="Play"
                bgColour="green"
                action="playGame"
                onPress={navigation}
            />
            <ColourButton
                text="Options"
                bgColour="yellow"
                action="viewOptions"
                onPress={navigation}
            />
            <ColourButton
                text="How to play"
                bgColour="yellow"
                action="viewInstructions"
                onPress={navigation}
            />
            <TextButton
                text="Clear high score"
                textColour={gameContext.theme.linkColour}
                action="ClearData"
                onPress={navigation}
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
        height: 100,
        width: 109,
    },
    gameName: {
        color: theme.textColour,
        fontSize: 40,
        fontWeight: 'bold',
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
});