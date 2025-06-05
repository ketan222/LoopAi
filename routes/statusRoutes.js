const express = require("express");
const router = express.Router();
const Batch = require("../models/batch");

router.get("/status/:ingestion_id", async (req, res) => {
  try {
    const { ingestion_id } = req.params;

    if (!ingestion_id) {
      return res.status(400).json({
        success: false,
        message: "Ingestion ID is required",
      });
    }

    const batches = await Batch.find({ ingestion_id }).sort({ created_at: 1 });

    if (batches.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No batches found for ingestion ID: ${ingestion_id}`,
      });
    }

    let overallStatus = "yet_to_start";

    if (batches.some((batch) => batch.status === "triggered")) {
      overallStatus = "triggered";
    }

    if (batches.every((batch) => batch.status === "completed")) {
      overallStatus = "completed";
    }

    const statusCounts = {
      yet_to_start: batches.filter((batch) => batch.status === "yet_to_start")
        .length,
      triggered: batches.filter((batch) => batch.status === "triggered").length,
      completed: batches.filter((batch) => batch.status === "completed").length,
    };

    res.status(200).json({
      success: true,
      data: {
        ingestion_id,
        overall_status: overallStatus,
        total_batches: batches.length,
        status_counts: statusCounts,
        batches: batches.map((batch) => ({
          batch_id: batch.batch_id,
          status: batch.status,
          priority: batch.priority,
          ids: batch.ids,
          created_at: batch.created_at,
          updated_at: batch.updated_at,
        })),
      },
    });
  } catch (error) {
    console.error("Error in status endpoint:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

module.exports = router;
