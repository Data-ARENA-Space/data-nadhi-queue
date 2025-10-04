---
name: Performance Issue
about: Report a performance problem or optimization opportunity
title: '[PERFORMANCE] '
labels: ['performance']
assignees: ''
---

## 🐌 Performance Issue Description

A clear and concise description of the performance problem.

## 📊 Current Performance

Describe the current performance characteristics:

- **Operation**: [e.g. queue.publish(), queue.fetchNext()]
- **Throughput**: [e.g. 100 msgs/sec, 1000 jobs/min]
- **Latency**: [e.g. 500ms average, 2s p99]
- **Resource Usage**: [e.g. CPU, Memory, Disk I/O]

## 🎯 Expected Performance

Describe what performance you expected or need:

- **Target Throughput**: [e.g. 1000 msgs/sec]
- **Target Latency**: [e.g. <100ms average]
- **Resource Constraints**: [e.g. limited memory, CPU]

## 🔧 Environment

- **OS**: [e.g. macOS 12.0, Ubuntu 20.04, Windows 11]
- **Node.js Version**: [e.g. 18.17.0]
- **PostgreSQL Version**: [e.g. 15.3]
- **PostgreSQL Configuration**: [e.g. default, custom tuning]
- **MinIO Version**: [e.g. RELEASE.2023-07-07T07-13-57Z]
- **Hardware**: [e.g. 4 CPU cores, 16GB RAM, SSD storage]
- **Network**: [e.g. local, AWS, latency characteristics]

## 📝 Code Sample

```typescript
// Code that demonstrates the performance issue
const queue = new Queue(db, storage);

// Your performance test code here
console.time('operation');
await queue.publish('test', buffer);
console.timeEnd('operation');
```

## 📈 Profiling Data

If you have profiling data, please include it:

```
// CPU profiling, memory usage, database query times, etc.
```

## 🔍 Investigation Done

- [ ] I've profiled the application
- [ ] I've checked database query performance
- [ ] I've monitored storage I/O
- [ ] I've tested with different data sizes
- [ ] I've tested with different concurrency levels

## 💡 Potential Solutions

If you have ideas for optimization:

- [ ] Database indexing improvements
- [ ] Connection pooling optimization
- [ ] Batch operations
- [ ] Caching strategies
- [ ] Async/parallel processing
- [ ] Other: ___________

## 📊 Test Scenario

Describe your test scenario:

- **Data Size**: [e.g. 1KB, 1MB, 10MB per message]
- **Queue Depth**: [e.g. 1000 pending messages]
- **Concurrency**: [e.g. 10 producers, 5 consumers]
- **Duration**: [e.g. 10 minutes, 1 hour]

## ✅ Checklist

- [ ] I have provided concrete performance measurements
- [ ] I have described my environment and constraints
- [ ] I have included reproducible test code
- [ ] I have investigated obvious bottlenecks