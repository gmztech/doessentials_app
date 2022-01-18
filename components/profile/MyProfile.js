

import React, { useState } from "react";
import { 
  View, 
  TextInput, 
  StyleSheet,
  Text
} from "react-native";
import colors from "../../assets/colors/colors"; 
import gs from "../../assets/css/GeneralStyles";
import { useGlobalState } from 'state-pool';

const MyProfile = ({ setUser, user, create }) => {
  const [siteData,] = useGlobalState('siteData');  
  const [profileData,] = useState(siteData.profile)
  return (
    <View>
      <Text style={styles.listTitle}>{ create ? profileData.createProfile : profileData.editProfile }</Text>
      <TextInput
        style={gs.input}
        placeholderTextColor={colors["text"]}
        placeholder="Nombre *"
        value={user.name}
        onChange={({ nativeEvent: { text: name } }) =>
          setUser({ ...user, name })
        }
      />
      <TextInput
        style={gs.input}
        placeholderTextColor={colors["text"]}
        placeholder="Apellido *"
        value={user.lastName}
        onChange={({ nativeEvent: { text: lastName } }) =>
          setUser({ ...user, lastName })
        }
      />
      <TextInput
        style={{...gs.input, backgroundColor: create ? colors['water'] : colors['lightGray']}}
        placeholderTextColor={colors["text"]}
        placeholder="Correo electrónico *"
        keyboardType="email-address"
        autoCompleteType="email"
        value={user.email}
        onChange={({ nativeEvent: { text: email } }) =>
          setUser({ ...user, email })
        }
        editable={!!create}
      />
      <TextInput
        style={gs.input}
        placeholderTextColor={colors["text"]}
        placeholder="Teléfono *"
        keyboardType="number-pad"
        autoCompleteType="tel"
        value={user.phone}
        onChange={({ nativeEvent: { text: phone } }) =>
          setUser({ ...user, phone })
        }
      />
      <TextInput
        style={gs.input}
        placeholderTextColor={colors["text"]}
        placeholder="RUT *"
        value={user.rut}
        onChange={({ nativeEvent: { text: rut } }) =>
          setUser({ ...user, rut })
        }
      />
      <TextInput
        style={gs.input}
        placeholderTextColor={colors["text"]}
        placeholder="ID Doterra"
        value={user.urlDoterra}
        onChange={({ nativeEvent: { text: urlDoterra } }) =>
          setUser({ ...user, urlDoterra })
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({ 
  listTitle: {
    color: colors['text'],
    paddingHorizontal: 10,
    paddingVertical: 10,
    textAlign: 'center'
  }
});

export default MyProfile;