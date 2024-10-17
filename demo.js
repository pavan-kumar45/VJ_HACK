import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDn1diK1hdrfAaqnxhnFlqQ5qvwUfAhags",
    authDomain: "rockerzz-8e4e5.firebaseapp.com",
    projectId: "rockerzz-8e4e5",
    storageBucket: "rockerzz-8e4e5.appspot.com",
    messagingSenderId: "741020854623",
    appId: "1:741020854623:web:158337df9eaca5deb4eeea",
    measurementId: "G-H7CDMWPZJH"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// const analytics = getAnalytics(app); // Include only if you need Analytics


// Function to log meal data
async function logMealData(userId, mealData) {
    try {
        await addDoc(collection(db, "nutrients"), {
            userId: userId,
            mealData: mealData,
            timestamp: new Date() // Store timestamp for time-series analysis
        });
        console.log("Meal data logged successfully");
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

// Example usage to store meal data from image analysis
const nutrients = {
    calcium: 150, // in mg
    vitaminD: 0.5, // in µg
    iron: 3.5, // in mg
    protein: 45, // in g
    fiber: 6, // in g
    vitaminC: 40, // in mg
    addedSugars: 0, // in g
    transFats: 0, // in g
    saturatedFats: 5, // in g
    sodium: 600, // in mg
    caffeine: 0, // in mg
    artificialSweeteners: 0, // in mg
    refinedCarbohydrates: 30, // in g
    processedMeats: 0 // in g
};

// logMealData("user_123", nutrients);

// Function to get nutrient data for a specific period (e.g., week, month, year)
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

// Example usage to get weekly nutrient totals
// const startOfWeek = new Date();
// startOfWeek.setDate(startOfWeek.getDate() - 7);
// const endOfWeek = new Date();

// getNutrientDataForPeriod("user_123", startOfWeek, endOfWeek).then(weeklyTotals => {
//     console.log("Weekly Nutrient Totals: ", weeklyTotals);
// });

// Function to load Google Charts and draw a chart
function drawChart(periodTotals, periodType, chartType) {
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(function () {
        const data = new google.visualization.DataTable();
        data.addColumn('string', 'Nutrient');
        data.addColumn('number', 'Amount');

        for (const nutrient in periodTotals) {
            data.addRow([nutrient, periodTotals[nutrient]]);
        }

        const options = {
            title: `${periodType} Nutrient Breakdown`,
            chartArea: { width: '70%', height: '80%' },
        };

        let chart;
        if (chartType === 'pie') {
            chart = new google.visualization.PieChart(document.getElementById(`${periodType.toLowerCase()}PieChart`));
        } else if (chartType === 'bar') {
            chart = new google.visualization.BarChart(document.getElementById(`${periodType.toLowerCase()}BarChart`));
        }

        chart.draw(data, options);
    });
}

// Function to visualize daily, weekly, and monthly nutrient data
async function visualizeAllData() {
    const userId = "user_123";

    // Daily Totals
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();

    const dailyTotals = await getNutrientDataForPeriod(userId, startOfDay, endOfDay);
    console.log("Daily Nutrient Totals:", dailyTotals);
    drawChart(dailyTotals, 'Daily', 'pie'); // Pie chart for daily
    drawChart(dailyTotals, 'Daily', 'bar'); // Bar chart for daily

    // Weekly Totals
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 7);
    const weeklyTotals = await getNutrientDataForPeriod(userId, startOfWeek, endOfDay);
    console.log("Weekly Nutrient Totals:", weeklyTotals);
    drawChart(weeklyTotals, 'Weekly', 'pie'); // Pie chart for weekly
    drawChart(weeklyTotals, 'Weekly', 'bar'); // Bar chart for weekly

    // Monthly Totals
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    const monthlyTotals = await getNutrientDataForPeriod(userId, startOfMonth, endOfDay);
    console.log("Monthly Nutrient Totals:", monthlyTotals);
    drawChart(monthlyTotals, 'Monthly', 'pie'); // Pie chart for monthly
    drawChart(monthlyTotals, 'Monthly', 'bar'); // Bar chart for monthly
}

// Call the function to visualize all data
visualizeAllData();