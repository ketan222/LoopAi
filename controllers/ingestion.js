const { v4: uuidv4 } = require("uuid");
const jobQueue = require("../services/jobQueue");
const ingestionModel = require("../models/ingestionModel"); // note: path is case-sensitive

const PRIORITY_MAP = {
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};

exports.ingest = async (req, res) => {
  try {
    const { ids, priority } = req.body;

    // Validation
    if (
      !Array.isArray(ids) ||
      ids.length === 0 ||
      ids.some((id) => typeof id !== "number" || id < 1 || id > 1e9 + 7)
    ) {
      return res.status(400).json({
        error:
          "Invalid ids. Must be a non-empty array of integers between 1 and 1e9+7.",
      });
    }

    if (!PRIORITY_MAP.hasOwnProperty(priority)) {
      return res
        .status(400)
        .json({ error: "Invalid priority. Must be HIGH, MEDIUM, or LOW." });
    }

    const ingestion_id = uuidv4();

    // Break into batches of 3
    const batches = [];
    for (let i = 0; i < ids.length; i += 3) {
      batches.push({
        batch_id: uuidv4(),
        ids: ids.slice(i, i + 3),
        status: "yet_to_start",
      });
    }

    // Save to DB
    const ingestionDoc = await ingestionModel.create({
      ingestion_id,
      priority,
      status: "yet_to_start",
      batches,
    });

    // Queue the job for processing
    await jobQueue.enqueue({
      ingestion_id,
      ids,
      priority,
      priorityValue: PRIORITY_MAP[priority],
      batches,
    });

    // Respond
    res.status(202).json({ ingestion_id });
  } catch (error) {
    console.error("Ingestion error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
