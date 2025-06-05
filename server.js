const app = require("./app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const port = process.env.PORT || 3000;
const db = process.env.DATABASE || process.env.LOCALDATABASE;

console.log(db + " " + port);

mongoose.connect(db).then(() => {
  console.log("Database connection successful");
});

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
