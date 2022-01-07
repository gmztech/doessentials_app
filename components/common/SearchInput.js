import React from "react";

import { View, TextInput, StyleSheet } from "react-native";
import colors from "../../assets/colors/colors";
import Feather from "react-native-vector-icons/Feather"; 
Feather.loadFont();

const SearchInput = ({ onChange }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={{...styles.searchInput}}
        placeholderTextColor={colors["text"]}
        placeholder="Introduce una búsqueda"
        onChange={ e => onChange(e.nativeEvent.text) }
      />
      <Feather
        style={styles.searchIcon}
        name="search"
        size={20}
        color={colors["text"]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    elevation: 2,
    backgroundColor: colors["white"],
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    borderRadius: 30,
    paddingLeft: 40,
    marginVertical: 20,
  }, 
  searchIcon: {
    position: "absolute",
    top: 15,
    left: 10,
  },
  searchInput: {
    color: colors['text']
  }
});

export default SearchInput;
