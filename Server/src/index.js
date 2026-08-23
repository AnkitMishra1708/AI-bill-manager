import "dotenv/config";
import connectDB from "./db/index.js";
import { app } from "./app.js";

const port = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.on("Error", (error) => {
      console.error("Error:", error);
      throw error;
    });

    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  })
  .catch((error) => {
    console.error("Mongodb connection failed:", error);
  });
