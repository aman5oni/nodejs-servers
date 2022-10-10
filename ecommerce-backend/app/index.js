import express from "express";
import cors from "cors";
import productRoute from "../routes/productRoute";
import { errorMiddleware } from "../middleware/error";
import userRoute from "../routes/userRoute";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import orderRoute from "../routes/orderRoute";
const App = express();

App.use(
  bodyParser.urlencoded({
    extended: true
  })
);
App.use(
  cors({
    origin: "*"
  })
);
App.use(cookieParser());
App.use(express.json());

// All Routes
App.use(userRoute);
App.use(productRoute);
App.use(orderRoute);

// Middleware For Error
App.use(errorMiddleware);

export default App;
