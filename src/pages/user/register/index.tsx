import { signIn } from "next-auth/react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { RadioButton } from "primereact/radiobutton";
import { useState } from "react";

import CsButton from "@/components/CsButton";
import MainLayout from "@/layouts/MainLayout";
import { apiClient } from "@/utils/api";

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    email: "",
    password: "",
    password_confirmation: "",
    first_name: "",
    last_name: "",
    role: "",
  });

  const handleChange = (
    prop:
      | "email"
      | "password"
      | "password_confirmation"
      | "first_name"
      | "last_name"
      | "role",
    event: { target: { value: string } }
  ) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      const user = await apiClient.users.register.query({
        ...values,
      });

      if (user) {
        await signIn("credentials", {
          redirect: true,
          email: values.email,
          password: values.password,
          callbackUrl: "/user",
        });
      }
    } catch (error: unknown) {
      console.log(error);
    }
  };

  return (
    <MainLayout>
      <div className="container flex items-center justify-center">
        <div className="flex w-[400px] flex-col gap-4 rounded-xl bg-cs-dark-800 p-12">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">
            Регистрация
          </h2>
          <div className="flex flex-col gap-2">
            <p>Я хочу...</p>
            <div className="flex items-center">
              <RadioButton
                inputId="leaseholder"
                name="role"
                value="leaseholder"
                onChange={(e) => {
                  handleChange("role", e);
                }}
                checked={values.role === "leaseholder"}
              />
              <label htmlFor="leaseholder" className="ml-2">
                снять
              </label>
            </div>
            <div className="flex items-center">
              <RadioButton
                inputId="owner"
                name="role"
                value="owner"
                onChange={(e) => {
                  handleChange("role", e);
                }}
                checked={values.role === "owner"}
              />
              <label htmlFor="leaseholder" className="ml-2">
                сдать
              </label>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="first_name">Имя</label>
            <InputText
              className="p-inputtext-sm"
              id="first_name"
              value={values.first_name}
              onChange={(e) => {
                handleChange("first_name", e);
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="last_name">Фамилия</label>
            <InputText
              className="p-inputtext-sm"
              id="last_name"
              value={values.last_name}
              onChange={(e) => {
                handleChange("last_name", e);
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email">Адрес e-mail</label>
            <InputText
              className="p-inputtext-sm"
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
              className="p-inputtext-sm"
              id="password"
              value={values.password}
              onChange={(e) => {
                handleChange("password", e);
              }}
              toggleMask
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password_confirmation">Подтвердите пароль</label>
            <Password
              className="p-inputtext-sm"
              id="password_confirmation"
              value={values.password_confirmation}
              onChange={(e) => {
                handleChange("password_confirmation", e);
              }}
              toggleMask
            />
          </div>
          <CsButton
            className="mt-4"
            onClick={() => void handleRegister()}
            filled
          >
            Зарегистрироваться
          </CsButton>
        </div>
      </div>
    </MainLayout>
  );
}
