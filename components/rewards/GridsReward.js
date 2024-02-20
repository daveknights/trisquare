import { StyleSheet, View, Text } from "react-native";
import colours from "../../defaults/colours";

export default function GridsReward({ text, colour }) {
    return(
        <View style={{...styles.gridsReward}}>
            {[...Array(9).keys()].map(tile => {
                return (
                    <View key={tile}>
                        <View style={{...styles.gridTile, backgroundColor: colours[colour].borderColor}}></View>
                        {tile === 8 && <View style={{...styles.textBg, ...colours[colour]}}>
                                        <Text style={styles.gridsRewardText}>{text}+</Text>
                                    </View>}
                    </View>
                )
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    gridsReward: {
        borderRadius: 15,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 1,
        height: 80,
        overflow: 'hidden',
        width: 80,
    },
    gridTile: {
        alignItems: 'center',
        height: 26,
        justifyContent: 'center',
        width: 26,
    },
    textBg: {
        alignItems: 'center',
        borderRadius: 10,
        height: 64,
        justifyContent: 'center',
        left: -46,
        position: 'absolute',
        top: -46,
        width: 64,
    },
    gridsRewardText: {
        color: colours.primary,
        fontSize: 18,
        fontWeight: 'bold',
    },
});