import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { useContext } from 'react';
import containerStyles from '../defaults/containerStyles';
import textStyles from '../defaults/textStyles';
import Shape from './Shape';
import GameContext from '../context/gameContext';

export default function Instructions() {
    const gameContext = useContext(GameContext);
    const styles = createStyles(gameContext.theme);

    textStyles.heading.color = gameContext.theme.textColour;
    textStyles.text.color = gameContext.theme.textColour;

    return (
        <View style={styles.container}>
            <Text style={{...textStyles.heading}}>How to play</Text>
            <Text style={{...textStyles.text}}>Select a free space on the grid, then choose a colour from the pallete.</Text>
            <Text style={{...textStyles.text}}>Score a point by matching colours in one of the following shapes:</Text>
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
                <Text style={{...textStyles.text, marginBottom: 0, width: Dimensions.get('window').width - 50}}>There is always 1 square which is unavailable, indicated by this tile:</Text>
                <View style={styles.blockedTile}>
                    <Text style={styles.xSymbol}>X</Text>
                </View>
            </View>
            <Text style={{...textStyles.text}}>A new tile is added to the grid and the blocked square changes place after every turn.</Text>
            <Text style={{...textStyles.text}}>Get bonus points for consecutive pattern matches and clearing the grid.</Text>
            <Text style={{...textStyles.text}}>The game ends when you can no longer make a shape of 3 matching tiles.</Text>
        </View>
    );
};

const createStyles = theme => StyleSheet.create({
    container: {
        backgroundColor: theme.bgColour,
        ...containerStyles,
    },
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
        backgroundColor: theme.gridColour,
        height: 30,
        justifyContent: 'center',
        marginLeft: 'auto',
        marginRight: 20,
        marginTop: 'auto',
        width: 30,
    },
    xSymbol: {
        color: theme.bgColour,
        fontSize: 16,
        fontWeight: 'bold',
    }
});
