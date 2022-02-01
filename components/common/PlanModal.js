import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import Modal from "react-native-modal";
import { useGlobalState } from "state-pool";
import gs from "../../assets/css/GeneralStyles";
import NumberFormat from "react-number-format";
import Feather from "react-native-vector-icons/Feather";
import colors from "../../assets/colors/colors";
import Button from "./Button";
import Purchases from 'react-native-purchases';
import { helpers } from "../../services/helpers";
import { firebase } from "@react-native-firebase/firestore";
import Toast from "react-native-root-toast";

Feather.loadFont();

const PlanModal = ({
  associateModal,
  toggleAssociatePurchase
}) => { 
  const [loading, setLoading] = useState(false)
  const [siteData] = useGlobalState("siteData");
  const [client] = useGlobalState("client");
  const [plan] = useGlobalState("plan"); 
  const [generalData] = useState(siteData.general); 

  const purchase = async() => {
    try {
      setLoading(true)
      const { purchaserInfo } = await Purchases.purchaseProduct(helpers.premiumPlan);
      if(typeof purchaserInfo.entitlements.active[helpers.RC_ENTITLEMENT] === "undefined") { return; }
      let clientRef = firebase.firestore().collection('clients').doc(client.id)
      const newClient = { ...client, associated: true }
      await clientRef.update(newClient)
      showToaster('Suscripción creada con éxito')
      toggleAssociatePurchase(false)
      setLoading(false)
    } catch (error) {
      console.log(error);
      showToaster('Error creando la suscripción, comunicate con el administrador', true)
      setLoading(false)
    }
  } 

  return (
    <Modal isVisible={associateModal}>
      {/*  */}
      <View style={styles.associateModal}>
        {!loading && <TouchableOpacity style={styles.right}>
          <Feather
            onPress={() => toggleAssociatePurchase(false)}
            name="x"
            size={30}
            color={colors["danger"]}
          />
        </TouchableOpacity>}
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
            {formatParagraph(plan?.title)}
            {"\n"}
            <NumberFormat
              value={plan?.price}
              displayType="text"
              thousandSeparator={"."}
              decimalSeparator={","}
              prefix={"$ "}
              renderText={(value, props) => (
                <Text style={{ ...gs.bold, color: colors["brandGreen"] }}>
                  {plan?.price_string}
                </Text>
              )}
            />
            <Text style={{ ...gs.bold, color: colors["text"], fontSize: 15 }}>
              / {'mensual'}
            </Text>
          </Text>
          <View style={styles.right}>
            <Button
              label={loading ? 'Cargando...' : generalData["subscribeme"]}
              color="white"
              fontFamily="Raleway_900Black"
              fontSize={15}
              background="brandGreen"
              onPress={purchase}
            />
            <Text>{"\n"}</Text>
          </View>
          <Text style={{ ...gs.medium, color: colors["text"], fontSize: 18 }}>
            {formatParagraph(plan?.description)}
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );
};

const formatParagraph = (str='') => str.split("\\n").join("\n");

const showToaster = ({ msg, error }) => {
  Toast.show(msg, {
    duration: 5000,
    shadow: true,
    animation: true,
    hideOnPress: true,
    backgroundColor: error ? colors["danger"] : colors["brandGreen"],
    position: 10,
  });
};

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
