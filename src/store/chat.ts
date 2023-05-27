import { atom } from "recoil";

interface Message {
  id: number;
  from: string;
  to: string;
  text: string;
}

const chatState = atom({
  key: "chat", // unique ID (with respect to other atoms/selectors)
  default: [] as Message[], // default value (aka initial value)
});

export default chatState;
