import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

const app = express();

mongoose
  .connect("mongodb://localhost:27017/cf-express-api-db")
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.get("/", (req, res) => {
  res.send("Restful service");
});

app.listen(5000, () => {
    console.log(`Restful server is listening on port 5000...`);
  });
  
export default app;
