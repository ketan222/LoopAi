// workers/IngestionWorker.js
const jobQueue = require("../services/jobQueue.js");

let lastBatchTime = 0;

async function processBatch() {
  const now = Date.now();

  // Rate limit: only allow a batch every 5 seconds
  if (now - lastBatchTime < 5000) return;

  const nextJob = jobQueue.getNextBatch();
  if (!nextJob || !nextJob.ids || nextJob.ids.length === 0) return;

  // Slice the next 3 ids
  const idsToProcess = nextJob.ids.splice(0, 3);
  lastBatchTime = now;

  // Simulate processing
  for (const id of idsToProcess) {
    console.log(`Processing id: ${id}`);
    await simulateFetch(id);
  }

  // If remaining IDs, put the job back in queue
  if (nextJob.ids.length > 0) {
    jobQueue.requeue(nextJob); // reinsert job with remaining ids
  }
}

async function simulateFetch(id) {
  return new Promise(
    (resolve) =>
      setTimeout(() => {
        console.log({ id, data: "processed" });
        resolve();
      }, 1000) // simulate delay per id
  );
}

// Polling loop
setInterval(processBatch, 1000); // checks every second
