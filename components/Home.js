import { StyleSheet, Text, View, Image } from 'react-native';
import { useContext } from 'react';
import ColourButton from './ColourButton';
import TextButton from './TextButton';
import ScoreContext from '../context/scoreContext';
import containerStyles from '../defaults/containerStyles';
import colours from '../defaults/colours';

export default function Home({ navigation }) {
    const scoreContext = useContext(ScoreContext);

    return (
        <View style={{...styles.container, paddingTop: 100}}>
            <Image
                style={styles.homescreenLogo}
                source={require('../assets/homescreen-logo.png')}
            />
            <Text style={styles.gameName}>TriSquare</Text>
            <View style={styles.bestScoreArea}>
                <Text style={styles.best}>Best: </Text>
                <Text style={styles.bestScore}>{scoreContext.highScore}</Text>
            </View>
            <ColourButton
                text="Play"
                bgColour="green"
                textColour="primaryColour"
                action="playGame"
                onPress={navigation}
            />
            <ColourButton
                text="How to play"
                bgColour="yellow"
                textColour="primaryColour"
                action="viewInstructions"
                onPress={navigation}
            />
            <TextButton
                text="Clear high score"
                textColour="blue"
                action="ClearData"
                onPress={navigation}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {...containerStyles},
    homescreenLogo: {
        height: 100,
        width: 109,
    },
    gameName: {
        color: colours.lightText,
        fontSize: 40,
        fontWeight: 'bold',
    },
    bestScoreArea: {
        flexDirection: 'row',
        marginBottom: 100,
        marginTop: 90,
    },
    best: {
        color: colours.lightText,
        fontSize: 20,
    },
    bestScore: {
        color: colours.lightText,
        fontSize: 20,
        fontWeight: 'bold',
    },
});