// import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
// import { FileUploader } from './FileUploader';

// export const s3Client = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//   },
// });

// export class S3FileUploader implements FileUploader {
//   constructor(private readonly s3Client: S3Client, private readonly bucketName: string) {}

//   async upload(file: Buffer, fileName: string, mimeType: string): Promise<string> {

//   const params = {
//     Bucket: process.env.S3_BUCKET_NAME!,
//     Key: `${Date.now()}-${fileName}`,
//     Body: file,
//     ContentType: mimeType, // Set appropriate MIME type dynamically
//   };

//     await s3Client.send(new PutObjectCommand(params));

//     return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;

//   }
// }

// export const uploadFile = async (file: Buffer, fileName: string, mimeType: string): Promise<string> => {
//   console.log("=||== ",process.env.S3_BUCKET_NAME, fileName, mimeType);
//   const params = {
//     Bucket: process.env.S3_BUCKET_NAME!,
//     Key: `${Date.now()}-${fileName}`, // Ensure unique filenames
//     Body: file,
//     ContentType: mimeType, // Set appropriate MIME type dynamically
//   };
//   console.log("=2== ",params);

//   const command = new PutObjectCommand(params);
//   await s3Client.send(command);

//   return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
// };

// export const deleteFromS3 = async (fileKey: string) => {
//   const params = {
//     Bucket: process.env.S3_BUCKET_NAME!,
//     Key: fileKey,
//   };

//   const command = new DeleteObjectCommand(params);

//   try {
//     await s3Client.send(command);
//     console.log(`File with key ${fileKey} deleted successfully`);
//   } catch (error) {
//     console.log(error);
//   }
// };

