import * as functions from 'firebase-functions';
const environment = functions.config().env;
const whitelist = [
  environment.firebase.appURL,
  environment.firebase.databaseURL
]; // enable for test 'http://localhost:4200'
const corsOptionsDelegate = function(req: any, callback: any) {
  let corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true, allowedHeaders: '*' };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};

const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.cert(environment.serviceAccount),
  databaseURL: 'https://community-tracker-covid-19.firebaseio.com'
});

const cors = require('cors')(corsOptionsDelegate);
const geo = require('geofirex').init(admin);
import { get } from 'geofirex';
const locations = admin.firestore().collection(`tracker-id`);

exports.createCovidData = functions.https.onRequest(async (req, res) => {
  cors(req, res, () => {
    const covidData: CovidData = req.body;
    if (!covidData.id) {
      return res.status(400).json({ message: `id is required` });
    }

    if (!covidData.location) {
      return res.status(400).json({ message: `location is required` });
    }

    const covidDataIdRef = admin.firestore().doc(`tracker-id/${covidData.id}`);
    return covidDataIdRef
      .get()
      .then((response: any) => {
        if (response.exist) {
          return res.status(400).json({ message: 'Covid user exist' });
        }

        // TODO: check if it's valid to improve security but is GUID
        // if (!this.isValidId()) {
        //  return res.status(400).json({ message: 'Covid user invalid' });
        // }
        covidData.createdAt = new Date().getTime();
        covidData.updatedAt = new Date().getTime();
        covidData.location = geo.point(covidData.location.lat, covidData.location.lng);

        return covidDataIdRef
          .create(covidData)
          .then(() => {
            const statsToUpdate: any = updateStateStats(covidData.metadata.state, {
              isIncrement: true
            });
            statsToUpdate.register = admin.firestore.FieldValue.increment(1);
            return admin
              .firestore()
              .collection(`stats`)
              .doc(`ecuador`)
              .update(statsToUpdate)
              .then(() => res.status(200).json({ message: `Covid data was created` }));
          })
          .catch((error: any) => res.status(400).json({ message: `error: ${error}` }));
      })
      .catch((error: any) => res.status(400).json({ message: `error: ${error}` }));
  });
});

exports.updateCovidData = functions.https.onRequest(async (req, res) => {
  cors(req, res, () => {
    const covidData: CovidData = req.body;
    if (!covidData.id) {
      return res.status(400).json({ message: `id is required` });
    }

    const covidDataIdRef = admin.firestore().doc(`tracker-id/${covidData.id}`);
    return covidDataIdRef
      .get()
      .then((response: any) => {
        const oldCovidData = response.data();
        if (!oldCovidData) {
          return res.status(400).json({ message: 'Covid user incorrect' });
        }

        delete covidData['id'];
        delete covidData['location'];
        delete covidData['createdAt'];
        covidData.updatedAt = new Date().getTime();

        return covidDataIdRef
          .update(covidData)
          .then(() => {
            let statsToUpdate: any = {};

            if (oldCovidData.metadata.state !== covidData.metadata.state) {
              statsToUpdate = {
                ...updateStateStats(oldCovidData.metadata.state, { isIncrement: false }),
                ...updateStateStats(covidData.metadata.state, { isIncrement: true })
              };
              return admin
                .firestore()
                .collection(`stats`)
                .doc(`ecuador`)
                .update(statsToUpdate)
                .then(() => res.status(200).json({ message: `Covid data was updated` }));
            }
            return res.status(200).json({ message: `Covid data was updated` });
          })
          .catch((error: any) => res.status(400).json({ message: `error: ${error}` }));
      })
      .catch((error: any) => res.status(400).json({ message: `error: ${error}` }));
  });
});

exports.checkProximity = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const queryLocation: any = req.query;
    const covidLocation = JSON.parse(queryLocation.location);
    if (!covidLocation || !covidLocation.lat && !covidLocation.lng) {
      return res.status(400).json({ message: `location is required` });
    }
    const position = geo.point(covidLocation.lat, covidLocation.lng);
    const radius = 10;
    const field = 'location';

    const query = geo.query(locations).within(position, radius, field);
    const proximity = await get(query);
    let proximityId = 'far';
    if (proximity.length > 0 && proximity.length < 5) {
      proximityId = 'warning';
    } else if (proximity.length >= 5) {
      proximityId = 'near';
    }
    return res.status(200).json({ proximity: proximityId });
  });
});

function updateStateStats(
  state: CovidState,
  opt: { isIncrement: boolean } = { isIncrement: false }
): any {
  const statsToUpdate: any = {};
  switch (state) {
    case CovidState.false:
      statsToUpdate.false = admin.firestore.FieldValue.increment(opt.isIncrement ? 1 : -1);
      break;
    case CovidState.negative:
      statsToUpdate.negative = admin.firestore.FieldValue.increment(opt.isIncrement ? 1 : -1);
      break;
    case CovidState.positive:
      statsToUpdate.positive = admin.firestore.FieldValue.increment(opt.isIncrement ? 1 : -1);
      break;
    case CovidState.suspect:
      statsToUpdate.suspect = admin.firestore.FieldValue.increment(opt.isIncrement ? 1 : -1);
      break;
    default:
      break;
  }
  return statsToUpdate;
}

export interface CovidData {
  id: string;
  location: CovidLocation;
  metadata: Metadata;
  updatedAt: number;
  createdAt: number;
}

export interface CovidLocation {
  lat: number;
  lng: number;
}

export interface Metadata {
  fiebre: boolean;
  cansancio: boolean;
  tosSeca: boolean;
  congestionNasal: boolean;
  rinorrea: boolean;
  dolorGarganta: boolean;
  diarrea: boolean;
  days: number;
  state: CovidState;
}

export enum CovidState {
  'positive' = 'positive',
  'negative' = 'negative',
  'suspect' = 'suspect',
  'false' = 'false'
}
