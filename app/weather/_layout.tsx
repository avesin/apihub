import { weatherApi } from '@/data/api/openweathermap';
import { RootState, store } from '@/data/redux/_store';
import { weatherRepository } from '@/data/repo/weather_repo';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import LottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Tabs } from 'react-native-collapsible-tab-view';
import { useSelector } from 'react-redux';
import HourlyScreen from './hourly';
import MonthlyScreen from './monthly';
import TenDaysScreen from './ten-days';
const Tab = createMaterialTopTabNavigator();

export default function WeatherScreen() {
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
        weatherRepository.getWeather({ lat: latitude, lon: longitude });

        // Subscribe to store updates to get query results
        const unsubscribe = store.subscribe(() => {
            const queryState = weatherApi.endpoints.getWeather
                .select({ lat: latitude, lon: longitude })(store.getState());

            if (queryState) {
                setData(queryState.data ?? null);
                setError(queryState.error ?? null);
                setIsLoading(queryState.status === 'pending');
            }
        });

        return () => unsubscribe();
    }, [latitude, longitude, permissionGranted]);

    // Prepare status, temp, description
    let status: string | null = null;
    let id: number | null = null;
    let temp: number | string | null = null;
    let description: string | null = null;
    let icon: string | null = null;

    if (!permissionGranted) status = 'Location permission denied';
    else if (!latitude || !longitude) status = 'Getting location...';
    else if (isLoading) status = 'Loading weather...';
    else if (error) status = 'Error loading weather';
    else if (data) {
        status = data?.name;
        id = data?.weather?.[0]?.id;
        temp = data?.main?.temp;
        description = data?.weather?.[0]?.description;
        icon = data?.weather?.[0]?.icon;
    }

    return (
        <Tabs.Container renderHeader={() => <WeatherHeader  id ={id} status={status} temp={temp} description={description} icon={icon} />}>
            <Tabs.Tab name="Hourly">
                <Tabs.ScrollView>
                    <HourlyScreen />
                </Tabs.ScrollView>
            </Tabs.Tab>
            <Tabs.Tab name="10 Days">
                <Tabs.ScrollView>
                    <TenDaysScreen />
                </Tabs.ScrollView>
            </Tabs.Tab>
            <Tabs.Tab name="Monthly">
                <Tabs.ScrollView>
                    <MonthlyScreen />
                </Tabs.ScrollView>
            </Tabs.Tab>
        </Tabs.Container>
    )

}


function WeatherTabs() {
    return <Tab.Navigator
        screenOptions={{
            tabBarLabelStyle: { fontSize: 14 },
            tabBarIndicatorStyle: { backgroundColor: "purple" },
        }}
    >
        <Tab.Screen name="Hourly" component={HourlyScreen} />
        <Tab.Screen name="10 Days" component={TenDaysScreen} />
        <Tab.Screen name="Monthly" component={MonthlyScreen} />
    </Tab.Navigator>
}

type WeatherHeaderProps = {
    id: number | null
    status: string | null
    temp: number | string | null
    description: string | null,
    icon: string | null
}

function getAnimation(id: number | null): any | null {
    let index = 0
    if (id) {
        if (id < 300) {
            /** Thunderstrom */
            index = 1
        } else if (id < 400) {
            /** Drizzle */
            index = 2
        } else if (id < 503) {
            /** Rain */
            index = 3
        } else if (id < 511) {
            /** Rain */
            index = 4
        } else if (id < 532) {
            /** Rain */
            index = 5
        } else if (id == 701) {
            index = 6
        } else if (id == 741) {
            index = 7
        } else if (id == 800) {
            index = 8
        } else if (id > 800) {
           index = 9
        }
    }
    const animations: Record<number, any> = {
        1: require('../../assets/lottie/Weather-storm.json'),
        2: require('../../assets/lottie/Weather-windy.json'),
        3: require('../../assets/lottie/Weather-partly shower.json'),
        4: require('../../assets/lottie/Weather-storm&showers(day).json'),
        5: require('../../assets/lottie/Weather-rainy(night).json'),
        6: require('../../assets/lottie/Weather-mist.json'),
        7: require('../../assets/lottie/Foggy.json'),
        8: require('../../assets/lottie/Weather-sunny.json'),
        9: require('../../assets/lottie/Weather-partly cloudy'),
    };
    return index > 0 ? animations[index] : null
}

function WeatherHeader({ id, status, temp, description, icon }: WeatherHeaderProps) {
    return (
        <View style={styles.header}>
            <LottieView
                style={{ flex: 1, width: 100, aspectRatio: 1 }}
                source={getAnimation(id)}
                autoPlay
                loop
            />
            <Text style={styles.title}>{status}</Text>
            <Text style={styles.temp}>{temp ? `${temp}°C` : 'N/A'}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignContent: 'center' }}>
                <Image style={{ width: 32, height: 32, tintColor: "#000000" }} source={{ uri: `https://openweathermap.org/payload/api/media/file/${icon}.png` }} />
                <Text style={styles.desc}>{description || 'N/A'}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        alignItems: "center",
        paddingTop: 40,
        paddingBottom: 10,
    },
    center: {
        flex: 1,
        textAlign: 'center',
        marginTop: 50,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    temp: {
        fontSize: 48,
        marginVertical: 10,
    },
    desc: {
        fontSize: 18,
        fontStyle: 'italic',
    },
});