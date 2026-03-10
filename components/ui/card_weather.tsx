import { FontAwesome5 } from "@expo/vector-icons"
import { StyleSheet, Text, View } from "react-native"

type CardWeatherProps = {
    icon: string | null,
    title: string | null,
    content: string | null,
    sub_title: string | null
}

export default function CardWeather({ icon, title, content, sub_title }: CardWeatherProps) {
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <View style={styles.circle}>
                    <FontAwesome5 color="#8e8e8e" size={20} name={icon} />
                </View>
                <Text style={styles.title}>{title}</Text>
            </View>
            <Text style={styles.content}>{content}</Text>
            <View>
                <Text style={styles.sub_title}>{sub_title}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 8,
        aspectRatio: 1.3,
        padding: 8,
        flex: 1,
        borderRadius: 12,
        backgroundColor: "#eee5fa"
    },
    circle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#ffffff",
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    row: {
        flexDirection: 'row',
        alignContent: 'center'
    },
    title: {
        color: "#8e8e8e",
        marginLeft: 8,
        fontSize: 16,
        textAlignVertical: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    sub_title: {
        margin: 8,
        fontSize: 12,
    },
    content: {
        textAlignVertical: 'center',
        flex: 1,
        fontSize: 36,
    }
})