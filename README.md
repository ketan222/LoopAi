# Job Processing Server with Express and MongoDB

A Node.js server built with Express and MongoDB that implements a job processing system with priority queues and rate limiting.

## Features

- POST `/api/ingest` endpoint for ingesting IDs with priority
- Background job processor that processes batches at a rate of 1 batch every 5 seconds
- GET `/api/status/:ingestion_id` endpoint for checking ingestion status
- Priority-based queuing (HIGH, MEDIUM, LOW)
- Automatic batching of IDs (max 3 per batch)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/job-processor
   ```
4. Start the server:
   ```
   npm start
   ```

## API Documentation

### POST /api/ingest

Accepts a list of integer IDs and a priority level, batches them, and enqueues them for processing.

**Request Body:**
```json
{
  "ids": [1, 2, 3, 4, 5, 6, 7],
  "priority": "HIGH" // "HIGH", "MEDIUM", or "LOW"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Ingestion created successfully",
  "data": {
    "ingestion_id": "123e4567-e89b-12d3-a456-426614174000",
    "total_batches": 3,
    "total_ids": 7
  }
}
```

### GET /api/status/:ingestion_id

Returns the status of all batches for a given ingestion_id.

**Response:**
```json
{
  "success": true,
  "data": {
    "ingestion_id": "123e4567-e89b-12d3-a456-426614174000",
    "overall_status": "triggered",
    "total_batches": 3,
    "status_counts": {
      "yet_to_start": 1,
      "triggered": 1,
      "completed": 1
    },
    "batches": [
      {
        "batch_id": "batch-1",
        "status": "completed",
        "priority": "HIGH",
        "ids": [1, 2, 3],
        "created_at": "2023-08-22T10:30:00.000Z",
        "updated_at": "2023-08-22T10:31:00.000Z"
      },
      {
        "batch_id": "batch-2",
        "status": "triggered",
        "priority": "HIGH",
        "ids": [4, 5, 6],
        "created_at": "2023-08-22T10:30:00.000Z",
        "updated_at": "2023-08-22T10:31:00.000Z"
      },
      {
        "batch_id": "batch-3",
        "status": "yet_to_start",
        "priority": "HIGH",
        "ids": [7],
        "created_at": "2023-08-22T10:30:00.000Z",
        "updated_at": "2023-08-22T10:30:00.000Z"
      }
    ]
  }
}
```

## Testing

Run tests with:
```
npm test
```