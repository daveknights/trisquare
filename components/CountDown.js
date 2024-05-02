import { useState, useEffect, useRef, useContext } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import GameContext from '../context/gameContext';
import colours from "../defaults/colours";
import { Audio } from 'expo-av';

export default function CountDown({ gridSize, number }) {
    const [sound, setSound] = useState();
    const gameContext = useContext(GameContext);
    const countDownZoom = useRef(new Animated.Value(0)).current;

    const playBeep = async () => {
        const { sound } = await Audio.Sound.createAsync(require('../assets/beep.mp3'));
        setSound(sound);

        await sound.playAsync();
    }

    useEffect(() => {
        gameContext.sfx && playBeep();
    }, [number]);

    useEffect(() => {
        return sound? () => sound.unloadAsync() : undefined;
    }, [sound]);

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
        backgroundColor: colours.lightBlue,
        borderRadius: 12,
        height: '100%',
        overflow: 'hidden',
        width: '100%',
    },
    text: {
        backgroundColor: colours.green,
        borderBottomColor: colours.primary,
        borderBottomWidth: 1,
        color: colours.primary,
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
        color: colours.primary,
        fontSize: 70,
        marginTop: 40,
    }
});