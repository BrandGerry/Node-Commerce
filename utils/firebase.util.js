const { initializeApp } = require('firebase/app');
const { getStorage } = require('firebase/storage');

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const firebaseConfig = {
    apiKey: "AIzaSyDEVYzcvbm1jZpuLoW-3thrzwOo4GKsKWU",
    authDomain: "ecommerce-final-866af.firebaseapp.com",
    projectId: "ecommerce-final-866af",
    storageBucket: "ecommerce-final-866af.appspot.com",
    messagingSenderId: "802410484335",
    appId: "1:802410484335:web:a0c7bcddd36a4d9de2739a"
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

module.exports = { storage };
