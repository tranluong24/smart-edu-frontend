import React from 'react';
import ReactDOM from 'react-dom/client'; 
import App from './App';
import { BrowserRouter } from 'react-router-dom'; 
import { AuthProvider } from './contexts/AuthContext'; 
import './assets/css/App.css'; 


const rootElement = document.getElementById('root');

const root = ReactDOM.createRoot(rootElement);


root.render(
  <React.StrictMode> 
    <BrowserRouter>   
      <AuthProvider>    
        <App />         
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);