import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import colours from '../defaults/colours';

export default function SolidButton({ text, textColour, action, onPress }) {
    const onPressAction = action => {
        switch (action) {
            case 'ClearData':
                return onPress.navigate('ClearData');
        }
    }

    return (
        <TouchableOpacity style={styles.button} onPress={() => onPressAction(action)}>
            <Text style={{...styles.buttonText, color: colours[textColour]}}>{text}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        marginBottom: 30,
        paddingBottom: 10,
        paddingTop: 10,
    },
    buttonText: {
        fontSize: 20,
        textAlign: 'center',
        textDecorationLine: 'underline',
    }
});