import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initializeApp } from "firebase/app";

const root = ReactDOM.createRoot(document.getElementById('root'));

// firebase configs
const firebaseConfig = {
  apiKey: "AIzaSyCGuyM--mF-yzvK0AW27c6y4ayezPl85X4",
  authDomain: "my-react-blog-6a9a5.firebaseapp.com",
  projectId: "my-react-blog-6a9a5",
  storageBucket: "my-react-blog-6a9a5.appspot.com",
  messagingSenderId: "133236279338",
  appId: "1:133236279338:web:bd60eda4f827bbbed65b53"
};
const app = initializeApp(firebaseConfig);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
