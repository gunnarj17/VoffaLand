/* For future store this configuration somewhere else for example in some 
environment variables and use those variables in this file so when the code is stored in git or
somewhere else they do not also get this configuration file*/

import firebase from 'firebase/app';

import 'firebase/firestore';

//object create new application
const configuration = {
    apiKey: "AIzaSyDtvmX8T-1N5OBBXVij228d0QtWkuORYpg",
    authDomain: "voffaland-2db0c.firebaseapp.com",
    projectId: "voffaland-2db0c",
    storageBucket: "voffaland-2db0c.appspot.com",
    messagingSenderId: "445652201476",
    appId: "1:445652201476:web:eecef1c1cc86ece28f4551",
    measurementId: "G-2BTX6H8YV9"
};

firebase.initializeApp(configuration);

// get database connection
const db = firebase.firestore();

export default db;
