import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import colors from "../../assets/colors/colors";
import { useGlobalState } from "state-pool";
import Button from "./Button";
import firebase from "../../firebase/firebase";
import { ButtonBack } from "./ButtonBack"; 
import PlanModal from "./PlanModal";
import { helpers } from "../../services/helpers";
const ActionBar = ({
  view,
  upliner,
  backColor,
  backSize,
  navigation,
  labelProp,
}) => {
  const [siteData] = useGlobalState("siteData");
  const [generalData] = useState(siteData.general);
  const [plans] = useGlobalState("plans");
  const [plan] = useState((plans|| []).find(plan => plan.type === helpers.premiumPlan));
  const [user] = useGlobalState("client");
  const [associateModal, setAssociateModal] = useState(false);
  const borderBottomWidth = view && view.indexOf("associate") > -1 ? 0.5 : 0; 
  const toggleAssociatePurchase = (bool) => { 
    setAssociateModal(bool);
  };

  return (
    <View style={{ ...styles.container, borderBottomWidth }}>
      {buttonStrategy[view] ? (
        buttonStrategy[view]({
          upliner,
          backColor,
          generalData,
          backSize,
          navigation,
          labelProp,
          user,
          toggleAssociatePurchase,
        })
      ) : (
        <></>
      )}
      {associateModal && <PlanModal
        associated={user.associated}
        plan={plan}
        associateModal={associateModal}
        toggleAssociatePurchase={toggleAssociatePurchase}/>}
    </View>
  );
}; 

const styles = StyleSheet.create({
  container: {
    height: 50,
    paddingHorizontal: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "#e3e3e3",
  },
  createClient: {
    fontFamily: "Raleway_900Black",
    color: colors["text"],
  }
});

// When screen "home associate"
const associateLabel = (name, generalData) => (
  <Text style={{ fontSize: 14 }}>
    {generalData.upliner}:{" "}
    <Text style={{ fontFamily: "Raleway_400Regular" }}> {name}</Text>{" "}
  </Text>
);

// Buttons depending on view
const buttonStrategy = {
  home: ({ generalData, user, toggleAssociatePurchase }) => (
    <>
      <View></View>
      {!user.associated && (
        <View style={{ flexDirection: "row" }}>
          <Button
            fontSize={15}
            label={generalData.beAssociate}
            background="brandPurple"
            onPress={() => toggleAssociatePurchase(true)}
          />
        </View>
      )}
    </>
  ),
  associateProfile: ({ upliner, navigation, backSize, generalData }) => (
    <>
      <View>
        <ButtonBack navigation={navigation} backSize={backSize} />
      </View>
      <View style={{ flexDirection: "row" }}>
        <Button
          label={associateLabel(upliner.name, generalData)}
          color="brandPurple"
          fontFamily="Raleway_900Black"
        />
      </View>
    </>
  ),
  creating: ({ backSize, navigation, labelProp, generalData }) => (
    <>
      <View>
        <ButtonBack navigation={navigation} backSize={backSize} />
      </View>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.createClient}>{generalData[labelProp]}</Text>
      </View>
    </>
  ),
  default: ({ backColor, backSize, navigation }) => (
    <>
      <View>
        <ButtonBack
          navigation={navigation}
          backColor={backColor}
          backSize={backSize}
        />
      </View>
    </>
  ),
  profile: ({ backColor, backSize, navigation, generalData }) => (
    <>
      <View>
        <ButtonBack
          navigation={navigation}
          backColor={backColor}
          backSize={backSize}
        />
      </View>
      <View style={{ flexDirection: "row" }}>
        <Button
          label={generalData["logout"]}
          color="danger"
          fontFamily="Raleway_900Black"
          onPress={() => logout(generalData)}
        />
      </View>
    </>
  ),
};

const logout = (generalData) => {
  Alert.alert(generalData["logout"], generalData["confirm:logout"], [
    { text: "Cancel", style: "cancel", onPress: () => setLoading(false) },
    { text: "OK", onPress: () => firebase.auth().signOut() },
  ]);
};

export default ActionBar;
