import React, { useEffect, useState, useRef } from "react"; 
import { 
  LogBox
} from "react-native"; 
// Screens
import Login from "./components/Login";
import Home from "./components/Home";
import EssentialOil from "./components/categories/EssentialOil";
import EssentialOilDetail from "./components/categories/EssentialOilDetail";
import Profile from "./components/profile/Profile";
import AssociateProfile from "./components/associate/AssociateProfile";
import MyTeam from "./components/associate/MyTeam";
import CreateClient from "./components/associate/CreateClient";
import MemberDetail from "./components/associate/MemberDetail";
import MySales from "./components/sales/MySales";
import CreateSale from "./components/sales/CreateSale";
// Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootSiblingParent } from "react-native-root-siblings";
// Extras 
import { store, useGlobalState } from 'state-pool';
import configs from './assets/data/data';
import Teams from "./components/Teams";
import CreateHealthConsult from "./components/healthConsult/CreateHealthConsult";
import HealthConsult from "./components/healthConsult/HealthConsult";
import Help from "./components/Help";
import Disclaimer from "./components/Disclaimer";
import SafeUsage from "./components/SafeUsage";
const Stack = createNativeStackNavigator();
LogBox.ignoreLogs(['Setting a timer for a long period of time'])
LogBox.ignoreLogs([`AsyncStorage has been extracted from react-native core and will be removed in a future release. It can now be installed and imported from '@react-native-async-storage/async-storage' instead of 'react-native'. See https://github.com/react-native-async-storage/async-storage`]);
// Global variable declarations 
store.setState('siteData', {})
store.setState('plan', null)
store.setState('client', {})
store.setState('usageTypes', {})
store.setState('salesStatus', {})
store.setState('clientTeam', null) 
store.setState('faqList', [])

export default function App() {
  const mountedRef = useRef(true)
  const [siteContent, setSiteContent] = useGlobalState('siteData');
  const [usageTypes, setUsageTypes] = useGlobalState('usageTypes');
  const [salesStatus, setSalesStatus] = useGlobalState('salesStatus'); 
  let [fontsLoaded] = useState({ });

  const getData = async() => {
    const res = await configs();
    const siteDataContent = (res.find(c => c.type === 'site_content') || {}).data
    const siteDataUsageTypes = (res.find(c => c.type === 'usage_types') || {}).data
    const siteSalesStatus = (res.find(c => c.type === 'sale_status') || {}).data
    setSiteContent(siteDataContent)
    setUsageTypes(siteDataUsageTypes)
    setSalesStatus(siteSalesStatus)
  }

  useEffect(() => {
    async function fetchData() { 
      await getData()
    }
    fetchData();
    return () => { mountedRef.current = false }
  }, [])   
  if (!fontsLoaded || !Object.keys(siteContent).length || !usageTypes.length || !salesStatus.length) {
    return <></>;
  } else {
    return (
      <RootSiblingParent>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Teams" 
              component={Teams}
              options={{ headerShown: false }}/>
            <Stack.Screen
              name="Login" 
              component={Login}
              options={{ headerShown: false }}/>
             <Stack.Screen
              name="Home"
              component={Home}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Profile"
              component={Profile}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AssociateProfile"
              component={AssociateProfile}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="MyTeam"
              component={MyTeam}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CreateClient"
              component={CreateClient}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="MySales"
              component={MySales}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CreateSale"
              component={CreateSale}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="MemberDetail"
              component={MemberDetail}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="EssentialOil"
              component={EssentialOil}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="EssentialOilDetail"
              component={EssentialOilDetail}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CreateHealthConsult"
              component={CreateHealthConsult}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="HealthConsult"
              component={HealthConsult}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Help"
              component={Help}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Disclaimer"
              component={Disclaimer}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SafeUsage"
              component={SafeUsage}
              options={{ headerShown: false }}
            /> 
          </Stack.Navigator>
        </NavigationContainer>
      </RootSiblingParent>
    );
  }
}
