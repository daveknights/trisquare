import { LinearGradient } from 'expo-linear-gradient';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const colourLookup = {
    '1': 'red',
    '2': 'orange',
    '3': 'yellow',
    '4': 'green',
    '5': 'blue',
    '6': 'violet'
};

export default function Combo({ comboNumber, theme }) {
    const [isDisplayed, setIsDisplayed] = useState('none');
    const grow = useRef(new Animated.Value(0)).current;

    useLayoutEffect(() => {
        grow.setValue(0);
        Animated.timing(grow, {
            toValue: 1,
            duration: 125,
            useNativeDriver: true,
        }).start();
    }, [isDisplayed]);

    useEffect(() => {
        setIsDisplayed('flex');

        const comboTimer = setInterval(() => {
            setIsDisplayed('none');
        }, 500);

        return () => clearInterval(comboTimer);
    }, [comboNumber]);

    return (
        <View style={{...styles.combo, display: isDisplayed}}>
            <Animated.View style={{opacity: grow,
                transformOrigin: 'center',
                transform: [{
                    scale: grow
            }]}}>
                <LinearGradient colors={theme.tileGrads[colourLookup[comboNumber]]}>
                    <Text style={styles.comboText}>
                        Combo <Text style={styles.comboScore}>{comboNumber}</Text>
                    </Text>
                </LinearGradient>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    combo: {
        borderRadius: 8,
        flexDirection: 'row',
        overflow: 'hidden',
        position: 'absolute',
        right: 0,
        top: 12,
        zIndex: 1,
    },
    comboText: {
        borderRadius: 8,
        paddingHorizontal: 40,
        paddingVertical: 16,
        fontSize: 24,
    },
    comboScore: {
        fontWeight: 'bold',
    }
});