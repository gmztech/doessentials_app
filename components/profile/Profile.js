import React, { useState, useEffect } from "react";
import {
  Text,
  Image,
  StyleSheet,
  View,
  ScrollView,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  Keyboard
} from "react-native";
import Toast from "react-native-root-toast";
import firebase from "../../firebase/firebase";
import { useGlobalState } from "state-pool";
import { useIsFocused } from "@react-navigation/core";
import colors from "../../assets/colors/colors"; 
import ActionBar from "../common/ActionBar";
import Button from "../common/Button";
import Intro from "../common/Intro";
import MyLikes from "./MyLikes";
import MyProfile from "./MyProfile";
import NavigationTabs from "../common/NavigationTabs";
import gs from "../../assets/css/GeneralStyles";  
import MyPurchases from "./MyPurchases";
const Profile = ({ navigation, route }) => {

  const [user, setUser] = useGlobalState("client");
  const [siteData,] = useGlobalState('siteData');  
  const [team] = useGlobalState("clientTeam");
  const [loading, setLoading] = useState(false);
  const [profileData,] = useState(siteData.profile)
  const [gData,] = useState(siteData.general)
  const { firstime } = route.params || {};
  const isFocused = useIsFocused();

  const [selectedTab, setSelectedTab] = useState(
    firstime ? "my_profile" : "my_likes"
  );

  const setText = (currTab) => {
    return selectedTab === currTab ? "Raleway_900Black" : "Raleway_500Medium";
  };

  const saveUser = async (newUser = null) => {
    setLoading(true);
    Keyboard.dismiss()
    const userRef = firebase.firestore().collection("clients").doc(user.id);
    await userRef.update(newUser || user);
    showToaster({ msg: profileData['saved:succesfully'] })
    setLoading(false);
  }; 

  const setName = ()=>{
    const name = (`${user.name} ${user.lastName}` || '👤')
      .split(' ')
      .map(item => item.slice(0, 1))
      .join('').toUpperCase()
    return name
  }

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <ScrollView>
          <StatusBar></StatusBar>
          <Intro team={team} view="profile" height={35}
            backgroundColor={team && team.bgs && team.bgs['profile'] ? 'tranparent' : colors['text']}/>
          <ActionBar
            view="profile"
            navigation={navigation}
            backColor={colors["white"]}
            backSize={30}
          />
          <View style={styles.content}>
            <View style={styles.profileHeader}>
              <View style={ styles.nameContainer}>
                <Text style={ styles.nameText}>{ setName(user.name) }</Text>
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.name}>
                  {user.name} {user.lastName}
                </Text>
                <Text style={styles.contact}>
                  {" "}
                  {user.phone} {"\n"} {'carolhazun@gmail.com'}
                </Text>
              </View>
            </View>
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={{
                  ...styles.tabTitle,
                  ...setTabContainerStyle("my_likes", selectedTab),
                }}
                onPress={() => setSelectedTab("my_likes")}
              >
                <Text
                  style={{
                    ...styles.tabTitleText,
                    fontFamily: setText("my_likes"),
                  }}
                >
                  {profileData?.myLikesTabTitle}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  ...styles.tabTitle,
                  ...setTabContainerStyle("my_profile", selectedTab),
                }}
                onPress={() => setSelectedTab("my_profile")}
              >
                <Text
                  style={{
                    ...styles.tabTitleText,
                    fontFamily: setText("my_profile"),
                  }}
                >
                  {profileData.myprofileTabTitle}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  ...styles.tabTitle,
                  ...setTabContainerStyle("my_purchases", selectedTab),
                }}
                onPress={() => setSelectedTab("my_purchases")}
              >
                <Text
                  style={{
                    ...styles.tabTitleText,
                    fontFamily: setText("my_purchases"),
                  }}
                >
                  {profileData.mypurchasesTabTitle}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.tabContent}>
              {selectedTab === "my_likes" ? (
                <MyLikes
                  isFocused={isFocused}
                  user={user}
                  navigation={navigation}
                />
              ) : (
                <></>
              )}
              {selectedTab === "my_profile" ? (
                <MyProfile user={user} setUser={setUser} />
              ) : (
                <></>
              )}
              {selectedTab === "my_purchases" ? (
                <MyPurchases  navigation={navigation}/>
              ) : (
                <></>
              )} 
            </View>
          </View>
        </ScrollView>
        <NavigationTabs route={route} navigation={navigation} />
      </SafeAreaView>
      {selectedTab === "my_profile" ? (
        <View style={{ ...gs.bottomButton, marginBottom: 60 }}>
          <Button
            label={loading ? gData.loading : profileData.save}
            onPress={()=>saveUser()}
            width="100%"
            background="brandYellow"
            fontFamily="Raleway_900Black"
            fontSize={15}
            paddingTop={10}
            paddingBottom={10}
            borderRadius={30}
            loading={loading}
          />
        </View>
      ) : (
        <></>
      )}
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
    paddingBottom: 100,
  },
  profileImg: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    borderRadius: 500,
    borderWidth: 5,
    borderColor: colors["brandGreen"],
  },
  profileHeader: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 20,
  },
  name: {
    color: colors["white"],
    fontFamily: "Raleway_900Black",
    fontSize: 20,
  },
  contact: {
    color: colors["white"],
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "#ffffff",
    marginTop: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  tabTitle: {
    backgroundColor: "#ffffff",
    flexGrow: 1,
    paddingVertical: 10,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  tabTitleText: {
    textAlign: "center",
    color: colors["text"],
  },
  tabContent: {
    paddingVertical: 20,
    backgroundColor: colors["white"],
    paddingBottom: 100,
  },
  nameContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: colors['brandGreen'],
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50
  },
  nameText: {
    fontSize: 20,
    color: colors['text']
  }
}); 

const setTabContainerStyle = (currTab, selectedTab) => {
  return selectedTab === currTab
    ? {
        borderWidth: 2,
        borderColor: "transparent",
      }
    : {
        borderWidth: 1,
        borderColor: colors["lightGray"],
      };
};

const showToaster = ({ msg, error }) => {
  Toast.show(msg, {
    duration: 5000,
    shadow: true,
    animation: true,
    hideOnPress: true,
    backgroundColor: error ? colors["danger"] : colors["brandGreen"],
    position: 10,
  });
};

export default Profile;
