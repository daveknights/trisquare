import { StyleSheet, View, Text } from "react-native";
import { useContext } from "react";
import GameContext from '../../context/gameContext';
import colours from "../../defaults/colours";

export default function MatchesReward({ text, colour }) {
    const gameContext = useContext(GameContext);
    const theme = gameContext.theme;

    return(
        <View style={styles.matchesReward}>
            <View style={{...styles.tile, backgroundColor: colours[colour].borderColor}}></View>
            <View style={{...styles.tile, ...styles.middleTile, backgroundColor: colours[colour].borderColor, borderColor: theme.bgColour}}></View>
            <View style={{...styles.tile, ...styles.frontTile, ...colours[colour], borderColor: theme.bgColour}}>
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
        backgroundColor: colours.blue,
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
        color: colours.primary,
        fontSize: 18,
        fontWeight: 'bold',
    },
});