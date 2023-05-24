/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { type Prisma, PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const userRoles = await prisma.userRole.findMany();
  return NextResponse.json(userRoles);
}

export async function POST(req: Request) {
  const data = await req.json();

  if (Array.isArray(data)) {
    const items = [];

    for (const role of data) {
      const roleData: Prisma.UserRoleCreateInput = {
        name: role,
      };
      const item = await prisma.userRole.create({
        data: roleData,
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
