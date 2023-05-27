import { atom } from "recoil";

import type { UserWithRole } from "@/types/user";

const userState = atom({
  key: "user",
  default: false as UserWithRole | false,
});

export default userState;
