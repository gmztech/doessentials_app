import React, { useState, useEffect, useRef } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Text,
  ScrollView,
} from "react-native";
import firebase from "../firebase/firebase";
import colors from "../assets/colors/colors";
import ActionBar from "./common/ActionBar";
import Intro from "./common/Intro";
import CategorySlider from "./categories/CategorySlider";
import gs from "../assets/css/GeneralStyles";
import NavigationTabs from "./common/NavigationTabs";
import { useGlobalState } from "state-pool";
import { CommonActions } from "@react-navigation/native";

const Home = ({ navigation, route }) => {
  const mountedRef = useRef(true);
  const [categoryList, setCategoryList] = useState([]);
  const [user, setUser] = useGlobalState("client"); 
  const [clientTeam, setclientTeam] = useGlobalState("clientTeam");
  const [siteData] = useGlobalState("siteData");
  const [homeData] = useState(siteData.home);

  const firstName = (name) => name.split(" ")[0];

  const getClient = async (loggedUser) => {
    if (!!!loggedUser || !loggedUser.uid) {
      return;
    }
    const clientRef = firebase
      .firestore()
      .collection("clients")
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
    !client.data().id && clientRef.update({ ...newClient });
    client = await clientRef.get();
    setUser(client.data());
    setUserListener(client.data().id);

    const teamRef = firebase
      .firestore()
      .collection("teams")
      .doc(client.data().team.id);
    let team = await teamRef.get();
    team = { ...team.data(), id: team.id }
    setclientTeam(team); 
    getMainCategories(team);

    if (!newClient.name) {
      navigation.navigate("Profile", { firstime: true });
      return;
    }
  };

  const setUserListener = (userId) => { 
    firebase
      .firestore()
      .collection("clients")
      .doc(userId)
      .onSnapshot((snapshot) => { 
        const updatedUser = snapshot.data() 
        setUser(updatedUser)
        updatedUser.disabled && firebase.auth().signOut()
      })
  };

  const getMainCategories = async (team) => {
    const mcRef = await firebase.firestore().collection("mainCategories").get();
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
      })
    );
    setCategoryList(
      mainCategories.sort((a, b) => a.title.localeCompare(b.title))
    );
  };

  const getSubCategories = async (mainCatId, team) => { 
    const scRef = await firebase
      .firestore()
      .collection("subCategories")
      .where("mainCategory", "==", mainCatId)
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
      })
    );
    return subCats;
  };

  const getItems = async (subCatId, team) => {
    const itemRef = await firebase
      .firestore()
      .collection("items")
      .where("subCategory", "==", subCatId)
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
      })
    );  
    return items;
  };

  const checkForSession = (user) => {
    if (!user && mountedRef.current) {
      navigation.dispatch(
        CommonActions.reset({ index: 1, routes: [{ name: "Teams" }] })
      );
    } else {
      getClient(user);
    }
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(checkForSession);
    return () => {
      mountedRef.current = false;
      unsubscribe();
      return 
    };
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <ScrollView>
          <StatusBar></StatusBar>
          {clientTeam && <Intro team={clientTeam} view="home" height={35} />}
          <ActionBar view="home"></ActionBar>
          <View style={styles.content}>
            <View style={styles.textContainer}>
              <Text style={{...styles.title, backgroundColor: clientTeam?.primaryColor}}>
                {homeData.welcome}{" "}
                {(user.name && firstName(user.name)) || user.email}.
              </Text>
            </View>
            <View style={styles.textContainer}>
              <Text selectable style={styles.introduction}>{homeData.introduction}</Text>
            </View>
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
    backgroundColor: "#ffffff",
  },
  spacer: {
    height: 20,
    width: "100%",
    backgroundColor: "red",
  },
  content: {
    paddingHorizontal: 30,
    paddingBottom: 70,
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 10,
  },
  title: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: colors["brandGreen"],
    fontFamily: "Raleway_900Black",
    fontSize: 25,
    color: colors["white"],
    borderRadius: 10,
  },
  introduction: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: "#ffffffdb",
    fontFamily: "Raleway_400Regular",
    fontSize: 20,
    color: colors["text"],
    borderRadius: 10,
  },
  categoryTitle: {
    fontFamily: "Raleway_900Black",
    fontSize: 20,
    color: colors["text"],
  },
  mainContent: {
    paddingTop: 20,
    paddingBottom: 50,
  },
});

export default Home;
