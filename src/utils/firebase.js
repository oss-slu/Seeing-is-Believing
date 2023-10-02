import firebase from 'firebase/app';
import 'firebase/auth';

// import the configured Firebase instance from config.js
import firebaseConfig from '../config';

//If an firebase app hasn't already been created
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

export default firebase
