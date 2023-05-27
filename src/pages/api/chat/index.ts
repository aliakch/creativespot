import { type NextApiRequest } from "next";

import { Message } from "@/components/Chat";
import { prisma } from "@/server/db";
import { redis } from "@/server/redis";
import { type NextApiResponseServerIO } from "@/types/socket";
import { generateChatId } from "@/utils/string-helper";

const MessageHandler = async (
  req: NextApiRequest,
  res: NextApiResponseServerIO
) => {
  if (req.method === "POST") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
      const { message, isNew } = req.body;

      if (isNew) {
        await prisma.chat.create({
          data: {
            users: {
              // @ts-expect-error all ok
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
              connect: [{ id: message.from }, { id: message.to }],
            },
            // users: [{ id: message.from }, { id: message.to }],
          },
        });
      }

      res.socket.server.io.emit("message", message);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      const threadId = generateChatId(message.from, message.to);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await redis.RPUSH(threadId, JSON.stringify(message));

      res.status(201).json(message);
    } catch (err) {
      console.log(err);
    }
  }
};

export default MessageHandler;
