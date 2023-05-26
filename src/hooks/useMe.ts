import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { type UserWithRole } from "@/types/user";
import { apiClient } from "@/utils/api";

const useMe = () => {
  const [me, setMe] = useState<UserWithRole | false>(false);

  const { status } = useSession();

  const getMe = async () => {
    const userData =
      (await apiClient.users.me.query()) as unknown as UserWithRole | null;
    if (userData) {
      setMe(userData);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      void getMe();
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      void getMe();
    } else {
      setMe(false);
    }
  }, [status]);

  return me;
};
export { useMe };
