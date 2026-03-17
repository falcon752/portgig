import { S3Client } from "@aws-sdk/client-s3";

const spacesClient = new S3Client({
  endpoint: process.env.SPACES_ENDPOINT!,
  region: process.env.SPACES_REGION ?? "sfo3",
  credentials: {
    accessKeyId: process.env.SPACES_KEY!,
    secretAccessKey: process.env.SPACES_SECRET!,
  },
  forcePathStyle: false,
});

export default spacesClient;