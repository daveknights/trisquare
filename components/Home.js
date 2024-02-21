import { StyleSheet, Text, View, Image } from 'react-native';
import { useContext } from 'react';
import ColourButton from './ColourButton';
import IconButton from './IconButton';
import GameContext from '../context/gameContext';
import containerStyles from '../defaults/containerStyles';
import layoutStyles from '../defaults/layoutStyles';

export default function Home({ navigation }) {
    const gameContext = useContext(GameContext);
    const theme = gameContext.theme;

    const handlePlayPress = () => navigation.navigate('Game');

    const handleRewardsPress = () => navigation.navigate('Rewards');

    const handleOptionsPress = () => navigation.navigate('Options');

    const handleInfoPress = () => navigation.navigate('Instructions');



    return (
        <View style={{...containerStyles, backgroundColor: theme.bgColour}}>
            <View style={{...layoutStyles.centerWrapper, ...layoutStyles.flexTwo}}>
                <Image
                    style={styles.homescreenLogo}
                    source={require('../assets/homescreen-logo.png')}
                />
            </View>
            <View style={{...layoutStyles.centerWrapper, ...layoutStyles.flexOne}}>
                <View style={styles.bestScoreArea}>
                    <Text style={{...styles.best, color: theme.textColour}}>Best: </Text>
                    <Text style={{...styles.bestScore, color: theme.textColour}}>{gameContext.highScore}</Text>
                </View>
            </View>
            <View style={{...layoutStyles.centerWrapper, ...layoutStyles.flexThree}}>
                <ColourButton
                    text="Play"
                    bgColour="green"
                    onPress={handlePlayPress}
                />
                <ColourButton
                    text="Rewards"
                    bgColour="yellow"
                    onPress={handleRewardsPress}
                />
                <View style={styles.optionsInfo}>
                    <IconButton
                        path={require('../assets/options-icon.png')}
                        bgColour="orange"
                        onPress={handleOptionsPress}
                    />
                    <IconButton
                        path={require('../assets/info-icon.png')}
                        bgColour="lightBlue"
                        onPress={handleInfoPress}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    homescreenLogo: {
        height: 146,
        width: 168,
    },
    bestScoreArea: {
        flexDirection: 'row',
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