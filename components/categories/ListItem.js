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
            <View style={{ ...styles.firstLetter, backgroundColor: colors[color] || color }}>
              <Text style={styles.itemIcon}>
                {item.title.split("")[0]}
              </Text>
            </View>
            <Text style={{ ...styles.itemTitle, paddingTop: 1, textAlign: "center",  }}>{item.title}</Text>
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
      backgroundColor: colors["white"],
      borderRadius: 10,
      padding: 10,
      marginTop: 10,
      borderWidth: 1,
      borderColor: colors["lightGray"],
      overflow: 'hidden'
    },
    textContainer: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      flexWrap: "wrap",
      position: 'relative'
    },
    firstLetter: {
      borderRadius: 50, 
      width: 25,
      height: 25, 
      marginRight: 5
    },
    itemIcon: {
      color: colors["white"],
      textAlign: "center",
      paddingTop: 3
    },
    itemTitle: { 
      color: colors["text"],
    },
    noResult: {
      color: colors["text"],
      textAlign: "center",
      justifyContent: "center",
    },
    bullets: {
      color: colors["text"], 
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
      overflow: 'hidden'
    },
    actionButtonIcon: {
      marginRight: 10,
    },
})

export default Item;
