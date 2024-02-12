import { StyleSheet, View } from 'react-native';
import colours from '../defaults/colours';

export default function Shape({ cols, rotation }) {
    return (
        <View style={{...styles.shape, width: (20 * cols) + ((cols * 2) -2) , transform: [{rotate: `${rotation}deg`}]}}>
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
        gap: 2,
    },
    tile: {
        backgroundColor: colours.green,
        height: 20,
        width: 20,
    }
});