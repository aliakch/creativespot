import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { prisma } from "@/server/db";

export const platformRouter = createTRPCRouter({
  favorites: protectedProcedure.query(async ({ ctx }) => {
    const email = ctx.session.user.email;
    if (email == null) {
      throw new TRPCError({
        message: "Не задан адрес e-mail",
        code: "PARSE_ERROR",
      });
    }
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        favorites: true,
      },
    });
    if (user == null) {
      throw new TRPCError({
        message: "Пользователь не найден",
        code: "FORBIDDEN",
      });
    }
    const favorites = await prisma.estate.findMany({
      where: {
        id: { in: user.favorites },
      },
      include: {
        metro: true,
      },
    });
    return { status: "ok", items: favorites };
  }),
});
