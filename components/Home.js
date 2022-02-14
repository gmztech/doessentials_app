import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Text,
  ScrollView,
  Linking,
} from 'react-native';
import firebase from '../firebase/firebase';
import colors from '../assets/colors/colors';
import ActionBar from './common/ActionBar';
import Intro from './common/Intro';
import CategorySlider from './categories/CategorySlider';
import gs from '../assets/css/GeneralStyles';
import NavigationTabs from './common/NavigationTabs';
import {useGlobalState} from 'state-pool';
import {CommonActions} from '@react-navigation/native';
import HealthConsultCaontainer from './healthConsult/HealthConsultCaontainer';
import {useIsFocused} from '@react-navigation/native';
import Button from './common/Button';
import {helpers} from '../services/helpers';
import Purchases from 'react-native-purchases';

const Home = ({navigation, route}) => {
  const mountedRef = useRef(true);
  const [categoryList, setCategoryList] = useState([]);
  const [user, setUser] = useGlobalState('client');
  const [plan, setPlan] = useGlobalState('plan');
  const [clientTeam, setclientTeam] = useGlobalState('clientTeam');
  const [siteData] = useGlobalState('siteData');
  const [homeData] = useState(siteData.home);
  const [generalData] = useState(siteData.general);
  const [consults, setConsults] = useState([]);
  const [faqList, setFaqList] = useGlobalState('faqList');
  const isFocused = useIsFocused();
  let unsubscribeConsultListener;
  let unsubscribeUserListener;

  const firstName = name => name.split(' ')[0];

  const setConsultListener = client => {
    return firebase
      .firestore()
      .collection('consults')
      .where('clientId', '==', client.id)
      .onSnapshot(_ => getConsults(client));
  };

  const getFaqs = async () => {
    try {
      let setFaqListRef = firebase.firestore().collection('faqs');
      setFaqListRef = await setFaqListRef.get();
      setFaqListRef = setFaqListRef._docs.map(item => item._data);
      setFaqList(setFaqListRef);
    } catch (error) {
      console.log(error);
    }
  };

  const getClient = async loggedUser => {
    if (!loggedUser || !loggedUser.uid) {
      return;
    }
    const clientRef = firebase
      .firestore()
      .collection('clients')
      .doc(loggedUser.uid);
    let client = await clientRef.get();
    if (!client.exists) {
      return;
    }
    const newClient = {
      ...client.data(),
      id: client.id,
    };
    setUser(newClient);
    !client.data().id && clientRef.update({...newClient});
    client = await clientRef.get();
    setUser(client.data());
    unsubscribeUserListener = setUserListener(client.data().id);
    unsubscribeConsultListener = setConsultListener(client.data());
    const teamRef = firebase
      .firestore()
      .collection('teams')
      .doc(client.data().team.id);
    let team = await teamRef.get();
    team = {...team.data(), id: team.id};
    setclientTeam(team);
    getMainCategories(team);
    getConsults(client.data());
    getFaqs();
    if (!newClient.name) {
      navigation.navigate('Profile', {firstime: true});
      return;
    }
  };

  const setUserListener = userId => {
    return firebase
      .firestore()
      .collection('clients')
      .doc(userId)
      .onSnapshot(snapshot => {
        if (!snapshot) {
          return;
        }
        const updatedUser = snapshot.data();
        setUser(updatedUser);
        updatedUser.disabled && firebase.auth().signOut();
      });
  };

  const getMainCategories = async team => {
    const mcRef = await firebase.firestore().collection('mainCategories').get();
    if (mcRef.empty) {
      return;
    }
    const mainCategories = await Promise.all(
      mcRef.docs.map(async (doc, index) => {
        const subCategories = await getSubCategories(doc.id, team);
        return {
          ...doc.data(),
          id: doc.id,
          items: subCategories,
        };
      }),
    );
    setCategoryList(
      mainCategories.sort((a, b) => a.title.localeCompare(b.title)),
    );
  };

  const getSubCategories = async (mainCatId, team) => {
    const scRef = await firebase
      .firestore()
      .collection('subCategories')
      .where('mainCategory', '==', mainCatId)
      .get();
    if (scRef.empty) {
      return [];
    }
    const subCats = await Promise.all(
      scRef.docs.map(async (doc, index) => {
        const items = await getItems(doc.id, team);
        return {
          ...doc.data(),
          id: doc.id,
          items,
        };
      }),
    );
    return subCats;
  };

  const getItems = async (subCatId, team) => {
    const itemRef = await firebase
      .firestore()
      .collection('items')
      .where('subCategory', '==', subCatId)
      .get();
    if (itemRef.empty) {
      return [];
    }
    const items = await Promise.all(
      itemRef.docs.map((doc, index) => {
        return {
          ...doc.data(),
          id: doc.id,
        };
      }),
    );
    return items;
  };

  const checkForSession = user => {
    if (!user && mountedRef.current) {
      navigation.dispatch(
        CommonActions.reset({index: 1, routes: [{name: 'Teams'}]}),
      );
    } else {
      getClient(user);
    }
  };

  const getConsults = async user => {
    let consultsRef = await firebase
      .firestore()
      .collection('consults')
      .where('clientId', '==', user.id)
      .get();
    setConsults(consultsRef.docs.map(d => d.data()));
  };

  const getPlan = async user => {
    try {
      Purchases.setDebugLogsEnabled(true);
      await Purchases.setup(helpers.RC_APIKEY, user.id);
      const offerings = await Purchases.getOfferings();
      if (!offerings.all.default.availablePackages.length) {
        return;
      }
      const packages = offerings.all.default.availablePackages;
      const product = packages.find(
        p => p.product.identifier === helpers.premiumPlan,
      );
      if (!product) {
        return;
      }
      const {product: myProduct} = product;
      setPlan({...myProduct});
      purchaseStatus();
    } catch (error) {
      console.log('RevenueCat error:', error);
    }
  };

  const purchaseStatus = async () => {
    try {
      const purchaserInfo = await Purchases.getPurchaserInfo();
      let userRef = firebase.firestore().collection('clients').doc(user.id);
      const newUser = {
        ...user,
        associated:
          typeof purchaserInfo.entitlements.active[helpers.RC_ENTITLEMENT] ===
          'undefined'
            ? false
            : true,
      };
      await userRef.update(newUser);
    } catch (error) {
      console.log('RevenueCat error:', error);
    }
  };

  const goTo = (view, params) => {
    navigation.navigate(view, params);
  };

  useEffect(() => {
    const refreshOpened = consults.some(c => !c.opened);
    if (isFocused && user && user.id && refreshOpened) {
      getConsults(user);
    }
    if (isFocused && user && user.id) {
      getPlan(user);
    }
    return;
  }, [isFocused]);

  useEffect(() => {
    if (user && user.id) {
      getPlan(user);
    }
    return;
  }, [user]);

  useEffect(() => {
    const unsubscribe1 = firebase.auth().onAuthStateChanged(checkForSession);
    return () => {
      mountedRef.current = false;
      unsubscribe1();
      if (unsubscribeUserListener && unsubscribeConsultListener) {
        unsubscribeUserListener;
        unsubscribeConsultListener;
      }
      return;
    };
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <ScrollView>
          <StatusBar />
          {clientTeam && <Intro team={clientTeam} view="home" height={35} />}
          <ActionBar view="home" goTo={goTo} />
          <View style={styles.content}>
            <View style={styles.textContainer}>
              <Text
                style={{
                  ...styles.title,
                  backgroundColor: clientTeam?.primaryColor,
                }}>
                {homeData.welcome}{' '}
                {(user.name && firstName(user.name)) || user.email}.
              </Text>
            </View>
            <View style={styles.textContainer}>
              <Text selectable style={styles.introduction}>
                {homeData.introduction}
              </Text>
            </View>
            {/* health consult */}
            <View style={{marginTop: 10}}>
              <Text style={{...styles.categoryLabel}}>
                {homeData.healthConsult}
              </Text>
              <View style={{...styles.card}}>
                <View style={styles.createConsult}>
                  <Text style={{fontWeight: 'bold', color: colors.text}}>
                    {homeData.myConsults}
                  </Text>
                  <Button
                    onPress={() => goTo('CreateHealthConsult', {create: true})}
                    fontSize={13}
                    label={homeData.createConsult}
                    background={colors.brandPurple}
                  />
                </View>
                <HealthConsultCaontainer
                  homeData={homeData}
                  consults={consults}
                  navigation={navigation}
                />
                <Button
                  onPress={() => goTo('HealthConsult', {asClient: true})}
                  marginTop={20}
                  fontSize={15}
                  label={homeData.seeAll}
                  color={'brandPurple'}
                />
              </View>
            </View>
            <View style={{marginTop: 10}}>
              <Text style={{...styles.categoryLabel}}>
                {generalData.effectiveUsage}
              </Text>
              <Button
                label={generalData.effectiveUsageLabel}
                background={'brandGreen'}
                fontSize={20}
                onPress={() => goTo('SafeUsage')}
              />
            </View>
            {/* categories */}
            <View style={styles.mainContent}>
              {categoryList && categoryList.length ? (
                categoryList.map((category, i) => {
                  return (
                    <CategorySlider
                      navigation={navigation}
                      key={i}
                      category={category}
                    />
                  );
                })
              ) : (
                <Text style={gs.noResult}>Cargando...</Text>
              )}
            </View>
            {/* urls */}
            <View style={{paddingHorizontal: 30}}>
              <Button
                paddingTop={5}
                label={'Disclaimer de responsabilidad'}
                background={'white'}
                color={'text'}
                fontSize={15}
                onPress={() => goTo('Disclaimer')}
              />
              <Button
                paddingTop={5}
                label={'Política de privacidad'}
                background={'white'}
                color={'text'}
                fontSize={15}
                onPress={() =>
                  Linking.openURL(
                    'https://doessentials.cl/politica-de-privacidad.html',
                  )
                }
              />
              <Button
                paddingTop={5}
                label={'Términos y Condiciones'}
                background={'white'}
                color={'text'}
                fontSize={15}
                onPress={() =>
                  Linking.openURL(
                    'https://doessentials.cl/terminos-y-condiciones.html',
                  )
                }
              />
            </View>
          </View>
        </ScrollView>
        <NavigationTabs route={route} navigation={navigation} />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  spacer: {
    height: 20,
    width: '100%',
    backgroundColor: 'red',
  },
  content: {
    paddingHorizontal: 30,
    paddingBottom: 70,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  title: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: colors.brandGreen,
    fontSize: 25,
    color: colors.white,
    borderRadius: 10,
    overflow: 'hidden',
  },
  introduction: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: '#ffffffdb',
    fontSize: 20,
    color: colors.text,
    borderRadius: 10,
    overflow: 'hidden',
  },
  categoryTitle: {
    fontSize: 20,
    color: colors.text,
  },
  mainContent: {
    paddingBottom: 50,
  },
  categoryLabel: {
    fontSize: 25,
    color: colors.text,
    marginBottom: 10,
    fontWeight: 'bold',
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingVertical: 10,
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
  createConsult: {
    flexWrap: 'wrap',
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: colors.lightGray,
    paddingBottom: 20,
    alignItems: 'center',
  },
});

export default Home;
