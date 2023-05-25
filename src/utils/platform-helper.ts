import type { Role } from "@/types/user";

const getArrayChunk = (arr: unknown[], size: number) => {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_v, k) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return arr.slice(k * size, k * size + size);
  });
};

const getPrettyPrice = (price: number): string => {
  return getArrayChunk(price.toString().split("").reverse(), 3)
    .map((el) => el.reverse().join(""))
    .reverse()
    .join(" ");
};

const getPrettyUserName = (firstName: string, lastName: string) => {
  return `${firstName} ${lastName.slice(0, 1).toLocaleUpperCase()}.`;
};

const getRoleNameByCode = (role: Role): string => {
  if (role === "leaseholder") return "Арендатор";
  if (role === "admin") return "Администратор";
  if (role === "owner") return "Арендодатель";
  return "Арендатор";
};

export { getArrayChunk, getRoleNameByCode, getPrettyPrice, getPrettyUserName };
