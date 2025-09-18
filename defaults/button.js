import { Dimensions } from "react-native";
import colour from "./colour";

export default {
    style: {
        button: {
        borderColor: colour.style.primary,
        borderRadius: 15,
        borderWidth: 1,
        height: 56,
        marginBottom: 30,
        paddingBottom: 12,
        paddingTop: 11,
        width: Dimensions.get('window').width - 140,
        },
        buttonText: {
            fontSize: 24,
            fontWeight: 'bold',
            lineHeight: 28,
            textAlign: 'center',
        }
    }
};