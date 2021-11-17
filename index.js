import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import ContextChargementProvider from './Context/Chargement';

ReactDOM.render(
  <ContextChargementProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ContextChargementProvider>,
  document.getElementById('root')
);
