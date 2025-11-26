require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB  = require('./config/db');
const authRoutes = require("./routes/auth")




const app = express();
app.use(express.json());
app.use(cors());

connectDB();

app.use("/api/auth",authRoutes);

app.get("/",(req,res)=> res.send("JWT token refresh"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> {
console.log(`server is running ${PORT}`);
});