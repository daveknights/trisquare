import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, Dimensions } from 'react-native';
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

const { height } = Dimensions.get('window');

export default function Options({ navigation }) {
    const [isDarkMode, setIsDarkMode] = useState(null);
    const [contentHeight, setContentHeight] = useState(0);
    const [scrollEnabled, setScrollEnabled] = useState(false);
    const headerHeight = useHeaderHeight();
    const gameContext = useContext(GameContext);
    const theme = gameContext.theme;
    const violetUnlocked = gameContext.violetUnlocked;

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

    const handleLevelPress = playViolet => {
        gameContext.setPlayViolet(playViolet);
        navigation.navigate('Game');
    };

    textStyles.heading.color = theme.textColour;
    textStyles.subHeading.color = theme.textColour;
    textStyles.text.color = theme.textColour;

    return (
        <View style={{...containerStyles, backgroundColor: theme.bgColour}}>
            <ScrollView scrollEnabled={scrollEnabled} onContentSizeChange={onContentSizeChange}>
                <View style={{...layoutStyles.centerWrapper}}>
                    <Text style={{...textStyles.heading}}>Game options</Text>
                    <Text style={{...textStyles.subHeading, color: theme.textColour}}>Mode</Text>
                    <View style={styles.themeChoice}>
                        <TouchableOpacity disabled={isDarkMode} style={{...styles.theme, ...styles.dark}} onPress={() => handleModePress('dark')}
                            accessible={true}
                            accessibilityLabel="Dark mode">
                            <Image
                                style={styles.moonIcon}
                                source={require('../assets/moon-icon.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity disabled={!isDarkMode} style={{...styles.theme, ...styles.light}} onPress={() => handleModePress('light')}
                            accessible={true}
                            accessibilityLabel="Light mode">
                            <Image
                                style={styles.sunIcon}
                            source={require('../assets/sun-icon.png')} />
                        </TouchableOpacity>
                    </View>
                    <Text style={{...textStyles.subHeading, color: theme.textColour}}>Level</Text>
                    <ColourButton
                        text="5 colours"
                        bgColour="blue"
                        onPress={() => handleLevelPress(false)} />
                    <TouchableOpacity style={{...buttonStyles.button, ...styles.violetButton, backgroundColor: violetUnlocked ? colours.violet : colours.disabledViolet}} disabled={!gameContext.violetUnlocked} onPress={() => handleLevelPress(true)}>
                        {!gameContext.violetUnlocked &&
                            <Image
                            style={styles.padlockIcon}
                            source={require('../assets/padlock-icon.png')} />
                        }
                        <Text style={{...buttonStyles.buttonText, color: violetUnlocked ? colours.primary : colours.disabledText}}>6 colours</Text>
                    </TouchableOpacity>
                </View>
                {!gameContext.violetUnlocked && <Text style={{...textStyles.text}}>Score 100 or more to unlock the violet tile.</Text>}
                <Text style={{...textStyles.text}}>The game becomes slightly harder with 6 colours, as the chance of the colour of the tile that's added being one that will help you is reduced.</Text>
                <Text style={{...textStyles.text}}>However, you get 2 points for every violet pattern matched.</Text>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    themeChoice: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    theme: {
        alignItems: 'center',
        backgroundColor: colours.grey,
        paddingBottom: 16,
        paddingTop: 16,
        width: (Dimensions.get('window').width - 140) / 2,
    },
    themeText: {
        color: 'yellow',
    },
    dark: {
        backgroundColor: colours.skyBlack,
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
    },
    light: {
        backgroundColor: colours.skyBlue,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,

    },
    moonIcon: {
        height: 24,
        width: 20,
    },
    sunIcon: {
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