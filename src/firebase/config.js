import firebase from 'firebase/compat/app'

import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyAoxZpBmOeumTfT85tyWbgBTHkKctfGspo",
    authDomain: "chat-app-3c012.firebaseapp.com",
    projectId: "chat-app-3c012",
    storageBucket: "chat-app-3c012.appspot.com",
    messagingSenderId: "80919168011",
    appId: "1:80919168011:web:55ccc0620a822d4600730e",
    measurementId: "G-2FS5KT79JR"
  };

  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const auth = firebase.auth()
const db = firebase.firestore()

auth.useEmulator('http://localhost:9099/')
if(window.location.hostname ==='localhost'){
  db.useEmulator('localhost', '8080')
}

export {db,auth}
export default firebase