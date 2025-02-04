import express from "express";
import { Router } from "express";
import dotenv from "dotenv";
import methodOverride from "method-override";
import "dotenv/config";
import productRouter from "./routes/productRoutes.js";
import orderRouter from "./routes/orderRouter.js";
import path from "path";
import cors from "cors";
import publicRouter from "./routes/publicRoutes.js";
import adminRouter from "./routes/adminRouter.js";
import privateUsers from "./routes/privateUsers.js";
import { connectDb } from "./database/connector.js";
import { fileURLToPath } from "url";

//initialise express server
const app = express();
const port = process.env.port;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//set up form handler middleware
app.use(express.urlencoded({ extended: true }));

// setup jso converter
app.use(express.json());
//set up non get&post converter
app.use(methodOverride("_method"));

const allowedOrigins = [
  "http://localhost:3000",
  "https://myapp.com",
  "http://localhost:5173",
  "http://localhost:5174",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Allow the request
      } else {
        callback(new Error("Not allowed by CORS")); // Block the request
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/public", publicRouter);
app.use("/official", privateUsers);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../blogInterface/dist")));

  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "blogInterface", "dist", "index.html")
    );
  });
}

//catch all middleware to catch errors not from our expected routes
app.use((req, res, next) => {
  const error = new Error("not found");
  //if its not an expected route set it as 404 not found;
  error.status = 404;
  next(error); //pass error to global middleware
});

//global error handler this middleware takes 4 parameters to be recognised as an official error handler
app.use((error, req, res, next) => {
  //return json data showing the error status coming from prev middlware
  res.status(error.status || 500).json({
    message: error.message || "internal server error",
  });
});

connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log("Server running on port:", port);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });
