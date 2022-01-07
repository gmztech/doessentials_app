import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  Alert,
  Linking,
  Button as RNbutton
} from "react-native";
import Intro from "../common/Intro";
import ActionBar from "../common/ActionBar";
import colors from "../../assets/colors/colors";
import Button from "../common/Button";
import Toast from "react-native-root-toast";
import gs from "../../assets/css/GeneralStyles";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import { useGlobalState } from "state-pool";
import firebase from "../../firebase/firebase";
import ToggleSwitch from "toggle-switch-react-native";
import RNPickerSelect from "react-native-picker-select";
moment().format();
const minDate = new Date(new Date().getFullYear() - 1, 0, 1);
const maxDate = new Date();
const CreateSale = ({ route, navigation }) => {
  let { create, sale: mySale, boughtBy } = route.params;
  const [siteData] = useGlobalState("siteData");
  const [client] = useGlobalState("client");
  const [salesData] = useState(siteData.sales);
  const [clients, setClients] = useState([]);
  const [buyer, setBuyer] = useState(boughtBy, null); 
  const [loading, setLoading] = useState(false);
  const [sale, setSale] = useState(
    formaInitialtSale(mySale) || {
      createdBy: client.id,
      date: new Date(),
      title: "",
      price: "",
      description: "",
      clientId: ""
    }
  );
  const [dateOpen, setDateOpen] = useState(false);

  const onDateChange = (event, selectedDate) => {
    setDateOpen(Platform.OS === "ios");
    if (!selectedDate) {
      return;
    }
    setSale({ ...sale, date: selectedDate });
  };

  const validateSale = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    if (formError(sale)) {
      setLoading(false);
      return showToaster({
        error: true,
        msg: salesData["mandatory:fields"],
      });
    }
    Alert.alert(
      salesData["register:sale"],
      salesData["confirm:sale:creation"],
      [
        { text: "Cancel", style: "cancel", onPress: () => setLoading(false) },
        { text: "OK", onPress: () => createSale() },
      ]
    );
  };

  const getClients = async () => {
    let clients = await firebase.firestore()
      .collection('clients')
      .where("upliner.id", "==", client.id)
      .where("team.id", "==", client.team.id)
      .get()
    setClients(clients.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    })
    .map((doc) => {
      return { value: doc.id, label: `${ doc.name } ${ doc.lastName }`, key: doc.id };
    }))
    setSale(sale)
  }

  const getBuyer = async () => {
    let buyer = await firebase.firestore()
      .collection('clients')
      .doc(sale.clientId)
      .get()
    if(!buyer.exists) { return; }
    setBuyer(buyer.data())
  }

  const createSale = async () => {
    setLoading(true);
    const newSale = formatLeavingSale(sale);
    let salesRef = firebase.firestore().collection("sales").doc();
    salesRef = await salesRef.set(newSale);
    showToaster({
      msg: salesData["registered:sale"],
      navigation,
      sale: formatLeavingSale(sale),
    });
  };

  const updateSale = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    if (formError(sale)) {
      setLoading(false);
      return showToaster({
        error: true,
        msg: salesData["mandatory:fields"],
      });
    }
    const newSale = formatLeavingSale(sale);
    let salesRef = firebase.firestore().collection("sales").doc(sale.id);
    salesRef = await salesRef.update({ description: newSale.description });
    showToaster({
      msg: salesData["saving:sale"],
      navigation,
    });
  };

  const saveNulled = (value) => {
    setLoading(true);
    Alert.alert(
      salesData["update:sale"],
      salesData["confirm:sale:update"],
      [
        { text: "Cancel", style: "cancel", onPress: () => setLoading(false) },
        { text: "OK", onPress: async() => {
          setSale({...sale, nulled: value})
          let salesRef = firebase.firestore().collection("sales").doc(sale.id);
          salesRef = await salesRef.update({ nulled: value });
          showToaster({
            msg: salesData["saving:sale"],
            navigation,
          });
        }},
      ]
    );
  } 

  const onSelectClient = (value) => {
    setSale({...sale, clientId: value})
  };

  useEffect(()=> {
    getClients()
    getBuyer()
    return 
  }, [])

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <ScrollView>
          <StatusBar />
          <Intro view="default" height={30} />
          <ActionBar
            view={loading ? "" : "creating"}
            navigation={navigation}
            backColor={colors["text"]}
            backSize={30}
            labelProp={
              client.id === sale.createdBy ? "createSale" : "saleDetail"
            }
          />
          {client.id !== sale.createdBy ? <Text>{"\n"}</Text> : <></>}
          { !create && <View style={{ paddingHorizontal: 30, marginVertical: 20 }}>
            <Text style={{ fontSize: 15 }}>{salesData.client}: </Text>
            <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 10 }}>{buyer ? buyer.name : 'Not'} {buyer ? buyer.lastName : 'Found'} </Text>
            {client.id !== buyer.id && <RNbutton onPress={() => Linking.openURL('mailto:'+buyer.email) } title={buyer.email} />}
          </View>}
          <View style={styles.content}>
            {client.id === sale.createdBy && (
              <Text style={{ ...gs.contentText, marginVertical: 10 }}>
                {create
                  ? salesData.createSaleDescription
                  : salesData.editSaleDescription}
              </Text>
            )}
            <View pointerEvents={create ? "auto" : "none"}>
              <Text
                style={{
                  ...styles.dateInput,
                  backgroundColor: create
                    ? colors["water"]
                    : colors["lightGray"],
                }}
                onPress={() => setDateOpen(true)}
              >
                {sale.date
                  ? `${salesData.saleDate}:`
                  : `${salesData.selectDate}:`}{" "}
                {sale.date && <Text>{formatDate(sale.date)}</Text>}
              </Text>
            </View>
            {dateOpen && (
              <RNDateTimePicker  
                minimumDate={minDate}
                maximumDate={maxDate}
                testID="dateTimePicker"
                value={!!sale.date ? new Date(sale.date) : new Date()}
                mode="date"
                is24Hour={true}
                locale="es-ES"
                onChange={onDateChange}
                editable={!!create} 
              />
            )}
            {create && <View style={{
                ...gs.input,
                paddingHorizontal: 0,
                backgroundColor: !!create ? colors["water"] : colors["lightGray"]
              }}>
              <RNPickerSelect
                onValueChange={onSelectClient}
                items={clients}
                placeholder={{ label: salesData.selectClient, value: null }}
                selectedValue={sale.clientId}
                style={{ inputAndroid: { color: colors["text"] } }}
              />
            </View>}
            <TextInput
              style={{
                ...gs.input,
                backgroundColor: create ? colors["water"] : colors["lightGray"],
              }}
              placeholderTextColor={colors["text"]}
              placeholder="Titulo de venta*"
              value={sale.title}
              onChange={({ nativeEvent: { text: title } }) =>
                setSale({ ...sale, title })
              }
              editable={!!create}
            />
            <TextInput
              style={{
                ...gs.input,
                backgroundColor: create ? colors["water"] : colors["lightGray"],
              }}
              placeholderTextColor={colors["text"]}
              placeholder="Precio total de la venta ($)*"
              keyboardType="number-pad"
              value={sale.price}
              onChange={({ nativeEvent: { text: price } }) =>
                setSale({ ...sale, price })
              }
              contextMenuHidden={true}
              editable={!!create}
            />
            <TextInput
              style={{
                ...gs.input,
                ...gs.textArea,
                backgroundColor:
                  client.id === sale.createdBy
                    ? colors["water"]
                    : colors["lightGray"],
              }}
              multiline={true}
              numberOfLines={10}
              placeholderTextColor={colors["text"]}
              placeholder="Descriptión *"
              value={sale.description}
              onChange={({ nativeEvent: { text: description } }) =>
                setSale({ ...sale, description })
              }
              editable={client.id === sale.createdBy}
            />
            {(!!!create && client.id === sale.createdBy) && <ToggleSwitch
              isOn={sale.nulled}
              onColor={colors['danger']}
              offColor={colors['brandGreen']}
              label={ sale.nulled ? 'Venta anulada' : 'Venta habilitada' }
              labelStyle={{...gs.subtitle, marginVertical: 20}}
              size="small"
              onToggle={saveNulled}
            />}
          </View>
        </ScrollView>
      </SafeAreaView>
      <View style={gs.bottomButton}>
        {client.id === sale.createdBy && (
          <Button
            onPress={create ? validateSale : updateSale}
            label={create ? salesData.register : salesData.saveSale}
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
  );
};

