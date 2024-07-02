// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBlFAWBHaCQS7umTzoRGq0RT4K1EmkX-lQ',
  authDomain: 'yelpcamp2-0.firebaseapp.com',
  projectId: 'yelpcamp2-0',
  storageBucket: 'yelpcamp2-0.appspot.com',
  messagingSenderId: '488016695136',
  appId: '1:488016695136:web:43fbd313a795714615d805',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export const storage = getStorage(app)
