import { type Prisma, type UserRole } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { hashSync } from "bcryptjs";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { prisma } from "@/server/db";

export const userRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx }) => {
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
    });
    return user;
  }),
  register: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
        password_confirmation: z.string(),
        first_name: z.string(),
        last_name: z.string(),
        // role: z.string(),
      })
    )
    .query(async ({ input }) => {
      if (input.password !== input.password_confirmation) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Пароли не совпадают",
        });
      }
      const roles = (await prisma.userRole.findMany()) as unknown as UserRole[];
      const clientRole = roles.find((el) => el.name === "leaseholder");
      if (clientRole) {
        const userData: Prisma.UserCreateInput = {
          login: input.email,
          email: input.email,
          password: hashSync(input.password),
          is_active: true,
          first_name: input.first_name,
          last_name: input.last_name,
          user_role: { connect: { id: clientRole.id } },
        };
        const user = await prisma.user.create({
          data: userData,
        });
        return user;
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Произошла ошибка при добавлении пользователя",
      });
    }),
  toggleFavorite: protectedProcedure
    .input(z.object({ platformId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const email = ctx.session.user.email;
      if (email) {
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
          if (user.favorites.includes(input.platformId)) {
            user.favorites = user.favorites.filter(
              (el) => el !== input.platformId
            );
          } else {
            user.favorites.push(input.platformId);
          }

          await prisma.user.update({
            where: { id: user.id },
            data: {
              favorites: {
                set: user.favorites,
              },
            },
          });
          return { status: "ok" };
        }
      }
      return { status: "error" };
    }),
  update: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        first_name: z.string().min(1),
        last_name: z.string().min(1),
        phone: z.string(),
        telegram: z.string(),
        whatsapp: z.string(),
        instagram: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
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
      });
      if (user) {
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            email: input.email,
            first_name: input.first_name,
            last_name: input.last_name,
            phone: input.phone,
            social_networks: JSON.stringify({
              instagram: input.instagram,
              telegram: input.telegram,
              whatsapp: input.whatsapp,
            }),
          },
        });
      }
      return await prisma.user.findUnique({
        where: {
          email,
        },
      });
    }),
  updatePassword: protectedProcedure
    .input(
      z.object({
        password: z.string().min(8),
        password_confirmation: z.string().min(8),
      })
    )
    .query(async ({ ctx, input }) => {
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
      });
      if (user) {
        if (input.password !== input.password_confirmation) {
          return {
            status: "error",
            message: "Пароли не совпадают",
          };
        }
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            password: hashSync(input.password),
          },
        });
        return {
          status: "success",
        };
      }
      return {
        status: "error",
        message: "Пользователь не найден",
      };
    }),
});
