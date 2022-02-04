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

const SafeUsage = ({ navigation, route }) => {
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
                            <Text style={styles.title}>¿Cómo usar y diluir los aceites esenciales de forma segura?</Text>
                        </View>
                        {/* dessctiption */}
                        <View>
                            <Markdown>
                            Al igual que con la medicina convencional, el objetivo es introducir la sustancia en el torrente sanguíneo. La inhalación y la absorción por la piel son dos de las formas más rápidas de llevar los aceites esenciales terapéuticos al torrente sanguíneo y se pueden usar una variedad de métodos (como se indica a continuación). Recuerde que los aceites esenciales son sustancias vegetales puras que se han utilizado durante miles de años, por lo que se puede confiar en ellos para ayudar con los problemas de salud de la familia de una manera segura y natural.{'\n\n'}
                            **Para el bath:**{'\n\n'}
                            Para adultos, diluya de 4 a 10 gotas de aceite esencial en un vehículo adecuado y agréguelo al baño una vez que haya terminado de funcionar. Sumérjase en el baño durante 15-20 minutos para que los aceites hagan efecto. Los transportistas adecuados incluyen:{'\n\n'}
                            **1-** 15ml de aceite de baño o gel de baño que ha sido formulado para aceptar la adición de aceites esenciales,{'\n\n'}
                            **2-** Un solubilizante como el polisorbato 20 (comience con cantidades iguales y agregue más polisorbato hasta que se solubilicen los aceites){'\n\n'}
                            **2-** 15 ml de aceite portador. Si bien un aceite portador diluirá de manera segura el aceite esencial, no se mezclará con el agua. Flotará en la superficie del agua, se adherirá a los lados y hará que el baño sea resbaladizo. Si desea utilizar un aceite portador, se recomienda el aceite de coco fraccionado y la jojoba, ya que son ligeramente menos grasos.{'\n\n'}
                            Una sola gota de un aceite esencial adecuado es suficiente para un baño de bebé, y 2-3 gotas para niños pequeños, si se bañan en una bañera grande. Asegúrese de que los aceites se diluyan en un vehículo adecuado antes de agregarlos al baño.{'\n\n'}
                            **Para masajes:**{'\n\n'}
                            Para adultos, use hasta 2 gotas de aceite esencial por cada 5 ml de aceite portador (por ejemplo, aceite de almendras dulces o de semilla de uva) y masajee en el área afectada. Haga clic aquí para obtener consejos sobre cómo realizar un masaje de aromaterapia eficaz.{'\n\n'}
                            Para bebés mayores de 3 meses, use solo 1 gota de un aceite esencial adecuado en 15 ml de aceite portador. Para bebés de 1 a 5 años puedes usar 2 gotas y para niños de 6 a 12 años, 3 gotas{'\n\n'}
                            **Para el cuidado de la piel:**{'\n\n'}
                            Para el cuerpo utilizar 2 gotas de aceite esencial por cada 5ml de producto base (crema, loción, gel, etc) o 1 gota por cada 5ml en el rostro. Esto se aplica solo a los adultos. Ver enlace de arriba para niños{'\n\n'}
                            **Para inhalar:**{'\n\n'}
                            Agregue 3 o 4 gotas de aceite esencial adecuado a un recipiente con agua hirviendo. Inclínate sobre el tazón y coloca una toalla sobre tu cabeza y el tazón. Inhala el vapor durante 5-10 minutos. Las inhalaciones de vapor deben usarse con precaución si sufre de asma, fiebre del heno u otras alergias. Inhale durante solo 30 segundos en la primera inhalación, luego aumente gradualmente hasta 5 minutos si no hay una reacción adversa.{'\n\n'}
                            Los aceites esenciales también se pueden difundir en un quemador de vela de aromaterapia (use hasta 12 gotas de aceite en agua) o en un difusor de aromaterapia (consulte las instrucciones de su producto para conocer las cantidades). Alternativamente, para una solución rápida y fácil, coloque un par de gotas de aceite esencial en un pañuelo e inhale.{'\n\n'}
                            **Para compresas frías o calientes:**{'\n\n'}
                            Agregue 4-5 gotas de aceite esencial a un tazón de agua caliente (tan caliente como pueda soportar) o agua helada. Dobla un paño limpio (es decir, muselina, franela) y colócalo en el agua para que absorba los aceites esenciales que están flotando en la superficie. Exprima el exceso de agua y coloque el paño sobre el área afectada. La compresa se puede cubrir y mantener en su lugar con una película adhesiva o un vendaje. Reemplace la compresa cuando se haya enfriado o calentado a la temperatura de la piel.{'\n\n'}
                            **Para aplicación directa:**{'\n\n'}
                            Lavender and Tea Tree are the ONLY two aromatherapy essential oils that can be applied undiluted to the skin. They should only be used undiluted in very small quantities (1 or 2 drops) in first aid situations, e.g. for a burn or insect bite. It is not advisable to use these oils neat on a regular basis as it may lead to sensitisation.  All other oils must be diluted in a suitable carrier (e.g. base oil, cream, lotion, gel, hydrolat etc) before applying to the skin.{'\n\n'}
                            **Safety advice:**{'\n\n'}
                            If pregnant or suffering from serious health problems, then please seek advice from a qualified Aromatherapist before using essential oils. Essential oils should never be taken internally and are best stored in a cool, dark place with the cap firmly in place. Keep out of the reach of children. 
                            </Markdown>
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

export default SafeUsage;
