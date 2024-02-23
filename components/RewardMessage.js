import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import colours from "../defaults/colours";
import { darkTheme } from "../defaults/themes";

export default function RewardMessage({ navigation }) {
    const handleRewardsPress = () => navigation.navigate('Rewards');

    return (
        <TouchableOpacity style={styles.rewardMessage} onPress={handleRewardsPress}>
            <View style={styles.rewardMessageInner}>
                <Text style={styles.message}>
                    You've earned a new reward
                </Text>
                <View style={styles.medalContainer}>
                    <View style={styles.ribbonLeft}></View>
                    <View style={styles.ribbonRight}></View>
                    <LinearGradient colors={darkTheme.tileGrads.yellow} style={styles.medal} />
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    rewardMessage: {
        aspectRatio: 1/1,
        backgroundColor: colours.gold.borderColor,
        borderRadius: 12,
        elevation: 5,
        padding: 15,
        position: 'absolute',
        shadowColor: "#000000",
        shadowOffset: {
        width: 0,
        height: 3,
        },
        shadowOpacity:  0.18,
        shadowRadius: 4.59,
        width: (Dimensions.get('window').width - 130),
    },
    rewardMessageInner: {
        alignItems: 'center',
        aspectRatio: 1/1,
        backgroundColor: '#fff9dd',
        borderRadius: 10,
        justifyContent: 'space-between',
        padding: 30,
        width: (Dimensions.get('window').width - 160),
    },
    message: {
        color: colours.primary,
        fontSize: 21,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    medalContainer: {
        marginBottom: 30,
    },
    medal: {
        borderColor: colours.primary,
        borderRadius: 25,
        borderWidth: 1,
        height: 50,
        width: 50,
    },
    ribbonLeft: {
        height: 40,
        borderLeftWidth: 16,
        borderLeftColor: colours.primary,
        borderBottomWidth: 8,
        borderBottomColor: "transparent",
        borderStyle: "solid",
        left: 10,
        position: 'absolute',
        top: 40,
        width: 0,
    },
    ribbonRight: {
        height: 40,
        borderRightWidth: 15,
        borderRightColor: colours.grey,
        borderBottomWidth: 8,
        borderBottomColor: "transparent",
        borderStyle: "solid",
        right: 10,
        position: 'absolute',
        top: 40,
        width: 0,
    }
});