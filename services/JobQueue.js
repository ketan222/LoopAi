let jobQueue = [];

exports.enqueue = async (job) => {
  jobQueue.push(job);
};

exports.getNextBatch = () => {
  if (jobQueue.length === 0) return null;

  jobQueue.sort((a, b) => {
    if (a.priorityValue !== b.priorityValue)
      return a.priorityValue - b.priorityValue;
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  return jobQueue.shift(); // remove & return highest-priority job
};

exports.requeue = (job) => {
  jobQueue.push(job); // add back to queue to continue later
};
