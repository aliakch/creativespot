import CsAvatar from "@/components/CsAvatar";
import { useMe } from "@/hooks/useMe";
import AccountLayout from "@/layouts/AccountLayout";
import { getRoleNameByCode } from "@/utils/platform-helper";

export default function UserDashboardPage() {
  const me = useMe();

  return (
    <>
      {me !== false && (
        <AccountLayout selectedOption="general" role={me.user_role.name}>
          <div className="grid grid-cols-1 gap-x-8 gap-y-4 lg:grid-cols-4">
            <div className="flex items-center rounded-2xl bg-cs-dark-600 p-5 lg:col-span-3">
              <CsAvatar className="mr-8" size="big" label={me.first_name} />
              <div>
                <h5 className="mb-2 text-2xl font-medium text-white">
                  {me.first_name} {me.last_name}
                </h5>
                <p className="text-lg font-medium uppercase text-cs-primary">
                  {getRoleNameByCode(me.user_role.name)}
                </p>
                <p className="text-white">
                  <span className="mr-3 font-medium">Почта:</span>
                  <span>{me.email}</span>
                </p>
              </div>
            </div>
            <div className="col-span-1 rounded-2xl bg-cs-dark-600 p-5">
              <p className="mb-4 text-xl text-white">Мои отзывы</p>
              <p className="text-6xl font-bold">0</p>
            </div>
          </div>
        </AccountLayout>
      )}
    </>
  );
}
