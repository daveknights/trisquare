import { StyleSheet, Text, TouchableOpacity, View, Image, Dimensions } from 'react-native';
import { useContext, useState } from 'react';
import GameContext from '../context/gameContext';
import ColourButton from './ColourButton';
import containerStyles from '../defaults/containerStyles';
import textStyles from '../defaults/textStyles';
import buttonStyles from '../defaults/buttonStyles';
import colours from '../defaults/colours';


export default function Options({ navigation }) {
    const [isVioloetDisabled, setIsVioloetDisabled] = useState(true);
    const gameContext = useContext(GameContext);
    const styles = createStyles(gameContext.theme);

    const playViolet = () => {};

    textStyles.heading.color = gameContext.theme.textColour;
    textStyles.text.color = gameContext.theme.textColour;

    return (
        <View style={styles.container}>
            <Text style={{...textStyles.heading}}>Game options</Text>
            <Text style={styles.subHeading}>Mode</Text>
            <View style={styles.themeChoice}>
                <TouchableOpacity disabled={true} style={{...styles.theme, ...styles.dark}}>
                    <Image
                        style={styles.moonIcon}
                        source={require('../assets/moon-icon.png')} />
                </TouchableOpacity>
                <TouchableOpacity style={{...styles.theme, ...styles.light}}>
                    <Image
                        style={styles.sunIcon}
                    source={require('../assets/sun-icon.png')} />
                </TouchableOpacity>
            </View>
            <Text style={styles.subHeading}>Level</Text>
            <ColourButton
                text="5 colours"
                bgColour="blue"
                action="playGame"
                onPress={navigation} />
            <Text style={{...textStyles.text}}>Score 100 or more to unlock the violet tile.</Text>
            <Text style={{...textStyles.text}}>The game becomes slightly harder with 6 colours
                as the chance of the colour of the added tile being one that will help you is reduced.</Text>
            <TouchableOpacity style={{...buttonStyles.button, ...styles.disabledButton}} disabled={isVioloetDisabled} onPress={playViolet}>
                {isVioloetDisabled &&
                    <Image
                    style={styles.padlockIcon}
                    source={require('../assets/padlock-icon.png')} />
                }
                <Text style={{...buttonStyles.buttonText, color: colours.disabledText}}>6 colours</Text>
            </TouchableOpacity>
        </View>
    );
};

const createStyles = theme => StyleSheet.create({
    container: {
        backgroundColor: theme.bgColour,
        ...containerStyles,
    },
    subHeading: {
        color: theme.textColour,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 20,
    },
    themeChoice: {
        flexDirection: 'row',
        marginBottom: 50,
    },
    theme: {
        alignItems: 'center',
        backgroundColor: colours.grey,
        paddingBottom: 12,
        paddingTop: 12,
        width: (Dimensions.get('window').width - 160) / 2,
    },
    themeText: {
        color: 'yellow',
    },
    dark: {
        backgroundColor: '#1f3c66',
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
    },
    light: {
        backgroundColor: '#006eff',
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
    disabledButton: {
        alignItems: 'center',
        backgroundColor: colours.disabledViolet,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    padlockIcon: {
        height: 24,
        marginRight: 10,
        width: 22,
    }
});