const mongoose = require('mongoose');

const uri = "mongodb+srv://georgiaairandheating_db_user:uKV3QGc6O6kBOgvR@cluster0.vhiyztl.mongodb.net/?appName=Cluster0";

async function run() {
    try {
        await mongoose.connect(uri);
        console.log("Connected successfully to server");
    } catch (err) {
        console.error("Connection failed:", err);
    } finally {
        await mongoose.disconnect();
    }
}

run();
