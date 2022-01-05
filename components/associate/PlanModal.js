import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform
} from "react-native";
// import * as InAppPurchases from 'expo-in-app-purchases';
import Modal from "react-native-modal";
import { useGlobalState } from "state-pool";
import gs from "../../assets/css/GeneralStyles";
import NumberFormat from "react-number-format";
import Feather from "react-native-vector-icons/Feather";
import colors from "../../assets/colors/colors";
import Button from "./Button";
Feather.loadFont(); 
// console.log(InAppPurchases);
const items = Platform.select({
  ios: [],
  android: ["me_10_1m"],
});

const PlanModal = ({
  associated,
  associateModal,
  toggleAssociatePurchase,
  plan,
}) => {
  const [purchased, setPurchased] = useState(associated);
  const [products, setProducts] = useState({});
  const [siteData] = useGlobalState("siteData");
  const [generalData] = useState(siteData.general);

  // const validate = async (receipt) => {
  //   try {
  //     // send receipt to backend
  //     const deliveryReceipt = await fetch("add your backend link here", {
  //       headers: { "Content-Type": "application/json" },
  //       method: "POST",
  //       body: JSON.stringify({ data: receipt }),
  //     }).then((res) => {
  //       res.json().then((r) => {
  //         // do different things based on response
  //         if (r.result.error == -1) {
  //           Alert.alert("Error", "There has been an error with your purchase");
  //         } else if (r.result.isActiveSubscription) {
  //           setPurchased(true);
  //         } else {
  //           Alert.alert("Expired", "your subscription has expired");
  //         }
  //       });
  //     });
  //   } catch (error) {
  //     Alert.alert("Error!", error.message);
  //   }
  // };

  // useEffect(() => { 
  //   IAP.initConnection()
  //     .catch(() => {
  //       console.log("error connecting to store...");
  //     })
  //     .then(() => {
  //       IAP.getSubscriptions(items)
  //         .catch(() => {
  //           console.log("error finding items");
  //         })
  //         .then((res) => {
  //           setProducts(res);
  //         });

  //       IAP.getPurchaseHistory()
  //         .catch(() => {})
  //         .then((res) => {
  //           try {
  //             const receipt = res[res.length - 1].transactionReceipt;
  //             if (receipt) {
  //               validate(receipt);
  //             }
  //           } catch (error) {}
  //         });
  //     });

  //   purchaseErrorSubscription = IAP.purchaseErrorListener((error) => {
  //     if (!(error["responseCode"] === "2")) {
  //       Alert.alert(
  //         "Error",
  //         "There has been an error with your purchase, error code" +
  //           error["code"]
  //       );
  //     }
  //   });
  //   purchaseUpdateSubscription = IAP.purchaseUpdatedListener((purchase) => {
  //     const receipt = purchase.transactionReceipt;
  //     if (receipt) {
  //       validate(receipt);
  //       IAP.finishTransaction(purchase, false);
  //     }
  //   });

  //   return () => {
  //     try {
  //       purchaseUpdateSubscription.remove();
  //     } catch (error) {}
  //     try {
  //       purchaseErrorSubscription.remove();
  //     } catch (error) {}
  //     try {
  //       IAP.endConnection();
  //     } catch (error) {}
  //   };
  // }, []);

  return (
    <Modal isVisible={associateModal}>
      {/*  */}
      <View style={styles.associateModal}>
        <TouchableOpacity style={styles.right}>
          <Feather
            onPress={() => toggleAssociatePurchase(false)}
            name="x"
            size={30}
            color={colors["danger"]}
          />
        </TouchableOpacity>
        <ScrollView>
          <Text style={{ ...gs.title, ...styles.planTitle }}>
            {[...Array(5).keys()].map((_, i) => (
              <Feather
                key={i}
                name="star"
                size={30}
                color={colors["brandYellow"]}
              />
            ))}
            {"\n"}
            {formatParagraph(plan.name)}
            {"\n"}
            <NumberFormat
              value={plan.price}
              displayType="text"
              thousandSeparator={"."}
              decimalSeparator={","}
              prefix={"$ "}
              renderText={(value, props) => (
                <Text style={{ ...gs.bold, color: colors["brandGreen"] }}>
                  {value}
                </Text>
              )}
            />
            <Text style={{ ...gs.bold, color: colors["text"], fontSize: 15 }}>
              / {plan.period}
            </Text>
          </Text>
          <View style={styles.right}>
            <Button
              label={generalData["subscribeme"]}
              color="white"
              fontFamily="Raleway_900Black"
              fontSize={15}
              background="brandGreen"
              onPress={() => alert("Subrscribe me")}
            />
            <Text>{"\n"}</Text>
          </View>
          <Text style={{ ...gs.medium, color: colors["text"], fontSize: 18 }}>
            {formatParagraph(plan.description)}
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );
};

const formatParagraph = (str) => str.split("\\n").join("\n");

const styles = StyleSheet.create({
  associateModal: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 30,
  },
  planTitle: {
    marginBottom: 20,
    color: colors["brandPurple"],
    fontSize: 30,
  },
  right: {
    alignItems: "flex-end",
  },
});

export default PlanModal;
