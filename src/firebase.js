import firebase from "firebase/app";

import "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD4ZbRBKxlO79OlIODJw3H6fl5eNFPMp48",
  authDomain: "notes-313614.firebaseapp.com",
  projectId: "notes-313614",
  storageBucket: "notes-313614.appspot.com",
  messagingSenderId: "706314816923",
  appId: "1:706314816923:web:ed8dcb19fb7ef32459253e",
  measurementId: "G-XFE0K9JDJG",
};

firebase.initializeApp(firebaseConfig);

const firebaseDB = firebase.database();

const firebaseTasks = firebaseDB.ref("tasks");
const firebaseNotes = firebaseDB.ref("notes");

const firebaseLooper = (snapshot) => {
  const data = [];
  snapshot.forEach((childSnapshot) => {
    data.push({
      ...childSnapshot.val(),
    });
  });
  return data;
};

export { firebase, firebaseDB, firebaseTasks, firebaseNotes, firebaseLooper };
