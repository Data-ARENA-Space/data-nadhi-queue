export interface StorageClient {
  upload(fileKey: string, data: Buffer): Promise<void>;
  download(fileKey: string): Promise<Buffer>;
  delete(fileKey: string): Promise<void>;
}
