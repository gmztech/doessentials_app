import { StyleSheet } from "react-native";
import colors from "../colors/colors";

const GeneralStyles = StyleSheet.create({
  bold: { 
  },
  medium: { 
  },
  title: { 
    fontSize: 20,
    color: colors["text"]
  },
  subtitle: { 
    fontSize: 15,
    color: colors["text"]
  },
  contentText: {  
    fontSize: 15,
    color: colors["text"]
  },
  spaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  noResult: {
    color: colors["text"],
    textAlign: "center",
    justifyContent: "center",
  },
  input: {
    backgroundColor: colors["water"],
    color: colors['text'],
    height: 50,
    paddingHorizontal: 20,
    width: "100%",
    marginTop: 10,
    borderRadius: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 20
  },
  bottomButton: {
    position: "absolute",
    width: "100%",
    justifyContent: "center",
    paddingHorizontal: 30,
    bottom: 30,
  }
});

export default GeneralStyles;
