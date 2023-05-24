/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { type Prisma, PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const data = await req.json();

  if (Array.isArray(data)) {
    const items = [];

    for (const estate of data) {
      const estateData: Prisma.EstateCreateInput = {
        name: estate.name,
        code: estate.code,
        description: estate.description,
        price: Number(estate.price),
        area: Number(estate.area),
        address: estate.address,
        photo_cover: estate.photo_cover,
        estate_type: {
          connect: { id: estate.estate_type_id },
        },
        user: {
          connect: { id: estate.user_id },
        },
        metro: {
          connect: { id: estate.metro_id },
        },
      };
      const item = await prisma.estate.create({
        data: estateData,
      });
      items.push(item);
    }
    return NextResponse.json({ status: "success", items });
  }

  if (typeof data === "object") {
    const estate = data;
    const estateData: Prisma.EstateCreateInput = {
      name: estate.name,
      code: estate.code,
      description: estate.description,
      price: Number(estate.price),
      area: Number(estate.area),
      address: estate.address,
      photo_cover: estate.photo_cover,
      estate_type: {
        connect: { id: estate.estate_type_id },
      },
      user: {
        connect: { id: estate.user_id },
      },
      metro: {
        connect: { id: estate.metro_id },
      },
    };
    const item = await prisma.estate.create({
      data: estateData,
    });
    return NextResponse.json({ status: "success", items: [item] });
  }

  return NextResponse.json({
    status: "error",
    message: "Something went wrong...",
  });
}
