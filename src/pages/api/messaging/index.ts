/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { type Server as NetServer } from "http";

import { type NextApiRequest, type NextApiResponse } from "next";
import { Server as ServerIO } from "socket.io";

import { type NextApiResponseServerIO } from "@/types/socket";

export const config = {
  api: {
    bodyParser: false,
  },
};

const SocketHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    console.log("New Socket.io server...");
    const httpServer: NetServer = res.socket.server as any;

    const io = new ServerIO(httpServer, {
      path: "/api/messaging",
    });

    io.on("connection", (socket) => {
      socket.send(JSON.stringify({ status: "ok", message: "hello!" }));
    });
    res.socket.server.io = io;
  }
  res.end();
};

export default SocketHandler;
