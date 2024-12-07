export interface FileUploader {
    /**
     * Uploads a file to the storage provider.
     * @param file - The file content as a buffer.
     * @param fileName - The name of the file to be stored.
     * @param mimeType - The MIME type of the file.
     * @returns A promise resolving to the public URL of the uploaded file.
     */
    upload(file: Buffer, fileName: string, mimeType: string): Promise<string>;
  }  