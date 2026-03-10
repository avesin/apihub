import { store } from '@/data/redux/_store';
import { setLocation, setPermissionDenied, setPermissionGranted } from '@/data/redux/location_slice';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as Location from 'expo-location';
import { Tabs } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Provider, useDispatch } from 'react-redux';

function LocationFetcher({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        // Minta permission
        const { status } = await Location.requestForegroundPermissionsAsync();
        console.log('Permission status:', status); // debug
        if (status !== 'granted') {
          dispatch(setPermissionDenied());
          return;
        } else {
          dispatch(setPermissionGranted())
        }

        // Ambil lokasi
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
          timeInterval: 5000
        });
        console.log('location:', loc); // debug
        dispatch(
          setLocation({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          })
        );
      } catch (e) {
        console.warn('Could not get location', e);
        dispatch(setPermissionDenied());
      }
    };

    fetchLocation();
  }, []);

  return <>{children}</>;
}


export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <LocationFetcher>
          <Tabs>
            <Tabs.Screen name="weather"
              options={{
                title: "Weather",
                tabBarIcon: ({ size, color }) => (
                  <FontAwesome5 name="cloud-meatball" size={size} color={color} />),
              }} />
            <Tabs.Screen name="location"
              options={{
                title: "Location",
                tabBarIcon: ({ size, color }) => (
                  <FontAwesome6 name="map-location" size={size} color={color} />),
              }} />
            <Tabs.Screen name="setting"
              options={{
                title: "Setting",
                tabBarIcon: ({ size, color }) => (
                  <FontAwesome6 name="screwdriver-wrench" size={size} color={color} />),
              }} />
          </Tabs>
        </LocationFetcher>
        <StatusBar style="auto" />
      </ThemeProvider>
    </Provider>
  );
}
