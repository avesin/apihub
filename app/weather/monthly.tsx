import { StyleSheet, View } from 'react-native';
import { Calendar } from 'react-native-big-calendar';


export default function MonthlyScreen() {
    return <View style={style.container}>
        <Calendar events={[]} height={600} mode='month' />
    </View>
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        margin: 8,
        marginBottom: 100,
    }
})