import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Constants from 'expo-constants';

const API_KEY = Constants.expoConfig?.extra?.OPENWEATHER_API_KEY;

const baseUrl = 'https://api.openweathermap.org/data/2.5/';
// const baseUrl = 'https://pro.openweathermap.org/data/2.5/';

export const weatherApi = createApi({
    reducerPath: 'weatherApi',
    baseQuery: async (args, api, extraOptions) => {
        const baseQuery = fetchBaseQuery({ baseUrl });
        const result = await baseQuery(args, api, extraOptions);

        console.info("===============================================================");
        console.info("Weather API api:", api);
        console.info("Weather API response:", JSON.stringify(result));
        console.info("Weather API request:", args);
        console.info("===============================================================");

        return result;
    },
    endpoints: (builder) => ({
        getWeather: builder.query({
            query: ({ lat, lon }: { lat: number; lon: number }) => `weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
        }),
        getWeatherHourly: builder.query({
            query: ({ lat, lon }: { lat: number; lon: number }) => `forecast/hourly?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
        }),
        getWeatherDaily: builder.query({
            query: ({lat, lon}: {lat: number; lon: number}) => `forecast?lat=${lat}&lon=${lon}&cnt=10&appid=${API_KEY}`,
        })
    }),
});

export const { useGetWeatherQuery, useGetWeatherHourlyQuery, useGetWeatherDailyQuery } = weatherApi;