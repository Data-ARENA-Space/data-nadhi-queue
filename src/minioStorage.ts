import { Client } from 'minio';
import { StorageClient } from './storageClient';

export class MinioStorage implements StorageClient {
  private client: Client;
  private bucket: string;

  constructor(host: string, port: number, accessKey: string, secretKey: string, bucket: string) {
    this.client = new Client({
      endPoint: host,
      port: port,
      useSSL: false,
      accessKey,
      secretKey,
    });
    this.bucket = bucket;
  }

  async upload(fileKey: string, data: Buffer) {
    await this.client.putObject(this.bucket, fileKey, data);
  }

  async download(fileKey: string): Promise<Buffer> {
    const stream = await this.client.getObject(this.bucket, fileKey);
    const chunks: Buffer[] = [];
    for await (const chunk of stream) chunks.push(chunk as Buffer);
    return Buffer.concat(chunks);
  }

  async delete(fileKey: string) {
    await this.client.removeObject(this.bucket, fileKey);
  }
}
