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

export { getArrayChunk, getPrettyPrice };
