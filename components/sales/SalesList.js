import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../../assets/colors/colors";
import gs from "../../assets/css/GeneralStyles";
import { useGlobalState } from "state-pool";
import moment from "moment";
moment().format();
import NumberFormat from "react-number-format";

const SalesList = ({ sales, navigation }) => {
  const [siteData] = useGlobalState("siteData");
  const [salesData] = useState(siteData.sales);
  sales = (sales || []).sort(
    (x, y) => new Date(y.date).getTime() - new Date(x.date).getTime()
  );
  const salesObj = populatePrices(sales);
  const salesSorted = Object.keys(salesObj);
  
  return (
    <>
      {sales.length ? (
        salesSorted.map((date, i) => (
          <View key={i} style={styles.monthContainer}>
            <Text style={{ ...gs.title, ...styles.month }}> {date} </Text>
            {salesObj[date].sales.map((sale, si) => (
              <TouchableOpacity
                key={si}
                onPress={() => navigation.navigate("CreateSale", { sale })}
              >
                <View style={{ ...gs.spaceBetween, ...styles.listItem }}>
                  <View>
                    <Text style={gs.subtitle}>{sale.title}</Text>
                    <Text style={{ ...gs.contentText, ...styles.clientName }}>
                      {salesData["client"]}: {sale.clientName}
                    </Text>
                    <Text style={{ ...gs.contentText, ...styles.clientName }}>
                      {salesData["date"]}: {formatDate(sale.date)}
                    </Text>
                  </View>
                  <NumberFormat
                    value={sale.price}
                    displayType="text"
                    thousandSeparator={"."}
                    decimalSeparator={","}
                    prefix={"$ "}
                    renderText={(value, props) => (
                      <Text
                        style={{
                          ...gs.contentText,
                          ...gs.bold,
                          textDecorationLine: sale.nulled
                            ? "line-through"
                            : "none",
                          color: sale.nulled
                            ? colors["danger"]
                            : colors["text"],
                        }}
                      >
                        {value}
                      </Text>
                    )}
                  />
                </View>
              </TouchableOpacity>
            ))}
            <Text> </Text>
            <NumberFormat
              value={salesObj[date].total}
              displayType="text"
              thousandSeparator={"."}
              decimalSeparator={","}
              prefix={"$ "}
              renderText={(value, props) => (
                <Text style={{ ...gs.title, ...styles.total }}>
                  {salesData.total}: {value}
                </Text>
              )}
            />
          </View>
        ))
      ) : (
        <Text style={gs.noResult}>{salesData.noSales}</Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  monthContainer: {
    marginBottom: 10,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e3e3e3",
  },
  month: {
    marginBottom: 10,
    color: colors["brandPurple"],
  },
  total: {
    textAlign: "right",
    fontSize: 15,
    color: colors["brandPurple"],
  },
  listItem: {
    borderBottomWidth: 0.2,
    paddingVertical: 10,
  },
  clientName: {
    fontFamily: "Raleway_500Medium",
    fontSize: 12,
    color: colors["text"],
  },
});

const extractDate = (date) => {
  date = date.split("T")[0].split("-").reverse();
  date.shift();
  return date.join("/");
};

const sumSales = (sales) => {
  return sales.reduce((n, { price, nulled }) => n + (nulled ? 0 : price), 0);
};
const formatDate = (date) => {
  return moment(date).format("DD-MM-YYYY");
};
const populatePrices = (sales) => { 
  const salesObj = {};
  sales.map((sale) => {
    if (!salesObj[extractDate(sale.date)]) {
      salesObj[extractDate(sale.date)] = { sales: [sale] }; 
      salesObj[extractDate(sale.date)].total = sumSales(
        salesObj[extractDate(sale.date)].sales
      );
    } else {
      salesObj[extractDate(sale.date)].sales.push(sale);
      salesObj[extractDate(sale.date)].total = sumSales(
        salesObj[extractDate(sale.date)].sales
      );
    }
  });
  return salesObj;
};

export default SalesList;
