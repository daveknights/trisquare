import { useState, useEffect, useRef, useContext } from "react";
import { Animated, StyleSheet, View } from "react-native";
import GameContext from '../context/gameContext';
import colours from "../defaults/colours";
import { Audio } from 'expo-av';

export default function Timer({ quickPlayTimerFinished }) {
    const [sound, setSound] = useState();
    const gameContext = useContext(GameContext);
    const timer = useRef(new Animated.Value(0)).current;

    const playMusic = async () => {
        const { sound } = await Audio.Sound.createAsync(require('../assets/quickplay.mp3'));
        setSound(sound);

        await sound.playAsync();
    }

    useEffect(() => {
        return sound? () => sound.unloadAsync() : undefined;
    }, [sound]);

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
                inputRange: [0, 0.8, 0.9, 1],
                outputRange: [colours.green, colours.green, colours.red, colours.red]
            })}}></Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    track: {
        backgroundColor: colours.grey,
        borderRadius: 8,
        height: 16,
        overflow: 'hidden',
        width: '100%',
    },
    progress: {
        backgroundColor: colours.green,
        height: 16,
        position: 'absolute',
        transformOrigin: 'left',
        width: '100%',
    }
});