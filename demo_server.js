// demo_server.js
import express from 'express';
import cors from 'cors';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

const app = express();
const port = 3000;

const firebaseConfig = {
    apiKey: "AIzaSyDn1diK1hdrfAaqnxhnFlqQ5qvwUfAhags",
    authDomain: "rockerzz-8e4e5.firebaseapp.com",
    projectId: "rockerzz-8e4e5",
    storageBucket: "rockerzz-8e4e5.appspot.com",
    messagingSenderId: "741020854623",
    appId: "1:741020854623:web:158337df9eaca5deb4eeea",
    measurementId: "G-H7CDMWPZJH"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

app.use(cors());

async function getNutrientDataForPeriod(userId, startDate, endDate) {
    const nutrientQuery = query(
        collection(db, "nutrients"),
        where("userId", "==", userId),
        where("timestamp", ">=", startDate),
        where("timestamp", "<=", endDate)
    );

    const querySnapshot = await getDocs(nutrientQuery);
    let periodTotals = {
        calcium: 0,
        vitaminD: 0,
        iron: 0,
        protein: 0,
        fiber: 0,
        vitaminC: 0,
        addedSugars: 0,
        transFats: 0,
        saturatedFats: 0,
        sodium: 0,
        caffeine: 0,
        artificialSweeteners: 0,
        refinedCarbohydrates: 0,
        processedMeats: 0
    };

    querySnapshot.forEach((doc) => {
        const data = doc.data().mealData;
        for (const nutrient in periodTotals) {
            periodTotals[nutrient] += data[nutrient];
        }
    });

    return periodTotals;
}

app.get('/api/nutrients', async (req, res) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    const endDate = new Date();
    const userId = "user_123";

    try {
        const nutrientData = await getNutrientDataForPeriod(userId, startDate, endDate);
        res.json(nutrientData);
    } catch (error) {
        console.error("Error fetching nutrient data:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
