import { StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import colours from '../defaults/colours';

export default function IconButton({ path, bgColour, onPress, label }) {
    return (
        <TouchableOpacity style={{...styles.button, backgroundColor: colours[bgColour]}} onPress={onPress}
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
        paddingLeft: 50,
        paddingRight: 50,
        paddingTop: 15,
        width: (Dimensions.get('window').width - 160) / 2,
    },
    buttonIcon: {
        height: 24,
        width: 24,
    },
});