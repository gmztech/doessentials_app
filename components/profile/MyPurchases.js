import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../../assets/colors/colors";
import { useGlobalState } from 'state-pool';
import firebase from "../../firebase/firebase";
import Feather from "react-native-vector-icons/Feather";
Feather.loadFont();

const MyPurchases = ({ navigation, isFocused }) => {
    const mountedRef = useRef(true)
    const [siteData,] = useGlobalState('siteData');
    const [client,] = useGlobalState("client");
    const [profileData,] = useState(siteData.profile)
    const [sales, setSales] = useState([])

    const getSales = async () => {
        let sales = await firebase.firestore()
            .collection('sales')
            .where("clientId", "==", client.id)
            .get()
        sales = sales.docs.map((doc) => {
            return { ...doc.data() };
        })
        setSales(sales)
    }

    useEffect(() => {
        getSales()
        return () => { mountedRef.current = false }
    }, [isFocused]);

    return (
        <View>
            <Text style={styles.listTitle}>{profileData.myPurchasesTitle}</Text>
            {(sales || []).map((sale, i) => (
                <Item
                    key={i}
                    sale={sale}
                    navigation={navigation}
                    client={client}
                    profileData={profileData}
                />
            ))}
        </View>
    );
};

const Item = ({ sale, navigation, client, profileData }) => {
    return (
        <View>
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate('CreateSale', { sale, boughtBy: client })
                }
                style={{ backgroundColor: "#ffffff" }}
            >
                <View style={styles.saleItem}>
                    <Text>{sale.title} {sale.nulled && <Text style={{ color: colors['danger'] }}>({profileData.saleNulled})</Text>}</Text>
                    
                    <Feather name="chevron-right" size={20} color={colors["lightGray"]} />
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    listTitle: {
        color: colors['text'],
        paddingHorizontal: 10,
        paddingVertical: 10,
        textAlign: 'center'
    },
    saleItem: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginTop: 10,
        borderRadius: 10,
        color: colors['text'],
        borderWidth: .5,
        borderColor: colors['lightGray'],
        flexDirection: "row",
        justifyContent: "space-between"
    }
})

export default MyPurchases;
