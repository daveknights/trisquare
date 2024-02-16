import { StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import colours from '../defaults/colours';

export default function SolidButton({ text, bgColour, action, onPress }) {
    const onPressAction = action => {
        switch (action) {
            case 'playGame':
                return onPress.navigate('Game')
            case 'viewInstructions':
                return onPress.navigate('Instructions');
            case 'clearData':
                return onPress();
            default:
                break;
        }
    }

    return (
        <TouchableOpacity style={{...styles.button,  backgroundColor: colours[bgColour]}} onPress={() => onPressAction(action)}>
            <Text style={{...styles.buttonText, color: colours.darkText}}>{text}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderColor: colours.primary,
        borderRadius: 15,
        borderWidth: 1,
        marginBottom: 30,
        paddingBottom: 10,
        paddingTop: 10,
        width: Dimensions.get('window').width - 160,
    },
    buttonText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    }
});