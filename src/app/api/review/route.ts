/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { type Prisma, PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const reviews = await prisma.userReview.findMany();
  return NextResponse.json(reviews);
}

export async function POST(req: Request) {
  const data = await req.json();

  if (Array.isArray(data)) {
    const items = [];

    for (const review of data) {
      const reviewData: Prisma.UserReviewCreateInput = {
        title: review.title,
        rating: review.rating,
        text: review.text,
        User: { connect: { id: review.user_id as string } },
      };
      const item = await prisma.userReview.create({
        data: reviewData,
      });
      items.push(item);
    }
    return NextResponse.json({ status: "success", items });
  }

  return NextResponse.json({
    status: "error",
    message: "Something went wrong...",
  });
}
