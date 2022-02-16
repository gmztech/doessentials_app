import React, {useState, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {useIsFocused} from '@react-navigation/core';
import colors from '../../assets/colors/colors';
import {useGlobalState} from 'state-pool';
import ActionBar from '../common/ActionBar';
import Intro from '../common/Intro';
import Feather from 'react-native-vector-icons/Feather';
import {firebase} from '@react-native-firebase/firestore';
Feather.loadFont();

const MyTeam = ({navigation, route}) => {
  let {team: myTeam, createdUser} = route.params || {};
  myTeam = sortAlphabetically(myTeam);
  const isFocused = useIsFocused();
  const [siteData] = useGlobalState('siteData');
  const [client] = useGlobalState('client');
  const [apData] = useState(siteData.associateProfile);
  const [team, setTeam] = useState(myTeam);

  const getTeams = async () => {
    let teamsRef = await firebase
      .firestore()
      .collection('clients')
      .where('upliner', '==', client.id)
      .get();
    setTeam(teamsRef.docs.map(d => d.data()));
  };

  useEffect(() => {
    // set team
    setTeam(sortAlphabetically(myTeam));
    if (createdUser) {
      getTeams();
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <ScrollView>
          <StatusBar />
          <Intro view="default" height={30} />
          <ActionBar
            view="default"
            navigation={navigation}
            backColor={colors.text}
            backSize={30}
          />
          <View style={styles.content}>
            {/* title */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>{apData.myTeam} </Text>
            </View>
            {/* dessctiption */}
            <View>
              <Text style={styles.myTeamDescription}>
                {apData.myTeamDescription}{' '}
              </Text>
            </View>
            {/* Create client */}
            <View style={styles.createContainer}>
              <TouchableOpacity
                style={styles.createButtonContainer}
                onPress={() =>
                  navigation.navigate('CreateClient', {create: true})
                }>
                <Text style={styles.createText}>{apData.createClient}</Text>
              </TouchableOpacity>
            </View>
            {/* team card */}
            <View style={styles.cardContent}>
              {team.length ? (
                team.map((member, i) => (
                  <Member
                    key={i}
                    navigation={navigation}
                    member={member}
                    team={team}
                    apData={apData}
                  />
                ))
              ) : (
                <Text style={styles.noResult}>{apData.noTeamAvailable}</Text>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const Member = ({navigation, member, team, apData}) => {
  return (
    <TouchableOpacity
      style={{...styles.card, ...styles.memberContainer}}
      onPress={() => navigation.navigate('MemberDetail', {member, team})}>
      <Text style={{...styles.saleName, color: colors.text}}>
        {member.name} {member.lastName}{' '}
        <Text
          style={{
            ...styles.saleName,
            color: member.associated ? colors.brandPurple : colors.brandGreen,
          }}>
          ({member.associated ? apData.associate : apData.client}){' '}
          {member.disabled ? (
            <Text style={{color: colors.danger}}>({apData.disabled})</Text>
          ) : (
            <></>
          )}
        </Text>
      </Text>
      <Feather name="chevron-right" size={20} color={colors.lightGray} />
    </TouchableOpacity>
  );
};

const sortAlphabetically = items =>
  items.sort((a, b) => a.name.localeCompare(b.name));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  noResult: {
    color: colors.text,
    textAlign: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 30,
    paddingBottom: 70,
  },
  createContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
  },
  createButtonContainer: {
    backgroundColor: colors.brandGreen,
    padding: 5,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
  },
  createText: {
    color: colors.white,
    borderRadius: 20,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
    borderRadius: 10,
  },
  title: {
    paddingVertical: 20,
    fontSize: 20,
    color: colors.text,
    fontWeight: 'bold',
  },
  myTeamDescription: {
    color: colors.text,
    fontSize: 16,
    marginBottom: 20,
  },
  card: {
    padding: 20,
    backgroundColor: colors.white,
    elevation: 2,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 5,
    borderRadius: 20,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardHeaderTitle: {
    color: colors.text,
    fontSize: 16,
  },
  cardHeaderButton: {
    color: colors.brandPurple,
  },
  memberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    alignItems: 'center',
  },
});

export default MyTeam;
