import { StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import buttonStyles from '../defaults/buttonStyles';
import colours from '../defaults/colours';

export default function SolidButton({ text, bgColour, onPress }) {
    return (
        <TouchableOpacity style={{...styles.button, backgroundColor: colours[bgColour]}} onPress={onPress}>
            <Text style={{...styles.buttonText, color: colours.darkText}}>{text}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    ...buttonStyles,
});