import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/functions';

const firebaseConfig = {
    apiKey: "your_config_value",
    projectId: "your_config_value",
    storageBucket: "your_config_value",
    appId: "your_config_value"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const fnct = firebase.app().functions('europe-west1');
const fv = firebase.firestore.FieldValue;
const storage = firebase.storage();

const settings = {
    cacheSizeBytes: firebase.CACHE_SIZE_UNLIMITED
};
db.settings(settings);


export { db, fnct, fv, storage };