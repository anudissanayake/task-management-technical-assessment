import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

export const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

  export interface FileUploader {
    /**
     * Uploads a file to the storage provider.
     * @param file - The file content as a buffer.
     * @param fileName - The name of the file to be stored.
     * @param mimeType - The MIME type of the file.
     * @returns A promise resolving to the public URL of the uploaded file.
     */
    uploadFile(file: Buffer, fileName: string, mimeType: string): Promise<string>;
  } 

export class FileUploadService implements FileUploader{
    async uploadFile(file: Buffer, fileName: string, mimeType: string): Promise<string> {
        const params = {
          Bucket: 'task-file-bucket',
          Key: `${Date.now()}-${fileName}`, // Ensure unique filenames
          Body: file,
          ContentType: mimeType, // Set appropriate MIME type dynamically
        };
        await s3Client.send(new PutObjectCommand(params));
        return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
      };

      async deleteFile (fileKey: string) {
        const params = {
          Bucket: process.env.S3_BUCKET_NAME!,
          Key: fileKey,
        };
        const command = new DeleteObjectCommand(params);
        try {
          await s3Client.send(command);
          console.log(`File with key ${fileKey} deleted successfully`);
        } catch (error) {
          console.log(error);
        }
      };
}