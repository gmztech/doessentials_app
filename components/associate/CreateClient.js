import React, { useState } from "react";
import MyProfile from "../profile/MyProfile";
import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from "react-native";
import Intro from "../common/Intro";
import ActionBar from "../common/ActionBar";
import colors from "../../assets/colors/colors";
import { useGlobalState } from 'state-pool';
import Button from "../common/Button";
import Toast from "react-native-root-toast";
import gs from "../../assets/css/GeneralStyles";
import firebase from '../../firebase/firebase'
import { request } from '../../services/request'

const randomPassword = Array.from(Array(8), () => Math.floor(Math.random() * 36).toString(36)).join('').toUpperCase();
const CreateClient = ({ route, navigation }) => {
  const [siteData,] = useGlobalState('siteData');
  const [client,] = useGlobalState('client');
  const [clientTeam,] = useGlobalState('clientTeam');
  const [apData,] = useState(siteData.associateProfile)
  const [loginData,] = useState(siteData.login)
  const { create } = route.params;
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    name: "",
    lastName: "",
    picture: "",
    email: "",
    phone: "",
    rut: "",
    urlDoterra: "",
  });
  
  const createUser = async () => {
    if ( loading ) { return; }
    setLoading(true);
    if (emailValidator(user)) {
      setLoading(false);
      return showToaster({ error: true, msg: loginData["error:wrong:email"] });
    }
    if (formError(user)) {
      setLoading(false);
      return showToaster({ error: true, msg: loginData["error:form"] });
    }
    try {   
      if ( !client.name || !client.lastName ) {
        showToaster({ msg: apData['error:client:name'], error: true, navigation, newUser });
        return navigation.navigate('Profile')
      }
      const checkIfexists = await clientExists(user.email)
      if ( checkIfexists ) {
        showToaster({ msg: apData['error:client:exists'], error: true });
        setLoading(false);
        return
      } 
      const newUser = {...user, team: {name: clientTeam.name, id: clientTeam.id}, email: user.email.toLocaleLowerCase(), password: randomPassword, upliner: { name: `${client.name} ${client.lastName}`, id: client.id }}
      const createdClientsRef = firebase.firestore().collection('createdClients').doc()
      await createdClientsRef.set({ ...newUser }) 
      const req = await request({
        method: 'POST',
        endpoint: 'create_client',
        body: { ...newUser }
      })
      showToaster({ msg: apData['success:client:created'], navigation });
    } catch (error) {
      console.log('Client creation error: ', error);
      navigation.navigate("AssociateProfile", {createdUser: true});
    }
  };

  const clientExists = async (email) => {
    const clientRef = firebase.firestore().collection('createdClients')
    const client = await clientRef.where('email', '==', email).get()
    return !client.empty
  }

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <ScrollView>
          <StatusBar />
          <Intro view="default" height={30} />
          <ActionBar
            view={loading ? '': 'creating'}
            navigation={navigation}
            backColor={colors["text"]}
            backSize={30}
            labelProp={'createClient'}
          />
          <View style={styles.content}>
            <MyProfile user={user} setUser={setUser} create={create} />
          </View>
        </ScrollView>
      </SafeAreaView>
      <View style={gs.bottomButton}>
        <Button
          onPress={createUser}
          label={apData.create}
          width="100%"
          background="brandYellow"
          fontFamily="Raleway_900Black"
          fontSize={15}
          paddingTop={10}
          paddingBottom={10}
          borderRadius={30}
          loading={loading}
        />
      </View>
    </View>
  );
};

const formError = (user) =>
  ["name", "lastName", "email", "phone", "rut"].some((model) => {
    return !user[model] || !user[model].length;
  });

const emailValidator = (user) => {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  if (!reg.test(user.email)) { return true }
  return false
}; 

const showToaster = ({ msg, navigation, error }) => {
  Toast.show(msg, {
    duration: 3000,
    shadow: true,
    animation: true,
    hideOnPress: true,
    backgroundColor: error ? colors["danger"] : colors["brandGreen"],
    position: 10,
    onHidden: () => {
      if (error) {
        return;
      } 
      navigation.navigate("AssociateProfile", {createdUser: true});
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
  }
});

export default CreateClient;
