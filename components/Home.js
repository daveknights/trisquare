import { StyleSheet, Text, View, Image, ImageBackground, Dimensions } from 'react-native';
import { useContext } from 'react';
import ColourButton from './ColourButton';
import IconButton from './IconButton';
import GameContext from '../context/gameContext';
import containerStyles from '../defaults/containerStyles';
import layoutStyles from '../defaults/layoutStyles';

export default function Home({ navigation }) {
    const gameContext = useContext(GameContext);
    const theme = gameContext.theme;
    const gameName = gameContext.mode === 'dark' ? require('../assets/gameName-light.png') :
                                                    require('../assets/gameName-dark.png');

    const handlePlayPress = () => navigation.navigate('Game');

    const handleRewardsPress = () => navigation.navigate('Rewards');

    const handleOptionsPress = () => navigation.navigate('Options');

    const handleInfoPress = () => navigation.navigate('Instructions');

    return (
        <ImageBackground source={gameContext.mode === 'dark' ? require('../assets/home-bg-dark.webp') : require('../assets/home-bg-light.webp')} resizeMode="cover" style={{backgroundColor: theme.bgColour, flex: 1}}>
            <View style={containerStyles}>
                <View style={{...layoutStyles.centerWrapper, ...layoutStyles.flexTwo}}>
                    <Image
                        style={styles.homescreenLogo}
                        source={require('../assets/homescreen-logo.png')}
                    />
                    <Image
                        style={styles.gameName}
                        source={gameName}
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
                            label="Options"
                            width={(Dimensions.get('window').width - 160) / 2}
                        />
                        <IconButton
                            path={require('../assets/info-icon.png')}
                            bgColour="blue"
                            onPress={handleInfoPress}
                            label="Instructions"
                            width={(Dimensions.get('window').width - 160) / 2}
                        />
                    </View>
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    homescreenLogo: {
        height: 102,
        marginBottom: 8,
        width: 111,
    },
    gameName: {
        height: 34,
        width: 166,
    },
    bestScoreArea: {
        flexDirection: 'row',
    },
    best: {
        fontSize: 24,
    },
    bestScore: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    optionsInfo: {
        flexDirection: 'row',
        gap: 20,
    },
});