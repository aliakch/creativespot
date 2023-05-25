import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import CsAvatar from "@/components/CsAvatar";
import AccountLayout from "@/layouts/AccountLayout";
import { type Role, type UserWithRole } from "@/types/user";
import { apiClient } from "@/utils/api";
import { getRoleNameByCode } from "@/utils/platform-helper";

export default function UserDashboardPage() {
  const { status } = useSession();
  const [userData, setUserData] = useState<UserWithRole | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setUserData(await apiClient.users.me.query());
    };
    if (status === "authenticated") {
      void fetchUserData();
    }
  }, []);

  return (
    <AccountLayout selectedOption="general" role="leaseholder">
      {userData && (
        <div className="grid grid-cols-4 gap-x-8">
          <div className="col-span-3 flex items-center rounded-2xl bg-cs-dark-600 p-5">
            <CsAvatar className="mr-8" size="big" label={userData.first_name} />
            <div>
              <h5 className="mb-2 text-2xl font-medium text-white">
                {userData.first_name} {userData.last_name}
              </h5>
              <p className="text-lg font-medium uppercase text-cs-primary">
                {getRoleNameByCode(userData.user_role.name as Role)}
              </p>
              <p className="text-white">
                <span className="mr-3 font-medium">Почта:</span>
                <span>{userData.email}</span>
              </p>
            </div>
          </div>
          <div className="col-span-1 rounded-2xl bg-cs-dark-600 p-5">
            <p className="mb-4 text-xl text-white">Мои отзывы</p>
            <p className="text-6xl font-bold">0</p>
          </div>
        </div>
      )}
    </AccountLayout>
  );
}
