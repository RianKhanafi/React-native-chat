import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';


const firebaseConfig = {
  apiKey: 'AIzaSyAq6K6pJv2JYP9HcR6rzrat55DacMuEkjM',
  authDomain: 'https://chatapp-e5237.firebaseio.com',
  databaseURL: 'https://chatapp-e5237.firebaseio.com/',
  projectId: 'chatapp-e5237',
  storageBucket: 'chatapp-e5237.appspot.com',
  messagingSenderId: '581130261726',
  appId: '1:581130261726:android:cf12cf9d29a95846ba5e4f',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
