import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";

const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //for using form data
app.use(cors());
app.use(xookieParser());

//morgan logger
app.use(morgan("tiny"));

export default app;
