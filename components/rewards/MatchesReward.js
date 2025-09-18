import { StyleSheet, View, Text } from "react-native";
import { useContext } from "react";
import { GameContext } from '../../context/gameContext';
import colour from "../../defaults/colour";

export default function MatchesReward({ text, scoreColour, border = '' }) {
    const gameContext = useContext(GameContext);
    const theme = gameContext.theme;
    const borderColour = border ? border : theme.bgColour;

    return(
        <View style={styles.matchesReward}>
            <View style={{...styles.tile, backgroundColor: colour.style[scoreColour].borderColor}} />
            <View style={{...styles.tile,
                            ...styles.middleTile,
                            backgroundColor: colour.style[scoreColour].borderColor,
                            borderColor: borderColour}} />
            <View style={{...styles.tile,
                            ...styles.frontTile,
                            ...colour.style[scoreColour],
                            borderBottomColor: colour.style[scoreColour].borderColor,
                            borderLeftColor: colour.style[scoreColour].borderColor}}>
                <Text style={styles.matchesRewardText}>{text}+</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    matchesReward: {
        alignItems: 'flex-end',
        height: 80,
        width: 80,
    },
    tile: {
        height: 60,
        width: 60,
    },
    middleTile: {
        backgroundColor: colour.style.blue,
        borderWidth: 1,
        left: 10,
        position: 'absolute',
        top: 10,
    },
    frontTile: {
        alignItems: 'center',
        borderWidth: 1,
        justifyContent: 'center',
        left: 0,
        position: 'absolute',
        top: 20,
    },
    matchesRewardText: {
        color: colour.style.primary,
        fontSize: 18,
        fontWeight: 'bold',
    },
});