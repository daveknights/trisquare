import { BackHandler, StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, Dimensions } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useHeaderHeight } from '@react-navigation/elements';
import GameContext from '../context/gameContext';
import ColourButton from './ColourButton';
import containerStyles from '../defaults/containerStyles';
import textStyles from '../defaults/textStyles';
import buttonStyles from '../defaults/buttonStyles';
import colours from '../defaults/colours';
import layoutStyles from '../defaults/layoutStyles';
import { darkTheme, lightTheme } from '../defaults/themes';
import { Audio } from 'expo-av';

const { height } = Dimensions.get('window');

export default function Options({ navigation }) {
    const [isDarkMode, setIsDarkMode] = useState(null);
    const [contentHeight, setContentHeight] = useState(0);
    const [scrollEnabled, setScrollEnabled] = useState(false);
    const [sound, setSound] = useState();
    const headerHeight = useHeaderHeight();
    const gameContext = useContext(GameContext);
    const theme = gameContext.theme;
    const violetUnlocked = gameContext.violetUnlocked;
    const selectedOption = {
        borderColor: '#00b353',
        borderWidth: 5
    };

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);

        return () => backHandler.remove();
    });

    const playSound = async () => {
        const { sound } = await Audio.Sound.createAsync(require('../assets/reward.mp3'));
        setSound(sound);

        await sound.playAsync();
    }

    useEffect(() => {
        return sound? () => sound.unloadAsync() : undefined;
    }, [sound]);

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
            gameContext.setTheme(value === 'dark' ? darkTheme : lightTheme);
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

    textStyles.heading.color = theme.textColour;
    textStyles.subHeading.color = theme.textColour;
    textStyles.text.color = theme.textColour;

    return (
        <View style={{...containerStyles, backgroundColor: theme.bgColour}}>
            <ScrollView scrollEnabled={scrollEnabled} onContentSizeChange={onContentSizeChange} style={{width: '100%'}}>
                <View style={{...layoutStyles.centerWrapper}}>
                    <Text style={{...textStyles.heading}}>Game options</Text>
                    <Text style={{...textStyles.subHeading, color: theme.textColour}}>Mode</Text>
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
                    <Text style={{...textStyles.subHeading, color: theme.textColour}}>Sound</Text>
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
                    <Text style={{...textStyles.subHeading, color: theme.textColour}}>Game type</Text>
                    <ColourButton
                        text="Quick play"
                        bgColour="green"
                        onPress={() => handleLevelPress('quickplay')} />
                    <ColourButton
                        text="5 colours"
                        bgColour="blue"
                        onPress={() => handleLevelPress('blue')} />
                    <TouchableOpacity style={{...buttonStyles.button, ...styles.violetButton, backgroundColor: violetUnlocked ? colours.violet : colours.disabledViolet}} disabled={!gameContext.violetUnlocked} onPress={() => handleLevelPress('violet')}>
                        {!gameContext.violetUnlocked &&
                            <Image
                            style={styles.padlockIcon}
                            source={require('../assets/padlock-icon.png')} />
                        }
                        <Text style={{...buttonStyles.buttonText, color: violetUnlocked ? colours.primary : colours.disabledText}}>6 colours</Text>
                    </TouchableOpacity>
                </View>
                {!gameContext.violetUnlocked && <Text style={{...textStyles.text}}>Score 100 or more to unlock the violet tile.</Text>}
                {!gameContext.violetUnlocked && <Text style={{...textStyles.text}}>You get 2 points for every violet pattern matched.</Text>}
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
        backgroundColor: colours.skyBlack,
    },
    light: {
        backgroundColor: colours.skyBlue,
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