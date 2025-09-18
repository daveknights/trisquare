import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState, useContext, useRef } from 'react';
import { StyleSheet, Text, View, Pressable, TouchableOpacity, Dimensions, Animated, ImageBackground } from 'react-native';
import { useAudioPlayer } from 'expo-audio';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RewardMessage from './RewardMessage';
import Combo from './Combo';
import IconButton from './IconButton';
import Timer from './Timer';
import CountDown from './CountDown';
import QuickPlayScore from './QuickPlayScore';
import { GameContext } from '../context/gameContext';
import container from '../defaults/container';
import layout from '../defaults/layout';
import colour from '../defaults/colour';
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
const gridRemainder = Math.floor((Dimensions.get('window').width - 84)) % 3;
const tileSize = Math.floor(((Dimensions.get('window').width - 84) - gridRemainder) / 3);
const gridSize = (tileSize * 3) + 6;
const matchSound = require('../assets/match.mp3');
const rewardSound = require('../assets/reward.mp3');

const shuffle = arrayToShuffle => {
    return arrayToShuffle.map(value => ({value, sort: Math.random()}))
            .sort((a, b) => a.sort - b.sort)
            .map(({value}) => value)
            .slice(0, arrayToShuffle.length);
};

export default function Game({ navigation }) {
    const [player, setPlayer] = useState('user');
    const [tiles, setTiles] = useState(initialTiles);
    const [emptyTiles, setEmptyTiles] = useState([...Object.keys(initialTiles)]);
    const [selectedTile, setSelectedTile] = useState(null);
    const [selectedColour, setSelectedColour] = useState('');
    const [blockedTile, setBlockedTile] = useState('');
    const [canAddTile, setCanAddTile] = useState(null);
    const [lastTile, setLastTile] = useState(false);
    const [score, setScore] = useState(null);
    const [newHighScore, setNewHighScore] = useState(false);
    const [consecutiveMatches, setConsecutiveMatches] = useState(0);
    const [showBonus, setShowBonus] = useState(false);
    const [bonusPoints, setBonusPoints] = useState(0);
    const [gridFull, setGridFull] = useState(false);
    const [gridsCleared, setGridsCleared] = useState(0);
    const [matches, setMatches] = useState(0);
    const [gameOver, setGameOver] = useState(null);
    const [showRewardsMessage, setShowRewardsMessage] = useState(false);
    const [rewardData, setRewardData] = useState({});
    const [tileAdded, setTileAdded] = useState(false);
    const [paletteTileSize, setPaletteTileSize] = useState(null);
    const [newTile, setNewTile] = useState(null);
    const [countDownNumber, setCountDownNumber] = useState(3);
    const [quickPlayWasStarted, setQuickPlayWasStarted] = useState(false);
    const [isQuickPlayTimerFinished, setIsQuickPlayTimerFinished] = useState(false);
    const gameContext = useContext(GameContext);
    const theme = gameContext.theme;
    const gameType = gameContext.gameType;
    const grow = useRef(new Animated.Value(0)).current;
    const scoreZoom = useRef(new Animated.Value(0)).current;
    const bonusZoom = useRef(new Animated.Value(0)).current;
    const matchPlayer = useAudioPlayer(matchSound);
    const rewardPlayer = useAudioPlayer(rewardSound);

    const playSound = type => {
        const player = type === 'match' ? matchPlayer : rewardPlayer;

        player.seekTo(0);
        player.play();
    }

    useEffect(() => {
        scoreZoom.setValue(0);
        score && Animated.timing(scoreZoom, {
            toValue: 1,
            duration: 125,
            useNativeDriver: true,
        }).start();
    }, [score]);

    useEffect(() => {
        grow.setValue(0);
        Animated.timing(grow, {
            toValue: 1,
            duration: 125,
            useNativeDriver: true,
        }).start();
    }, [newTile]);

    useEffect(() => {
        bonusZoom.setValue(0);
        Animated.timing(bonusZoom, {
            toValue: 1,
            duration: 75,
            useNativeDriver: true,
        }).start();
    }, [showBonus]);

    useEffect(() => {
        const countDown = setInterval(() => {
            countDownNumber > 0 && setCountDownNumber(num => num - 1);
        }, 1000);

        return () => clearInterval(countDown);
    }, [countDownNumber]);

    const saveGameData = async () => {
        const newRewardData = {};
        let newReward = false;

        try {
            const triSquareData = await AsyncStorage.getItem('@triSquareData');
            const updatedData = JSON.parse(triSquareData) || {};

            updatedData.plays = gameContext.plays + 1;
            gameContext.setPlays(gameContext.plays + 1);

            if (score >= 100 && !updatedData.violetUnlocked) {
                updatedData.violetUnlocked = true;
                newRewardData.violet = true;
                gameContext.setVioletUnlocked(true);
            }

            if(!updatedData.achievements) {
                updatedData.achievements = {
                    scores: {},
                    grids: {},
                    matches: {}
                };
            }

            if (score > gameContext.highScore) {
                updatedData.highScore = score;

                switch (true) {
                    case score > 349 && !updatedData.achievements.scores.score350:
                        updatedData.achievements.scores.score350 = true;
                        newRewardData.score = {text: 350, colour: 'gold'};
                    case score > 299 && !updatedData.achievements.scores.score300:
                        updatedData.achievements.scores.score300 = true;
                        !newRewardData.score && (newRewardData.score = {text: 300, colour: 'silver'});
                    case score > 249 && !updatedData.achievements.scores.score250:
                        updatedData.achievements.scores.score250 = true;
                        !newRewardData.score && (newRewardData.score = {text: 250, colour: 'bronze'});
                    case score > 199 && !updatedData.achievements.scores.score200:
                        updatedData.achievements.scores.score200 = true;
                        !newRewardData.score && (newRewardData.score = {text: 200, colour: 'violet'});
                    case score > 149 && !updatedData.achievements.scores.score150:
                        updatedData.achievements.scores.score150 = true;
                        !newRewardData.score && (newRewardData.score = {text: 150, colour: 'blue'});
                    case score > 119 && !updatedData.achievements.scores.score120:
                        updatedData.achievements.scores.score120 = true;
                        !newRewardData.score && (newRewardData.score = {text: 120, colour: 'green'});
                    case score > 89 && !updatedData.achievements.scores.score90:
                        updatedData.achievements.scores.score90 = true;
                        !newRewardData.score && (newRewardData.score = {text: 90, colour: 'yellow'});
                    case score > 59 && !updatedData.achievements.scores.score60:
                        updatedData.achievements.scores.score60 = true;
                        !newRewardData.score && (newRewardData.score = {text: 60, colour: 'orange'});
                    case score > 29 && !updatedData.achievements.scores.score30:
                        updatedData.achievements.scores.score30 = true;
                        !newRewardData.score && (newRewardData.score = {text: 30, colour: 'red'});
                        newReward = true;
                        break;
                }

                setNewHighScore(true);
                gameContext.setHighScore(score);
            }

            switch (true) {
                case gridsCleared > 5 && !updatedData.achievements.grids.grids6:
                    updatedData.achievements.grids.grids6 = true;
                    newRewardData.grids = {text: 6, colour: 'gold'};
                case gridsCleared > 2 && !updatedData.achievements.grids.grids3:
                    updatedData.achievements.grids.grids3 = true;
                    !newRewardData.grids && (newRewardData.grids = {text: 3, colour: 'silver'});
                case gridsCleared > 0 && !updatedData.achievements.grids.grids1:
                    updatedData.achievements.grids.grids1 = true;
                    !newRewardData.grids && (newRewardData.grids = {text: 1, colour: 'bronze'});
                    newReward = true;
                    break;
            }

            switch (true) {
                case matches > 4 && !updatedData.achievements.matches.matches6:
                    updatedData.achievements.matches.matches5 = true;
                    newRewardData.matches = {text: 5, colour: 'gold'};
                case matches > 2 && !updatedData.achievements.matches.matches3:
                    updatedData.achievements.matches.matches3 = true;
                    !newRewardData.matches && (newRewardData.matches = {text: 3, colour: 'silver'});
                case matches > 0 && !updatedData.achievements.matches.matches1:
                    updatedData.achievements.matches.matches1 = true;
                    !newRewardData.matches && (newRewardData.matches = {text: 1, colour: 'bronze'});
                    newReward = true;
                    break;
            }

            gameContext.setAchievements(updatedData.achievements);

            if (newReward) {
                gameContext.sfx && playSound('reward');
                setRewardData(newRewardData);
                setShowRewardsMessage(true);
            }

            await AsyncStorage.setItem('@triSquareData', JSON.stringify(updatedData));
        } catch (error) {
            console.log('There has been a problem saving: ' + error.message);
        }

    };

    const getEmptyTile = () => emptyTiles[Math.floor(Math.random() * emptyTiles.length)];

    const getColour = () => tileColours[Math.floor(Math.random() * (gameType === 'violet' ? 6 : 5))];
    // Initial grid state
    const startGame = () => {
        if (gameType) {
            const startingTiles = shuffle([...Object.keys(initialTiles)]);
            const [tileOneKey, tileTwoKey, blockedTileKey] = startingTiles.slice(0, -6);
            const tileOneColour = getColour();
            let tileTwoColour = getColour();

            while (tileTwoColour === tileOneColour) {
                tileTwoColour = getColour();
            }

            setSelectedTile(null);
            setEmptyTiles(startingTiles.filter(key => key !== tileOneKey && key !== tileTwoKey && key !== blockedTileKey));
            setBlockedTile(blockedTileKey);
            setTiles({...initialTiles, ...{
                [tileOneKey]: tileOneColour,
                [tileTwoKey]: tileTwoColour,
                [blockedTileKey]: 'blocked'
            }});
            setCanAddTile(false);
            setNewTile(null);
            setScore(0);
            setNewHighScore(false);
            setMatches(0);
            setConsecutiveMatches(0);
            setGridsCleared(0);
            setGameOver(false);
            setShowRewardsMessage(false);

            if(gameType === 'quickplay') {
                setQuickPlayWasStarted(true);
                setIsQuickPlayTimerFinished(false);
                setCountDownNumber(3);
            } else {
                setQuickPlayWasStarted(false);
            }
        }
    };

    const getPaletteTileSize = (qty, gap) => {
        const remainder = Math.floor((Dimensions.get('window').width - (50 + gap))) % qty;

        return Math.floor((Dimensions.get('window').width - (50 + gap + remainder))) / qty;
    };

    useEffect(() => {
        if(gameType === 'violet') {
            setPaletteTileSize(getPaletteTileSize(6, 15));
            tileColours.push('violet');
        } else {
            setPaletteTileSize(getPaletteTileSize(5, 12));
        }

        startGame();

        return () => tileColours.length === 6 && tileColours.pop();
    }, [gameType]);
    // Add new tile
    useEffect(() => {
        let timer;

        if (canAddTile && !gameOver) {
            setPlayer('phone');
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
                setNewTile(newTile);
                setTiles(prevTiles => ({
                    ...prevTiles,
                    [blockedTile]: '',
                    [newBlockedTile]: 'blocked',
                    [newTile]: newColour
                }));
                setBlockedTile(newBlockedTile);
                setCanAddTile(false);
                setTileAdded(true);

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
                !gameOver && setScore(score => score + 5);
                gameType !== 'quickplay' && setGridsCleared(prev => prev + 1);
                setBonusPoints(5);
                setShowBonus(true);
            default:
                lastTile && setLastTile(false);
                gridFull && setGridFull(false);
                break;
        }
    }, [emptyTiles]);

    useEffect(() => {
        let timer;

        if (showBonus) {
            timer = setTimeout(() => {
                setShowBonus(false);
                setBonusPoints(0);
            }, 500);
        }

        return () => clearTimeout(timer);
    }, [showBonus]);

    const colourMatch = num => tiles[`t${num}`] === selectedColour;
    // Check for 3 adjacents squares
    useEffect(() => {
        let timer;

        if (selectedColour && selectedTile) {
            let comboMatch = false;

            for (const combo of combos[selectedTile]) {
                const selected = selectedTile;
                const scoreIncrement = selectedColour === 'violet' ? 2 : 1;
                comboMatch = combo.every(colourMatch);

                if (comboMatch) {
                    gameContext.sfx && playSound('match');
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
                        !gameOver && setScore(score => score + scoreIncrement);
                        !tileAdded && setCanAddTile(true);
                        setGridFull(false);
                        setConsecutiveMatches(prev => prev + 1);

                        clearTimeout(timer);
                    }, 250);

                    break;
                }
            }

            if (!comboMatch) {
                setSelectedColour('');
                setSelectedTile(null);

                if (player === 'user' && !canAddTile && consecutiveMatches > 0) {
                    if ((consecutiveMatches - 1) >= 1) {
                        !gameOver && setScore(score => score + (consecutiveMatches - 1));
                        setBonusPoints(consecutiveMatches - 1);
                        setShowBonus(true);
                    }

                    consecutiveMatches - 1 > matches && setMatches(consecutiveMatches - 1);

                    setConsecutiveMatches(0);
                }

                if (gridFull) {
                    setGameOver(true);
                    setCanAddTile(false);
                    gameType !== 'quickplay' && saveGameData();
                } else {
                    !tileAdded && setCanAddTile(true);
                }
            }
        }

        return () => clearTimeout(timer);
    }, [tiles]);

    const handleTilePress = key => {
        if (gameOver) {
            return;
        }

        !canAddTile && setSelectedTile(key);
    };

    const handlePalettePress = colour => {
        if (selectedColour) {
            return;
        }

        if (selectedTile) {
            emptyTiles.length === 1 && setGridFull(true);
            setPlayer('user');
            setSelectedColour(colour);
            setTiles(prevTiles => ({...prevTiles, ...{[selectedTile]: colour}}));
            setEmptyTiles(emptyTiles.filter(key => key !== selectedTile));
            setTileAdded(false);
        }
    };

    const handleHomePress = () => navigation.navigate('Home');

    const handleOptionsPress = () => {
        gameType === 'quickplay' && setQuickPlayWasStarted(false);
        gameContext.setGameType('');
        navigation.navigate('Options');
    };

    const quickPlayTimerFinished = () => {
        setGameOver(true);
        setIsQuickPlayTimerFinished(true);
        setSelectedTile(null);
    };

    return (
        <ImageBackground source={gameContext.mode === 'dark' ? require('../assets/game-bg-dark.webp') : require('../assets/game-bg-light.webp')} resizeMode="cover" style={{backgroundColor: theme.bgColour, flex: 1}}>
            {showRewardsMessage && <RewardMessage rewards={rewardData} />}
            <View style={container.style}>
                <View style={{...layout.style.spaceBetweenWrapper, ...layout.style.flexOne}}>
                    <View style={styles.scoreWrapper}>
                        {(gameType === 'quickplay' && quickPlayWasStarted) && <QuickPlayScore quickPlayWasStarted={quickPlayWasStarted} score={score} gameOver={gameOver} />}
                        <View style={styles.scoreView}>
                            {gameType !== 'quickplay' &&  <View style={styles.scoreArea}>
                                <Text style={styles.scoreHeading}>{newHighScore ? 'Hi-Score' : 'Score'}</Text>
                                <Animated.Text style={{...styles.scoreTotal,
                                    transform: [{
                                        scale: scoreZoom.interpolate({
                                            inputRange: [0, 0.5, 1],
                                            outputRange: [1, 1.5, 1]})
                                    }]
                                }}>
                                    {score}
                                </Animated.Text>
                            </View>}
                        </View>

                        {consecutiveMatches > 1 && <Combo comboNumber={parseInt(consecutiveMatches) - 1} theme={theme}/>}

                        {showBonus && <Animated.View style={{...styles.bonus, transform: [{scale: bonusZoom}]}}>
                            <Text style={styles.bonusText}>+
                                <Text style={{...styles.bonusText, ...styles.bonusPoints}}>{bonusPoints}</Text>
                            </Text>
                        </Animated.View>}

                        <View style={styles.bestScoreArea}>
                            <Text style={{...styles.best, color: theme.textColour}}>{gameType === 'quickplay' ? 'Quick play best: ' : 'Best: '}</Text>
                            <Text style={{...styles.bestScore, color: theme.textColour}}>{gameType === 'quickplay' ? gameContext.quickPlayHighScore : gameContext.highScore}</Text>
                        </View>
                    </View>
                    {(gameType === 'quickplay' && countDownNumber === 0 && !gameOver) && <Timer quickPlayTimerFinished={quickPlayTimerFinished} />}
                </View>
                <View style={{...layout.style.centerWrapper, ...layout.style.flexFour}}>
                    {(gameType === 'quickplay' && countDownNumber > 0 && !gameOver) && <CountDown gridSize={gridSize} number={countDownNumber} />}
                    <View style={{...styles.grid, backgroundColor: theme.bgColour}}>
                        {Object.entries(tiles).map(([k, col]) => {
                            let tileColour =  gameContext.theme.tileGrads['blankColour'];
                            let tilePress = () => handleTilePress(k);
                            let borderRadius = null;
                            let blocked = null;
                            let selected = null;
                            let growStyles = null;

                            if (k === newTile) {
                                growStyles = {
                                    opacity: grow,
                                    transform: [{
                                        scale: grow
                                    }]
                                };
                            }

                            if (col === 'blocked') {
                                blocked = <>
                                            <View style={{...styles.blocked, backgroundColor: theme.bgColour, transform: [{rotate: '45deg'}]}} />
                                            <View style={{...styles.blocked, backgroundColor: theme.bgColour, transform: [{rotate: '-45deg'}]}} />
                                        </>;
                                tilePress = null;
                            } else if (col) {
                                tileColour = gameContext.theme.tileGrads[col];
                                tilePress = null;
                            }

                            if (k === selectedTile && !selectedColour) {
                                selected = {borderColor: '#00ef00', borderWidth: 5}
                            }

                            switch (k) {
                                case 't1':
                                    borderRadius = {borderTopLeftRadius: 15}
                                    break;
                                case 't3':
                                    borderRadius = {borderTopRightRadius: 15}
                                    break;
                                case 't7':
                                    borderRadius = {borderBottomLeftRadius: 15}
                                    break;
                                case 't9':
                                    borderRadius = {borderBottomRightRadius: 15}
                                    break;
                            }

                            const accessibilityAttributes = col !==  'blocked' ? {
                                accessible: true,
                                accessibilityLabel: "Empty grid space",
                                accessibilityHint: "Press to select this space"
                            } : {};

                            return !col || col === 'blocked' ? <Pressable key={k} onPress={tilePress}
                                                                    {...accessibilityAttributes}
                                                                    style={{...styles.tile, backgroundColor: gameContext.theme.gridColour, ...borderRadius, ...selected}}>
                                                                    {blocked}
                                                                </Pressable> :
                                                                <View key={k} style={{...styles.tile, ...borderRadius, backgroundColor: gameContext.theme.gridColour}}>
                                                                    <Animated.View style={growStyles}>
                                                                        <LinearGradient colors={tileColour} style={styles.tile} />
                                                                    </Animated.View>
                                                                </View>
                        })}
                    </View>
                </View>
                <View style={{...layout.style.startWrapper, ...layout.style.flexTwo}}>
                    <View style={styles.colourPalette}>
                        {gameOver ? <View style={styles.gameOver}><Text style={{...styles.gameOverText, color: theme.textColour}}>{gameType !== 'quickplay' ? 'Game Over' : isQuickPlayTimerFinished ? `Time's up!` : `The Grid's full`}</Text></View>
                            : tileColours.map(colour => colour !== 'blankColour' && <LinearGradient key={colour} colors={gameContext.theme.tileGrads[colour]}
                                                                                                style={{...styles.paletteColour, width: paletteTileSize}}>
                                                    <TouchableOpacity onPress={() => handlePalettePress(colour)}
                                                                        accessible={true}
                                                                        accessibilityLabel={colour}
                                                                        accessibilityHint={`Adds a ${colour} tile to the grid`}
                                                                        style={{...styles.paletteColour, width: paletteTileSize}} />
                                                </LinearGradient>)}
                    </View>
                    {gameOver && <View style={styles.postGameOptions}>
                                    <IconButton
                                        path={require('../assets/home-icon.png')}
                                        bgColour="yellow"
                                        onPress={handleHomePress}
                                        label="Go to home screen"
                                        width={70}
                                    />
                                    <IconButton
                                        path={require('../assets/options-icon.png')}
                                        bgColour="orange"
                                        onPress={handleOptionsPress}
                                        label="Go to options screen"
                                        width={70}
                                    />
                                    <IconButton
                                        path={require('../assets/play-icon.png')}
                                        bgColour="green"
                                        onPress={startGame}
                                        label="Replay game"
                                        width={90}
                                    />
                                </View>}
                </View>
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    scoreWrapper: {
        flexDirection: 'row',
    },
    scoreView: {
        flexDirection: 'row',
    },
    grid: {
        borderRadius: 15,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 3,
        height: gridSize,
        overflow: 'hidden',
        marginLeft: 40,
        marginRight: 40,
        width: gridSize,
    },
    tile: {
        alignItems: 'center',
        height: tileSize,
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
        width: tileSize,
    },
    blocked: {
        height: 56,
        position: 'absolute',
        width: 6,
    },
    colourPalette: {
        flexDirection: 'row',
        gap: 3,
    },
    paletteColour: {
        aspectRatio: 1/1,
        borderRadius: 4,
    },
    bestScoreArea: {
        alignItems: 'center',
        flexDirection: 'row',
        marginLeft: 'auto',
    },
    best: {
        fontSize: 20,
    },
    bestScore: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    scoreArea: {
        backgroundColor: colour.style.lightBlue,
        borderColor: colour.style.primary,
        borderRadius: 8,
        borderWidth: 1,
        overflow: 'hidden',
    },
    scoreHeading: {
        backgroundColor: colour.style.green,
        borderColor: colour.style.primary,
        borderBottomWidth: 1,
        color: colour.style.primary,
        fontSize: 20,
        paddingBottom: 5,
        paddingTop: 3,
        textAlign: 'center',
        width: 100,
    },
    scoreTotal: {
        color: colour.style.primary,
        fontSize: 30,
        fontWeight: 'bold',
        paddingBottom:5,
        paddingTop: 3,
        textAlign: 'center',
        width: 100,
    },
    bonus: {
        alignItems: 'center',
        alignSelf: 'flex-end',
        backgroundColor: colour.style.green,
        borderRadius: 15,
        height: 36,
        justifyContent: 'center',
        marginLeft: 10,
        width: 56,
    },
    bonusText: {
        color: colour.style.skyBlue,
        fontSize: 20,
        letterSpacing: 1,
        lineHeight: 24,
    },
    bonusPoints: {
        fontWeight: 'bold',
    },
    postGameOptions: {
        flexDirection: 'row',
        gap: 20,
        marginTop: 30,
    },
    button: {
        borderColor: colour.style.primary,
        borderRadius: 15,
        borderWidth: 1,
        paddingBottom: 12,
        paddingLeft: 50,
        paddingRight: 50,
        paddingTop: 12,
    },
    buttonIcon: {
        height: 24,
        width: 24,
    },
    gameOver: {
        alignItems: 'center',
        height: 70,
        width: gridSize,
    },
    gameOverText: {
        fontSize: 36,
    },
});