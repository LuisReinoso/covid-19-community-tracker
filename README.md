# Covid 19 Community Tracker
Check if you are near of suspected cases of covid-19. Self-report. No data is revealed.

<p align="center">
    <img alt="main page" style="text-align:center;" src="img/main.png" alt="main" width="500"/>
</p>

## **Important**
### **Data could be easy faked so use in own risk**

Check remaining task

## Features
- No login required
- Self-report
- One device - One location (Actually is dependent of browser). PR is needed
- User just check if they are near of this points.
- No data is revealed.

## [DEMO: Click here!](https://community-tracker-covid-19.firebaseapp.com/)

## Technologies
- Typescript
- SCSS
- Prettier
- Angular
- Firebase
- Bootstrap
- Leaflet
- fingerprintjs2
- uuid
- geofire

## Setup

Setup firebase:

```
firebase init
```

Setup environment:

``` javascript
export const environment = {
  production: true,
  firebase: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: ''
  },
  namespace: 'sdjskaldjsakldjsakdldsajlkdjsalk', // valid GUID
  api: 'https://mycloudfunctionsapi.com',
  countryBounds: {
    point1: { lat: 2.37928, lng: -92.69996 },
    point2: { lat: -5.41915, lng: -75.10254 }
  },
  countryCenter: {
    center: { lat: -1.36218, lng: -78.37646 }
  }
};

```

- **env cloud functions **

`environments.ts` file
``` javascript
export const environment = {
  firebase: {
    databaseURL: 'https://myapp.firebaseio.com',
    appURL: 'https://myapp.firebaseapp.com',
    serviceAccountPath: '../credentials/serviceAccountAdminSKD.json'
  }
}
```

- **proximity checker**

  `functions/src/index.ts`

- By default is check 10km around
- If more cases are founded so proximity is more
  ```
  - 0 -> far
  - [1, 4] -> warning
  - [5, ...] -> near
  ```

- **Database rules**

  Remember block any operatation: 'read', 'update', 'delete', 'write'

## Development

1. Install dependencies

```console
npm install
```
2. Star development server

```console
npm run start
```
3. Start to develop

Navigate to [localhost:4200](http://localhost:4200).

## Deploy
```console
npm run deploy
```

## Acknowledgment
Thanks for people to contribuite with it's ideas/opinions.

## Remaining tasks
- Improve figerprint
- Improve GPS detector
- Improve mobile detector
- Add service workers

## Licence
Luis Reinoso [MIT LICENCE](LICENCE)


