import { Dimensions } from "react-native";
import colours from "./colours";

export default buttonStyles = {
    button: {
        borderColor: colours.primary,
        borderRadius: 15,
        borderWidth: 1,
        marginBottom: 30,
        paddingBottom: 10,
        paddingTop: 10,
        width: Dimensions.get('window').width - 160,
    },
    buttonText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    }
};