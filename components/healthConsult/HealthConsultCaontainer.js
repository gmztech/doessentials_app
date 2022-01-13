import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import colors from "../../assets/colors/colors";
import Feather from "react-native-vector-icons/Feather";
Feather.loadFont();

const HealthConsultCaontainer = ({ homeData, consults, navigation }) => {

    const goTo = (consult) => {
        navigation.navigate("CreateHealthConsult", { consult })
    }

    return (<>
        {consults && consults.length ? consults.slice(0, 4).map((consult, i) => (
            <TouchableOpacity key={i} onPress={()=>goTo(consult)}> 
                <View style={styles.item}>
                    {!consult.opened && <View style={styles.bubble}></View>}
                    <Text style={{fontSize: 16, color: consult.opened ? colors["text"] : colors["brandGreen"]}}>{consult.name}</Text>
                    <Feather name="chevron-right" size={20} color={colors["lightGray"]} />
                </View>
            </TouchableOpacity>
        )) : <Text>{ homeData.noConsults } </Text> }
    </>);
};

const styles = StyleSheet.create({
    item: {
        position: 'relative',
        paddingVertical: 5,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    bubble: {
        position: 'absolute',
        top: 5,
        right: 0,
        width: 20,
        height: 20,
        borderRadius: 50,
        backgroundColor: colors["brandGreen"]
    }
});

export default HealthConsultCaontainer;
