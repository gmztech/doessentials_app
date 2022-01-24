import React, { useState, useEffect, useRef } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Image,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking
} from "react-native";
import firebase from "../firebase/firebase";
import colors from "../assets/colors/colors";
import Button from "./common/Button";
import ActionBar from "./common/ActionBar";
import Intro from "./common/Intro";
import { CommonActions } from "@react-navigation/native";
import { useGlobalState } from "state-pool";
import RNPickerSelect from "react-native-picker-select";
const timeout = (time) =>
  new Promise((resolve, reject) => setTimeout(() => resolve(), time));
const Teams = ({ navigation }) => {
  const [siteData] = useGlobalState("siteData");
  const [, setclientTeam] = useGlobalState("clientTeam");
  const [loading, setLoading] = useState(false);
  const [showTeams, setShowTeams] = useState(false);
  const [teamData] = useState(siteData.teams);
  const [selectedTeam, setselectedTeam] = useState(null);
  const mountedRef = useRef(true);
  const [teams, setTeams] = useState(null);
  const checkForSession = async (user) => {
    if (!user) {
      setShowTeams(true)
      return;
    }
    await timeout(1000);
    user &&
      mountedRef.current &&
      navigation.dispatch(
        CommonActions.reset({ index: 1, routes: [{ name: "Home" }] })
      );
  };

  const getTeams = async () => {
    const teamsRef = firebase.firestore().collection("teams");
    let newTeams = await teamsRef.get();
    if (newTeams.empty) {
      return;
    }
    newTeams = newTeams.docs
      .map((doc) => {
        return { ...doc.data(), id: doc.id };
      })
      .map((doc) => {
        return { value: doc, label: doc.name, key: doc.id };
      });
    setTeams(newTeams);
  };

  const onSelect = (value) => {
    setselectedTeam(value);
    setclientTeam(value);
  };

  const enter = async () => {
    setLoading(true);
    const theTeam = { ...selectedTeam };
    await timeout(2000);
    setLoading(false);
    navigation.navigate("Login", { team: theTeam });
  };

  const sendEmail = async() => {
    try {
      await Linking.openURL('mailto:info.doessentials@gmail.com?subject=Quiero registrar mi equipo 🙌')
    } catch (error) {
      console.log('link error');
    }
  }

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(checkForSession);
    if (mountedRef.current) {
      getTeams();
    }
    return () => {
      mountedRef.current = false;
      unsubscribe();
    };
  }, []);

  return !teams || !teams.length || !showTeams ? (
    <></>
  ) : (
    <View style={styles.container}>
      <SafeAreaView>
        <ScrollView>
          <StatusBar></StatusBar>
          <Intro view="default" height={20} />
          <ActionBar />
          <View style={styles.contentContainer}>
            <Text style={{ ...styles.title, color: colors["brandGreen"] }}>
              {teamData.hello}! ✌️
            </Text>
            <Text style={styles.teamWelcome}>{teamData.teamWelcome}</Text>
            <View style={{ marginVertical: 20 }}>
              <RNPickerSelect
                onValueChange={onSelect}
                items={teams}
                placeholder={{ label: teamData.selectTeam, value: null }}
                selectedValue={selectedTeam}
                style={{ inputAndroid: { color: colors["text"] } }}
              />
            </View>
            {selectedTeam && (
              <View style={styles.selectedContainer}>
                {selectedTeam.logo ? (
                  <Logo selectedTeam={selectedTeam} />
                ) : (
                  <></>
                )}
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.subtitle}>{teamData.teamSelection}</Text>
                  <Text
                    style={{
                      ...styles.title,
                      fontSize: 20,
                      color: selectedTeam.primaryColor,
                    }}
                  >
                    {selectedTeam.name}
                  </Text>
                </View>
              </View>
            )}
            {selectedTeam && (
              <Button
                label={teamData.enter}
                width="100%"
                background="brandYellow"
                fontFamily="Raleway_900Black"
                fontSize={15}
                paddingTop={10}
                paddingBottom={10}
                borderRadius={30}
                loading={loading}
                onPress={enter}
              />
            )} 
            {!selectedTeam && <TouchableOpacity onPress={sendEmail}>
              <View style={{
                  paddingVertical: 10,
                  marginTop: 50,
                  borderRadius: 20,
                  borderWidth: 2,
                  borderColor: colors['brandGreen']
                }}>
                <Text style={{ color: colors['brandGreen'], textAlign: "center" }}>
                  ¿Quieres registrar tu equipo?,{"\n"}Contáctanos 👇❤️
                </Text>
              </View>
            </TouchableOpacity>}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const Logo = ({ selectedTeam }) => {
  return (
    <Image
      style={{ width: 60, height: 60, borderRadius: 50 }}
      source={{ uri: selectedTeam.logo }}
    />
  );
};

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 14,
    color: colors["text"],
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  contentContainer: {
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 30,
    color: colors["text"],
  },
  teamWelcome: {
    color: colors["text"],
    fontSize: 18,
  },
  selectedContainer: {
    paddingVertical: 20,
    flexDirection: "row",
  },
});

export default Teams;
