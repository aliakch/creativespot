import { ChatMessage } from "@prisma/client";
import { atom } from "recoil";

const chatState = atom({
  key: "chat", // unique ID (with respect to other atoms/selectors)
  default: [] as ChatMessage[], // default value (aka initial value)
});

export default chatState;
