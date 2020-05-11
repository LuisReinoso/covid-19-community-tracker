// This file is a template for environment.ts
// Please rename this filename to environment.ts

export const environment = {
  production: false,
  firebase: {
    apiKey: '',
    authDomain: '',
    databaseURL: 'http://localhost:9000',
    appURL: 'https://localhost:4200',
    projectId: '',
    storageBucket: 'http://localhost:8080',
    messagingSenderId: '',
    appId: ''
  },
  namespace: 'b4bfb9fd-2e9b-40e6-afcd-81ac1699eb9d', // copy valid GUID from above GUID random generator
  api: 'http://localhost:5001/community-tracker-covid-19/us-central1', // <-- replace with functions location
  countryBounds: {
    point1: { lat: 2.37928, lng: -92.69996 },
    point2: { lat: -5.41915, lng: -75.10254 }
  },
  countryCenter: {
    center: { lat: -1.36218, lng: -78.37646 }
  },
};
