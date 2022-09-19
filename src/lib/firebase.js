import firebase from 'firebase/app';
import 'firebase/auth';
import "firebase/firestore";
import "firebase/storage";
import { firebaseConfig } from '../config';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore()
const storage = firebase.storage();

export { storage,db, firebase as default };

