import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { provideFirestore, getFirestore } from '@angular/fire/firestore'; //importante colocar
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), 
              provideClientHydration(), 
              importProvidersFrom(provideAuth(() => getAuth())), 
              importProvidersFrom(provideDatabase(() => getDatabase())), 
              importProvidersFrom(
                provideFirebaseApp(() => 
                  initializeApp({"projectId":"autent-5db11",
                                "appId":"1:1018635080099:web:236aeea9a1e6732949ca16",
                                "databaseURL":"https://autent-5db11-default-rtdb.firebaseio.com",
                                "storageBucket":"autent-5db11.appspot.com",
                                "apiKey":"AIzaSyAUKmMzSc-uBwwm-s3HZua6ptlQSyN6vIg",
                                "authDomain":"autent-5db11.firebaseapp.com",
                                "messagingSenderId":"1018635080099"})),
                  provideFirestore(() => getFirestore()) //adicionaddo
                  ),
              importProvidersFrom(provideStorage(() => getStorage())), provideAnimationsAsync()],
             
};
