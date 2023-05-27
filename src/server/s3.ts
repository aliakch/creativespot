import * as Minio from "minio";

import { env } from "@/env.mjs";

export const s3Client = new Minio.Client({
  endPoint: env.NEXT_PUBLIC_MINIO_DOMAIN,
  port: Number(env.NEXT_PUBLIC_MINIO_PORT),
  useSSL: env.NEXT_PUBLIC_MINIO_USE_SSL === "true",
  accessKey: env.NEXT_PUBLIC_MINIO_ACCESS_KEY,
  secretKey: env.NEXT_PUBLIC_MINIO_SECRET_KEY,
});
