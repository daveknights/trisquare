import { BackHandler, StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, Dimensions } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useHeaderHeight } from '@react-navigation/elements';
import { useAudioPlayer } from 'expo-audio';
import { GameContext } from '../context/gameContext';
import ColourButton from './ColourButton';
import container from '../defaults/container';
import text from '../defaults/text';
import button from '../defaults/button';
import colour from '../defaults/colour';
import layout from '../defaults/layout';
import themes from '../defaults/themes';
const sound = require('../assets/reward.mp3');
const { height } = Dimensions.get('window');

export default function Options({ navigation }) {
    const [isDarkMode, setIsDarkMode] = useState(null);
    const [contentHeight, setContentHeight] = useState(0);
    const [scrollEnabled, setScrollEnabled] = useState(false);
    const headerHeight = useHeaderHeight();
    const gameContext = useContext(GameContext);
    const theme = gameContext.theme;
    const violetUnlocked = gameContext.violetUnlocked;
    const player = useAudioPlayer(sound);
    const selectedOption = {
        borderColor: '#00b353',
        borderWidth: 5
    };

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);

        return () => backHandler.remove();
    });

    const playSound = () => {
        player.seekTo(0);
        player.play();
    }

    const onContentSizeChange = (contentWidth, contentHeight) => {
        setContentHeight(contentHeight);
    };

    useEffect(() => {
        (!scrollEnabled && contentHeight > (height - headerHeight)) && setScrollEnabled(true);
    }, [contentHeight]);

    useEffect(() => {
        gameContext.mode === 'dark' ? setIsDarkMode(true) : setIsDarkMode(false);
    }, [gameContext.mode]);

    const handleModePress = async value => {
        try {
            const triSquareData = await AsyncStorage.getItem('@triSquareData');
            const updatedData = JSON.parse(triSquareData) || {};

            updatedData.mode = value;

            await AsyncStorage.setItem('@triSquareData', JSON.stringify(updatedData));

            gameContext.setMode(value);
            gameContext.setTheme(themes[value]);
        } catch (e) {
            // saving error
        }
    };

    const handleSfxPress = async value => {
        value && playSound();

        try {
            const triSquareData = await AsyncStorage.getItem('@triSquareData');
            const updatedData = JSON.parse(triSquareData) || {};

            updatedData.sfx = value;

            await AsyncStorage.setItem('@triSquareData', JSON.stringify(updatedData));

            gameContext.setSfx(value);
        } catch (e) {
            // saving error
        }
    };

    const handleLevelPress = gameType => {
        gameContext.setGameType(gameType);

        navigation.navigate('Game');
    };

    text.style.heading.color = theme.textColour;
    text.style.subHeading.color = theme.textColour;
    text.style.text.color = theme.textColour;

    return (
        <View style={{...container.style, backgroundColor: theme.bgColour, paddingBottom: 48, paddingTop: 24}}>
            <ScrollView scrollEnabled={scrollEnabled} onContentSizeChange={onContentSizeChange} style={{width: '100%'}}>
                <View style={{...layout.style.centerWrapper}}>
                    <Text style={{...text.style.heading}}>Game options</Text>
                    <Text style={{...text.style.subHeading, color: theme.textColour}}>Mode</Text>
                    <View style={styles.optionChoice}>
                        <TouchableOpacity disabled={isDarkMode} style={{...styles.option, ...styles.dark, ...isDarkMode && selectedOption}} onPress={() => handleModePress('dark')}
                            accessible={true}
                            accessibilityLabel="Dark mode">
                            <Image
                                style={styles.moonIcon}
                                source={require('../assets/moon-icon.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity disabled={!isDarkMode} style={{...styles.option, ...styles.light, ...!isDarkMode && selectedOption}} onPress={() => handleModePress('light')}
                            accessible={true}
                            accessibilityLabel="Light mode">
                            <Image
                                style={styles.sunIcon}
                            source={require('../assets/sun-icon.png')} />
                        </TouchableOpacity>
                    </View>
                    <Text style={{...text.style.subHeading, color: theme.textColour}}>Sound</Text>
                    <View style={styles.optionChoice}>
                        <TouchableOpacity disabled={gameContext.sfx} style={{...styles.option, ...styles.sound, ...gameContext.sfx && selectedOption}} onPress={() => handleSfxPress(true)}
                            accessible={true}
                            accessibilityLabel="Sound on">
                            <Image
                                style={styles.soundOnIcon}
                                source={require('../assets/sound-on-icon.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity disabled={!gameContext.sfx} style={{...styles.option, ...styles.sound, ...!gameContext.sfx && selectedOption}} onPress={() => handleSfxPress(false)}
                            accessible={true}
                            accessibilityLabel="Sound off">
                            <Image
                                style={styles.soundOffIcon}
                            source={require('../assets/sound-off-icon.png')} />
                        </TouchableOpacity>
                    </View>
                    <Text style={{...text.style.subHeading, color: theme.textColour}}>Game type</Text>
                    <ColourButton
                        text="Quick play"
                        bgColour="green"
                        onPress={() => handleLevelPress('quickplay')} />
                    <ColourButton
                        text="5 colours"
                        bgColour="blue"
                        onPress={() => handleLevelPress('blue')} />
                    <TouchableOpacity style={{...button.style.button, ...styles.violetButton, backgroundColor: violetUnlocked ? colour.style.violet : colour.style.disabledViolet}} disabled={!gameContext.violetUnlocked} onPress={() => handleLevelPress('violet')}>
                        {!gameContext.violetUnlocked &&
                            <Image
                            style={styles.padlockIcon}
                            source={require('../assets/padlock-icon.png')} />
                        }
                        <Text style={{...button.style.buttonText, color: violetUnlocked ? colour.style.primary : colour.style.disabledText}}>6 colours</Text>
                    </TouchableOpacity>
                </View>
                {!gameContext.violetUnlocked && <Text style={{...text.style.text}}>Score 100 or more to unlock the violet tile.</Text>}
                {!gameContext.violetUnlocked && <Text style={{...text.style.text}}>You get 2 points for every violet pattern matched.</Text>}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    optionChoice: {
        flexDirection: 'row',
        gap: 60,
        marginBottom: 20,
    },
    option: {
        alignItems: 'center',
        borderRadius: 15,
        height: 56,
        justifyContent: 'center',
        width: 70,
    },
    dark: {
        backgroundColor: colour.style.skyBlack,
    },
    light: {
        backgroundColor: colour.style.skyBlue,
    },
    sound: {
        backgroundColor: '#b5cde5',
    },
    moonIcon: {
        height: 24,
        width: 20,
    },
    sunIcon: {
        height: 24,
        width: 24,
    },
    soundOnIcon: {
        height: 24,
        width: 14,
    },
    soundOffIcon: {
        height: 24,
        width: 24,
    },
    violetButton: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    padlockIcon: {
        height: 24,
        marginRight: 10,
        width: 22,
    }
});