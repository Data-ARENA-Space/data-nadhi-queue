# Data Nadhi Queue

[![npm version](https://badge.fury.io/js/data-nadhi-queue.svg)](https://badge.fury.io/js/data-nadhi-queue)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/Data-ARENA-Space/data-nadhi-queue/blob/main/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/Data-ARENA-Space/data-nadhi-queue)](https://github.com/Data-ARENA-Space/data-nadhi-queue/issues)
[![GitHub stars](https://img.shields.io/github/stars/Data-ARENA-Space/data-nadhi-queue)](https://github.com/Data-ARENA-Space/data-nadhi-queue/stargazers)

A cost-effective, scalable queue framework that combines PostgreSQL and object storage (MinIO/S3) to create an intermediate storage system that simulates traditional message queuing at a fraction of the cost of cloud-provided queuing systems.

**🔗 Quick Links:**
- [📚 Documentation](https://github.com/Data-ARENA-Space/data-nadhi-queue#readme)
- [🐛 Report Issues](https://github.com/Data-ARENA-Space/data-nadhi-queue/issues)
- [💡 Request Features](https://github.com/Data-ARENA-Space/data-nadhi-queue/issues/new?template=feature_request.md)
- [🤝 Contributing](https://github.com/Data-ARENA-Space/data-nadhi-queue/blob/main/CONTRIBUTING.md)
- [📦 npm Package](https://www.npmjs.com/package/data-nadhi-queue)

## 🚀 Overview

Data Nadhi Queue provides a robust queuing solution by separating concerns:
- **PostgreSQL**: Handles queue metadata, job status tracking, and ordering
- **Object Storage (MinIO/S3)**: Stores large message payloads efficiently
- **Low Cost**: Significantly cheaper than cloud queuing services like AWS SQS, Azure Service Bus, or Google Cloud Tasks

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Producer      │───▶│   Queue System   │───▶│   Consumer      │
│                 │    │                  │    │                 │
│ - Publishes     │    │ ┌──────────────┐ │    │ - Fetches jobs  │
│   messages      │    │ │ PostgreSQL   │ │    │ - Processes     │
│ - Large         │    │ │ - Job status │ │    │ - Completes     │
│   payloads      │    │ │ - Metadata   │ │    │                 │
└─────────────────┘    │ │ - Ordering   │ │    └─────────────────┘
                       │ └──────────────┘ │
                       │ ┌──────────────┐ │
                       │ │ MinIO/S3     │ │
                       │ │ - Payloads   │ │
                       │ │ - Files      │ │
                       │ └──────────────┘ │
                       └──────────────────┘
```

## ✨ Features

- **Cost Efficient**: Use your existing PostgreSQL and object storage infrastructure
- **Scalable**: Handle large message payloads without bloating your database
- **Reliable**: ACID transactions ensure message consistency
- **Flexible**: Pluggable storage backend (currently supports MinIO, easily extensible to S3, GCS, etc.)
- **Simple API**: Clean, TypeScript-first interface
- **Status Tracking**: Built-in job status management (pending → processing → completed)

## 📦 Installation

```bash
npm install data-nadhi-queue
```

## 🔧 Prerequisites

1. **PostgreSQL Database** with the following table:
```sql
CREATE TABLE queue_log (
    message_id VARCHAR(255) PRIMARY KEY,
    file_key VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_queue_status_created ON queue_log(status, created_at);
```

2. **MinIO Server** or S3-compatible storage with a configured bucket

## 🚀 Quick Start

```typescript
import { Pool } from 'pg';
import { Queue, MinioStorage } from 'data-nadhi-queue';

// Setup database connection
const db = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'your_db',
  user: 'your_user',
  password: 'your_password',
});

// Setup storage client
const storage = new MinioStorage(
  'localhost',        // MinIO host
  9000,              // MinIO port
  'minioadmin',      // Access key
  'minioadmin',      // Secret key
  'queue-bucket'     // Bucket name
);

// Create queue instance
const queue = new Queue(db, storage);

// Publish a message
const messageData = { 
  userId: 123, 
  action: 'process_payment', 
  amount: 99.99 
};
await queue.publish('unique-message-id', Buffer.from(JSON.stringify(messageData)));

// Fetch and process messages
const job = await queue.fetchNext();
if (job) {
  console.log('Processing job:', job.message_id);
  console.log('Job data:', job.data);
  
  // Process your job here...
  
  // Mark as completed
  await queue.complete(job.message_id);
}
```

## 📚 API Reference

### `Queue`

#### Constructor
```typescript
new Queue(db: Pool, storage: StorageClient)
```

#### Methods

##### `publish(messageId: string, data: Buffer): Promise<void>`
Publishes a new message to the queue.

- `messageId`: Unique identifier for the message
- `data`: Message payload as Buffer

##### `fetchNext(): Promise<Job | null>`
Fetches the next pending job from the queue.

Returns a job object with:
```typescript
{
  message_id: string;
  file_key: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  data: any; // Parsed JSON data
}
```

##### `complete(messageId: string): Promise<void>`
Marks a job as completed and cleans up associated storage.

### `MinioStorage`

#### Constructor
```typescript
new MinioStorage(host: string, port: number, accessKey: string, secretKey: string, bucket: string)
```

### `StorageClient` Interface

Implement this interface to create custom storage backends:

```typescript
interface StorageClient {
  upload(fileKey: string, data: Buffer): Promise<void>;
  download(fileKey: string): Promise<Buffer>;
  delete(fileKey: string): Promise<void>;
}
```

## 🔌 Custom Storage Backends

You can easily implement custom storage backends by implementing the `StorageClient` interface:

```typescript
import { StorageClient } from 'data-nadhi-queue';

class S3Storage implements StorageClient {
  // Implement upload, download, delete methods
}

const queue = new Queue(db, new S3Storage());
```

## 🏗️ Use Cases

- **Background Job Processing**: Handle heavy computations, file processing, or API calls
- **Event-Driven Architecture**: Decouple microservices with reliable message passing
- **Batch Processing**: Queue large datasets for processing during off-peak hours
- **Cost Optimization**: Replace expensive cloud queuing services in development/staging environments
- **Hybrid Architectures**: Bridge on-premise and cloud systems

## 📊 Performance Characteristics

- **Throughput**: Depends on your PostgreSQL and storage performance
- **Latency**: Low latency for metadata operations, storage latency for payload operations
- **Scalability**: Horizontal scaling through database read replicas and distributed storage
- **Cost**: ~90% cost reduction compared to cloud queuing services for high-volume scenarios

## 🔗 Links & Resources

- **GitHub Repository**: [Data-ARENA-Space/data-nadhi-queue](https://github.com/Data-ARENA-Space/data-nadhi-queue)
- **npm Package**: [data-nadhi-queue](https://www.npmjs.com/package/data-nadhi-queue)
- **Report Issues**: [GitHub Issues](https://github.com/Data-ARENA-Space/data-nadhi-queue/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Data-ARENA-Space/data-nadhi-queue/discussions)
- **Contributing Guide**: [CONTRIBUTING.md](https://github.com/Data-ARENA-Space/data-nadhi-queue/blob/main/CONTRIBUTING.md)

## 🔍 Monitoring

Monitor your queue performance by querying the `queue_log` table:

```sql
-- Check queue depth
SELECT COUNT(*) FROM queue_log WHERE status = 'pending';

-- Check processing jobs
SELECT COUNT(*) FROM queue_log WHERE status = 'processing';

-- Check job age
SELECT message_id, created_at, updated_at 
FROM queue_log 
WHERE status = 'processing' 
  AND updated_at < NOW() - INTERVAL '5 minutes';
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/Data-ARENA-Space/data-nadhi-queue/blob/main/CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/Data-ARENA-Space/data-nadhi-queue/blob/main/LICENSE) file for details.

## 🙏 Acknowledgments

- Built for the Data ARENA Space project
- Inspired by the need for cost-effective queuing solutions
- Thanks to all contributors and the open-source community

---

**Made with ❤️ by the Data ARENA Space team**