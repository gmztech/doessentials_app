import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform
} from "react-native";
import Modal from "react-native-modal";
import { useGlobalState } from "state-pool";
import gs from "../../assets/css/GeneralStyles";
import NumberFormat from "react-number-format";
import Feather from "react-native-vector-icons/Feather";
import colors from "../../assets/colors/colors";
import Button from "./Button";
import * as RNIap from 'react-native-iap';
Feather.loadFont();

const IAP_SKUS = Platform.select({
  ios: ['associate.13d.monthly'],
  android: ['com.13d.monthly'],
});

const PlanModal = ({
  associated,
  associateModal,
  toggleAssociatePurchase,
  plan,
}) => {
  const [purchased, setPurchased] = useState(associated);
  const [products, setProducts] = useState({});
  const [processing, setProcessing] = useState(false);
  const [siteData] = useGlobalState("siteData");
  const [generalData] = useState(siteData.general);

  const getProducts = async () => {
    try {
      const products = await RNIap.getProducts(IAP_SKUS);
      console.log(products)
    } catch(err) {
      console.warn(err);
    }
  }

  const initPurchases = async () => {
    try {
      await RNIap.initConnection();
      getProducts()
    } catch (error) {
      console.log('Purchase connection error: ', error);
    }
  }

  useEffect(() => {
    async function fetchData() {
      initPurchases();
    }
    fetchData();
    return () => {
      RNIap.endConnection();
    }
  }, []);

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
