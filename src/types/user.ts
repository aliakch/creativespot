import { type User, type UserRole } from "@prisma/client";

export type Role = "admin" | "leaseholder" | "owner";
export type UserWithRole = User & {
  user_role: UserRole;
};
