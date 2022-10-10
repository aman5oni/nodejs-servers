import App from "./app";
import { PORT } from "./config/appConfig";
import databaseConnection from "./config/dataBase";

// Uncaught / Referance Error
process.on("uncaughtException", (err) => {
  console.log(`Error ${err.message}`);
  console.log("Shutting Down The Server Due To Uncaught Exception");
  process.exit(1);
});

databaseConnection();
const Server = App.listen(PORT, () => {
  console.log(`Listening to Port: ${PORT}`);
});

// Unhandled Promise Rejection

process.on("unhandledRejection", (err) => {
  console.log(`Error ${err.message}`);
  console.log("Shutting Down The Server Due To Unhandled Promise Rejection");
  Server.close(() => {
    process.exit(1);
  });
});
