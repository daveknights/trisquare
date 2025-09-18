import { useEffect, useRef, useContext } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { GameContext } from '../context/gameContext';
import { useAudioPlayer } from 'expo-audio';
import colour from "../defaults/colour";

const sound  = require('../assets/beep.mp3');

export default function CountDown({ gridSize, number }) {
    const gameContext = useContext(GameContext);
    const countDownZoom = useRef(new Animated.Value(0)).current;
    const player = useAudioPlayer(sound);

    const playBeep = async () => {
        player.seekTo(0);
        player.play();
    }

    useEffect(() => {
        gameContext.sfx && playBeep();
    }, [number]);

    useEffect(() => {
        countDownZoom.setValue(0);
        Animated.timing(countDownZoom, {
            toValue: 1,
            duration: 125,
            useNativeDriver: true,
        }).start();
    }, [number]);

    return (
        <View style={{...styles.countDown, height: gridSize, width: gridSize}}>
            <View style={styles.countDownBG}>
                <Text style={styles.text}>45 seconds to score as many as you can!</Text>
                <Animated.Text style={{...styles.countDownText,
                    transform: [
                        {scale: countDownZoom}
                    ]
                }}>{number}</Animated.Text>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    countDown: {
        backgroundColor: 'rgba(0,4,6,0.7)',
        borderRadius: 15,
        padding: 30,
        position: 'absolute',
        zIndex: 1,
    },
    countDownBG: {
        alignItems: 'center',
        backgroundColor: colour.style.lightBlue,
        borderRadius: 12,
        height: '100%',
        overflow: 'hidden',
        width: '100%',
    },
    text: {
        backgroundColor: colour.style.green,
        borderBottomColor: colour.style.primary,
        borderBottomWidth: 1,
        color: colour.style.primary,
        fontSize: 20,
        fontWeight: 'bold',
        paddingBottom: 12,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 12,
        textAlign: 'center',
        width: '100%',
    },
    countDownText: {
        color: colour.style.primary,
        fontSize: 70,
        marginTop: 40,
    }
});