import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import colors from "../../assets/colors/colors";
import { useGlobalState } from 'state-pool';
import ActionBar from "../common/ActionBar";
import Intro from "../common/Intro";
import Feather from "react-native-vector-icons/Feather";
import gs from "../../assets/css/GeneralStyles";
import SalesList from "./SalesList";
import NumberFormat from "react-number-format";
Feather.loadFont(); 

const MySales = ({ navigation, route }) => {
  let { sales: mySales } = route.params || {}; 
  const [sales,] = useState(mySales);
  const [siteData,] = useGlobalState('siteData');  
  const [salesData,] = useState(siteData.sales)
  const [totalSales,] = useState(sumSales(sales))

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <ScrollView>
          <StatusBar></StatusBar>
          <Intro view="default" height={30} />
          <ActionBar
            view="default"
            navigation={navigation}
            backColor={colors["text"]}
            backSize={30}
          />
          <View style={styles.content}>
            {/* title */}
            <View style={styles.textContainer}>
              <Text style={{...gs.title, fontWeight: 'bold'}}>{salesData.mySales} </Text>
            </View>
            {/* dessctiption */}
            <View>
              <Text style={styles.mySalesDescription}>
                {salesData.mySalesDescription}{" "}
              </Text>
              <Text style={{...gs.subtitle, marginBottom: 20}}>Total historico de ventas: {' '}
                <NumberFormat
                  value={totalSales}
                  displayType="text"
                  thousandSeparator={"."}
                  decimalSeparator={","}
                  prefix={"$ "}
                  renderText={(value, props) => (
                    <Text style={{ ...gs.subtitle, color: totalSales ? colors['brandGreen'] : colors['danger'] }}>{value} {totalSales ? '🤑' : '😟'}</Text>
                  )}
                />
                </Text> 
            </View>
            {/* Create sale */}
            <View style={styles.createContainer}>
              <TouchableOpacity
                style={styles.createButtonContainer}
                onPress={() => navigation.navigate("CreateSale", { create: true }) }>
                <Text style={styles.createText}>{salesData.createSale}</Text>
              </TouchableOpacity>
            </View>
            {/* sales card */}
            {sales.length ? <SalesList sales={sales} navigation={navigation} /> : <></>}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}; 

const sumSales = (sales) => {
  return sales.reduce((n, { price, nulled }) => n + (nulled ? 0 : price), 0);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  noResult: {
    color: colors["text"],
    textAlign: "center",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 30,
    paddingBottom: 70,
  },
  createContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    flexWrap: "wrap",
  },
  createButtonContainer: {
    backgroundColor: colors["brandGreen"],
    padding: 5,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
  },
  createText: {
    fontFamily: "Raleway_900Black",
    color: colors["white"],
    borderRadius: 20,
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 10,
    borderRadius: 10,
  },
  mySalesDescription: {
    color: colors["text"],
    fontFamily: "Raleway_500Medium",
    fontSize: 16,
    marginBottom: 20,
  },
});

export default MySales;
