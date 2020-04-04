// This file is a template for environment.prod.ts
// Please rename this filename to environment.prod.ts

export const environment = {
  production: true,
  firebase: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    appURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: ''
  },
  namespace: '',
  api: '',
  countryBounds: {
    point1: { lat: 2.37928, lng: -92.69996 },
    point2: { lat: -5.41915, lng: -75.10254 }
  },
  countryCenter: {
    center: { lat: -1.36218, lng: -78.37646 }
  },
};
