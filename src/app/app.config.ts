import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';

// Firebase konfiguráció (demo adatok)
const firebaseConfig = {
  apiKey: "AIzaSyBysXOmnKUrHJakcA9vQYD8crQsNNZAp7c",
  authDomain: "totallynotmvm.firebaseapp.com",
  projectId: "totallynotmvm",
  storageBucket: "totallynotmvm.firebasestorage.app",
  messagingSenderId: "631992960215",
  appId: "1:631992960215:web:da2136cc6aa4710ca3dc92",
  measurementId: "G-552NK70B4P"
};

// Inicializáljuk a Firebase app-ot és a Firestore-t
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideAnimations()
  ]
};
