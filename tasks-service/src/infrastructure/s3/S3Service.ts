import { s3 } from '../../infrastructure/awsConfig';

export const uploadFile = async (file: Buffer, fileName: string): Promise<string> => {

  const params = {

    Bucket: process.env.S3_BUCKET_NAME!,

    Key: fileName,

    Body: file,

    ContentType: 'application/octet-stream',

  };

  await s3.upload(params).promise();

  return `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;

};