const formError = (sale) =>
  ["date", "clientId", "title", "price", "description"].some((model) => {
    return !sale[model] || !String(sale[model]).length;
  });

const formatDate = (date) => {
  return moment(date).format("DD-MM-YYYY");
};

const formaInitialtSale = (sale) => {
  if (!sale) {
    return null;
  }
  return {
    ...sale,
    price: String(sale.price),
    date: new Date(sale.date),
  };
};

const formatLeavingSale = (sale) => {
  return {
    ...sale,
    price: Number(sale.price),
    date: sale.date.toISOString(),
  };
};

const showToaster = ({ msg, navigation, error }) => {
  Toast.show(msg, {
    duration: 3000,
    shadow: true,
    animation: true,
    hideOnPress: true,
    backgroundColor: error ? colors["danger"] : colors["brandGreen"],
    position: 10,
    onHidden: () => {
      if (error) {
        return;
      }
      navigation.navigate("AssociateProfile", { refreshSales: true });
    },
  });
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    paddingHorizontal: 30,
    paddingBottom: 100,
  },
  bottom: {
    position: "absolute",
    width: "100%",
    justifyContent: "center",
    paddingHorizontal: 30,
    bottom: 30,
  },
  dateInput: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderStyle: "dotted",
    borderColor: "#e3e3e3",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: colors["water"],
    color: colors["text"],
  },
});

export default CreateSale;
