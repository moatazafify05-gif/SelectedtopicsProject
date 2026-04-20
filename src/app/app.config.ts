import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAuth, getAuth } from '@angular/fire/auth';


import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getDatabase, provideDatabase } from '@angular/fire/database';


const firebaseConfig = {
  apiKey:            "AIzaSyBeYjY78d0GaB9GEh4OknjUVVuNCqot7WY",
  authDomain:        "uni-system-84f89.firebaseapp.com",
  databaseURL:       "https://uni-system-84f89-default-rtdb.firebaseio.com",
  projectId:         "uni-system-84f89",
  storageBucket:     "uni-system-84f89.firebasestorage.app",
  messagingSenderId: "747584228007",
  appId:             "1:747584228007:web:c4e6410a660d9463e56982"
};

export const appConfig: ApplicationConfig = {
  providers: [

    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),

    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideDatabase(() => getDatabase()),
    provideAuth(() => getAuth()),
  ]
};
