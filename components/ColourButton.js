import { Text, TouchableOpacity } from 'react-native';
import button from '../defaults/button';
import colour from '../defaults/colour';

export default function ColourButton({ text, bgColour, onPress }) {
    return (
        <TouchableOpacity style={{...button.style.button, backgroundColor: colour.style[bgColour]}} onPress={onPress}>
            <Text style={{...button.style.buttonText, color: colour.style.darkText}}>{text}</Text>
        </TouchableOpacity>
    );
};
