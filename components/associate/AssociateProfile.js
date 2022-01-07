import React, { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useIsFocused } from "@react-navigation/core";
import colors from "../../assets/colors/colors";
import { useGlobalState } from "state-pool";
import ActionBar from "../common/ActionBar";
import Intro from "../common/Intro";
import Feather from "react-native-vector-icons/Feather";
import NavigationTabs from "../common/NavigationTabs";
import firebase from "../../firebase/firebase";
import NumberFormat from "react-number-format";
Feather.loadFont();

const AssociateProfile = ({ navigation, route }) => {
  const isFocused = useIsFocused();
  let { createdUser, disabledUser, refreshSales } = route.params || {};
  const [siteData] = useGlobalState("siteData");
  const [apData] = useState(siteData.associateProfile);
  const [client] = useGlobalState("client");
  const [team, setTeam] = useState([]);
  const [sales, setSales] = useState([]);

  useEffect(() => {
    getTeam();
    getSales();
    if (createdUser || disabledUser) {
      getTeam();
    }
    if (refreshSales) {
      getSales();
    }
  }, [isFocused]);

  const getTeam = async () => {
    let clientRef = firebase
      .firestore()
      .collection("clients")
      .where("upliner.id", "==", client.id);
    clientRef = await clientRef.get();
    const newTeam = clientRef.docs.map((c) => {
      return { ...c.data(), id: c.id };
    });
    setTeam(newTeam);
  };

  const getSales = async () => {
    let salesRef = firebase
      .firestore()
      .collection("sales")
      .where("createdBy", "==", client.id);
    salesRef = await salesRef.get();
    const newSales = salesRef.docs.map((s) => {
      return { ...s.data(), id: s.id };
    });
    setSales(newSales);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <ScrollView>
          <StatusBar></StatusBar>
          <Intro view="default" height={30} />
          <ActionBar
            view="associateProfile"
            navigation={navigation}
            backColor={colors["text"]}
            backSize={30}
            upliner={client.upliner}
          />
          <View style={styles.content}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>
                {apData.hello}{" "}
                <Text style={{ color: colors["brandPurple"] }}>
                  {user.name}
                </Text>{" "}
                {apData.welcome}
              </Text>
            </View>
            {/* team card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardHeaderTitle}>
                  {apData.myTeam} ({team.length})
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("MyTeam", { team })}
                >
                  <Text style={styles.cardHeaderButton}>{apData.seeAll}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.cardContent}>
                {team.length ? (
                  team
                    .slice(0, 4)
                    .map((member, i) => (
                      <Member
                        key={i}
                        navigation={navigation}
                        member={member}
                        team={team}
                        apData={apData}
                      />
                    ))
                ) : (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("CreateClient", { create: true })
                    }
                  >
                    <Text
                      style={{
                        ...styles.noResult,
                        color: colors["brandGreen"],
                      }}
                    >
                      {apData.noTeamAvailable}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            {/* sales card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardHeaderTitle}>
                  {apData.mySales} ({sales.length})
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("MySales", { sales })}
                >
                  <Text style={styles.cardHeaderButton}>
                    {apData.goToSales}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.cardContent}>
                {sales.length ? (
                  sales
                    .slice(0, 4)
                    .map((sale, i) => (
                      <Sale key={i} navigation={navigation} sale={sale} />
                    ))
                ) : (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("CreateSale", { create: true })
                    }
                  >
                    <Text
                      style={{
                        ...styles.noResult,
                        color: colors["brandGreen"],
                      }}
                    >
                      {apData.noSaleAvailable}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
        <NavigationTabs route={route} navigation={navigation} />
      </SafeAreaView>
    </View>
  );
};

const Member = ({ navigation, member, team, apData }) => {
  return (
    <TouchableOpacity
      style={styles.memberContainer}
      onPress={() => navigation.navigate("MemberDetail", { member, team })}
    >
      <Text style={{ ...styles.saleName, color: colors["text"], 
            textDecorationLine: !member.disabled
              ? "none"
              : "line-through",
              
            color: !member.disabled
            ? colors["text"]
            : colors["danger"] }}>
        {member.name} {member.lastName}{" "}
        <Text
          style={{
            ...styles.saleName,
            color: member.associated
              ? colors["brandPurple"]
              : colors["brandGreen"]
          }}
        >
          ({member.associated ? apData.associate : apData.client}){" "}
        </Text>
      </Text>
      <Feather name="chevron-right" size={20} color={colors["lightGray"]} />
    </TouchableOpacity>
  );
};

const Sale = ({ navigation, sale }) => {
  return (
    <TouchableOpacity
      style={styles.memberContainer}
      onPress={() => navigation.navigate("CreateSale", { sale })}
    >
      <Text style={{ ...styles.saleName, color: colors["text"] }}>
        {sale.title}
      </Text>
      <View style={styles.salesPrice}>
        <NumberFormat
          value={sale.price}
          displayType="text"
          thousandSeparator={"."}
          decimalSeparator={","}
          prefix={"$ "}
          renderText={(value, props) => (
            <Text
              style={{
                ...styles.saleName,
                textDecorationLine: sale.nulled ? "line-through" : "none",
                color: sale.nulled ? colors['danger'] : colors['text'],
              }}
            >
              {value}
            </Text>
          )}
        />
        <Feather name="chevron-right" size={20} color={colors["lightGray"]} />
      </View>
    </TouchableOpacity>
  );
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
    paddingBottom: 100,
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 10,
  },
  title: {
    paddingVertical: 20,
    fontFamily: "Raleway_900Black",
    fontSize: 20,
    color: colors["text"],
  },
  card: {
    padding: 20,
    backgroundColor: colors["white"],
    elevation: 2,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    borderRadius: 20,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  cardHeaderTitle: {
    color: colors["text"],
    fontFamily: "Raleway_900Black",
    fontSize: 16,
  },
  cardHeaderButton: {
    color: colors["brandPurple"],
    fontFamily: "Raleway_500Medium",
  },
  memberContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    alignItems: "center",
  },
  salesPrice: {
    flexDirection: "row",
  },
  saleName: {
    fontFamily: "Raleway_500Medium",
    color: colors["text"],
  },
});

const user = {
  name: "Isaias",
  sales: [
    {
      client: "Angie Chacin",
      date: new Date(1633379734957).toISOString(),
      name: "Aceite Lavanda",
      price: 16000,
    },
    {
      client: "Isaias Gmez",
      date: new Date(1630792014511).toISOString(),
      name: "Aceite Pepermint",
      price: 8000,
    },
    {
      client: "Estefania Chacin",
      date: new Date(1633379734957).toISOString(),
      name: "Aceite Lemmon",
      price: 10000,
    },
    {
      client: "Francisco Chacin",
      date: new Date(1628115910109).toISOString(),
      name: "Difusor",
      price: 60000,
    },
    {
      client: "Angie Chacin",
      date: new Date(1633379734957).toISOString(),
      name: "Aceite Lavanda",
      price: 16000,
    },
  ],
};

const { myTeam } = {
  myTeam: [
    {
      name: "Carlos",
      lastName: "Pérez",
      associated: true,
      email: "carlosperes@gmail.com",
      phone: "65946216",
      sales: [
        {
          client: "Angie Chacin",
          date: new Date(1633379734957).toISOString(),
          name: "Aceite Lavanda",
          price: 16000,
        },
        {
          client: "Isaias Gmez",
          date: new Date(1630792014511).toISOString(),
          name: "Aceite Pepermint",
          price: 8000,
        },
        {
          client: "Estefania Chacin",
          date: new Date(1633379734957).toISOString(),
          name: "Aceite Lemmon",
          price: 10000,
        },
        {
          client: "Francisco Chacin",
          date: new Date(1628115910109).toISOString(),
          name: "Difusor",
          price: 60000,
        },
        {
          client: "Angie Chacin",
          date: new Date(1633379734957).toISOString(),
          name: "Aceite Lavanda",
          price: 16000,
        },
        {
          client: "Isaias Gmez",
          date: new Date(1630792014511).toISOString(),
          name: "Aceite Pepermint",
          price: 8000,
        },
        {
          client: "Estefania Chacin",
          date: new Date(1633379734957).toISOString(),
          name: "Aceite Lemmon",
          price: 10000,
        },
        {
          client: "Francisco Chacin",
          date: new Date(1628115910109).toISOString(),
          name: "Difusor",
          price: 60000,
        },
        {
          client: "Angie Chacin",
          date: new Date(1633379734957).toISOString(),
          name: "Aceite Lavanda",
          price: 16000,
        },
        {
          client: "Isaias Gmez",
          date: new Date(1630792014511).toISOString(),
          name: "Aceite Pepermint",
          price: 8000,
        },
        {
          client: "Estefania Chacin",
          date: new Date(1633379734957).toISOString(),
          name: "Aceite Lemmon",
          price: 10000,
        },
        {
          client: "Francisco Chacin",
          date: new Date(1628115910109).toISOString(),
          name: "Difusor",
          price: 60000,
        },
        {
          client: "Angie Chacin",
          date: new Date(1633379734957).toISOString(),
          name: "Aceite Lavanda",
          price: 16000,
        },
        {
          client: "Isaias Gmez",
          date: new Date(1630792014511).toISOString(),
          name: "Aceite Pepermint",
          price: 8000,
        },
        {
          client: "Estefania Chacin",
          date: new Date(1633379734957).toISOString(),
          name: "Aceite Lemmon",
          price: 10000,
        },
        {
          client: "Francisco Chacin",
          date: new Date(1628115910109).toISOString(),
          name: "Difusor",
          price: 60000,
        },
      ],
    },
    {
      name: "Ana",
      lastName: "Rojas",
      email: "anarojas@gmail.com",
      phone: "65946216",
    },
    {
      name: "Julio",
      lastName: "Lopez",
      associated: true,
      email: "juliolopez@gmail.com",
      phone: "65946216",
    },
    {
      name: "Karolina",
      lastName: "Andrade",
      email: "karolinaandrade@gmail.com",
      phone: "65946216",
    },
  ],
};

export default AssociateProfile;
