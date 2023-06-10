import { type NextApiRequest } from "next";

import { prisma } from "@/server/db";
import { redis } from "@/server/redis";
import { type NextApiResponseServerIO } from "@/types/socket";

const MessageHandler = async (
  req: NextApiRequest,
  res: NextApiResponseServerIO
) => {
  if (req.method === "POST") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
      const { message } = req.body;
      let chatId = message.chat_id ?? "";

      const newMessage = await prisma.chatMessage.create({
        data: {
          content: message.content,
          type: "message",
          Chat: { connect: { id: chatId } },
          userFrom: { connect: { id: message.user_from } },
          userTo: { connect: { id: message.user_to } },
        },
      });

      res.socket.server.io.emit("message", message);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await redis.RPUSH(chatId, JSON.stringify(message));

      res.status(201).json(message);
    } catch (err) {
      console.log(err);
    }
  }
};

export default MessageHandler;
