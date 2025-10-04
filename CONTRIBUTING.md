# Contributing to Data Nadhi Queue

Thank you for your interest in contributing to Data Nadhi Queue! We welcome contributions from everyone.

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm
- PostgreSQL 12+
- MinIO server or S3-compatible storage
- Git

### Development Setup

1. **Fork and Clone**
   ```bash
   git fork https://github.com/Data-ARENA-Space/data-nadhi-queue.git
   git clone https://github.com/YOUR_USERNAME/data-nadhi-queue.git
   cd data-nadhi-queue
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set up Development Environment**
   
   **PostgreSQL Setup:**
   ```sql
   CREATE DATABASE data_nadhi_queue_dev;
   
   \c data_nadhi_queue_dev;
   
   CREATE TABLE queue_log (
       message_id VARCHAR(255) PRIMARY KEY,
       file_key VARCHAR(255) NOT NULL,
       status VARCHAR(50) DEFAULT 'pending',
       created_at TIMESTAMP DEFAULT NOW(),
       updated_at TIMESTAMP DEFAULT NOW()
   );
   
   CREATE INDEX idx_queue_status_created ON queue_log(status, created_at);
   ```

   **MinIO Setup (using Docker):**
   ```bash
   docker run -p 9000:9000 -p 9001:9001 \
     -e "MINIO_ROOT_USER=minioadmin" \
     -e "MINIO_ROOT_PASSWORD=minioadmin" \
     minio/minio server /data --console-address ":9001"
   ```

4. **Build the Project**
   ```bash
   npm run build
   ```

5. **Run Tests** (when available)
   ```bash
   npm test
   ```

## 🛠️ Development Workflow

### Code Style

- We use TypeScript with strict mode enabled
- Follow existing code patterns and naming conventions
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
git commit -m "feat: add Redis storage backend support"
git commit -m "fix(queue): handle concurrent job fetching race condition"
git commit -m "docs: update API documentation with examples"
```

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

## 📝 Pull Request Process

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Write clean, well-documented code
   - Follow existing patterns and conventions
   - Add tests for new functionality (when test framework is available)

3. **Test Your Changes**
   ```bash
   npm run build
   # Run any manual tests to verify functionality
   ```

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Use the provided PR template
   - Provide a clear description of changes
   - Link any related issues
   - Request review from maintainers

### Pull Request Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review of code completed
- [ ] Documentation updated (if applicable)
- [ ] No breaking changes (or clearly documented)
- [ ] Tested manually with PostgreSQL + MinIO setup

## 🐛 Reporting Issues

### Bug Reports

Use the bug report template and include:

- **Description**: Clear description of the bug
- **Environment**: OS, Node.js version, PostgreSQL version, MinIO version
- **Steps to Reproduce**: Minimal steps to reproduce the issue
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Code Sample**: Minimal code that demonstrates the issue

### Feature Requests

Use the feature request template and include:

- **Description**: Clear description of the proposed feature
- **Use Case**: Why this feature would be useful
- **Proposed API**: How you envision the feature working
- **Alternatives**: Any alternative solutions considered

## 🎯 Areas for Contribution

### High Priority
- **Testing Framework**: Set up Jest/Mocha with test database
- **Additional Storage Backends**: AWS S3, Google Cloud Storage, Azure Blob
- **Error Handling**: Improved error handling and retry mechanisms
- **Monitoring**: Built-in metrics and health checks
- **Documentation**: More examples and tutorials

### Medium Priority
- **Performance Optimizations**: Bulk operations, connection pooling
- **CLI Tools**: Command-line interface for queue management
- **Docker Support**: Official Docker images and docker-compose examples
- **TypeScript Improvements**: Better type safety and generics

### Low Priority
- **Web UI**: Simple web interface for queue monitoring
- **Message Encryption**: Optional encryption for sensitive payloads
- **Dead Letter Queue**: Failed message handling
- **Message TTL**: Automatic message expiration

## 🏗️ Architecture Guidelines

### Adding Storage Backends

1. Implement the `StorageClient` interface
2. Add appropriate error handling
3. Include connection configuration options
4. Update documentation with usage examples

### Database Changes

1. Provide migration scripts
2. Maintain backward compatibility
3. Update schema documentation
4. Consider performance implications

### API Changes

1. Maintain backward compatibility
2. Use semantic versioning
3. Update TypeScript definitions
4. Document breaking changes clearly

## 📚 Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [MinIO Documentation](https://docs.min.io/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

## 💬 Community

- **GitHub Discussions**: For questions and general discussion
- **Issues**: For bug reports and feature requests
- **Pull Requests**: For code contributions

## 📞 Getting Help

If you need help or have questions:

1. Check existing documentation and issues
2. Create a new issue with the "question" label
3. Join our GitHub Discussions

## 📄 License

By contributing, you agree that your contributions will be licensed under the same MIT License that covers the project.

---

Thank you for contributing to Data Nadhi Queue! 🎉