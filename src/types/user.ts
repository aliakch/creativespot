import { type User, type UserReview, type UserRole } from "@prisma/client";

export type Role = "admin" | "leaseholder" | "owner";
export type UserWithRole = User & {
  user_role: {
    id: string;
    name: Role;
  };
};
export type UserReviewWithUserData = UserReview & {
  user: {
    name: string;
  };
};
