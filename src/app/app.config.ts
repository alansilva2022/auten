import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { provideFirestore, getFirestore } from '@angular/fire/firestore'; //importante colocar
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideEnvironmentNgxMask } from 'ngx-mask';


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), 
              provideClientHydration(), 
              provideEnvironmentNgxMask(),
              //importProvidersFrom(provideAuth(() => getAuth())), 
              importProvidersFrom(provideDatabase(() => getDatabase())), 
              //importProvidersFrom(
                //provideFirebaseApp(() => 
                  //initializeApp({})),
                  //provideFirestore(() => getFirestore()) //adicionaddo
                  //),
              importProvidersFrom(provideStorage(() => getStorage())), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"projetobiblioteca-2024tcc","appId":"1:575038282464:web:abb72903545aa6ee238e85","storageBucket":"projetobiblioteca-2024tcc.appspot.com","apiKey":"AIzaSyD_YGQ267pGW9dK99fAPXX7XbYaXA1TS_U","authDomain":"projetobiblioteca-2024tcc.firebaseapp.com","messagingSenderId":"575038282464"}))), importProvidersFrom(provideAuth(() => getAuth())), importProvidersFrom(provideFirestore(() => getFirestore())), importProvidersFrom(provideStorage(() => getStorage()))],
             
};
