import { StyleSheet, Text, View, Dimensions, ScrollView } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { useState, useContext, useEffect } from 'react';
import container from '../defaults/container';
import text from '../defaults/text';
import Shape from './Shape';
import { GameContext } from '../context/gameContext';

const { height } = Dimensions.get('window');

export default function Instructions() {
    const [contentHeight, setContentHeight] = useState(0);
    const [scrollEnabled, setScrollEnabled] = useState(false);
    const headerHeight = useHeaderHeight();
    const gameContext = useContext(GameContext);
    const theme = gameContext.theme;

    const onContentSizeChange = (contentWidth, contentHeight) => {
        setContentHeight(contentHeight);
    };

    useEffect(() => {
        (!scrollEnabled && contentHeight > (height - headerHeight)) && setScrollEnabled(true);
    }, [contentHeight]);

    text.style.heading.color = theme.textColour;
    text.style.text.color = theme.textColour;

    return (
        <View style={{...container.style, backgroundColor: theme.bgColour, paddingBottom: 48, paddingTop: 24}}>
            <ScrollView scrollEnabled={scrollEnabled} onContentSizeChange={onContentSizeChange} style={{width: '100%'}}>
                <Text style={{...text.style.heading}}>How to play</Text>
                <Text style={{...text.style.text}}>Select a free space on the grid, then choose a colour from the pallete.</Text>
                <Text style={{...text.style.text}}>Score a point by matching colours in one of the following shapes:</Text>
                <View style={styles.shapeRow}>
                    <Shape cols={1} rotation="0" />
                    <Shape cols={3} rotation="0" />
                    <Shape cols={2} rotation="180" />
                </View>
                <View style={styles.shapeRow}>
                    <Shape cols={2} rotation="0" />
                    <Shape cols={2} rotation="90" />
                    <Shape cols={2} rotation="270" />
                </View>
                <View style={styles.blockedInfo}>
                    <Text style={{...text.style.text, marginBottom: 0, width: Dimensions.get('window').width - 90}}>There is always 1 square which is unavailable, indicated by this tile:</Text>
                    <View style={{...styles.blockedTile, backgroundColor: theme.gridColour}}>
                        <Text style={{...styles.xSymbol, color: theme.bgColour}}>X</Text>
                    </View>
                </View>
                <Text style={{...text.style.text}}>A new tile is added to the grid and the blocked square changes place after every turn.</Text>
                <Text style={{...text.style.text}}>Get bonus points for consecutive pattern matches and clearing the grid.</Text>
                <Text style={{...text.style.text}}>The game ends when you can no longer make a shape of 3 matching tiles.</Text>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    shapeRow: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
        paddingLeft: 20,
        paddingRight: 20,
        width: '100%',
    },
    blockedInfo: {
        flexDirection: 'row',
        marginBottom: 20,
        width: '100%',
    },
    blockedTile: {
        alignItems: 'center',
        height: 30,
        justifyContent: 'center',
        marginLeft: 'auto',
        marginRight: 20,
        marginTop: 'auto',
        width: 30,
    },
    xSymbol: {
        fontSize: 16,
        fontWeight: 'bold',
    }
});
