import React from "react";
import { View, StyleSheet, Image, ImageBackground, Platform } from "react-native";
import colors from "../../assets/colors/colors";
import { useGlobalState } from "state-pool";

import { Dimensions } from "react-native";
const vh = (percent) => (Dimensions.get("window").height * percent) / 100;
const vw = (percent) => (Dimensions.get("window").width * percent) / 100;

const ps = Platform.select({
  ios: {
    introCurve: {
      bottom: -3
    }
  },
  android: {
    introCurve: {
      bottom: 0
    }
  }
});

const Intro = ({ backgroundColor, view = "default", height = 30 }) => { 
  const [team] = useGlobalState("clientTeam"); 
  const logo =
    view === "default" ? (
      <></>
    ) : (
      <View style={{ width: "100%", alignItems: "center" }}>
        <Image
          source={{ uri: team?.logo }}
          style={{ ...styles.logo, borderRadius: 500 }}
        ></Image>
      </View>
    );
  return (
    <>
      {team ? (
        <View
          style={{
            ...styles.intro,
            backgroundColor: colors[backgroundColor] || backgroundColor || "#ffffff",
            height: vh(height),
          }}
        >
          <ImageBackground source={{ uri: team.bgs[view] }} style={styles.bg}>
            {view === "login" && logo}
            <View style={{...styles.introCurve, ...ps.introCurve}}>
              <ImageBackground
                source={bgImgStrategy[view] && bgImgStrategy[view]["curve"]}
                style={{ ...styles.bg, backgroundColor: "transparent" }}
              />
            </View>
          </ImageBackground>
        </View>
      ) : (
        <></>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  intro: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
  },
  introCurve: {
    position: "absolute", 
    left: 0,
    height: 135,
    width: "100%",
  },
  bg: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: "cover"
  },
  logo: {
    resizeMode: "contain",
    width: vw(30),
    height: vh(30),
  },
});

const bgImgStrategy = {
  login: {
    intro: require("../../assets/images/login-bg.jpg"),
    curve: require("../../assets/images/intro-curve.png"),
  },
  home: {
    intro: require("../../assets/images/home-bg.jpg"),
    curve: require("../../assets/images/intro-curve.png"),
  },
  default: {
    intro: require("../../assets/images/transparent.png"),
    curve: require("../../assets/images/intro-curve-transparent.png"),
  },
  essentialOil: {
    intro: require("../../assets/images/transparent.png"),
    curve: require("../../assets/images/intro-curve.png"),
  },
  profile: {
    intro: require("../../assets/images/profile-bg.jpg"),
    curve: require("../../assets/images/intro-curve.png"),
  },
};
export default Intro;
