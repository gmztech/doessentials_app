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
import {useIsFocused} from '@react-navigation/native';
import colors from '../../assets/colors/colors';
import {useGlobalState} from 'state-pool';
import ActionBar from '../common/ActionBar';
import firebase from '../../firebase/firebase';
import Intro from '../common/Intro';
import Feather from 'react-native-vector-icons/Feather';
Feather.loadFont();

const HealthConsult = ({navigation, route}) => {
  const isFocused = useIsFocused();
  const [siteData] = useGlobalState('siteData');
  const [consults, setConsults] = useState([]);
  const [client] = useGlobalState('client');
  const [consultData] = useState(siteData.consult);
  const {asClient} = route.params || {};
  let unsubscribeConsultListener;

  const getConsults = async clientData => {
    let consultsRef = await firebase
      .firestore()
      .collection('consults')
      .where(asClient ? 'clientId' : 'upliner.id', '==', clientData.id)
      .get();
    setConsults(consultsRef.docs.map(d => d.data()));
  };

  const setCondultListener = () =>
    firebase
      .firestore()
      .collection('consults')
      .where(asClient ? 'clientId' : 'upliner.id', '==', client.id)
      .onSnapshot(snapshot => getConsults(client));

  useEffect(() => {
    unsubscribeConsultListener = setCondultListener();
    if (isFocused) {
      getConsults(client);
    }
    return unsubscribeConsultListener;
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
              <Text style={styles.title}>{consultData.consultsModule} </Text>
            </View>
            {/* dessctiption */}
            {!asClient && (
              <View>
                <Text style={styles.myTeamDescription}>
                  {consultData.consultsModuleDescription}{' '}
                </Text>
              </View>
            )}
            {/* consult card */}
            <View style={styles.cardContent}>
              {consults.length ? (
                consults.map((consult, i) => (
                  <Consult key={i} navigation={navigation} consult={consult} />
                ))
              ) : (
                <Text style={styles.noResult}>
                  {consultData.noConsultsAvailable}
                </Text>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const Consult = ({navigation, consult}) => {
  return (
    <TouchableOpacity
      style={{...styles.memberContainer}}
      onPress={() => navigation.navigate('CreateHealthConsult', {consult})}>
      <View>
        <Text
          style={{
            ...styles.saleName,
            color: !consult.opened ? colors.brandGreen : colors.text,
          }}>
          {consult.name}
        </Text>
        <Text
          style={{
            ...styles.saleName,
            fontWeight: 'bold',
            color: !consult.opened ? colors.brandGreen : colors.text,
          }}>
          {consult.clientName}
        </Text>
      </View>
      <Feather
        name="chevron-right"
        size={20}
        color={
          !consult.recomendations ||
          !consult.recomendations.length ||
          !consult.notes ||
          !consult.notes.length
            ? colors.brandGreen
            : colors.text
        }
      />
    </TouchableOpacity>
  );
};

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
    fontWeight: 'bold',
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

export default HealthConsult;
