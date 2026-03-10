import CardWeather from '@/components/ui/card_weather';
import { weatherApi } from '@/data/api/openweathermap';
import { RootState } from '@/data/redux/_store';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';

export default function HourlyScreen() {
    const state = useSelector((state: RootState) => state);
    const { latitude, longitude } = state.location;
    const weatherQuery = latitude && longitude ? weatherApi.endpoints.getWeather.select({ lat: latitude, lon: longitude })(state) : undefined

    const data = weatherQuery?.data;
    const error = weatherQuery?.error;
    const isLoading = weatherQuery?.status === 'pending';

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <CardWeather icon="wind" title="Wind speed" content={data?.wind.speed + "km/h"} sub_title={
                    data?.wind.deg == 0 ? "North" : data?.wind.deg == 90 ? "East" : "West-Southwest"
                } />
                <CardWeather icon="cloud-rain" title="Rain chance" content={data?.main.humidity + "%"} sub_title={data?.clouds.all + "%"} />
            </View>
            <View style={{ ...styles.row, marginTop: 8 }}>
                <CardWeather icon="skyatlas" title="Presure" content={data?.main.pressure + " hpa"} sub_title="32 hpa" />
                <CardWeather icon="sun" title="UV Index" content="2.3" sub_title="0.3" />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 8,
        alignContent: 'center'
    },
    row: {
        flexDirection: 'row',
        gap: 16,
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
    }
})