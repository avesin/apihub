import 'dotenv/config';
import appJson from './app.json';

export default {
  ...appJson,
  expo: {
    ...appJson.expo,
    extra: {
      ...appJson.expo.extra,
      OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY,
    },
  },
};