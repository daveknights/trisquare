import { StyleSheet, View, Text } from "react-native";
import colours from "../../defaults/colours";

export default function PointsReward({ text, colour }) {
    return(
        <View style={{...styles.pointsReward, ...colours[colour]}}>
            <Text style={styles.pointsRewardText}>{text}+</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    pointsReward: {
        alignItems: 'center',
        backgroundColor: '#ffd700',
        borderColor: '#d4af37',
        borderRadius: 40,
        borderWidth: 8,
        height: 80,
        justifyContent: 'center',
        width: 80,
    },
    pointsRewardText: {
        color: colours.primary,
        fontSize: 18,
        fontWeight: 'bold',
    },
});