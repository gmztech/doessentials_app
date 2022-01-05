import React from "react";
import { View, StyleSheet, Image, ImageBackground } from "react-native";
import colors from "../../assets/colors/colors";

import { Dimensions } from "react-native";
const vh = (percent) => (Dimensions.get("window").height * percent) / 100;
const vw = (percent) => (Dimensions.get("window").width * percent) / 100;

const Intro = ({ backgroundColor, view = "default", height = 30 }) => {
  const logo =
    view === "default" ? (
      <></>
    ) : (
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
      ></Image>
    );
  return (
    <View
      style={{
        ...styles.intro,
        backgroundColor:
          colors[backgroundColor] || backgroundColor || "#ffffff",
        height: vh(height),
      }}
    >
      <ImageBackground
        source={bgImgStrategy[view] && bgImgStrategy[view]["intro"]}
        style={styles.bg}
      >
        {view === "login" && logo} 
        <View style={styles.introCurve}>
          <ImageBackground
            source={bgImgStrategy[view] && bgImgStrategy[view]["curve"]}
            style={{ ...styles.bg, backgroundColor: "transparent" }}
          />
        </View>
      </ImageBackground>
    </View>
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
    bottom: 0,
    left: 0,
    height: 135,
    width: "100%",
  },
  bg: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: "cover",
  },
  logo: {
    resizeMode: "contain",
    position: "absolute",
    top: 50,
    left: 30,
    width: vw(25),
    height: 50,
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
