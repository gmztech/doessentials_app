import React, { useState, useEffect, useRef } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import firebase from "../firebase/firebase";
import { useIsFocused } from "@react-navigation/core";
import colors from "../assets/colors/colors";
import ActionBar from "./common/ActionBar";
import Intro from "./common/Intro";
import { Dimensions } from "react-native";
import Button from "./common/Button";
import Toast from "react-native-root-toast";
import { CommonActions } from "@react-navigation/native";
import { useGlobalState } from 'state-pool';
import gs from "../assets/css/GeneralStyles";
import moment from "moment";
moment().format();
import { request } from '../services/request'

const vh = (percent) => (Dimensions.get("window").height * percent) / 100;

const Login = ({ navigation, route }) => {
  const [team, setTeam] = useState(route.params.team)
  const [siteData,] = useGlobalState('siteData'); 
  const [loginData,] = useState(siteData.login)
  const [forgotData,] = useState(siteData.forgot)  
  const mountedRef = useRef(true);
  const [toggleFocus, settoggleFocus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [user, setUser] = useState({ email: 'isaiasegomez@gmail.com', password: 'admin123'}); 

  const checkForSession = async (user) =>{
    if( !user ) { return; }
    const clientRef = firebase.firestore().collection('clients').doc(user.uid)
    let client = await clientRef.get()  
    client = client.data()

    const clientTeamRef = firebase
      .firestore()
      .collection("teams")
      .doc(client.team.id);
    let clientTeam = await clientTeamRef.get();
    clientTeam = clientTeam.data()
    if(clientTeam.id !== team.id) {
      actionToaster("error:auth:wrongTeam");
      setUser({})
      setLoading(false)
      return firebase.auth().signOut();
    }

    if ( client.disabled ) {
      actionToaster("error:auth:disabled");
      setUser({})
      setLoading(false)
      return firebase.auth().signOut();
    }
    user && mountedRef.current && navigation.dispatch(
      CommonActions.reset({ index: 1, routes: [{ name: "Home" }] })
    )
  };

  const login = () => {
    if (loading) {
      return;
    }
    if (emailValidator(user)) {
      setLoading(false);
      return actionToaster("error:wrong:email");
    }
    if (validator(user, forgotMode)) {
      setLoading(false);
      return actionToaster("error:form");
    }
    setLoading(true);
    firebase
      .auth()
      .signInWithEmailAndPassword(user.email, user.password)
      .then(({ user }) => {
      })
      .catch((error) => {
        console.log("error on login", error);
        setLoading(false);
        actionToaster("error:auth");
      });
  };

  const requestPassword = async () => {
    if (loading) {
      return;
    }
    if (emailValidator(user)) {
      setLoading(false);
      return actionToaster("error:wrong:email");
    }
    if (validator(user, forgotMode)) {
      setLoading(false);
      return actionToaster("error:form");
    }
    const docRef = await firebase
      .firestore()
      .collection("createdClients")
      .where("email", "==", user.email)
      .get();

    if (docRef.empty) {
      actionToaster("success:forgot");
      setUser({});
      setForgotMode(false);
      setLoading(false);
      return 
    }
    const client = docRef.docs[0];
    const today = moment(Date.now());
    const then = client.data().passwordRequested
      ? moment(client.data().passwordRequested)
      : null;
    if (!!then && today.diff(then, "minutes") < 15) {
      return actionToaster("error:trylater");
    }
    setLoading(true); 
    try { 
      await request({
        method: 'POST',
        endpoint: 'request_password',
        body: { id: client.id, passwordRequested: Date.now() }
      })
      actionToaster("success:forgot");
      setUser({});
      setForgotMode(false);
      setLoading(false);
    } catch (error) {
      console.log(error);
      actionToaster("error:auth");
    }
  };

  const actionToaster = async (type) => {
    await showToaster({
      msg: loginData[type],
      navigation,
      error: type.indexOf("error") > -1,
      forgotMode,
    });
  };
  
  useEffect(() => {  
    const unsubscribe = firebase.auth().onAuthStateChanged(checkForSession);
    return () => {
      mountedRef.current = false;
      unsubscribe();
    };
  }, []); 

  return ( 
    <View style={styles.container}>
      <SafeAreaView>
        <StatusBar></StatusBar>
        <ScrollView>
          <Intro team={team} view="login" height={35} />
          <ActionBar />
          <View style={styles.formContainer}>
            <Text style={{...styles.title, color: team.primaryColor}}>
              {!forgotMode ? loginData.title : forgotData.title}
            </Text>
            <Text style={styles.description}>
              {!forgotMode ? loginData.description : forgotData.description}
            </Text>
            <TextInput
              style={gs.input}
              placeholderTextColor={colors["text"]}
              placeholder="Correo electrónico"
              keyboardType="email-address"
              autoCompleteType="email"
              onFocus={() => settoggleFocus(true)}
              onBlur={() => settoggleFocus(false)}
              value={user.email}
              onChange={({ nativeEvent: { text: email } }) =>
                setUser({ ...user, email })
              }
            />
            {forgotMode ? (
              <></>
            ) : (
              <TextInput
                style={gs.input}
                placeholderTextColor={colors["text"]}
                placeholder="Contraseña"
                secureTextEntry={true}
                autoCompleteType="password"
                onFocus={() => settoggleFocus(true)}
                onBlur={() => settoggleFocus(false)}
                value={user.password}
                onChange={({ nativeEvent: { text: password } }) =>
                  setUser({ ...user, password })
                }
              />
            )}
            <View style={styles.forgot}>
              <TouchableOpacity
                onPress={() => setForgotMode(!forgotMode)}
                delayLongPress={500}
              >
                <Text style={styles.forgotText}>
                  {forgotMode ? forgotData.back : loginData.forgot}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      {!toggleFocus && <View style={{ ...gs.bottomButton, opacity: toggleFocus ? 0 : 1 }}>
        <Button
          label={forgotMode ? forgotData.action : loginData.action}
          width="100%"
          background={team.secondColor}
          fontFamily="Raleway_900Black"
          fontSize={15}
          paddingTop={10}
          paddingBottom={10}
          borderRadius={30}
          loading={loading}
          onPress={() => (forgotMode ? requestPassword() : login())}
        />
      </View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  formContainer: {
    paddingHorizontal: 30,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: vh(25),
  },
  title: {
    fontSize: 40,
    fontFamily: "Raleway_900Black",
    color: colors["brandGreen"],
  },
  description: {
    fontFamily: "Raleway_400Regular",
    textAlign: "center",
    color: colors["text"],
  },
  input: {
    backgroundColor: colors["water"],
    height: 50,
    paddingHorizontal: 20,
    width: "100%",
    marginTop: 10,
    borderRadius: 10,
  },
  forgot: {
    marginTop: 20,
  },
  forgotText: {
    fontFamily: "Raleway_400Regular",
  },
});

const validator = (user, forgotMode) => {
  const modelsTocheck = forgotMode ? ["email"] : ["email", "password"]; 
  return modelsTocheck.some((model) => !user[model] || !user[model].length);
};

const emailValidator = (user) => {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  if (!reg.test(user.email)) { return true }
  return false
}; 

const showToaster = ({ msg, error, forgot }) => {
  Toast.show(msg, {
    duration: forgot ? 10000 : 3000,
    shadow: true,
    animation: true,
    hideOnPress: true,
    backgroundColor: error ? colors["danger"] : colors["brandGreen"],
    position: 10
  });
};

export default Login;
