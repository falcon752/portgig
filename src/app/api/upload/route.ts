import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  endpoint: process.env.SPACES_ENDPOINT!,
  region: process.env.SPACES_REGION ?? "sfo3",
  credentials: {
    accessKeyId: process.env.SPACES_KEY!,
    secretAccessKey: process.env.SPACES_SECRET!,
  },
  forcePathStyle: false,
});

const BUCKET = process.env.SPACES_BUCKET ?? "portgig";
const SPACES_PUBLIC_BASE = `https://${BUCKET}.sfo3.digitaloceanspaces.com`;

async function uploadToSpaces(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  const key = `portfolio/${filename}`;
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      ACL: "public-read",
    })
  );
  return `${SPACES_PUBLIC_BASE}/${key}`;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const uploadPromises = files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const ext = file.name.split(".").pop() ?? "bin";
      const filename = `${crypto.randomUUID()}.${ext}`;
      return uploadToSpaces(buffer, filename, file.type || "application/octet-stream");
    });

    const urls = await Promise.all(uploadPromises);
    return NextResponse.json({ files: urls });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Upload failed";
    console.error("[/api/upload] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
