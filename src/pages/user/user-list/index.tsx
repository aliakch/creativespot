import CsAvatar from "@/components/CsAvatar";
import { useMe } from "@/hooks/useMe";
import AccountLayout from "@/layouts/AccountLayout";
import { apiClient, apiNext } from "@/utils/api";
import { getRoleNameByCode } from "@/utils/platform-helper";

export default function UserListPage() {
  const me = useMe();

  const userList = apiNext.users.getList.useQuery();
  const deleteUser = (id: string) => {
    void apiClient.platforms.delete.query({ id });
  };
  return (
    <>
      {me !== false && (
        <AccountLayout selectedOption="general" role={me.user_role.name}>
          <h3 className="mb-6 text-4xl font-bold">Пользователи</h3>
          <div className="flex flex-col gap-y-4">
            {userList &&
              userList.data?.map((user) => (
                <div
                  className="flex flex-wrap items-center border-b border-cs-dark-600 pb-2"
                  key={user.id}
                >
                  <CsAvatar
                    className="mr-3"
                    size="generic"
                    label={user.first_name}
                  />
                  <p className="font-bold">
                    {user.first_name} {user.last_name}
                  </p>
                  <p
                    className="ml-auto cursor-pointer font-medium "
                    onClick={() => {
                      deleteUser(user.id);
                    }}
                  >
                    Удалить
                  </p>
                </div>
              ))}
          </div>
        </AccountLayout>
      )}
    </>
  );
}
