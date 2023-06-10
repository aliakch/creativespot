import { type EstateBusyTime, type Metro } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { parse } from "date-fns";
import { z } from "zod";

import { type FormInputBusyTime } from "@/pages/user/my-platforms/add";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { prisma } from "@/server/db";
import { generateCode } from "@/utils/string-helper";

interface FilterQueryOptions {
  estate_type?: { id: string };
  metro?: { id: string };
  price?: {
    lte?: number;
    gte?: number;
  };
  area?: {
    lte?: number;
    gte?: number;
  };
}

export const platformRouter = createTRPCRouter({
  add: protectedProcedure
    .input(
      z.object({
        action: z.string(),
        id: z.string().optional(),
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
        photo_cover: z.string().optional().nullable(),
        photo_gallery: z.string().array().optional().nullable(),
        presentation: z.string().optional().nullable(),
        active: z.boolean().optional(),
        busy_time: z
          .array(
            z.object({
              id: z.union([z.number(), z.string()]),
              date_from: z.string(),
              date_to: z.string(),
              type: z.string(),
              status: z.string(),
            })
          )
          .optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const email = ctx.session.user.email;
      if (!email) return;
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
      let platformId = input.id;
      let platform = null;
      if (user) {
        if (input.action === "add") {
          platform = await prisma.estate.create({
            data: {
              name: input.name,
              area: input.area,
              code: generateCode(input.name),
              description: input.description,
              price: input.price,
              address: input.address,
              photo_cover: input.photo_cover,
              photo_gallery: input.photo_gallery,
              presentation: input.presentation,
              active: true,
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
          platformId = platform.id;
        }
        if (input.action === "edit" && input.id) {
          platform = await prisma.estate.update({
            where: {
              id: input.id,
            },
            data: {
              name: input.name,
              area: input.area,
              description: input.description,
              price: input.price,
              address: input.address,
              photo_cover: input.photo_cover,
              photo_gallery: input.photo_gallery,
              presentation: input.presentation,
              estate_type: {
                connect: { id: input.platform_type.id },
              },
              metro: {
                connect: { id: metroStation.id },
              },
            },
          });
          platformId = platform.id;
        }
        const busyTimes = await prisma.estateBusyTime.findMany({
          where: {
            estateId: { equals: platformId },
          },
        });
        const handleBusyTimes = async (
          oldBusyTimes: EstateBusyTime[],
          newBusyTimes: FormInputBusyTime[] | undefined = []
        ) => {
          const oldIds = oldBusyTimes.map((busyTime) => {
            return busyTime.id;
          });
          const newIdsRegistered: string[] = [];
          const newBusyTimesToAdd: FormInputBusyTime[] = [];
          newBusyTimes.forEach((item) => {
            if (typeof item.id === "string") {
              if (oldIds.includes(item.id)) {
                newIdsRegistered.push(item.id);
              }
            } else if (typeof item.id === "number") {
              newBusyTimesToAdd.push(item);
            }
          });

          const oldItemsRemoved = oldIds.filter(
            (id) => !newIdsRegistered.includes(id)
          );

          // create
          if (newBusyTimesToAdd.length > 0) {
            const query = newBusyTimesToAdd.map((item) => {
              return {
                type: "custom",
                date_from: parse(item.date_from, "yyyy-MM-dd", new Date()),
                date_to: parse(item.date_to, "yyyy-MM-dd", new Date()),
                status: "confirmed",
                estateId: platformId,
              };
            });
            await prisma.estateBusyTime.createMany({
              data: query,
            });
          }
          if (newIdsRegistered.length > 0) {
            for (const newId of newIdsRegistered) {
              const busyTime = newBusyTimes.filter((el) => el.id === newId);
              await prisma.estateBusyTime.update({
                where: {
                  id: newId,
                },
                data: {
                  date_from: parse(
                    busyTime[0].date_from,
                    "yyyy-MM-dd",
                    new Date()
                  ),
                  date_to: parse(busyTime[0].date_to, "yyyy-MM-dd", new Date()),
                },
              });
            }
          }
          if (oldBusyTimes.length > 0) {
            await prisma.estateBusyTime.deleteMany({
              where: {
                id: {
                  in: oldItemsRemoved,
                },
              },
            });
          }
        };
        await handleBusyTimes(busyTimes, input.busy_time);
        return platform;
      }
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const email = ctx.session.user.email;
      if (email) {
        const user = await prisma.user.findUnique({
          where: {
            email,
          },
          include: {
            user_role: true,
            Estate: {
              select: { id: true },
            },
          },
        });
        if (user) {
          if (user.user_role.name === "admin") {
            await prisma.estate.delete({
              where: {
                id: input.id,
              },
            });
            return true;
          } else if (user.user_role.name === "owner") {
            const estateIds = user.Estate.map((item) => item.id);
            if (estateIds.includes(input.id)) {
              await prisma.estate.delete({
                where: {
                  id: input.id,
                },
              });
              return true;
            }
          }
        }
      }
      return false;
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
          EstateBusyTime: true,
        },
      });
      return platform;
    }),
  getById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const platform = await prisma.estate.findFirst({
        where: {
          id: input.id,
        },
        include: {
          estate_type: true,
          metro: true,
          user: true,
          EstateBusyTime: true,
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
        price_from: z.number().optional(),
        price_to: z.number().optional(),
        area_from: z.number().optional(),
        area_to: z.number().optional(),
        date_from: z.number().optional(),
        date_to: z.number().optional(),
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
      if (input.price_from ?? input.price_to) {
        query.price = {};
      }
      if (input.price_from) {
        // @ts-expect-error all ok
        query.price.gte = input.price_from;
      }
      if (input.price_to) {
        // @ts-expect-error all ok
        query.price.lte = input.price_to;
      }
      if (input.area_from ?? input.area_to) {
        query.area = {};
      }
      if (input.area_from) {
        // @ts-expect-error all ok
        query.area.gte = input.area_from;
      }
      if (input.area_to) {
        // @ts-expect-error all ok
        query.area.lte = input.area_to;
      }
      if (input.date_from && input.date_to === undefined) {
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
  toggleActive: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const results = await prisma.estate.findUnique({
        where: { id: input.id },
      });
      if (results) {
        await prisma.estate.update({
          where: { id: input.id },
          data: { active: !results.active },
        });
        return true;
      }
      return false;
    }),
});
