import { StyleSheet, View, Text } from "react-native";
import colour from "../../defaults/colour";

export default function PointsReward({ text, scoreColour }) {
    const elite = ['bronze', 'silver', 'gold'];
    const tStyle = text === 'T' ? {color: colour.style[scoreColour].borderColor, fontSize: 36} : {};
    let bgColour = '#fff';
    let borColour = colour.style[scoreColour];

    if (elite.includes(scoreColour)) {
        bgColour = colour.style[scoreColour].backgroundColor;
        borColour = colour.style[scoreColour].borderColor;
    }

    return(
        <View style={{...styles.pointsReward, ...{borderColor: borColour, backgroundColor: bgColour}}}>
            <Text style={{...styles.pointsRewardText, ...tStyle}}>{text}{text !== 'T' && '+'}</Text>
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
        color: colour.style.primary,
        fontSize: 18,
        fontWeight: 'bold',
    },
});