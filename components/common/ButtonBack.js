import React from "react";
import colors from "../../assets/colors/colors";
import { TouchableOpacity } from "react-native";
import Feather from "react-native-vector-icons/Feather";
Feather.loadFont();

export const ButtonBack = ({ backColor, backSize, navigation }) => {
  return (
    <TouchableOpacity delayLongPress={500} onPress={()=> navigation.goBack() }>
      <Feather name="chevron-left" size={backSize || 20} color={backColor || colors["text"]} />
    </TouchableOpacity>
  );
};
