import express from "express";
import cors from "cors";
import dotenv from "dotenv"; 
import dbconnect from "./Config/db.js"; 
import userroute from "./route/userroute.js";
import postroute from "./route/postroute.js";
dotenv.config();
const app = express();
dbconnect();

app.use(express.json());

app.use(cors({
  origin: process.env.CLIENT_URL,  //  frontend URL
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.get("/", (req, res) => {
  res.send("API is running...");
});
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});
app.use("/api/auth",userroute)
app.use("/api/posts", postroute);

// PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});