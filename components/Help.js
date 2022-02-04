import React, { useState } from "react";
import {
    Text,
    StyleSheet,
    View,
    ScrollView,
    StatusBar,
    SafeAreaView,
    TouchableOpacity,
    Linking
} from "react-native";
import colors from "../assets/colors/colors";
import { useGlobalState } from 'state-pool';
import ActionBar from "./common/ActionBar"; 
import Intro from "./common/Intro";
import Feather from "react-native-vector-icons/Feather";
import Modal from "react-native-modal"; 
import Markdown from 'react-native-simple-markdown'
import Button from "./common/Button";
Feather.loadFont();

const Help = ({ navigation, route }) => {
    const [siteData,] = useGlobalState('siteData');
    const [faqList,] = useGlobalState('faqList');
    const [helpData,] = useState(siteData.help)
    const [infoItem, setInfoItem] = useState(null) 

    const setInfoItemFn = (item) => {
        setInfoItem(item)
    } 

    const openBook = async() => {
        await Linking.openURL('https://www.oily.cl/products/guia-modern-essentials-espanol')
    }

    const goTo = (path) => {
        navigation.navigate(path)
    }
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
                            <Text style={styles.title}>{helpData.title} </Text>
                        </View> 
                        {/* dessctiption */}
                        <View>
                            <Text style={styles.faqDescription}>
                                {helpData.description}{" "}
                            </Text>
                        </View> 
                        {/* disclaimer */}
                        <View style={styles.disclaimerContainer}>
                            <Text style={styles.disclaimer}>
                                <Text style={{ fontWeight: 'bold', color: colors['brandYellow'] }}>Nota importante:</Text>
                                {'\n'}
                                La información que presentamos proviene de un proceso de análisis e investigación inspirado por el libro 
                                <Text style={{ fontWeight: 'bold' }} onPress={openBook}> Guía Modern Essentials - terapia con los aceites esenciales</Text>. Favor leer nuestro disclaimer de responsabilidad
                                {'\n'}
                            </Text>
                            <Button 
                                label={'Disclaimer de responsabilidad'}
                                background={'white'}
                                color={'brandYellow'}
                                fontSize={15}
                                onPress={()=>goTo('Disclaimer')}/>
                        </View>
                        {/* collapses */}
                        <View>
                            <Text style={{ color: colors['brandGreen'] }}>{helpData.forClients}:</Text>
                            {faqList && faqList.length ? faqList.filter(fq => fq.for === 'clients').map((item, index) => {
                                return <FaqItem key={index} item={item} setInfoItemFn={setInfoItemFn}/>
                            }) : <></>}
                        </View>
                        <Text>{'\n'}</Text>
                        <View>
                            <Text style={{ color: colors['brandPurple'] }}>{helpData.forAssociates}:</Text>
                            {faqList && faqList.length ? faqList.filter(fq => fq.for === 'associated').map((item, index) => {
                                return <FaqItem key={index} item={item} setInfoItemFn={setInfoItemFn}/>
                            }) : <></>}
                        </View>
                    </View>
                    <InfoModal infoItem={infoItem} setInfoItemFn={setInfoItemFn}/>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

const FaqItem = ({ item, setInfoItemFn }) => {
    return (
        <View>
            <TouchableOpacity
                onPress={()=>setInfoItemFn(item)}
                style={{ backgroundColor: "#ffffff" }}
            >
                <View style={styles.infoItem}>
                    <Text>{item.title}</Text>
                    <Feather name="chevron-right" size={20} color={colors["lightGray"]} />
                </View>
            </TouchableOpacity>
        </View>
    )
}

const InfoModal = ({ infoItem, setInfoItemFn }) => {
    return !infoItem ? <></> : (
        <Modal isVisible={!!infoItem}>
          {/*  */}
          <View style={styles.infoItemModal}>
            <TouchableOpacity style={styles.right}>
              <Feather
                onPress={() => setInfoItemFn(null)}
                name="x"
                size={30}
                color={colors["danger"]}
              />
            </TouchableOpacity>
            <ScrollView>
              <Text style={{ ...styles.title, color: infoItem.for === 'clients' ? colors['brandGreen'] : colors['brandPurple'] }}> 
                {formatParagraph(infoItem?.title)}
              </Text>
              <Markdown>{formatParagraph(infoItem?.description)}</Markdown>
            </ScrollView>
          </View>
        </Modal>
      );
}

const formatParagraph = (str='') => str.split("\\n").join('\n\n');  

const styles = StyleSheet.create({
    bold: {
        fontWeight: 'bold'
    },
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
    }, 
    textContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        marginTop: 10,
        borderRadius: 10,
        fontWeight: 'bold'
    },
    title: {
        paddingVertical: 20,
        fontSize: 20,
        color: colors["text"],
        fontWeight: 'bold'
    },
    faqDescription: {
        color: colors["text"],
        fontSize: 16,
        marginBottom: 20,
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
        fontSize: 16,
    },
    cardHeaderButton: {
        color: colors["brandPurple"],
    },
    memberContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
        alignItems: "center",
    },
    infoItem: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginTop: 10,
        borderRadius: 10,
        color: colors['text'],
        borderWidth: .5,
        borderColor: colors['lightGray'],
        flexDirection: "row",
        justifyContent: "space-between"
    },
    infoItemModal: {
        flex: 1,
        backgroundColor: "#ffffff",
        borderRadius: 20,
        padding: 30,
      }, 
    right: {
        alignItems: "flex-end",
    }, 
    bullets: {
        color: colors["text"], 
        fontSize: 15,
        marginTop: 10,
    },
    disclaimer: {
        fontSize: 13,
        textAlign: 'center',
        color: colors['text']
    },
    disclaimerContainer: {
        borderWidth: 1,
        borderColor: colors['brandYellow'],
        borderStyle: 'dashed',
        padding: 10,
        marginBottom: 20,
        borderRadius: 20
    }
});

export default Help;
