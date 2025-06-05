const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema({
  batch_id: {
    type: String,
    required: true,
    unique: true,
  },
  ingestion_id: {
    type: String,
    required: true,
    index: true,
  },
  ids: {
    type: [Number],
    required: true,
    validate: [
      {
        validator: function (ids) {
          return ids.length <= 3;
        },
        message: "Batch cannot contain more than 3 IDs",
      },
      {
        validator: function (ids) {
          return ids.every((id) => Number.isInteger(id));
        },
        message: "All IDs must be integers",
      },
    ],
  },
  priority: {
    type: String,
    required: true,
    enum: ["HIGH", "MEDIUM", "LOW"],
    index: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["yet_to_start", "triggered", "completed"],
    default: "yet_to_start",
    index: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
    index: true,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Update the updated_at field before save
batchSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

const Batch = mongoose.model("Batch", batchSchema);

module.exports = Batch;
