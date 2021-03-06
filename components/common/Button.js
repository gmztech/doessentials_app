import React, { useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import colors from "../../assets/colors/colors";
import { useGlobalState } from 'state-pool';

const Button = ({
  label,
  onPress,
  background,
  color,
  width,
  fontSize,
  paddingTop,
  paddingBottom,
  borderRadius,
  loading,
  marginTop,
  marginBottom,
  borderWidth,
  borderColor
}) => {
  const [siteData,] = useGlobalState('siteData');   
  const [generalData,] = useState(siteData.general);
  return (
    <TouchableOpacity onPress={onPress} delayLongPress={500}>
      <View
        style={{
          ...styles.buttonContainer,
          backgroundColor: loading ? colors['text'] : colors[background] || background || "transparent",
          width,
          paddingTop: paddingTop || 2,
          paddingBottom: paddingBottom || 5,
          borderRadius: borderRadius || 10,
          marginTop,
          marginBottom,
          borderWidth,
          borderColor
        }}
      >
        {loading ? (
          <Text style={{
            ...styles.buttonText, 
            fontSize: fontSize || 11,
          }}>{ generalData.loading }</Text>
        ) : (
          <Text
            style={{
              ...styles.buttonText,
              color: colors[color] || "#ffffff", 
              fontSize: fontSize || 11,
            }}
          >
            {label}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    paddingHorizontal: 10,
    paddingTop: 2,
    paddingBottom: 5,
    marginRight: 5,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 11,
    textAlign: "center",
  },
});

export default Button;
