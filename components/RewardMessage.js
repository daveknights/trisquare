import { StyleSheet, Text, Pressable, Modal, View } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from "react";
import PointsReward from './rewards/PointsReward';
import GridsReward from './rewards/GridsReward';
import MatchesReward from './rewards/MatchesReward';
import colours from "../defaults/colours";
import { darkTheme } from "../defaults/themes";

export default function RewardMessage({ rewards }) {
    const [rewardMsgVisible, setRewardMsgVisible] = useState(true);

    return (
            <Modal animationType="fade"
                transparent={true}
                statusBarTranslucent={true}
                navigationBarTranslucent={true}
                visible={rewardMsgVisible}
                onRequestClose={() => setRewardMsgVisible(!rewardMsgVisible)}
            >
            <View style={styles.modal}>
                <Pressable style={styles.rewardMessage} onPress={() => setRewardMsgVisible(!rewardMsgVisible)}>
                    <Text style={styles.heading}>Achievements</Text>
                    {Object.entries(rewards).map(([key, data]) => {
                            if (key === 'score') {
                                return <View key={key} style={styles.reward}>
                                            <View style={styles.badge}>
                                                <PointsReward text={data.text} colour={data.colour} />
                                            </View>
                                            <Text style={styles.rewardType}>Points</Text>
                                    </View>;
                            }
                            if (key === 'grids') {
                                return <View key={key} style={styles.reward}>
                                            <View style={styles.badge}>
                                                <GridsReward text={data.text} colour={data.colour} />
                                            </View>
                                            <Text style={styles.rewardType}>Grids cleared</Text>
                                    </View>;
                            }
                            if (key === 'matches') {
                                return <View key={key} style={styles.reward}>
                                            <View style={styles.badge}>
                                                <MatchesReward text={data.text} colour={data.colour} border={colours.primary} />
                                            </View>
                                            <Text style={styles.rewardType}>Consecutive matches</Text>
                                    </View>;
                            }
                            if (key === 'violet') {
                                return <View key={key} style={styles.reward}>
                                            <View style={styles.badge}>
                                                <LinearGradient colors={darkTheme.tileGrads.violet} style={styles.violetTile}>
                                                </LinearGradient>
                                            </View>
                                            <Text style={styles.rewardType}>Violet unlocked</Text>
                                    </View>;
                            }
                        })
                    }
                </Pressable>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modal: {
        backgroundColor: 'rgba(0,4,6,0.5)',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        paddingTop: 30,
    },
    heading: {
        backgroundColor: colours.green,
        color: colours.primary,
        fontSize: 20,
        fontWeight: 'bold',
        paddingBottom: 12,
        paddingTop: 12,
        textAlign: 'center',
        width: 280,
    },
    reward: {
        alignItems: 'center',
        backgroundColor: colours.lightBlue,
        borderTopColor: colours.primary,
        borderTopWidth: 1,
        flexDirection: 'row',
        width: 280,
    },
    badge: {
        alignItems: 'center',
        backgroundColor: colours.primary,
        justifyContent: 'center',
        height: 120,
        marginRight: 15,
        width: 120,
    },
    rewardType: {
        color: colours.primary,
        fontSize: 18,
        fontWeight: 'bold',
        paddingRight: 15,
        width: 150,
    },
    rewardMessage: {
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        marginBottom: 100,
        overflow: 'hidden',
    },
    violetTile: {
        borderRadius: 4,
        height: 80,
        width: 80,
    }
});