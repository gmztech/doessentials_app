import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import colors from "../../assets/colors/colors";
import { useGlobalState } from "state-pool";

const CategorySlider = ({ category, navigation }) => {
  const [team] = useGlobalState("clientTeam");
  return (
    <View style={{ marginTop: 30 }}>
      <View>
        <Text selectable style={styles.categoryLabel}>
          {category?.title}
        </Text>
      </View>
      <View
        style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center" }}
      >
        {(category.items || []).map((item, i) => (
          <CategoryItem
            index={i}
            key={i}
            category={category}
            navigation={navigation}
            item={item}
            team={team}
          />
        ))}
      </View>
    </View>
  );
};

const CategoryItem = ({ index, category, navigation, item, team }) => {
  const color = (index + 1) % 2 == 1 ? team.primaryColor : team.secondColor;
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("EssentialOil", { mainCategory: category, item })
      }
    >
      <View
        style={{
          ...styles.categoryContainer,
          backgroundColor: !!category.brandColors ? color : item.color,
        }}
      >
        <Text style={styles.categoryTitle}>{item.title}</Text>
        {item.icon ? (
          <Image
            style={styles.categoryIcon}
            source={categoryIcons[item.icon]}
          />
        ) : (
          <></>
        )}
      </View>
    </TouchableOpacity>
  );
};

const categoryIcons = {
  aceites_individuales: require(`../../assets/images/categories/aceites_individuales.png`),
  bienestar: require(`../../assets/images/categories/bienestar.png`),
  cuidado_personal: require(`../../assets/images/categories/cuidado_personal.png`),
  mezcla_aceites: require(`../../assets/images/categories/mezcla_aceites.png`),
};

const styles = StyleSheet.create({
  categoryLabel: {
    fontSize: 25,
    color: colors["text"],
    marginBottom: 10,
    fontWeight: 'bold'
  },
  categoryContainer: {
    flexDirection: "row",
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
    marginTop: 10,
    alignItems: "baseline",
  },
  categoryTitle: {
    color: colors["white"], 
    fontSize: 20,
    marginRight: 10,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
});

export default CategorySlider;
