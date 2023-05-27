import { createClient } from "redis";

import { env } from "@/env.mjs";

const client = createClient({
  url: env.REDIS_URL,
});

void client.connect();

export { client as redis };
