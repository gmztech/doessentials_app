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
import Markdown from 'react-native-simple-markdown' 
Feather.loadFont();

const Disclaimer = ({ navigation, route }) => {
    const [siteData,] = useGlobalState('siteData'); 
    const [disclaimerData,] = useState(siteData.disclaimer) 

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
                            <Text style={styles.title}>Disclaimer</Text>
                        </View>
                        {/* dessctiption */}
                        <View>
                            <Markdown>
                            **Disclaimer de responsabilidad**{'\n\n'}
                            La información proporcionada por DoEssentials en nuestra aplicación es solo para información personal e interés personal. No tiene la intención de ofrecer consejo médico profesional o tratamiento para ninguna condición. No debe utilizar nuestra app ni los consejos que contiene para tratar problemas de salud o para autodiagnosticarse. Le recomendamos que consulte a su médico de cabecera o enfermera si tiene algún problema de salud.{'\n\n'}
                            Todos nuestros consejos se han proporcionado sobre la base de que no existen contraindicaciones conocidas para el tratamiento. Si tiene algún problema de salud o está tomando algún medicamento, debe buscar el consejo de su proveedor de atención médica antes de usar la aromaterapia. También le recomendamos que haga una cita con un aromaterapeuta local que podrá tomar un historial completo del caso y ofrecerle consejos de tratamiento personalizados.{'\n\n'}
                            Tenga en cuenta que DoEssentials no acepta ninguna responsabilidad por el mal uso de los aceites esenciales u otros productos o por cualquier confianza en la información proporcionada por nosotros a través de nuestra aplicación.{'\n\n'}
                            {'\n\n'}
                            **Consejo de Seguridad**{'\n\n'}
                            **1-** Los aceites esenciales son líquidos potentes y altamente concentrados. Su potencia debe ser respetada y pueden ser tóxicos si se usan incorrectamente. La forma en que manejas y usas los aceites esenciales es muy importante. Lea los siguientes consejos para asegurarse de que utiliza los aceites esenciales de forma segura y eficaz. Tenga en cuenta que esta lista no constituye una referencia de seguridad completa. Si no está seguro, comuníquese con Base Formula o con un aromaterapeuta local calificado para obtener más consejos.{'\n\n'}
                            **2-** Los aceites esenciales son líquidos inflamables.{'\n\n'}
                            **3-** Mantener fuera del alcance de los niños.{'\n\n'}
                            **4-** Si tiene una afección médica y está tomando algún medicamento o se somete a algún tipo de tratamiento médico, debe consultar con su médico y un aromaterapeuta calificado para asegurarse de que es seguro usar la aromaterapia junto con su tratamiento recetado.{'\n\n'}
                            **5-** Ciertos aceites esenciales deben evitarse durante el embarazo. Busque asesoramiento profesional antes de usar la aromaterapia durante el embarazo.{'\n\n'}
                            **6-** Siempre consulte a un aromaterapeuta calificado antes de usar aceites esenciales con bebés y niños.{'\n\n'}
                            **7-** Nunca tome aceites esenciales por vía oral y evite todo contacto con el área de la boca y los ojos.{'\n\n'}
                            **8-** Los aceites esenciales nunca deben aplicarse sin diluir sobre la piel, ya que pueden causar irritación (solo hay un par de excepciones a esta regla, por ejemplo, lavanda y árbol de té). Siga todas las recetas y métodos cuidadosamente y no aumente la cantidad de aceite esencial citada.{'\n\n'}
                            **9-** Ciertos aceites esenciales (es decir, especias) pueden causar irritación en la piel de las personas con piel sensible. Si tiene piel sensible, le recomendamos que realice una pequeña prueba de parche antes de usar cualquier aceite o producto nuevo.{'\n\n'}
                            **10-** Algunos aceites esenciales, como el de bergamota y otros aceites cítricos, son fototóxicos, lo que significa que pueden causar sensibilización y decoloración de la piel a la luz del sol. Estos aceites no deben aplicarse sobre la piel antes de la exposición directa a la luz solar.{'\n\n'}
                            </Markdown>
                            <Text>{'\n\n'}</Text>
                            <Text>Haga clic <Text onPress={()=>{
                                navigation.navigate('SafeUsage')
                            }}>aquí</Text> para obtener más información sobre cómo usar y diluir los aceites esenciales de forma segura.</Text>
                            <Text>{'\n\n'}</Text>
                        </View>
                        {/* disclaimer */}  
                        
                    </View> 
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};  

const styles = StyleSheet.create({
    bold: {
        fontWeight: 'bold'
    },
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
});

export default Disclaimer;
