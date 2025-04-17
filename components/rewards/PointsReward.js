import { StyleSheet, View, Text } from "react-native";
import colours from "../../defaults/colours";

export default function PointsReward({ text, colour }) {
    const elite = ['bronze', 'silver', 'gold'];
    let bgColour = '#fff';
    let borColour = colours[colour];

    if (elite.includes(colour)) {
        bgColour = colours[colour].backgroundColor;
        borColour = colours[colour].borderColor;
    }

    return(
        <View style={{...styles.pointsReward, ...{borderColor: borColour, backgroundColor: bgColour}}}>
            <Text style={styles.pointsRewardText}>{text}+</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    pointsReward: {
        alignItems: 'center',
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