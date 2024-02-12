import { StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import colours from '../defaults/colours';

export default function SolidButton({ text, bgColour, textColour, action, onPress }) {
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
            <Text style={{...styles.buttonText, color: colours[textColour]}}>{text}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 15,
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