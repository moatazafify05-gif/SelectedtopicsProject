import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// 1. سطور استدعاء مكتبة الفايربيز
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getDatabase, provideDatabase } from '@angular/fire/database';

// 2. اعمل Paste للكود اللي إنت نسخته من موقع فايربيز هنا مكان ده بالظبط:
const firebaseConfig = {
  apiKey: "AIzaSyBe...", // كمل الباقي من الكود بتاعك
  authDomain: "uni-system-84f89.firebaseapp.com",
  databaseURL: "https://uni-system-84f89-default-rtdb.firebaseio.com",
  projectId: "uni-system-84f89",
  storageBucket: "uni-system-84f89.appspot.com",
  messagingSenderId: "...", // كمل من الكود بتاعك
  appId: "..." // كمل من الكود بتاعك
};

export const appConfig: ApplicationConfig = {
  providers: [
    // السطور القديمة بتاعتك زي ما هي ماتغيرتش
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),

    // 3. السطور الجديدة لتفعيل الفايربيز
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideDatabase(() => getDatabase())
  ]
};
