import { StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import buttonStyles from '../defaults/buttonStyles';
import colours from '../defaults/colours';

export default function SolidButton({ text, bgColour, action, onPress }) {
    const onPressAction = action => {
        switch (action) {
            case 'playGame':
                return onPress.navigate('Game')
            case 'viewOptions':
                return onPress.navigate('Options');
            case 'viewInstructions':
                return onPress.navigate('Instructions');
            case 'clearData':
                return onPress();
            default:
                break;
        }
    }

    return (
        <TouchableOpacity style={{...styles.button, backgroundColor: colours[bgColour]}} onPress={() => onPressAction(action)}>
            <Text style={{...styles.buttonText, color: colours.darkText}}>{text}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    ...buttonStyles,
});