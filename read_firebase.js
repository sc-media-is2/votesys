const firebaseConfig = {
  apiKey: "AIzaSyDSW3UfkgT5kO1kTzDIFlv_QsDRkKmUCfs",
  authDomain: "voting-system-6d23d.firebaseapp.com",
  databaseURL: "https://voting-system-6d23d.firebaseio.com",
  projectId: "voting-system-6d23d",
  storageBucket: "voting-system-6d23d.appspot.com",
  messagingSenderId: "515017082682",
  appId: "1:515017082682:web:a20d97cedb8e0105"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//selfID:投票者のID。ログイン時にデータベース(user_name/<year>)より取得して割り当てられる。
let db = firebase.firestore();