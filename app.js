const express = require("express");
const ingestionController = require("./controllers/ingestion");

const app = express();
app.use(express.json());

app.use("/ingest", ingestionController.ingest);

module.exports = app;
