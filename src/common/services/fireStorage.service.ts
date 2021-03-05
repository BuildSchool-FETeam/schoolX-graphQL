import { Injectable } from '@nestjs/common';
import * as firebase from 'firebase/app';

@Injectable()
export class FirebaseStorageService {
  private readonly firebaseConfig = {
    apiKey: 'AIzaSyC4FV6Cyn6N_P2G3zLd128k9wf3Kt5k3Wo',
    authDomain: 'schoolx-a58c0.firebaseapp.com',
    projectId: 'schoolx-a58c0',
    storageBucket: 'schoolx-a58c0.appspot.com',
    messagingSenderId: '31961184155',
    appId: '1:31961184155:web:85622902e4e8fa86cf933e',
    measurementId: 'G-E9KDGDBHFF',
  };

  private storage: firebase.default.storage.Storage;

  constructor() {
    const app = firebase.default.initializeApp(this.firebaseConfig);
    this.storage = app.storage();
  }
}
