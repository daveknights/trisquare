import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { useState, useContext, useEffect } from 'react';
import PointsReward from './rewards/PointsReward';
import GridsReward from './rewards/GridsReward';
import MatchesReward from './rewards/MatchesReward';
import { GameContext } from '../context/gameContext';
import container from '../defaults/container';
import text from '../defaults/text';

const { height } = Dimensions.get('window');

export default function Rewards({ navigation }) {
    const [contentHeight, setContentHeight] = useState(0);
    const [scrollEnabled, setScrollEnabled] = useState(false);
    const headerHeight = useHeaderHeight();
    const gameContext = useContext(GameContext);
    const theme = gameContext.theme;
    const achievements = gameContext.achievements;

    const onContentSizeChange = (contentWidth, contentHeight) => {
        setContentHeight(contentHeight);
    };

    useEffect(() => {
        (!scrollEnabled && contentHeight > (height - headerHeight)) && setScrollEnabled(true);
    }, [contentHeight]);

    text.style.heading.color = theme.textColour;
    text.style.subHeading.color = theme.textColour;
    text.style.text.color = theme.textColour;

    const handleLinkToClearData = () => navigation.navigate('ClearData');

    return (
            <View style={{...container.style, backgroundColor: theme.bgColour, paddingBottom: 48, paddingTop: 24}}>
                <ScrollView scrollEnabled={scrollEnabled} onContentSizeChange={onContentSizeChange} style={{width: '100%'}}>
                    <Text style={{...text.style.heading}}>Your Achievements</Text>
                    {!Object.keys(achievements).length > 0 && <Text style={{...text.style.text}}>All your achievement rewards will show here.</Text>}
                    {(Object.keys(achievements).length > 0 && Object.keys(achievements.scores).length > 0) && <Text style={{...text.style.subHeading, alignSelf: 'center'}}>Points scored in a game</Text>}
                    {(Object.keys(achievements).length > 0 && Object.keys(achievements.scores).length > 0 && achievements.scores.score30) && <View style={styles.rewardsRow}>
                        {achievements.scores.score30 && <PointsReward text="30" scoreColour="red" />}
                        {achievements.scores.score60 && <PointsReward text="60" scoreColour="orange" />}
                        {achievements.scores.score90 && <PointsReward text="90" scoreColour="yellow" />}
                    </View>}
                    {(Object.keys(achievements).length > 0 && Object.keys(achievements.scores).length > 0 && achievements.scores.score120) && <View style={styles.rewardsRow}>
                        {achievements.scores.score120 && <PointsReward text="120" scoreColour="green" />}
                        {achievements.scores.score150 && <PointsReward text="150" scoreColour="blue" />}
                        {achievements.scores.score200 && <PointsReward text="200" scoreColour="violet" />}
                    </View>}
                    {(Object.keys(achievements).length > 0 && Object.keys(achievements.scores).length > 0 && achievements.scores.score250) && <View style={styles.rewardsRow}>
                        {achievements.scores.score250 && <PointsReward text="250" scoreColour="bronze" />}
                        {achievements.scores.score300 && <PointsReward text="300" scoreColour="silver" />}
                        {achievements.scores.score350 && <PointsReward text="350" scoreColour="gold" />}
                    </View>}
                    {(Object.keys(achievements).length > 0 && Object.keys(achievements.grids).length > 0) && <Text style={{...text.style.subHeading}}>Grids cleared in a game</Text>}
                    {(Object.keys(achievements).length > 0 && Object.keys(achievements.grids).length > 0) && <View style={styles.rewardsRow}>
                        {achievements.grids.grids1 && <GridsReward text="1" scoreColour="bronze" />}
                        {achievements.grids.grids3 && <GridsReward text="3" scoreColour="silver" />}
                        {achievements.grids.grids6 && <GridsReward text="6" scoreColour="gold" />}
                    </View>}
                    {(Object.keys(achievements).length > 0 && Object.keys(achievements.matches).length > 0) && <Text style={{...text.style.subHeading}}>Consecutive matches</Text>}
                    {(Object.keys(achievements).length > 0 && Object.keys(achievements.matches).length > 0) && <View style={styles.rewardsRow}>
                        {achievements.matches.matches1 && <MatchesReward text="1" scoreColour="bronze" />}
                        {achievements.matches.matches3 && <MatchesReward text="3" scoreColour="silver" />}
                        {achievements.matches.matches5 && <MatchesReward text="5" scoreColour="gold" />}
                    </View>}
                    <TouchableOpacity style={styles.link} onPress={handleLinkToClearData}>
                        <Text style={{...styles.linkText, color: gameContext.theme.linkColour}}>Clear all game data</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
    );
};

const styles = StyleSheet.create({
    rewardsRow: {
        flexDirection: 'row',
        gap: 30,
        justifyContent: 'center',
        marginBottom: 30,
        marginTop: 10,
        width: '100%',
    },
    link: {
        paddingBottom: 11,
        paddingTop: 11,
    },
    linkText: {
        fontSize: 20,
        textAlign: 'center',
        textDecorationLine: 'underline',
    }
});