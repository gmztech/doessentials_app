import firebase from "../../firebase/firebase"; 
let configs = async () => {
  const configRef = await firebase
    .firestore()
    .collection("appConfig")
    .get();
  if(configRef.empty) { return {} }
  return configRef.docs.map(d => d.data())
}; 
export default configs; 