/* eslint-disable @typescript-eslint/no-misused-promises */
import { getSession, signIn } from "next-auth/react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { useState } from "react";

import CsButton from "@/components/CsButton";
import MainLayout from "@/layouts/MainLayout";

export default function SignInPage({ providers, loginError }) {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const handleChange = (
    prop: "email" | "password",
    event: { target: { value: string } }
  ) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleLoginUser = async () => {
    const s = await signIn("credentials", {
      redirect: true,
      email: values.email,
      password: values.password,
      callbackUrl: "/user",
    });
    if (s.ok) {
      const session = await getSession();
    } else {
      console.log("Session is not ok");
    }
  };

  return (
    <MainLayout>
      <div className="container flex items-center justify-center">
        <div className="flex w-[400px] flex-col gap-4 rounded-xl bg-cs-dark-800 p-12">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">
            Войти
          </h2>
          <div className="flex flex-col gap-2">
            <label htmlFor="email">Адрес e-mail</label>
            <InputText
              id="email"
              value={values.email}
              onChange={(e) => {
                handleChange("email", e);
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password">Пароль</label>
            <Password
              id="password"
              value={values.password}
              onChange={(e) => {
                handleChange("password", e);
              }}
              toggleMask
              feedback={false}
            />
          </div>
          <CsButton onClick={handleLoginUser} filled>
            Войти
          </CsButton>
        </div>
      </div>
    </MainLayout>
  );
}
