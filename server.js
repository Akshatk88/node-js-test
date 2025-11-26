require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB Connected Successfully"))
  .catch((err) => console.log(" MongoDB Connection Error:", err));


app.use("/api/auth", require("./routes/auth"));


app.get("/", (req, res) => {
  res.send("Server is running...");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log( `Server running on port ${PORT}`);
});
