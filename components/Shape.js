import { StyleSheet, View } from 'react-native';
import colour from '../defaults/colour';

export default function Shape({ cols, rotation }) {
    return (
        <View style={{...styles.shape, width: (24 * cols) + (cols - 1) , transform: [{rotate: `${rotation}deg`}]}}>
            <View style={styles.tile}></View>
            <View style={styles.tile}></View>
            <View style={styles.tile}></View>
        </View>
    );
};

const styles = StyleSheet.create({
    shape: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 1,
    },
    tile: {
        backgroundColor: colour.style.green,
        borderColor: colour.style.primary,
        borderWidth: 1,
        height: 24,
        width: 24,
    }
});