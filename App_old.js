import React, { useState, useEffect } from 'react'; 
import * as RNIap from 'react-native-iap';

import {
  Text, 
  View,
} from 'react-native';  

const suscriptionsId = Platform.select({
  ios: [ 'associate.13d.monthly' ],
  android: [ 'associate.13d.monthly' ]
});

const App = () => {  

  const getProducts = async () => {
    try {
      const products = await RNIap.getProducts(suscriptionsId);
      console.log(products);
    } catch(err) {
      console.warn(err);
    }
  }

  const initPurchases = async () => {
    try {
      await RNIap.initConnection();
      getProducts()
    } catch (error) {
      console.log('Purchase connection error: ', error);
    }
  }

  useEffect(() => {
    initPurchases()
    return
  }, []); 

  return (
    <View>
      <Text>Welcome</Text>
    </View>
  );
}; 

export default App;
