import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, Pressable, TouchableOpacity, Image, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScoreContext from '../context/scoreContext';
import containerStyles from '../defaults/containerStyles';
import colours from '../defaults/colours';

const initialTiles = {'t1':'', 't2':'', 't3':'', 't4':'', 't5':'', 't6':'', 't7':'', 't8':'', 't9':''};
const tileColours = ['red', 'orange', 'yellow', 'green', 'blue'];

const combos = {
    t1: [[2,3], [2,4], [2,5], [4,5], [4,7]],
    t2: [[1,3], [1,4], [1,5], [3,5], [3,6], [4,5], [5,6], [5,8]],
    t3: [[1,2], [2,5], [2,6], [5,6], [6,9]],
    t4: [[1,2], [1,5], [1,7], [2,5], [5,6], [5,7], [5,8], [7,8]],
    t5: [[1,2], [1,4], [2,3], [2,4], [2,6], [2,8], [3,6], [4,6], [4,7], [4,8], [6,8], [6,9], [7,8], [8,9]],
    t6: [[2,3], [2,5], [3,5], [3,9], [4,5], [5,8], [5,9], [8,9]],
    t7: [[1,4], [4,5], [4,8], [5,8], [8,9],],
    t8: [[2,5], [4,5], [4,7], [5,6], [5,7], [5,9], [6,9], [7,9]],
    t9: [[3,6], [5,6], [5,8], [6,8], [7,8]],
}
const shuffle = arrayToShuffle => {
    return arrayToShuffle.map(value => ({value, sort: Math.random()}))
            .sort((a, b) => a.sort - b.sort)
            .map(({value}) => value)
            .slice(0, arrayToShuffle.length);
};

