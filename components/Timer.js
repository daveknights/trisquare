import { useEffect, useRef, useContext } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { GameContext } from '../context/gameContext';
import colour from "../defaults/colour";
import { useAudioPlayer } from 'expo-audio';
const sound  = require('../assets/quickplay.mp3');

export default function Timer({ quickPlayTimerFinished }) {
    const gameContext = useContext(GameContext);
    const timer = useRef(new Animated.Value(0)).current;
    const player = useAudioPlayer(sound);

    const playMusic = () => {
        player.seekTo(0);
        player.play();
    }

    useEffect(() => {
        gameContext.sfx && playMusic();

        Animated.timing(timer, {
            toValue: 1,
            duration: 45000,
            useNativeDriver: true,
        }).start(() => Animated.timing(timer).stop());

        timer.addListener((progress) => {
            if (progress.value === 1) {
                quickPlayTimerFinished();
            }
        });

        return () => {
            timer.removeAllListeners();
        };
    }, []);

    return (
        <View style={styles.track}>
            <Animated.View style={{...styles.progress, transform: [{scaleX: timer}], backgroundColor: timer.interpolate({
                inputRange: [0, 0.8, 0.8, 1],
                outputRange: [colour.style.green, colour.style.green, colour.style.red, colour.style.red]
            })}}></Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    track: {
        backgroundColor: colour.style.grey,
        borderRadius: 8,
        height: 16,
        overflow: 'hidden',
        width: '100%',
    },
    progress: {
        backgroundColor: colour.style.green,
        height: 16,
        position: 'absolute',
        transformOrigin: 'left',
        width: '100%',
    }
});