const Batch = require("../Models/batch.js");

/**
 * Job processor service for processing batches
 */
class JobProcessor {
  constructor() {
    this.running = false;
    this.processingInterval = 5000; // 5 seconds between batch processing
  }

  /**
   * Start the job processor
   */
  start() {
    if (this.running) {
      console.log("Job processor is already running");
      return;
    }

    this.running = true;
    console.log("Job processor started");
    this.processNextBatch();
  }

  /**
   * Stop the job processor
   */
  stop() {
    this.running = false;
    console.log("Job processor stopped");
  }

  /**
   * Process the next batch
   */
  async processNextBatch() {
    if (!this.running) return;

    try {
      // Find the next batch to process based on priority and creation time
      const batch = await Batch.findOneAndUpdate(
        { status: "yet_to_start" },
        { status: "triggered" },
        {
          sort: {
            // Sort by priority (HIGH > MEDIUM > LOW) and then by creation time (oldest first)
            priority: -1,
            created_at: 1,
          },
          new: true,
        }
      );

      if (batch) {
        console.log(
          `Processing batch: ${batch.batch_id}, Priority: ${
            batch.priority
          }, IDs: ${batch.ids.join(", ")}`
        );

        // Process each ID in the batch with a simulated delay
        await this.processBatchIds(batch);

        // Mark the batch as completed
        batch.status = "completed";
        await batch.save();

        console.log(`Completed batch: ${batch.batch_id}`);
      } else {
        console.log("No batches to process");
      }
    } catch (error) {
      console.error("Error processing batch:", error);
    }

    // Schedule the next batch processing after the interval
    setTimeout(() => this.processNextBatch(), this.processingInterval);
  }

  async processBatchIds(batch) {
    // Process each ID with a simulated delay
    for (const id of batch.ids) {
      await this.processId(id);
    }
  }

  async processId(id) {
    // Simulate processing delay (random between 500ms and 1500ms)
    const processingTime = Math.floor(Math.random() * 1000) + 500;

    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Processed ID: ${id} (took ${processingTime}ms)`);
        resolve();
      }, processingTime);
    });
  }
}

// Create and export a singleton instance
const jobProcessor = new JobProcessor();
module.exports = jobProcessor;
