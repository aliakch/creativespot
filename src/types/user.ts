import { type User, type UserReview, type UserRole } from "@prisma/client";

export type Role = "admin" | "leaseholder" | "owner";
export type UserWithRole = User & {
  user_role: UserRole;
};
export type UserReviewWithUserData = UserReview & {
  user: {
    name: string;
  };
};
