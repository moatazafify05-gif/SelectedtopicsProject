import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';


import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getDatabase, provideDatabase } from '@angular/fire/database';


const firebaseConfig = {
  apiKey: "AIzaSyBe...",
  authDomain: "uni-system-84f89.firebaseapp.com",
  databaseURL: "https://uni-system-84f89-default-rtdb.firebaseio.com",
  projectId: "uni-system-84f89",
  storageBucket: "uni-system-84f89.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};

export const appConfig: ApplicationConfig = {
  providers: [

    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),

    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideDatabase(() => getDatabase())
  ]
};
