import { type EstateType, type Metro } from "@prisma/client";
import { useRouter } from "next/router";
import { AutoComplete } from "primereact/autocomplete";
import { Dropdown } from "primereact/dropdown";
import { Editor } from "primereact/editor";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { useEffect, useState } from "react";
import Dropzone from "react-dropzone-uploader";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";

import CsButton from "@/components/CsButton";
import { useMe } from "@/hooks/useMe";
import AccountLayout from "@/layouts/AccountLayout";
import { apiClient } from "@/utils/api";

export default function MyPlatformsAddPage() {
  const [metro, setMetro] = useState<Metro[]>([]);
  const [metroNames, setMetroNames] = useState<string[]>([]);
  const [platformTypes, setPlatformTypes] = useState<EstateType[]>([]);

  useEffect(() => {
    const getMetroNames = async () => {
      const names = await apiClient.platforms.getMetro.query();
      setMetro(names);
      setMetroNames(names.map((m) => m.name));
    };
    const getPlatformTypes = async () => {
      const types = await apiClient.platforms.getPlatformTypes.query();
      setPlatformTypes(types);
    };
    void getMetroNames();
    void getPlatformTypes();
  }, []);

  const me = useMe();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      name: "",
      platform_type: null,
      description: null,
      price: null,
      area: null,
      metro: null,
      address: "",
      photo_cover: null,
      photo_gallery: [],
    },
  });

  const handleChangeStatus = ({ meta }, status) => {
    console.log(status, meta);
  };

  const getCoverUploadParams = async ({
    file,
    meta: { name },
  }: {
    file: File;
    meta: { name: string };
  }) => {
    const uploadUrl = await apiClient.s3.getPreSignedUploadUrl.query({ name });
    const fileUrl = uploadUrl.split("?")[0] as unknown as string;
    setValue("photo_cover", fileUrl, { shouldValidate: true });
    return { body: file, meta: { fileUrl }, url: uploadUrl, method: "PUT" };
  };

  const getGalleryUploadParams = async ({
    file,
    meta: { name },
  }: {
    file: File;
    meta: { name: string };
  }) => {
    const uploadUrl = await apiClient.s3.getPreSignedUploadUrl.query({ name });
    const fileUrl = uploadUrl.split("?")[0] as unknown as string;
    const v = getValues();
    const gallery = v.photo_gallery;
    gallery.push(fileUrl);
    console.log(gallery);
    setValue("photo_gallery", gallery, { shouldValidate: true });
    return { body: file, meta: { fileUrl }, url: uploadUrl, method: "PUT" };
  };

  interface FormInput {
    name: string;
    description: string;
    price: number;
    area: number;
    address: string;
    photo_cover: string;
    photo_gallery: string[];
    platform_type: {
      code: string;
      id: string;
      name: string;
    };
    metro: string;
  }

  const metroSearch = (e: { query: string }) => {
    if (metro.length > 0) {
      console.log(e.query);
      setMetroNames(
        metro
          .filter((el) => el.name.toLowerCase().includes(e.query.toLowerCase()))
          .map((el) => el.name)
      );
    }
  };

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    const results = await apiClient.platforms.add.query({ ...data });
    console.log(data);
    if (results) {
      reset();
      await router.push("/user/my-platforms");
    }
  };

  const getFormErrorMessage = (name: string) => {
    return errors[name] ? (
      <small className="p-error">{errors[name].message}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };

  return (
    <>
      {me !== false && (
        <AccountLayout role={me.user_role.name} selectedOption="my-platforms">
          <>
            <h4 className="mb-8 text-3xl font-bold text-white">
              Добавить площадку
            </h4>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex max-w-lg flex-col gap-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name">Название площадки</label>
                  <Controller
                    name="name"
                    control={control}
                    rules={{ required: "Заполните поле" }}
                    render={({ field }) => <InputText id="name" {...field} />}
                  />
                  {getFormErrorMessage("name")}
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="platform_type">Тип площадки</label>
                  <Controller
                    name="platform_type"
                    control={control}
                    rules={{ required: "Заполните поле" }}
                    render={({ field, fieldState }) => (
                      <Dropdown
                        value={field.value}
                        optionLabel="name"
                        options={platformTypes}
                        placeholder="Выберите тип площадки"
                        id="platform_type"
                        className={classNames({
                          "p-invalid": fieldState.error,
                        })}
                        {...field}
                      />
                    )}
                  />
                  {getFormErrorMessage("platform_type")}
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="description">Описание</label>
                  <Controller
                    name="description"
                    control={control}
                    rules={{ required: "Заполните описание" }}
                    render={({ field, fieldState }) => (
                      <Editor
                        id={field.name}
                        name="description"
                        showHeader={false}
                        value={field.value}
                        onTextChange={(e) => {
                          field.onChange(e.textValue);
                        }}
                        style={{ height: "200px" }}
                      />
                    )}
                  />
                  {getFormErrorMessage("description")}
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="price">Цена за день, руб</label>
                  <Controller
                    name="price"
                    control={control}
                    rules={{ required: "Заполните цену" }}
                    render={({ field }) => (
                      <InputNumber
                        id="price"
                        inputRef={field.ref}
                        value={field.value}
                        onBlur={field.onBlur}
                        onValueChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                    )}
                  />
                  {getFormErrorMessage("price")}
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="area">Размер, м²</label>
                  <Controller
                    name="area"
                    control={control}
                    rules={{ required: "Заполните поле" }}
                    render={({ field }) => (
                      <InputNumber
                        id="area"
                        inputRef={field.ref}
                        value={field.value}
                        onBlur={field.onBlur}
                        onValueChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                    )}
                  />
                  {getFormErrorMessage("area")}
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="address">Адрес</label>
                  <Controller
                    name="address"
                    control={control}
                    rules={{ required: "Заполните поле «Адрес»" }}
                    render={({ field }) => (
                      <InputText
                        id="address"
                        inputRef={field.ref}
                        value={field.value}
                        onValueChange={(e) => {
                          field.onChange(e);
                        }}
                        {...field}
                      />
                    )}
                  />
                  {getFormErrorMessage("address")}
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="metro">Метро</label>
                  <Controller
                    name="metro"
                    control={control}
                    rules={{ required: "Заполните поле" }}
                    render={({ field, fieldState }) => (
                      <AutoComplete
                        inputId="metro"
                        forceSelection
                        value={field.value}
                        onChange={field.onChange}
                        inputRef={field.ref}
                        suggestions={metroNames}
                        completeMethod={metroSearch}
                        className={classNames({
                          "p-invalid": fieldState.error,
                        })}
                      />
                    )}
                  />
                  {getFormErrorMessage("metro")}
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="photo_cover">Изображение для превью</label>
                  <div className=" mb-4 rounded-lg border-2 border-dashed border-cs-primary">
                    <Dropzone
                      inputContent="Перетащите сюда изображения или кликните, чтобы выбрать файлы"
                      getUploadParams={getCoverUploadParams}
                      onChangeStatus={handleChangeStatus}
                      multiple={false}
                      accept="image/*,audio/*,video/*"
                    />
                  </div>
                  {getFormErrorMessage("photo_cover")}
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="photo_gallery">Изображения для галереи</label>
                  <div className="mb-4 rounded-lg border-2 border-dashed border-cs-primary">
                    <Dropzone
                      inputContent="Перетащите сюда изображения или кликните, чтобы выбрать файлы"
                      getUploadParams={getGalleryUploadParams}
                      onChangeStatus={handleChangeStatus}
                      maxFiles={10}
                      accept="image/*,audio/*,video/*"
                    />
                  </div>
                  {getFormErrorMessage("photo_gallery")}
                </div>
                <CsButton type="button" buttonType="submit">
                  Добавить площадку
                </CsButton>
              </div>
            </form>
          </>
        </AccountLayout>
      )}
    </>
  );
}
