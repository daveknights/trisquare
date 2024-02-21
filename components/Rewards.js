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
                <ScrollView scrollEnabled={scrollEnabled} onContentSizeChange={onContentSizeChange} style={{minHeight: height - headerHeight, width: '100%'}}>
                    <Text style={{...textStyles.heading}}>Your Achievements</Text>
                    {!Object.keys(achievements).length && <Text style={{...textStyles.text}}>All your achievement rewards will show here.</Text>}
                    {Object.keys(achievements).length > 0 && <Text style={{...textStyles.subHeading, alignSelf: 'center'}}>Points scored in a game</Text>}
                    {Object.keys(achievements).length > 0 && <View style={styles.rewardsRow}>
                        {achievements.score30 && <PointsReward text="30" colour="bronze" />}
                        {achievements.score60 && <PointsReward text="60" colour="bronze" />}
                        {achievements.score90 && <PointsReward text="90" colour="silver" />}
                    </View>}
                    {/* <View style={styles.rewardsRow}>
                        <PointsReward text="120" colour="silver" />
                        <PointsReward text="150" colour="gold" />
                        <PointsReward text="200" colour="gold" />
                    </View>
                    <Text style={{...textStyles.subHeading}}>Grids cleared in a game</Text>
                    <View style={styles.rewardsRow}>
                        <GridsReward text="1" colour="bronze" />
                        <GridsReward text="3" colour="silver" />
                        <GridsReward text="6" colour="gold" />
                    </View>
                    <Text style={{...textStyles.subHeading}}>Consecutive matches</Text>
                    <View style={styles.rewardsRow}>
                        <MatchesReward text="1" colour="bronze" />
                        <MatchesReward text="3" colour="silver" />
                        <MatchesReward text="6" colour="gold" />
                    </View> */}
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