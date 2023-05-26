import { useSession } from "next-auth/react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { TabPanel, TabView } from "primereact/tabview";
import { useEffect, useState } from "react";

import CsButton from "@/components/CsButton";
import { useMe } from "@/hooks/useMe";
import AccountLayout from "@/layouts/AccountLayout";
import { apiClient } from "@/utils/api";

export default function SettingsPage() {
  const [values, setValues] = useState({
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    telegram: "",
    whatsapp: "",
    instagram: "",
  });

  const [securityValues, setSecurityValues] = useState({
    password: "",
    password_confirmation: "",
  });

  const { data: sessionData, status } = useSession();

  interface SocialNetworks {
    telegram: string;
    whatsapp: string;
    instagram: string;
  }

  const me = useMe();

  useEffect(() => {
    if (status === "authenticated") {
      const initialFetch = async () => {
        console.log("initial fetch");
        await fetchUserData();
      };
      void initialFetch();
    }
  }, []);

  const fetchUserData = async () => {
    console.log("Fetching started...");

    const userData = await apiClient.users.me.query();
    console.log("Fetching started...");
    if (userData) {
      const socialNetworks: SocialNetworks = userData.social_networks
        ? (JSON.parse(userData.social_networks as string) as SocialNetworks)
        : {
            telegram: "",
            whatsapp: "",
            instagram: "",
          };
      setValues({
        email: userData.email ?? "",
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone: userData.phone ?? "",
        telegram: socialNetworks.telegram,
        whatsapp: socialNetworks.whatsapp,
        instagram: socialNetworks.instagram,
      });
    }
  };

  const handleChange = (
    prop:
      | "email"
      | "first_name"
      | "last_name"
      | "phone"
      | "telegram"
      | "whatsapp"
      | "instagram",
    event: { target: { value: string } }
  ) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleSecurityChange = (
    prop: "password" | "password_confirmation",
    event: { target: { value: string } }
  ) => {
    setSecurityValues({ ...securityValues, [prop]: event.target.value });
  };

  const updateUserData = async () => {
    await apiClient.users.update.query(values);
    await fetchUserData();
  };

  const updatePassword = async () => {
    await apiClient.users.updatePassword.query(securityValues);
    await fetchUserData();
  };

  return (
    <>
      {me !== false && (
        <AccountLayout role={me.user_role.name} selectedOption="settings">
          <div className="section">
            <TabView>
              <TabPanel header="Основные данные">
                <div className="max-w-xl">
                  <div className="mb-6 grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-3">
                      <label
                        className="text-lg font-medium text-white"
                        htmlFor="first_name"
                      >
                        Имя
                      </label>
                      <InputText
                        className="p-inputtext-sm"
                        id="first_name"
                        value={values.first_name}
                        onChange={(e) => {
                          handleChange("first_name", e);
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <label
                        className="text-lg font-medium text-white"
                        htmlFor="last_name"
                      >
                        Фамилия
                      </label>
                      <InputText
                        className="p-inputtext-sm"
                        id="last_name"
                        value={values.last_name}
                        onChange={(e) => {
                          handleChange("last_name", e);
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-wrap">
                      <p className="mr-5 text-lg font-medium text-white">
                        Почта:
                      </p>
                      <InputText
                        className="p-inputtext-sm grow"
                        id="email"
                        value={values.email}
                        onChange={(e) => {
                          handleChange("email", e);
                        }}
                      />
                    </div>
                  </div>
                  <div className="mt-8">
                    <h4 className="mb-2 text-2xl font-bold text-white">
                      Контактные данные
                    </h4>
                    <div className="mb-6 grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-3">
                        <label
                          className="text-lg font-medium text-white"
                          htmlFor="telegram"
                        >
                          Telegram
                        </label>
                        <InputText
                          className="p-inputtext-sm"
                          id="telegram"
                          value={values.telegram}
                          onChange={(e) => {
                            handleChange("telegram", e);
                          }}
                        />
                      </div>
                      <div className="flex flex-col gap-3">
                        <label
                          className="text-lg font-medium text-white"
                          htmlFor="whatsapp"
                        >
                          Whatsapp
                        </label>
                        <InputText
                          className="p-inputtext-sm"
                          id="whatsapp"
                          value={values.whatsapp}
                          onChange={(e) => {
                            handleChange("whatsapp", e);
                          }}
                        />
                      </div>
                      <div className="flex flex-col gap-3">
                        <label
                          className="text-lg font-medium text-white"
                          htmlFor="instagram"
                        >
                          Instagram
                        </label>
                        <InputText
                          className="p-inputtext-sm"
                          id="telegram"
                          value={values.instagram}
                          onChange={(e) => {
                            handleChange("instagram", e);
                          }}
                        />
                      </div>
                      <div className="flex flex-col gap-3">
                        <label
                          className="text-lg font-medium text-white"
                          htmlFor="phone"
                        >
                          Телефон
                        </label>
                        <InputText
                          className="p-inputtext-sm"
                          id="phone"
                          value={values.phone}
                          onChange={(e) => {
                            handleChange("phone", e);
                          }}
                        />
                      </div>
                    </div>
                    <CsButton filled onClick={updateUserData}>
                      Сохранить изменения
                    </CsButton>
                  </div>
                </div>
              </TabPanel>
              <TabPanel header="Безопасность">
                <div className="max-w-xl">
                  <h4 className="mb-2 text-2xl font-bold text-white">
                    Изменить пароль
                  </h4>
                  <div className="mb-6 grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-3">
                      <label
                        className="text-lg font-medium text-white"
                        htmlFor="password"
                      >
                        Новый пароль
                      </label>
                      <Password
                        className="p-inputtext-sm"
                        id="password"
                        value={securityValues.password}
                        onChange={(e) => {
                          handleSecurityChange("password", e);
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <label
                        className="text-lg font-medium text-white"
                        htmlFor="telegram"
                      >
                        Подтверждение пароля
                      </label>
                      <Password
                        className="p-inputtext-sm"
                        id="password_confirmation"
                        value={securityValues.password_confirmation}
                        onChange={(e) => {
                          handleSecurityChange("password_confirmation", e);
                        }}
                      />
                    </div>
                  </div>
                  <CsButton filled onClick={updatePassword}>
                    Изменить пароль
                  </CsButton>
                </div>
              </TabPanel>
            </TabView>
          </div>
        </AccountLayout>
      )}
    </>
  );
}
