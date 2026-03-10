import { weatherApi } from '@/data/api/openweathermap';
import { RootState, store } from '@/data/redux/_store';
import { weatherRepository } from '@/data/repo/weather_repo';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

export default function TenDaysScreen() {
    const { latitude, longitude, permissionGranted } = useSelector(
        (state: RootState) => state.location
    );

    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Subscribe to Redux updates and trigger query
    useEffect(() => {
        if (!latitude || !longitude || !permissionGranted) return;

        // Trigger the API call via repository
        weatherRepository.getWeatherDaily({ lat: latitude, lon: longitude });

        // Subscribe to store updates to get query results
        const unsubscribe = store.subscribe(() => {
            const queryState = weatherApi.endpoints.getWeatherDaily
                .select({ lat: latitude, lon: longitude })(store.getState());

            if (queryState) {
                console.log("JJJDJDNDN", queryState.data?.list)
                setData(queryState.data?.list ?? null);
                setError(queryState.error ?? null);
                setIsLoading(queryState.status === 'pending');
            }
        });

        return () => unsubscribe();
    }, [latitude, longitude, permissionGranted]);

    if (isLoading) return (<View><ActivityIndicator size="large" /></View>)

    return (<View>
        <FlatList
            data={data}
            scrollEnabled={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
                <View style={styles.item}>
                    <Text style={styles.text}>{new Date(item.dt_txt).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                    })}</Text>
                    <Text style={styles.text}>{item.weather?.[0]?.description}</Text>
                </View>
            )}
        />
    </View>)
}

const styles = StyleSheet.create({
    item: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    text: {
        fontSize: 18,
    },
});