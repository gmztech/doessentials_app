import React, { useState, useEffect, useRef } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Text,
  TouchableOpacity,
  Share,
} from "react-native";
import firebase from "../../firebase/firebase";
import colors from "../../assets/colors/colors";
import ActionBar from "../common/ActionBar";
import Intro from "../common/Intro";
import Feather from "react-native-vector-icons/Feather";
import { useGlobalState } from "state-pool";
Feather.loadFont();

const EssentialOilDetail = ({ route, navigation }) => {
  const mountedRef = useRef(true)
  const [client] = useGlobalState("client");
  const [savedItems, setSavedItems] = useState(client.mySaves); 
  const [loading, setLoading] = useState(false); 
  const { item, mainCategory, subcategory } = route.params;
 

  useEffect(()=>{
    setSavedItems(client.mySaves)
    return () => { mountedRef.current = false }
  }, [client])

  const saveItem = async () => {
    if(loading) { return }
    setLoading(true)
    const clientRef = firebase.firestore().collection('clients').doc(client.id)
    let newItems
    if ( itemExist() ) {
      newItems = (savedItems || []).filter(si => si.path !== `${ mainCategory.id }/${ subcategory.id }/${ item.id }`) 
    } else {
      newItems = [...(savedItems || []), {
        created: Date.now(),
        item: item,
        mainCategory: removeItems(mainCategory),
        subcategory: removeItems(subcategory),
        path: `${ mainCategory.id }/${ subcategory.id }/${ item.id }`
      }] 
    }
    await clientRef.set({ mySaves: newItems }, { merge: true })
    setLoading(false)
  }; 

  const itemExist = () => {
    return (savedItems || [])
      .some(i => i.path === `${ mainCategory.id }/${ subcategory.id }/${ item.id }`)
  } 
  
  const share = () => {
    Share.share({
      title: "Compartir",
      message: `${item.title}\n\n${item.description}`,
    });
  }; 

  return !item ? (
    <></>
  ) : (
    <View style={styles.container}>
      <SafeAreaView>
        <StatusBar></StatusBar>
        <Intro backgroundColor={item.color} view="essentialOil" height={22} />
        <ActionBar
          view={loading ?  "none" : "default"}
          backColor={colors["white"]}
          backSize={30}
          navigation={navigation}
        ></ActionBar>
        {/* title */}
        <View style={styles.content}>
          <View style={{ ...styles.textContainer, marginTop: 10 }}>
            <Text style={styles.title}>{item.title}</Text>
          </View>
        </View>
        {/* Description */}
        <View style={{ ...styles.content, paddingVertical: 30 }}>
          <Text style={styles.description}>{item.description}</Text>
          {/* Action */}
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.actionButtons} onPress={ ()=>saveItem() }>
              <Feather style={styles.actionButtonIcon} name={loading ? 'clock' : 'heart'} size={30}
                color={itemExist() && !loading ? colors["danger"] : colors["lightGray"] } />
              { itemExist() && !loading ? <Text style={styles.likeButton}>Me gusta!</Text> : <></>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButtons} onPress={share}>
              <Feather style={styles.actionButtonIcon} name="share" size={30} color={colors["brandGreen"]} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const removeItems = (obj) => {
  delete obj.items
  return obj
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    paddingHorizontal: 30,
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap",
  },
  title: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: colors["white"],
    fontFamily: "Raleway_900Black",
    fontSize: 20,
    color: colors["text"],
    borderRadius: 10,
  },
  description: {
    color: colors["text"],
    fontFamily: "Raleway_500Medium",
    fontSize: 15,
    lineHeight: 30,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingVertical: 20,
    flexWrap: "wrap",
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  actionButtonIcon: {
    marginRight: 10
  },
  bold: {
    fontFamily: 'Raleway_900Black'
  },
  likeButton: {
    color: colors['text'],
    fontFamily: 'Raleway_500Medium'
  }
});

export default EssentialOilDetail;
