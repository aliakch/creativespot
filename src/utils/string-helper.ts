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

const generateChatId = (str1: string, str2: string) => {
  return str1.localeCompare(str2) ? `${str1}_${str2}` : `${str2}_${str1}`;
};

const generateRandomInt = (min: number, max: number) => {
  const newMin = Math.ceil(min);
  const newMax = Math.floor(max);
  return Math.floor(Math.random() * (newMax - newMin) + newMin); // The maximum is exclusive and the minimum is inclusive
};

export { generateCode, generateChatId, generateRandomInt };
