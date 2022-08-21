import React from 'react';
import ReactDOM from 'react-dom/client';
import {PayPalScriptProvider} from "@paypal/react-paypal-js"


//pentru a utiliza bootstrap peste tot trebuie importat aici
//cand adaugam ceva in pakage json trebuie sa restartam aplicatia
import 'bootstrap/dist/css/bootstrap.min.css';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import App from './App';
import { StoreProvider } from './Store';

//pentru a vedea de forma dinamica  numele produsului in partea de sus a paginei utiliza react-helmet-async

//pentru a folosi data din bac scriem asta in package json   "proxy": "http://localhost:5000",

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  {/* utilizam storeProvider pentru a avea acces la store */}
    <StoreProvider>
      {/* si facem un wqrap in helmet provider pentru a putea actiona in toate compoinentele */}
      <HelmetProvider>
      {/* facem wrapu asta pentru a putea folosi paypal */}
      <PayPalScriptProvider deferLoading={true}>
        <App />
        </PayPalScriptProvider>
      </HelmetProvider>
    </StoreProvider>
  </React.StrictMode>
);
