import { createClient } from "redis";

const client = createClient({
  url: "redis://192.168.1.118:6379",
});

void client.connect();

export { client as redis };
