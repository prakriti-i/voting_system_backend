
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";



dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res)=>{
    res.send("Voting System API is running!");
})


const startServer = async()=>{
    await connectDB();

    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

};

startServer();


