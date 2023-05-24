/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { type Prisma, PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const estateTypes = await prisma.estateType.findMany();
  return NextResponse.json(estateTypes);
}

export async function POST(req: Request) {
  const data = await req.json();

  if (Array.isArray(data)) {
    const items = [];

    for (const estateType of data) {
      const estateTypeData: Prisma.EstateTypeCreateInput = {
        name: estateType.name,
        code: estateType.code,
      };
      const item = await prisma.estateType.create({
        data: estateTypeData,
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
