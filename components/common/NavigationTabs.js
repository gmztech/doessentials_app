import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import colors from "../../assets/colors/colors";
import Feather from "react-native-vector-icons/Feather";
Feather.loadFont();
import { Dimensions } from "react-native";
import { useGlobalState } from "state-pool";
const vw = (percent) => (Dimensions.get("window").width * percent) / 100;

const NavigationTabs = ({ route, navigation }) => {
  const { name: routeName } = route;
  const [user] = useGlobalState("client");
  const [siteData] = useGlobalState("siteData");
  const [generalData] = useState(siteData.general);
  const [buttons, setButtons] = useState(buildButtons(generalData)); 
  const [team,] = useGlobalState("clientTeam");
  const goTo = (comp) => { 
    comp !== route.name && navigation.navigate(comp);
  }

  useEffect(() => {
    filterButtons()
  }, [user]);

  const filterButtons = () => { 
    const filterButtons = buildButtons(generalData).filter(
      (b) => !(b.route === "AssociateProfile" && !user.associated)
    ); 
    setButtons(filterButtons);
  }

  return (
    <View style={styles.container}>
      {team && buttons.map((b, i) => { 
        const color = (i+1) % 2 == 1 ? team.primaryColor : team.secondColor;  
        return (
          <TouchableOpacity
            key={i}
            style={styles.button}
            onPress={() => goTo(b.route)}
          >
            <Feather
              name={b.icon}
              size={20}
              color={
                routeName === b.route ? color : colors["text"]
              }
            />
            <Text
              style={{
                ...styles.buttonText,
                color:
                  routeName === b.route ? color : colors["text"],
              }}
            >
              {b.name}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  );
};

const buildButtons = (generalData) => {
  const mainbuttons = [
    {
      name: generalData.home,
      route: "Home",
      activeColor: "brandYellow",
      icon: "home",
    },
    {
      name: generalData.associate,
      route: "AssociateProfile",
      activeColor: "brandPurple",
      icon: "command",
    },
    {
      name: generalData.profile,
      route: "Profile",
      activeColor: "brandGreen",
      icon: "user",
    },
  ];
  return mainbuttons
}

const styles = StyleSheet.create({
  container: {
    width: vw(100) - 40,
    marginHorizontal: 20,
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: colors["lightGray"],
    borderWidth: 0.5,
    elevation: 2,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    borderRadius: 30,
  },
  button: {
    padding: 10,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 15,
    color: colors["text"],
    fontFamily: "Raleway_900Black",
  },
});

export default NavigationTabs;
