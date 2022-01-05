import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import colors from "../../assets/colors/colors";
import Feather from "react-native-vector-icons/Feather"; 
Feather.loadFont();

const Item = ({ item, navigation, color, mainCategory, subcategory, goTo = 'EssentialOilDetail' }) => {
  item = item || subcategory
  color = color || item.color
  goTo = goTo 
  return (
    <View>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(goTo, {
            item: { ...item, color },
            mainCategory,
            subcategory,
          })
        }
        style={{ backgroundColor: "#ffffff" }}
      >
        <View style={styles.itemCard}>
          <View style={styles.textContainer}>
            <Text
              style={{
                ...styles.firstLetter,
                backgroundColor: colors[color] || color,
              }}
            >
              {item.title.split("")[0]}
            </Text>
            <Text style={{ ...styles.itemTitle }}>{item.title}</Text>
          </View>
          <Feather name="chevron-right" size={20} color={colors["lightGray"]} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({  
    itemCard: {
      flexDirection: "row", 
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: colors["white"],
      borderRadius: 10,
      padding: 10,
      marginTop: 10,
      borderWidth: 1,
      borderColor: colors["lightGray"],
    },
    textContainer: {
      flexDirection: "row",
      justifyContent: "flex-start",
      flexWrap: "wrap",
    },
    firstLetter: {
      borderRadius: 50,
      color: colors["white"],
      width: 25,
      height: 25,
      paddingTop: 1,
      textAlign: "center",
      fontFamily: "Raleway_900Black",
      marginRight: 5,
    },
    itemTitle: {
      fontFamily: "Raleway_900Black",
      color: colors["text"],
    },
    noResult: {
      color: colors["text"],
      textAlign: "center",
      justifyContent: "center",
    },
    bullets: {
      color: colors["text"],
      fontFamily: "Raleway_500Medium",
      fontSize: 15,
      marginTop: 10,
    },
    actionContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
      paddingVertical: 20,
      flexWrap: "wrap",
    },
    actionButtons: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      borderRadius: 10,
      marginRight: 10,
    },
    actionButtonIcon: {
      marginRight: 10,
    },
})

export default Item;
