import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StatusBar,
  View,
  StyleSheet,
  ScrollView,
  Text,
  Alert,
} from "react-native";
import colors from "../../assets/colors/colors";
import { useGlobalState } from "state-pool";
import ActionBar from "../common/ActionBar";
import Button from "../common/Button";
import Intro from "../common/Intro";
import { StackActions } from "@react-navigation/native";
import gs from "../../assets/css/GeneralStyles";
import SalesList from "../sales/SalesList";
import firebase from "../../firebase/firebase";

const MemberDetail = ({ navigation, route }) => {
  const { member } = route.params;
  const [siteData] = useGlobalState("siteData");
  const [apData] = useState(siteData.associateProfile);
  const [deleting] = useState(false);
  const [sales, setSales] = useState([]);

  const deactivateAlert = () => {
    const alertMsg = member.disabled
      ? `Deseas activar a ${member.name}?`
      : `Deseas desactivar a ${member.name}?`;
    Alert.alert("Estatus de cliente", alertMsg, [
      { text: "Cancel", style: "cancel" },
      { text: "OK", onPress: () => memberStatus() },
    ]);
  };

  const memberStatus = async () => {
    const clientRef = firebase.firestore().collection("clients").doc(member.id);
    await clientRef.update({ disabled: member.disabled ? false : true });
    navigation.dispatch(
      StackActions.replace("AssociateProfile", { disabledUser: true })
    );
  };

  const getSales = async () => {
    let salesRef = firebase
      .firestore()
      .collection("sales")
      .where("createdBy", "==", member.id);
    salesRef = await salesRef.get();
    const newSales = salesRef.docs.map((s) => {
      return { ...s.data(), id: s.id };
    }); 
    setSales(newSales);
  }; 

  useEffect(() => {
    getSales();
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <ScrollView>
          <StatusBar />
          <Intro view="default" height={30} />
          <ActionBar
            view="default"
            navigation={navigation}
            backColor={colors["text"]}
            backSize={30}
          />
          <View style={styles.content}>
            <Text style={{ ...gs.title, marginVertical: 20 }}>
              {member.name} {member.lastName} {"\n"}
              <Text
                style={{
                  ...styles.role,
                  color: member.associated
                    ? colors["brandPurple"]
                    : colors["brandGreen"],
                }}
              >
                ({member.associated ? apData.associate : apData.client}){" "}
                {member.disabled ? (
                  <Text style={{ color: colors["danger"] }}>
                    ({apData.disabled})
                  </Text>
                ) : (
                  <></>
                )}
              </Text>
            </Text>
            <Text style={styles.memberField}>
              {apData.email}:{" "}
              <Text style={styles.memberValue}>{member.email}</Text>
            </Text>
            <Text style={styles.memberField}>
              {apData.phone}:{" "}
              <Text style={styles.memberValue}>{member.phone}</Text>
            </Text>
            {member.associated ? (
              <Text style={{ ...gs.title, marginVertical: 20 }}>
                {" "}
                {apData.sales}
              </Text>
            ) : (
              <></>
            )}
            {member.associated ? (
              <SalesList sales={sales} navigation={navigation} />
            ) : (
              <></>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
      {!member.associated && (
        <View style={gs.bottomButton}>
          <Button
            onPress={deactivateAlert}
            label={member.disabled ? apData.activate : apData.deactivate}
            width="100%"
            background="white"
            fontFamily="Raleway_900Black"
            color={member.disabled ? "brandGreen" : "danger"}
            fontSize={10}
            paddingTop={5}
            paddingBottom={5}
            borderRadius={30}
            loading={deleting}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    paddingHorizontal: 30,
    paddingBottom: 70,
  },
  role: {
    fontSize: 20,
    fontFamily: "Raleway_500Medium",
  },
  memberField: {
    fontFamily: "Raleway_900Black",
    color: colors["text"],
    fontSize: 16,
  },
  memberValue: {
    fontFamily: "Raleway_500Medium",
    color: colors["text"],
  },
});

export default MemberDetail;
