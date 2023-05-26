import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { s3Client } from "@/server/s3";

export const s3Router = createTRPCRouter({
  getPreSignedUploadUrl: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    // eslint-disable-next-line @typescript-eslint/require-await
    .query(async ({ input }) => {
      const fileUrl = await s3Client.presignedPutObject(
        "creativespot",
        input.name,
        3600
      );
      return fileUrl;
    }),
});
