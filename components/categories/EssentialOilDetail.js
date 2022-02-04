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
import AssignConsultModal from "./AssignConsultModal";
import Button from "../common/Button";
Feather.loadFont();

const EssentialOilDetail = ({ route, navigation }) => {
  const mountedRef = useRef(true)
  const [siteData] = useGlobalState("siteData");
  const [eoData] = useState(siteData.essentialOilDetail);
  const [generalData] = useState(siteData.general);
  const [client] = useGlobalState("client"); 
  const [usageTypes] = useGlobalState("usageTypes");
  const [savedItems, setSavedItems] = useState(client.mySaves); 
  const [showAssignConsultModal, setShowAssignConsultModal] = useState(false); 
  const [loading, setLoading] = useState(false); 
  const [path, setPath] = useState(null); 
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

  const toggleShowAssignConsultModal = () => {
    setPath({ 
      item: item,
      mainCategory: removeItems(mainCategory),
      subcategory: removeItems(subcategory),
      path: `${ mainCategory.id }/${ subcategory.id }/${ item.id }`
    })
    setShowAssignConsultModal(!showAssignConsultModal)
  }

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
        <View style={{ ...styles.content, paddingVertical: 30 }}>
          {/* Description */}
          <Text style={styles.description}>{item.description}</Text>
          {/* Usage type */}
          { subcategory.showUsageType && item.usageType &&
            <View style={styles.usageTypeContainer}>
              <Text style={styles.usageTypeLabel}>
                { eoData.usageType }:
              </Text>
              {usageTypes.map( (usageType, i) => {
                return (
                  <View key={i} style={{
                      ...styles.usageTypeItem,
                      backgroundColor: item.usageType && item.usageType === usageType.type ? colors['brandGreen'] : '#e3e3e3'
                    }}>
                    <Text style={styles.usageTypeName}>
                      { usageType.name }
                    </Text>
                  </View>
                )
              })}
            </View>
          }
          <Button
              marginTop={20}
              label={generalData.effectiveUsageLabel}
              background={'brandGreen'}
              fontSize={20}
              onPress={()=>goTo('SafeUsage')}/> 
          {/* Action */}
          <View style={styles.actionContainer}>
            {client.associated && <TouchableOpacity style={styles.actionButtons} onPress={ ()=>toggleShowAssignConsultModal() }>
              <Feather style={styles.actionButtonIcon} color={colors["brandPurple"]} name={'award'} size={30}/>
              <Text style={styles.likeButton}>Asignar</Text> 
            </TouchableOpacity>}
            <TouchableOpacity style={styles.actionButtons} onPress={ ()=>saveItem() }>
              <Feather style={styles.actionButtonIcon} name={loading ? 'clock' : 'heart'} size={30}
                color={itemExist() && !loading ? colors["danger"] : colors["lightGray"] } />
              { itemExist() && !loading ? <Text style={styles.likeButton}>Me gusta!</Text> : <></>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButtons} onPress={share}>
              <Feather style={styles.actionButtonIcon} name="share" size={30} color={colors["brandGreen"]} />
            </TouchableOpacity>
          </View>
          {/* assign modal */}
          {showAssignConsultModal && <AssignConsultModal
            showAssignConsultModal={showAssignConsultModal}
            path={path}
            toggleShowAssignConsultModal={toggleShowAssignConsultModal}/>}    
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
    fontSize: 20,
    color: colors["text"],
    borderRadius: 10,
    overflow: 'hidden'
  },
  description: {
    color: colors["text"], 
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
  },
  likeButton: {
    color: colors['text'], 
  },
  usageTypeContainer: {
    marginVertical: 20,
    paddingVertical: 20,
    borderTopWidth: .5,
    borderTopColor: '#e3e3e3',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  usageTypeLabel: {
    fontWeight: 'bold'
  },
  usageTypeItem: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#e3e3e3',
    borderRadius: 50
  },
  usageTypeName: {
    color: colors['white']
  }
});

export default EssentialOilDetail;
