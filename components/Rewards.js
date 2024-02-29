import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { useState, useContext, useEffect } from 'react';
import PointsReward from './rewards/PointsReward';
import GridsReward from './rewards/GridsReward';
import MatchesReward from './rewards/MatchesReward';
import GameContext from '../context/gameContext';
import containerStyles from '../defaults/containerStyles';
import textStyles from '../defaults/textStyles';

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

    textStyles.heading.color = theme.textColour;
    textStyles.subHeading.color = theme.textColour;
    textStyles.text.color = theme.textColour;

    const handleLinkToClearData = () => navigation.navigate('ClearData');

    return (
            <View style={{...containerStyles, backgroundColor: theme.bgColour}}>
                <ScrollView scrollEnabled={scrollEnabled} onContentSizeChange={onContentSizeChange} style={{width: '100%'}}>
                    <Text style={{...textStyles.heading}}>Your Achievements</Text>
                    {!Object.keys(achievements).length > 0 && <Text style={{...textStyles.text}}>All your achievement rewards will show here.</Text>}
                    {(Object.keys(achievements).length > 0 && Object.keys(achievements.scores).length > 0) && <Text style={{...textStyles.subHeading, alignSelf: 'center'}}>Points scored in a game</Text>}
                    {(Object.keys(achievements).length > 0 && Object.keys(achievements.scores).length > 0 && achievements.scores.score30) && <View style={styles.rewardsRow}>
                        {achievements.scores.score30 && <PointsReward text="30" colour="bronze" />}
                        {achievements.scores.score60 && <PointsReward text="60" colour="bronze" />}
                        {achievements.scores.score90 && <PointsReward text="90" colour="silver" />}
                    </View>}
                    {(Object.keys(achievements).length > 0 && Object.keys(achievements.scores).length > 0 && achievements.scores.score120) && <View style={styles.rewardsRow}>
                        {achievements.scores.score120 && <PointsReward text="120" colour="silver" />}
                        {achievements.scores.score150 && <PointsReward text="150" colour="gold" />}
                        {achievements.scores.score200 && <PointsReward text="200" colour="gold" />}
                    </View>}
                    {(Object.keys(achievements).length > 0 && Object.keys(achievements.grids).length > 0) && <Text style={{...textStyles.subHeading}}>Grids cleared in a game</Text>}
                    {(Object.keys(achievements).length > 0 && Object.keys(achievements.grids).length > 0) && <View style={styles.rewardsRow}>
                        {achievements.grids.grids1 && <GridsReward text="1" colour="bronze" />}
                        {achievements.grids.grids3 && <GridsReward text="3" colour="silver" />}
                        {achievements.grids.grids6 && <GridsReward text="6" colour="gold" />}
                    </View>}
                    {(Object.keys(achievements).length > 0 && Object.keys(achievements.matches).length > 0) && <Text style={{...textStyles.subHeading}}>Consecutive matches</Text>}
                    {(Object.keys(achievements).length > 0 && Object.keys(achievements.matches).length > 0) && <View style={styles.rewardsRow}>
                        {achievements.matches.matches1 && <MatchesReward text="1" colour="bronze" />}
                        {achievements.matches.matches3 && <MatchesReward text="3" colour="silver" />}
                        {achievements.matches.matches6 && <MatchesReward text="6" colour="gold" />}
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
        paddingBottom: 10,
        paddingTop: 10,
    },
    linkText: {
        fontSize: 20,
        textAlign: 'center',
        textDecorationLine: 'underline',
    }
});