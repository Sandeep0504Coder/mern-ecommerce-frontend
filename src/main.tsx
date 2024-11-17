import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import "./styles/app.scss"
import { Provider } from 'react-redux'
import { store, persistor } from './redux/store.ts'
import { PersistGate } from "redux-persist/integration/react";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)
