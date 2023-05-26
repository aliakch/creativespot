import CyrillicToTranslit from "cyrillic-to-translit-js";

const cyrillicToTranslit = new CyrillicToTranslit();

const generateCode = (input: string) => {
  if (typeof input === "string") {
    return cyrillicToTranslit.transform(
      input.toLowerCase().replaceAll(" ", "_")
    ) as unknown as string;
  }

  return crypto.randomUUID();
};

export { generateCode };
