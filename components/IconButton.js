import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import colours from '../defaults/colours';

export default function IconButton({ path, bgColour, onPress }) {
    return (
        <TouchableOpacity style={{...styles.button, backgroundColor: colours[bgColour]}} onPress={onPress}>
            <Image
                style={styles.buttonIcon}
                source={path} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderColor: colours.primary,
        borderRadius: 15,
        borderWidth: 1,
        paddingBottom: 15,
        paddingLeft: 50,
        paddingRight: 50,
        paddingTop: 15,
    },
    buttonIcon: {
        height: 24,
        width: 24,
    },
});