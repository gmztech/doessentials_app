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
    TouchableOpacity
} from "react-native";
import Intro from "../common/Intro";
import ActionBar from "../common/ActionBar";
import colors from "../../assets/colors/colors";
import Button from "../common/Button";
import Toast from "react-native-root-toast";
import gs from "../../assets/css/GeneralStyles";
import { useGlobalState } from "state-pool";
import firebase from "../../firebase/firebase";
import Item from "../categories/ListItem";

const CreateHealthConsult = ({ route, navigation }) => {
    let { create, consult: myConsult } = route.params;
    const [siteData] = useGlobalState("siteData");
    
    const [client] = useGlobalState("client");
    const [consultData] = useState(siteData.consult);
    const [generalData] = useState(siteData.general); 

    const [loading, setLoading] = useState(false);
    const [consult, setConsult] = useState(
        !!myConsult ? myConsult : {
            clientId: client.id,
            upliner: client.upliner,
            createdAt: Date.now(),
            name: "",
            description: "",
            recomendations: [],
            notes: ""
        }
    ); 

    const validateConsult = () => {
        if (loading) {
            return;
        }
        setLoading(true);
        if (formError(consult, create)) {
            setLoading(false);
            return showToaster({
                error: true,
                msg: consultData["mandatory:fields"],
            });
        }
        Alert.alert(
            consultData["register:consult"],
            consultData["confirm:consult:creation"],
            [
                { text: "Cancel", style: "cancel", onPress: () => setLoading(false) },
                { text: "OK", onPress: () => createConsult() },
            ]
        );
    };

    const createConsult = async () => {
        setLoading(true);
        let consultRef = firebase.firestore().collection("consults")
        consultRef = await consultRef.add({ ...consult, clientName: `${client.name} ${client.lastName}` });
        consultRef = firebase.firestore().collection("consults").doc(consultRef.id)
        consultRef = await consultRef.update({ id: consultRef.id })
        setLoading(false);
        showToaster({
            msg: consultData["registered:consult"],
            navigation,
            consult,
        });
    };

    const saveConsult = () => {
        if (loading) { return; }
        setLoading(true);
        if (formError(consult)) {
            setLoading(false);
            return showToaster({
                error: true,
                msg: consultData["mandatory:fields"],
            });
        }
        if(!consult.recomendations || !consult.recomendations.length){
            setLoading(false);
            return showToaster({
                error: true,
                msg: consultData["mandatory:recomendations"],
            });
        }
        setLoading(false);
        updateConsult(true, {...consult, opened: false})
    }

    const marAsOpened = () => { 
        if(client.id !== consult.clientId || !!create || consult.opened) { return; }
        const newConsult = { ...consult, opened: true } 
        setConsult(newConsult)
        updateConsult(false, newConsult)
    } 

    const updateConsult = async (showToasterBool, newConsult) => {
        let consultRef = firebase.firestore().collection("consults").doc(consult.id);
        consultRef = await consultRef.update({ ...newConsult });
        if(showToasterBool){
            showToaster({
                msg: consultData["saving:consult"],
                navigation,
            });
        }
        setLoading(false);
    };

    const removeRecomendation = (rec) => {
        const recomendations = consult.recomendations.filter(r => r.path !== rec.path)
        const newConsult = {...consult, recomendations, opened: false }
        setConsult(newConsult)
        updateConsult(false, newConsult)
    }

    useEffect(() => {
        if( !!consult && !!consult.id ) {
            marAsOpened()
        }
        return 
    }, [consult])

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
                            create ? "createConsult" : "consultDetail"
                        }
                    />
                    {client.id !== consult.createdBy ? <Text>{"\n"}</Text> : <></>}
                    <View style={styles.content}>
                        {(client.id === consult.upliner || create) && (
                            <Text style={{ ...gs.contentText, marginVertical: 10 }}>
                                {create
                                    ? consultData.createConsultDescription
                                    : consultData.editConsultDescription}
                            </Text>
                        )}
                        {/* Consult data */}
                        {!!create && <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{consultData.consultData}</Text>}
                        {/* conult name */}
                        {!!create ? <TextInput
                            style={{
                                ...gs.input,
                                backgroundColor: !!create ? colors["water"] : colors["lightGray"],
                            }}
                            placeholderTextColor={colors["text"]}
                            placeholder="Nombre de consulta*"
                            value={consult.name}
                            onChange={({ nativeEvent: { text: name } }) =>
                                setConsult({ ...consult, name })
                            }
                            editable={!!create}
                        /> : <View>
                                <Text>{''}</Text>
                                <Text style={{fontSize: 15}}>{consultData.consultName}:</Text>
                                <Text style={{fontWeight: 'bold', fontSize: 20}}>{consult.name}</Text>
                            </View>}
                        {/* consult description */}
                        {!!create ? <TextInput
                            style={{
                                ...gs.input,
                                ...gs.textArea,
                                backgroundColor: !!create ? colors["water"] : colors["lightGray"],
                            }}
                            multiline={true}
                            numberOfLines={10}
                            placeholderTextColor={colors["text"]}
                            placeholder="Descriptión *"
                            value={consult.description}
                            onChange={({ nativeEvent: { text: description } }) =>
                                setConsult({ ...consult, description, opened: false })
                            }
                            editable={!!create}
                        /> : <View>
                                <Text>{''}</Text>
                                <Text style={{fontSize: 15}}>{consultData.consultDescription}:</Text>
                                <Text style={{fontWeight: 'bold', fontSize: 20}}>{consult.description}</Text>
                            </View>}
                        <Text>{"\n"}</Text>
                        {/* Respuesta del consultor */}
                        { !!!create && <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors['brandPurple'] }}>{consultData.consultAnswer} { consult.recomendations && consult.recomendations.length ? '✅' : '🕑'}</Text>}
                        { !!!create && consult && consult.notes && consult.notes.length && client.id === consult.clientId ? 
                            <View>
                                <Text>{''}</Text>
                                <Text style={{ fontSize: 15 }}>{consultData.notes}</Text>
                                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{consult.notes}</Text>
                            </View>
                            : <></>
                        }
                        {
                            !!!create && client.id !== consult.clientId && <View>
                            <Text>{''}</Text>
                            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{consultData.notes}:</Text>
                            <TextInput
                                style={{
                                    ...gs.input,
                                    ...gs.textArea,
                                    backgroundColor: colors["water"],
                                }}
                                multiline={true}
                                numberOfLines={10}
                                placeholderTextColor={colors["text"]}
                                placeholder="Descriptión *"
                                value={consult.notes}
                                onChange={({ nativeEvent: { text: notes } }) =>
                                    setConsult({ ...consult, notes })
                                }
                                />
                        </View>
                        }
                        { !!!create && consult && consult.recomendations && consult.recomendations.length ? 
                            <View>
                                <Text>{''}</Text>
                                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{consultData.recomendations}:</Text>
                                {(consult.recomendations || []).map((recomendation, i) => (
                                    <View key={i}>
                                        <Item
                                            item={recomendation.item || null} 
                                            navigation={navigation}
                                            mainCategory={recomendation.mainCategory}
                                            subcategory={recomendation.subcategory}
                                            goTo={!recomendation.item ? 'EssentialOil' : 'EssentialOilDetail'}
                                        />
                                        {client.id !== consult.clientId && <TouchableOpacity onPress={() => removeRecomendation(recomendation)}>
                                            <View style={{
                                                backgroundColor: colors['danger'],
                                                paddingVertical: 5,
                                                paddingHorizontal: 10,
                                                borderRadius: 50,
                                                position: 'absolute',
                                                bottom: 30,
                                                right: 0
                                            }}>
                                                <Text style={{ color: '#ffffff' }}>x</Text>
                                            </View>
                                        </TouchableOpacity>}
                                    </View>
                                ))}
                                <Button 
                                    marginTop={20}
                                    label={generalData.effectiveUsageLabel}
                                    background={'brandGreen'}
                                    fontSize={20}
                                    onPress={()=>goTo('SafeUsage')}/> 
                            </View>
                            : <></>
                        }
                        {!!!create && consult.upliner !== client.id && consult && (!consult.recomendations || !consult.recomendations.length) && <Text>{consultData.notAnswerYet}</Text>}
                    </View>
                </ScrollView>
            </SafeAreaView>
            <View style={gs.bottomButton}>
                {!!create || (consult && consult.clientId !== client.id) && !loading ? (
                    <Button
                        onPress={!!create ? validateConsult : saveConsult}
                        label={!!create ? consultData.register : consultData.saveConsult}
                        width="100%"
                        background="brandPurple"
                        fontFamily="Raleway_900Black"
                        fontSize={15}
                        paddingTop={10}
                        paddingBottom={10}
                        borderRadius={30}
                        loading={loading}
                    />
                ) : <></>}
            </View>
        </View>
    );
};

const formError = (consult, create) =>
    (!!create ? ["name", "description"] : ["name", "description", "notes"])
        .some((model) => {
            return !consult[model] || !String(consult[model]).length;
        });

const showToaster = ({ msg, navigation, error }) => {
    Toast.show(msg, {
        duration: 3000,
        shadow: true,
        animation: true,
        hideOnPress: true,
        backgroundColor: error ? colors["danger"] : colors["brandGreen"],
        position: 10,
        onHidden: () => {
            if (error) { return; }
            if (!navigation) { return; }
            navigation.navigate("HealthConsult", { refresh: true });
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
    ifNulled: {
        paddingVertical: 10,
        marginBottom: 15,
        backgroundColor: colors['danger'],
        flexDirection: 'row',
        justifyContent: 'center'
    }
});

export default CreateHealthConsult;
