import dotenv from 'dotenv';
dotenv.config();

export const environment = {
  firebase: {
    apiKey: process.env['API_KEY'],
    authDomain: process.env['AUTH_DOMAIN'],
    projectId: process.env['PROJECT_ID'],
    storageBucket: process.env['STORAGE_BUCKET'],
    appId: process.env['APP_ID'],
  },
};
