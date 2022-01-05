import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../../assets/colors/colors";
import { useGlobalState } from 'state-pool';
import Item from "../categories/ListItem"; 

const MyLikes = ({ navigation, isFocused }) => {
  const mountedRef = useRef(true)
  const [client] = useGlobalState("client");
  const [savedItems, setSavedItems] = useState(client.mySaves);
  const [siteData,] = useGlobalState('siteData');  
  const [profileData,] = useState(siteData.profile)
  
  useEffect(() => {
    return () => { mountedRef.current = false }
  }, [isFocused]); 

  useEffect(()=>{
    setSavedItems(client.mySaves)
    return () => { mountedRef.current = false }
  }, [client])

  return (
    <View>
      <Text style={styles.listTitle}>{ profileData.myLikesTitle }</Text>
      {(savedItems || []).map((si, i) => (
        <Item
          key={i}
          item={si.item || null} 
          navigation={navigation}
          mainCategory={si.mainCategory}
          subcategory={si.subcategory}
          goTo={!si.item ? 'EssentialOil' : 'EssentialOilDetail'}
        />
      ))}
    </View>
  );
}; 

const styles = StyleSheet.create({
  listTitle: {
    fontFamily: 'Raleway_500Medium',
    color: colors['text'],
    paddingHorizontal: 10,
    paddingVertical: 10,
    textAlign: 'center'
  }
})

export default MyLikes;
