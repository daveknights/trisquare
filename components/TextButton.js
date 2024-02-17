import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function TextButton({ text, textColour, onPress }) {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={{...styles.buttonText, color: textColour}}>{text}</Text>
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