export default function Game({ navigation }) {
    const [playing, setPlaying] = useState(false);
    const [tiles, setTiles] = useState(initialTiles);
    const [emptyTiles, setEmptyTiles] = useState([...Object.keys(initialTiles)]);
    const [selectedTile, setSelectedTile] = useState(null);
    const [selectedColour, setSelectedColour] = useState('');
    const [blockedTile, setBlockedTile] = useState('');
    const [canAddTile, setCanAddTile] = useState(null);
    const [lastTile, setLastTile] = useState(false);
    const [score, setScore] = useState(null);
    const [gameOver, setGameOver] = useState(null);
    const scoreContext = useContext(ScoreContext);

    const saveHighScore = async (value) => {
        try {
            await AsyncStorage.setItem('tri-square-high-score', value.toString());
        } catch (e) {
            // saving error
        }

        scoreContext.setHighScore(score);
    };

    const getEmptyTile = () => emptyTiles[Math.floor(Math.random() * emptyTiles.length)];

    const getColour = () => tileColours[Math.floor(Math.random() * 5)];
    // Initial grid state
    const startGame = () => {
        const startingTiles = shuffle([...Object.keys(initialTiles)]);
        const [tileOneKey, tileTwoKey, blockedTileKey] = startingTiles.slice(0, -6);
        const tileOneColour = getColour();
        let tileTwoColour = getColour();

        while (tileTwoColour === tileOneColour) {
            tileTwoColour = getColour();
        }

        setEmptyTiles(startingTiles.filter(key => key !== tileOneKey && key !== tileTwoKey && key !== blockedTileKey));
        setBlockedTile(blockedTileKey);
        setTiles({...initialTiles, ...{
            [tileOneKey]: tileOneColour,
            [tileTwoKey]: tileTwoColour,
            [blockedTileKey]: 'blocked'
        }});
        setCanAddTile(false);
        setScore(0);
        setGameOver(false);
        setPlaying(true);
    };

    useEffect(() => {
        startGame()
    }, []);
    // Add new tile
    useEffect(() => {
        let timer;

        if (playing && canAddTile) {
            timer = setTimeout(() => {
                const newColour = getColour();
                let newBlockedTile;
                let newTile;

                if (lastTile) {
                    newBlockedTile = emptyTiles[0];
                    newTile = blockedTile;
                    setPlaying(false);
                    setGameOver(true);
                    score > scoreContext.highScore && saveHighScore(score);
                } else {
                    newBlockedTile = getEmptyTile();

                    while (!newTile || newTile === newBlockedTile) {
                        newTile = getEmptyTile();
                    }
                }

                const newEmptyArray = emptyTiles.filter(key => key !== newBlockedTile && key !== newTile);

                setSelectedColour(newColour);
                setSelectedTile(newTile);
                setEmptyTiles([...newEmptyArray, blockedTile]);
                setTiles(prevTiles => ({
                    ...prevTiles,
                    [blockedTile]: '',
                    [newBlockedTile]: 'blocked',
                    [newTile]: newColour
                }));
                setBlockedTile(newBlockedTile);
                setCanAddTile(false);

                clearTimeout(timer);
            }, 250);
        }

        return () => clearTimeout(timer);
    }, [canAddTile, lastTile]);
    // Handle play & score based on empty spaces
    useEffect(() => {
        switch (emptyTiles.length) {
            case 0:
                setPlaying(false);
                setGameOver(true);
                // check/set high score
                score > scoreContext.highScore && saveHighScore(score);
                break;
            case 1:
                setLastTile(true);
                break;
            case 8:
                setScore(score => score + 5);
            default:
                lastTile && setLastTile(false);
                break;
        }
    }, [emptyTiles]);

    const colourMatch = num => tiles[`t${num}`] === selectedColour;
    // Check for 3 adjacents squares
    useEffect(() => {
        let timer;

        if (selectedColour && selectedTile) {
            let comboMatch = false;

            for (const combo of combos[selectedTile]) {
                comboMatch = combo.every(colourMatch);

                if (comboMatch) {
                    // update score
                    timer = setTimeout(() => {
                        setEmptyTiles([...emptyTiles, selectedTile, `t${combo[0]}`, `t${combo[1]}`]);
                        setTiles(prevTiles => ({
                            ...prevTiles,
                            [selectedTile]: '',
                            [`t${combo[0]}`]: '',
                            [`t${combo[1]}`]: ''
                        }));
                        setPlaying(true);
                        setScore(score => score + 1);
                        setCanAddTile(true);
                        setSelectedColour('');
                        setSelectedTile(null);

                        clearTimeout(timer);
                    }, 250);

                    break;
                }
            }

            if (!comboMatch) {
                setCanAddTile(true);
                setSelectedColour('');
                setSelectedTile(null);
            }
        }

        return () => clearTimeout(timer);
    }, [tiles]);

    const handleTilePress = key => setSelectedTile(key);

    const handlePalettePress = colour => {
        setSelectedColour(colour);
        setTiles(prevTiles => ({...prevTiles, ...{[selectedTile]: colour}}));
        setEmptyTiles(emptyTiles.filter(key => key !== selectedTile));
    };

    return (
        <View style={{...styles.container, paddingTop: 80}}>
            <View style={styles.bestScoreArea}>
                <Text style={styles.best}>Best: </Text>
                <Text style={styles.bestScore}>{scoreContext.highScore}</Text>
            </View>
            <View style={styles.scoreArea}>
                <Text style={styles.score}>Score: </Text>
                <Text style={styles.scoreTotal}>{score}</Text>
            </View>
            <View style={styles.grid}>
                {Object.entries(tiles).map(([k, col]) => {
                    let tileColour =  colours.tileGrads['blankColour'];
                    let tilePress = () => handleTilePress(k);
                    let borderRadius = null;
                    let blocked = null;
                    let selected = null;

                    if (col === 'blocked') {
                        blocked = <>
                                    <View style={{...styles.blocked, transform: [{rotate: '45deg'}]}} />
                                    <View style={{...styles.blocked, transform: [{rotate: '-45deg'}]}} />
                                </>;
                        tilePress = null;
                    } else if (col) {
                        tileColour = colours.tileGrads[col];
                        tilePress = null;
                    }

                    if (k === selectedTile) {
                        selected = {borderColor: 'lime', borderWidth: 3}
                    }

                    switch (k) {
                        case 't1':
                            borderRadius = {borderTopLeftRadius: 9}
                            break;
                        case 't3':
                            borderRadius = {borderTopRightRadius: 9}
                            break;
                        case 't7':
                            borderRadius = {borderBottomLeftRadius: 9}
                            break;
                        case 't9':
                            borderRadius = {borderBottomRightRadius: 9}
                            break;
                    }

                    return !col || col === 'blocked' ? <Pressable key={k} onPress={tilePress} style={{...styles.tile, backgroundColor: colours.grey, ...borderRadius, ...selected}}>
                                                            {blocked}
                                                        </Pressable> :
                                                        <LinearGradient key={k} colors={tileColour} style={{...styles.tile, ...borderRadius, ...selected}} />;
                })}
            </View>
            <View style={styles.colourPalette}>
                {tileColours.map(colour => colour !== 'blankColour' && <LinearGradient key={colour} colors={colours.tileGrads[colour]} style={{...styles.paletteColour}}>
                                            <TouchableOpacity onPress={() => handlePalettePress(colour)} style={{...styles.paletteColour}} />
                                        </LinearGradient>)}
            </View>
            {gameOver && <View style={styles.postGameOptions}>
                            <TouchableOpacity style={{...styles.button, backgroundColor: colours.yellow}} onPress={() => navigation.navigate('Home')}>
                                <Image
                                    style={styles.buttonIcon}
                                    source={require('../assets/home-icon.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{...styles.button, backgroundColor: colours.green}} onPress={startGame}>
                                <Image
                                    style={styles.buttonIcon}
                                    source={require('../assets/play-icon.png')} />
                            </TouchableOpacity>
                        </View>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {...containerStyles},
    grid: {
        aspectRatio: 1/1,
        borderRadius: 15,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 2,
        overflow: 'hidden',
        paddingLeft: 16,
        paddingRight: 16,
        width: '100%',
    },
    tile: {
        alignItems: 'center',
        aspectRatio: 1/1,
        height: 1,
        justifyContent: 'center',
        position: 'relative',
        width: (Dimensions.get('window').width - 84) / 3,
    },
    blocked: {
        backgroundColor: colours.primaryColour,
        height: 56,
        position: 'absolute',
        width: 6,
    },
    colourPalette: {
        flexDirection: 'row',
        gap: 2,
        marginTop: 30,
        width: (Dimensions.get('window').width - 60),
    },
    paletteColour: {
        aspectRatio: 1/1,
        width: (Dimensions.get('window').width - 65) / 5,
    },
    bestScoreArea: {
        flexDirection: 'row',
        marginBottom: 40,
        marginLeft: 'auto',
    },
    best: {
        color: colours.lightText,
        fontSize: 20,
    },
    bestScore: {
        color: colours.lightText,
        fontSize: 20,
        fontWeight: 'bold',
    },
    scoreArea: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    score: {
        color: colours.lightText,
        fontSize: 30,
    },
    scoreTotal: {
        color: colours.lightText,
        fontSize: 30,
        fontWeight: 'bold',
    },
    postGameOptions: {
        flexDirection: 'row',
        gap: 20,
    },
    button: {
        borderRadius: 15,
        marginTop: 30,
        paddingBottom: 12,
        paddingLeft: 50,
        paddingRight: 50,
        paddingTop: 12,
    },
    buttonIcon: {
        height: 24,
        width: 24,
    },
});