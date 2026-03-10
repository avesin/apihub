// repository/weatherRepository.ts
import { weatherApi } from '../api/openweathermap';
import { store } from '../redux/_store';

interface WeatherParams {
  lat: number;
  lon: number;
}

export const weatherRepository = {
  getWeather: (params: WeatherParams) => {
    return store.dispatch(weatherApi.endpoints.getWeather.initiate(params));
  },
  getWeatherHourly: (params: WeatherParams) => {
    return store.dispatch(weatherApi.endpoints.getWeatherHourly.initiate(params));
  },
  getWeatherDaily: (params: WeatherParams) => {
    return store.dispatch(weatherApi.endpoints.getWeatherDaily.initiate(params));
  }
};