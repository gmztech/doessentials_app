import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView
} from "react-native";
import Modal from "react-native-modal";
import { useGlobalState } from "state-pool";
import gs from "../../assets/css/GeneralStyles"; 
import firebase from "../../firebase/firebase";
import Feather from "react-native-vector-icons/Feather";
import colors from "../../assets/colors/colors"; 
import RNPickerSelect from "react-native-picker-select";
import Toast from "react-native-root-toast";
import Button from "../common/Button";
Feather.loadFont(); 

const AssignConsultModal = ({ 
  showAssignConsultModal,
  toggleShowAssignConsultModal,
  path
}) => { 
  const [siteData] = useGlobalState("siteData");
  const [client] = useGlobalState("client"); 
  const [generalData] = useState(siteData.general); 
  const [consults, setConsults] = useState([]) 
  const [clients, setClients] = useState([]) 
  const [assign, setAssign] = useState({})
  const [loading, setLoading] = useState(false);

  const getConsults = async(client, clientId) => {
    let consultsRef = await firebase.firestore()
      .collection("consults")
      .where("upliner", "==", client.id)
      .where("clientId", "==", clientId)
      .get()
    setConsults(consultsRef.docs.map(d=>d.data()).map((doc) => {
        return { value: doc.id, label: `${doc.name}`, key: doc.id };
      }))
  } 

  const getClients = async (client) => {
    let clients = await firebase.firestore()
      .collection('clients')
      .where("upliner.id", "==", client.id)
      .where("team.id", "==", client.team.id)
      .get()
    setClients(clients.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    })
      .map((doc) => {
        return { value: doc.id, label: `${doc.name} ${doc.lastName}`, key: doc.id };
      }))
  } 

  const onClientSelect = (value) => {
    setAssign({ ...assign, clientId: value })
    getConsults(client, value)
  };

  const onConsultSelect = (value) => {
    setAssign({ ...assign, consultId: value })
  }; 

  const assignSelection = async() => {
    try {
      setLoading(true)
      let consultsRef = await firebase.firestore()
        .collection("consults")
        .doc(assign.consultId)
      let consult = await consultsRef.get()
      consult = consult.data()
      setLoading(false)
      const assignation = JSON.stringify(path) 
      await consultsRef.update('recomendations', firebase.firestore.FieldValue.arrayUnion(JSON.parse(assignation)))
      await consultsRef.update('opened', false)
      showToaster({ 
          msg: generalData["consult:assigned"],
      });
      toggleShowAssignConsultModal()
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    async function fetchData() { getClients(client) }
    fetchData();
    return () => {
      
    }
  }, []);

  return (
    <Modal isVisible={showAssignConsultModal}>
      {/*  */}
      <View style={styles.showAssignConsultModal}>
        <SafeAreaView>
            <TouchableOpacity style={styles.right}>
            <Feather
                onPress={() => toggleShowAssignConsultModal(false)}
                name="x"
                size={30}
                color={colors["danger"]}
            />
            </TouchableOpacity>
            <ScrollView>  
                <Text style={{ color: colors['brandPurple'], fontSize: 20, fontWeight: 'bold' }}>
                    {generalData.assignLabel}
                </Text>
                <Text style={{ color: colors['text'], fontSize: 15}}>
                    {generalData.assignDescription}
                </Text>
                <View style={{
                ...gs.input,
                paddingHorizontal: 0,
                backgroundColor: colors["water"]
                }}>
                <RNPickerSelect
                    onValueChange={onClientSelect}
                    items={clients}
                    placeholder={{ label: generalData.selectClient, value: null }}
                    selectedValue={assign.consultId}
                    style={{ inputAndroid: { color: colors["text"] } }}
                />
                </View>
                {assign.clientId && <View style={{
                ...gs.input,
                paddingHorizontal: 0,
                backgroundColor: colors["water"]
                }}>
                <RNPickerSelect
                    onValueChange={onConsultSelect}
                    items={consults}
                    placeholder={{ label: generalData.selectConsult, value: null }}
                    selectedValue={assign.clientId}
                    style={{ inputAndroid: { color: colors["text"] } }}
                />
                </View>}
            </ScrollView>
        </SafeAreaView>
        <View style={gs.bottomButton}>
            {assign.clientId && assign.consultId && (
            <Button
                onPress={assignSelection}
                label={generalData.assignSelection}
                width="100%"
                background="brandYellow"
                fontFamily="Raleway_900Black"
                fontSize={15}
                paddingTop={10}
                paddingBottom={10}
                borderRadius={30}
                loading={loading}
            />
            )}
        </View>
      </View>
    </Modal>
  );
};

const showToaster = ({ msg, error }) => {
    Toast.show(msg, {
      duration: 3000,
      shadow: true,
      animation: true,
      hideOnPress: true,
      backgroundColor: error ? colors["danger"] : colors["brandGreen"],
      position: 10,
      onHidden: () => {
        if (error) { return; }
      },
    });
  };

const styles = StyleSheet.create({
  showAssignConsultModal: {
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

export default AssignConsultModal;
