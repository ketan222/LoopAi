const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const Batch = require("../models/batch");

router.post("/ingest", async (req, res) => {
  try {
    const { ids, priority } = req.body;

    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({
        success: false,
        message: "IDs must be provided as an array",
      });
    }

    if (!priority || !["HIGH", "MEDIUM", "LOW"].includes(priority)) {
      return res.status(400).json({
        success: false,
        message: "Priority must be one of: HIGH, MEDIUM, LOW",
      });
    }

    if (!ids.every((id) => Number.isInteger(id))) {
      return res.status(400).json({
        success: false,
        message: "All IDs must be integers",
      });
    }

    const ingestion_id = uuidv4();

    const batches = [];
    for (let i = 0; i < ids.length; i += 3) {
      const batchIds = ids.slice(i, i + 3);
      batches.push({
        batch_id: uuidv4(),
        ingestion_id,
        ids: batchIds,
        priority,
        status: "yet_to_start",
      });
    }

    await Batch.insertMany(batches);

    res.status(201).json({
      success: true,
      message: "Ingestion created successfully",
      data: {
        ingestion_id,
        total_batches: batches.length,
        total_ids: ids.length,
      },
    });
  } catch (error) {
    console.error("Error in ingest endpoint:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

module.exports = router;
