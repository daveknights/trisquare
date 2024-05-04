import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import colours from '../defaults/colours';

export default function IconButton({ path, bgColour, onPress, label, width }) {
    return (
        <TouchableOpacity style={{...styles.button, backgroundColor: colours[bgColour], width: width}} onPress={onPress}
            accessible={true}
            accessibilityLabel={label}>
            <Image
                style={styles.buttonIcon}
                source={path} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        borderColor: colours.primary,
        borderRadius: 15,
        borderWidth: 1,
        paddingBottom: 15,
        paddingTop: 15,
    },
    buttonIcon: {
        height: 24,
        width: 24,
    },
});