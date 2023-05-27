import { type Metro } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { prisma } from "@/server/db";
import { generateCode } from "@/utils/string-helper";

interface FilterQueryOptions {
  estate_type?: { id: string };
  metro?: { id: string };
}

export const platformRouter = createTRPCRouter({
  add: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3),
        platform_type: z.object({
          code: z.string(),
          id: z.string(),
          name: z.string(),
        }),
        description: z.string(),
        price: z.number(),
        area: z.number(),
        metro: z.string(),
        address: z.string(),
        photo_cover: z.string(),
        photo_gallery: z.string().array(),
      })
    )
    .query(async ({ ctx, input }) => {
      const email = ctx.session.user.email!;
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
          favorites: true,
        },
      });
      const metroStation = (await prisma.metro.findFirst({
        where: {
          name: input.metro,
        },
      })) as unknown as Metro;
      if (user) {
        const platform = await prisma.estate.create({
          data: {
            name: input.name,
            area: input.area,
            code: generateCode(input.name),
            description: input.description,
            price: input.price,
            address: input.address,
            photo_cover: input.photo_cover,
            photo_gallery: input.photo_gallery,
            user: {
              connect: { id: user.id },
            },
            estate_type: {
              connect: { id: input.platform_type.id },
            },
            metro: {
              connect: { id: metroStation.id },
            },
          },
        });
        return platform;
      }
    }),
  getByCode: protectedProcedure
    .input(
      z.object({
        code: z.string(),
      })
    )
    .query(async ({ input }) => {
      const platform = await prisma.estate.findFirst({
        where: {
          code: input.code,
        },
        include: {
          estate_type: true,
          metro: true,
          user: true,
        },
      });
      return platform;
    }),
  getAdditional: protectedProcedure.query(async ({ input }) => {
    const additionalPlatforms = await prisma.estate.findMany({
      take: 3,
      include: {
        metro: true,
      },
    });
    return additionalPlatforms;
  }),
  getFilteredList: protectedProcedure
    .input(
      z.object({
        platform_type: z
          .object({
            code: z.string(),
            id: z.string(),
            name: z.string(),
          })
          .optional(),
        metro: z
          .object({
            code: z.string(),
            id: z.string(),
            name: z.string(),
          })
          .optional(),
      })
    )
    .query(async ({ input }) => {
      const query: FilterQueryOptions = {};
      if (input.platform_type) {
        const platformTypes = await prisma.estateType.findMany();
        query.estate_type = {
          // @ts-expect-error all ok
          id: platformTypes.find((el) => el.code === input.platform_type.code)
            .id as unknown as string,
        };
      }
      if (input.metro) {
        const metroStations = await prisma.metro.findMany();
        query.metro = {
          // @ts-expect-error all ok
          id: metroStations.find((el) => el.code === input.metro.code)
            .id as unknown as string,
        };
      }
      const results = await prisma.estate.findMany({
        where: query,
        include: {
          metro: true,
        },
        take: 24,
      });
      return results;
    }),
  getPlatformTypes: protectedProcedure.query(async () => {
    return await prisma.estateType.findMany();
  }),
  getMetro: protectedProcedure.query(async () => {
    const stations = await prisma.metro.findMany();
    return stations;
  }),
  getMine: protectedProcedure.query(async ({ ctx }) => {
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
    if (user) {
      const platforms = await prisma.estate.findMany({
        where: {
          userId: user.id,
        },
        include: {
          metro: true,
        },
      });
      return { status: "ok", items: platforms };
    }
    return { status: "error" };
  }),
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
