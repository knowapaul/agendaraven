// React Resources
import React from 'react';
import ReactDOM from 'react-dom/client';

// Project Resources
import './index.css';
import App from './App';

// Other Resources
import reportWebVitals from './reportWebVitals';


console.log('Firebase emulator warning bar hidden')

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

// reportWebVitals();