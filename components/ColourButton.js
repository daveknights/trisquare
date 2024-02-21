import { Text, TouchableOpacity } from 'react-native';
import buttonStyles from '../defaults/buttonStyles';
import colours from '../defaults/colours';

export default function ColourButton({ text, bgColour, onPress }) {
    return (
        <TouchableOpacity style={{...buttonStyles.button, backgroundColor: colours[bgColour]}} onPress={onPress}>
            <Text style={{...buttonStyles.buttonText, color: colours.darkText}}>{text}</Text>
        </TouchableOpacity>
    );
};
