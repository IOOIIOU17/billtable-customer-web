import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAZMGuzojPeBrnMHfhW9wtehLqMbwsIR8w",
  authDomain: "billtable-ce0be.firebaseapp.com",
  projectId: "billtable-ce0be",
  storageBucket: "billtable-ce0be.firebasestorage.app",
  messagingSenderId: "777802287340",
  appId: "1:777802287340:web:cb4b832258fbb1fec13dc9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
