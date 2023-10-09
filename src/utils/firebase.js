import firebase from 'firebase/app';
import 'firebase/auth';

//Import firebase
import firebaseConfig from '../config';

//If an firebase app hasn't already been created
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

export default firebase
