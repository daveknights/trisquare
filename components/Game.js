import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, Pressable, TouchableOpacity, Image, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IconButton from './IconButton';
import GameContext from '../context/gameContext';
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
    const [tiles, setTiles] = useState(initialTiles);
    const [emptyTiles, setEmptyTiles] = useState([...Object.keys(initialTiles)]);
    const [selectedTile, setSelectedTile] = useState(null);
    const [selectedColour, setSelectedColour] = useState('');
    const [blockedTile, setBlockedTile] = useState('');
    const [canAddTile, setCanAddTile] = useState(null);
    const [lastTile, setLastTile] = useState(false);
    const [score, setScore] = useState(null);
    const [gridFull, setGridFull] = useState(false);
    const [gameOver, setGameOver] = useState(null);
    const gameContext = useContext(GameContext);
    const styles = createStyles(gameContext.theme, gameContext.playViolet);


    useEffect(() => {
        gameContext.playViolet && tileColours.push('violet');

        return () => tileColours.length === 6 && tileColours.pop();
    }, []);

    const saveHighScore = async value => {
        try {
            const triSquareData = await AsyncStorage.getItem('@triSquareData');
            const updatedData = JSON.parse(triSquareData);

            updatedData.normalHighScore = value;

            if (value >= 100 && !updatedData.violetUnlocked) {
                updatedData.violetUnlocked = true;
            }

            await AsyncStorage.setItem('@triSquareData', JSON.stringify(updatedData));
        } catch (e) {
            // saving error
        }

        gameContext.setHighScore(value);
    };

    const getEmptyTile = () => emptyTiles[Math.floor(Math.random() * emptyTiles.length)];

    const getColour = () => tileColours[Math.floor(Math.random() * (gameContext.playViolet ? 6 : 5))];
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
    };

    useEffect(() => {
        startGame()
    }, []);
    // Add new tile
    useEffect(() => {
        let timer;

        if (canAddTile) {
            timer = setTimeout(() => {
                const newColour = getColour();
                let newBlockedTile;
                let newTile;

                if (lastTile) {
                    newBlockedTile = emptyTiles[0];
                    newTile = blockedTile;
                    setGridFull(true);
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
                setGridFull(true);
                break;
            case 1:
                setLastTile(true);
                break;
            case 8:
                setScore(score => score + 5);
            default:
                lastTile && setLastTile(false);
                gridFull && setGridFull(false);
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
                const selected = selectedTile;
                comboMatch = combo.every(colourMatch);

                if (comboMatch) {
                    timer = setTimeout(() => {
                        setSelectedTile(null);
                        setSelectedColour('');
                        setEmptyTiles([...emptyTiles, selected, `t${combo[0]}`, `t${combo[1]}`]);
                        setTiles(prevTiles => ({
                            ...prevTiles,
                            [selected]: '',
                            [`t${combo[0]}`]: '',
                            [`t${combo[1]}`]: ''
                        }));
                        setScore(score => score + 1);
                        setCanAddTile(true);
                        setGridFull(false);

                        clearTimeout(timer);
                    }, 250);

                    break;
                }
            }

            if (!comboMatch) {
                setSelectedColour('');
                setSelectedTile(null);

                if (gridFull) {
                    setGameOver(true);
                    setCanAddTile(false);
                    score > gameContext.highScore && saveHighScore(score);
                } else {
                    setCanAddTile(true);
                }
            }
        }

        return () => clearTimeout(timer);
    }, [tiles]);

    const handleTilePress = key => setSelectedTile(key);

    const handlePalettePress = colour => {
        if (selectedTile) {
            emptyTiles.length === 1 && setGridFull(true);
            setSelectedColour(colour);
            setTiles(prevTiles => ({...prevTiles, ...{[selectedTile]: colour}}));
            setEmptyTiles(emptyTiles.filter(key => key !== selectedTile));
        }
    };

    const handleHomePress = () => navigation.navigate('Home');

    return (
        <View style={styles.container}>
            <View style={styles.bestScoreArea}>
                <Text style={styles.best}>Best: </Text>
                <Text style={styles.bestScore}>{gameContext.highScore}</Text>
            </View>
            <View style={styles.scoreArea}>
                <Text style={styles.score}>Score: </Text>
                <Text style={styles.scoreTotal}>{score}</Text>
            </View>
            <View style={styles.grid}>
                {Object.entries(tiles).map(([k, col]) => {
                    let tileColour =  gameContext.theme.tileGrads['blankColour'];
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
                        tileColour = gameContext.theme.tileGrads[col];
                        tilePress = null;
                    }

                    if (k === selectedTile) {
                        selected = {borderColor: '#00ef00', borderWidth: 5}
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

                    return !col || col === 'blocked' ? <Pressable key={k} onPress={tilePress} style={{...styles.tile, backgroundColor: gameContext.theme.gridColour, ...borderRadius, ...selected}}>
                                                            {blocked}
                                                        </Pressable> :
                                                        <LinearGradient key={k} colors={tileColour} style={{...styles.tile, ...borderRadius, ...selected}} />;
                })}
            </View>
            <View style={styles.colourPalette}>
                {tileColours.map(colour => colour !== 'blankColour' && <LinearGradient key={colour} colors={gameContext.theme.tileGrads[colour]} style={{...styles.paletteColour}}>
                                            <TouchableOpacity onPress={() => handlePalettePress(colour)} style={{...styles.paletteColour}} />
                                        </LinearGradient>)}
            </View>
            {gameOver && <View style={styles.postGameOptions}>
                            <IconButton
                                path={require('../assets/home-icon.png')}
                                bgColour="yellow"
                                onPress={handleHomePress}
                            />
                            <IconButton
                                path={require('../assets/play-icon.png')}
                                bgColour="green"
                                onPress={startGame}
                            />
                        </View>}
        </View>
    )
}

const createStyles = (theme, playViolet) => StyleSheet.create({
    container: {
        backgroundColor: theme.bgColour,
        paddingTop: 80,
        ...containerStyles,
    },
    grid: {
        aspectRatio: 1/1,
        borderRadius: 15,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 2,
        overflow: 'hidden',
        marginLeft: 40,
        marginRight: 40,
        width: (Dimensions.get('window').width - 80),
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
        backgroundColor: theme.bgColour,
        height: 56,
        position: 'absolute',
        width: 6,
    },
    colourPalette: {
        flexDirection: 'row',
        gap: 2,
        marginTop: 30,
    },
    paletteColour: {
        aspectRatio: 1/1,
        width: (Dimensions.get('window').width - (playViolet ? 70 : 68)) / (playViolet ? 6 : 5),
    },
    bestScoreArea: {
        flexDirection: 'row',
        marginBottom: 40,
        marginLeft: 'auto',
    },
    best: {
        color: theme.textColour,
        fontSize: 20,
    },
    bestScore: {
        color: theme.textColour,
        fontSize: 20,
        fontWeight: 'bold',
    },
    scoreArea: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    score: {
        color: theme.textColour,
        fontSize: 30,
    },
    scoreTotal: {
        color: theme.textColour,
        fontSize: 30,
        fontWeight: 'bold',
    },
    postGameOptions: {
        flexDirection: 'row',
        gap: 20,
        marginTop: 30,
    },
    button: {
        borderColor: colours.primary,
        borderRadius: 15,
        borderWidth: 1,
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