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
moment().format();
const minDate = new Date(new Date().getFullYear() - 1, 0, 1);
const maxDate = new Date();
const CreateSale = ({ route, navigation }) => {
  let { create, sale: mySale } = route.params;
  const [siteData] = useGlobalState("siteData");
  const [client] = useGlobalState("client");
  const [salesData] = useState(siteData.sales);
  const [loading, setLoading] = useState(false);
  const [sale, setSale] = useState(
    formaInitialtSale(mySale) || {
      clientId: client.id,
      clientName: "",
      date: new Date(),
      title: "",
      price: "",
      description: "",
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
              client.id === sale.clientId ? "createSale" : "saleDetail"
            }
          />
          {client.id !== sale.clientId ? <Text>{"\n"}</Text> : <></>}
          <View style={styles.content}>
            {client.id === sale.clientId && (
              <Text style={{ ...gs.contentText, marginVertical: 20 }}>
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
            <TextInput
              style={{
                ...gs.input,
                backgroundColor: create ? colors["water"] : colors["lightGray"],
              }}
              placeholderTextColor={colors["text"]}
              placeholder="Nombre de cliente *"
              value={sale.clientName}
              onChange={({ nativeEvent: { text: clientName } }) =>
                setSale({ ...sale, clientName })
              }
              editable={!!create}
            />
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
                  client.id === sale.clientId
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
              editable={client.id === sale.clientId}
            />
            {(!!!create && client.id === sale.clientId) && <ToggleSwitch
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
        {client.id === sale.clientId && (
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
  ["date", "clientName", "title", "price", "description"].some((model) => {
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
