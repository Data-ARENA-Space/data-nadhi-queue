import { Pool } from 'pg';
import { StorageClient } from './storageClient';

export class Queue {
  constructor(private db: Pool, private storage: StorageClient) {}

  async publish(messageId: string, data: Buffer, filePath?: string) {
    const fileKey = filePath ? `${filePath}/${messageId}.json` : `${messageId}.json`;
    await this.storage.upload(fileKey, data);
    await this.db.query(
      `INSERT INTO queue_log (message_id, file_key) VALUES ($1, $2)`,
      [messageId, fileKey]
    );
  }

  async fetchNext() {
    const client = await this.db.connect();
    try {
      const res = await this.db.query(
            'SELECT * FROM queue_log WHERE status=$1 ORDER BY created_at LIMIT 1',
            ['pending']
        );
        if (res.rows.length === 0) return null;

        const job = res.rows[0];

        // Mark as processing
        await this.db.query(
            'UPDATE queue_log SET status=$1, updated_at=NOW() WHERE message_id=$2',
            ['processing', job.message_id]
        );

        // Fetch the actual data from MinIO
        const dataBuffer = await this.storage.download(job.file_key);
        const data = JSON.parse(dataBuffer.toString());
        return { ...job, data };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async complete(messageId: string) {
    const { rows } = await this.db.query(
      `SELECT file_key FROM queue_log WHERE message_id=$1`,
      [messageId]
    );
    if (!rows.length) return;
    await this.storage.delete(rows[0].file_key);
    await this.db.query(`DELETE FROM queue_log WHERE message_id=$1`, [messageId]);
  }
}
