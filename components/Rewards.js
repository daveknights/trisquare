import { StyleSheet, Text, View, Dimensions, ScrollView } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { useState, useContext, useEffect } from 'react';
import PointsReward from './rewards/PointsReward';
import GridsReward from './rewards/GridsReward';
import MatchesReward from './rewards/MatchesReward';
import GameContext from '../context/gameContext';
import containerStyles from '../defaults/containerStyles';
import textStyles from '../defaults/textStyles';

const { height } = Dimensions.get('window');

export default function Rewards() {
    const [screenHeight, setScreenHeight] = useState(0);
    const [scrollEnabled, setScrollEnabled] = useState(false);
    const headerHeight = useHeaderHeight();
    const gameContext = useContext(GameContext);
    const theme = gameContext.theme;

    const onContentSizeChange = (contentWidth, contentHeight) => {
        setScreenHeight(contentHeight);
    };

    useEffect(() => {
        (!scrollEnabled && screenHeight > (height - headerHeight)) && setScrollEnabled(true);
    }, [screenHeight]);

    textStyles.heading.color = theme.textColour;
    textStyles.subHeading.color = theme.textColour;
    textStyles.text.color = theme.textColour;


    return (
            <View style={{...containerStyles, backgroundColor: theme.bgColour}}>
                <ScrollView scrollEnabled={scrollEnabled} onContentSizeChange={onContentSizeChange}>
                    <Text style={{...textStyles.heading}}>Your Achievements</Text>
                    <Text style={{...textStyles.text}}>All your achievement rewards will show here.</Text>
                    {/* <Text style={{...textStyles.subHeading}}>Points scored in a game</Text>
                    <View style={styles.rewardsRow}>
                        <PointsReward text="30" colour="bronze" />
                        <PointsReward text="60" colour="bronze" />
                        <PointsReward text="90" colour="silver" />
                    </View>
                    <View style={styles.rewardsRow}>
                        <PointsReward text="120" colour="silver" />
                        <PointsReward text="150" colour="gold" />
                        <PointsReward text="200" colour="gold" />
                    </View>
                    <Text style={{...textStyles.subHeading}}>Grids cleared in a game</Text>
                    <View style={styles.rewardsRow}>
                        <GridsReward text="1" colour="bronze" />
                        <GridsReward text="3" colour="silver" />
                        <GridsReward text="6" colour="gold" />
                    </View> */}
                    {/* <Text style={{...textStyles.subHeading}}>Consecutive matches</Text>
                    <View style={styles.rewardsRow}>
                        <MatchesReward text="1" colour="bronze" />
                        <MatchesReward text="3" colour="silver" />
                        <MatchesReward text="6" colour="gold" />
                    </View> */}
                </ScrollView>
            </View>
    );
};

const styles = StyleSheet.create({
    rewardsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
        marginTop: 10,
        width: '100%',
    }
});