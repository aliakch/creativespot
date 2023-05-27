/* eslint-disable promise/always-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { type Chat, type User } from "@prisma/client";
import { useRouter } from "next/router";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { connect } from "socket.io-client";

import userState from "@/store/user";
import { apiClient } from "@/utils/api";
import { generateChatId } from "@/utils/string-helper";

import chatState from "../store/chat";

import CsAvatar from "./CsAvatar";
import CsButton from "./CsButton";

const ChatUser = ({
  label,
  userId,
  handleClick,
}: {
  label: string;
  userId: string;
  handleClick: (userId: string) => void;
}) => {
  return (
    <div
      className="flex w-full cursor-pointer rounded-2xl p-2 hover:bg-cs-dark-600"
      onClick={() => {
        handleClick(userId);
      }}
    >
      <CsAvatar className="mr-4" label={label.slice(0, 1).toUpperCase()} />
      <div className="grow">
        <p className="font-medium text-white">{label}</p>
      </div>
    </div>
  );
};

export interface Message {
  id: number;
  from: string;
  to: string;
  text: string;
}
interface ChatMessagingProps {
  to?: User;
}
const connection = connect("http://localhost:3000", {
  path: "/api/messaging",
  autoConnect: true,
});

connection.on("connect", () => {
  console.log("connected!");
});

const ChatMessaging = ({ to }: ChatMessagingProps) => {
  const me = useRecoilValue(userState);
  const router = useRouter();
  const [msg, setMsg] = useState("");
  const [user, setUser] = useState<User | undefined>(to);
  const [newPeer, setNewPeer] = useState(false);

  const chat = useRecoilValue(chatState);
  const setChat = useSetRecoilState(chatState);

  connection.on("message", (message: Message) => {
    setChat([...chat, ...[message]]);
  });

  const getUserFromQueryIfNotExists = async () => {
    if (!newPeer) {
      if (to === undefined) {
        const id = router.query.id as string | undefined;
        if (id) {
          const newUser = await apiClient.users.getById.query({ id });
          if (newUser) {
            setUser(newUser);
            setNewPeer(true);
          }
        }
      }
    }
  };
  void getUserFromQueryIfNotExists();

  const getMessageHistory = async () => {
    if (to) {
      const results = await apiClient.users.getChatHistory.query({
        peer: to.id,
      });
      if (results) {
        const parsed = results.map((r) => JSON.parse(r) as unknown as Message);
        setChat(parsed);
      }
    }
  };
  void getMessageHistory();

  const handleInput = async () => {
    if (user && me) {
      const newMessage = {
        id: Math.floor(Math.random() * 100000000),
        from: me.id,
        to: user.id,
        text: msg,
      };

      const response = await fetch("/api/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isNew: newPeer,
          message: newMessage,
        }),
      });
      if (response.ok) setMsg("");
    }
  };

  return (
    <>
      {user && me && (
        <div className="max-w-2xl">
          <h4 className="mb-4 text-3xl font-semibold">
            {user.first_name} {user.last_name}
          </h4>
          {/* <ScrollToBottom> */}
          <div className="flex flex-col gap-2">
            {chat.map((message) => (
              <div
                key={message.id}
                className={`
                flex flex-wrap
                ${me.id === message.from ? "justify-end" : "justify-start"}
                `}
              >
                <p
                  className={`rounded-xl  px-4 py-3 text-sm font-medium ${
                    me.id === message.from
                      ? "rounded-br-none bg-cs-primary"
                      : "rounded-bl-none bg-cs-dark-800 "
                  }`}
                >
                  {message.text}
                </p>
              </div>
            ))}
          </div>
          {/* </ScrollToBottom> */}
          <div className="mt-3 flex flex-wrap items-center gap-x-3">
            <InputText
              className="grow"
              value={msg}
              onChange={(e) => {
                setMsg(e.target.value);
              }}
            />
            <CsButton
              onClick={() => {
                void handleInput();
              }}
            >
              Отправить
            </CsButton>
          </div>
        </div>
      )}
    </>
  );
};

type ChatListItem = Chat & {
  users: Array<{
    id: string;
    first_name: string;
    last_name: string;
  }>;
  active?: boolean | undefined;
  chatId?: string;
};
const ChatView = () => {
  const router = useRouter();
  const me = useRecoilValue(userState);
  const [chats, setChats] = useState<ChatListItem[] | false>(false);
  const [chatsLoaded, setChatsLoaded] = useState(false);
  const [chatsPopulated, setChatsPopulated] = useState(false);
  const [activeUserId, setActiveUserId] = useState("");
  const [activeUser, setActiveUser] = useState();

  useEffect(() => {
    if (!chatsLoaded) {
      apiClient.users.getChats
        .query()
        .then((res) => {
          if (res) {
            setChats(res);
            setChatsLoaded(true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  useEffect(() => {
    if (chatsLoaded) {
      if (chats !== false || (Array.isArray(chats) && chats.length > 0)) {
        if (chats[0]?.chatId === undefined) {
          if (chats === false || me === false) return;
          setChats(
            chats.map((chat) => {
              return {
                ...chat,
                ...{
                  // @ts-expect-error all ok
                  chatId: generateChatId(chat.users[0]?.id, chat.users[1]?.id),
                  active: false,
                  users: chat.users.filter((u) => u.id !== me.id),
                },
              };
            })
          );
          setChatsPopulated(true);
        }
      }
    }
  }, [chatsLoaded, chats, me]);

  const handleUserClick = (userId: string) => {
    if (chats !== false && chats.length > 0) {
      const chatsUpdated = chats.map((chat) => {
        if (chat.users[0]?.id === userId) {
          setActiveUserId(chat.users[0]?.id);
          // @ts-expect-error all ok
          setActiveUser(chat.users[0]);
          return { ...chat, ...{ active: true } };
        } else {
          return { ...chat, ...{ active: false } };
        }
      });
      setChats(chatsUpdated);
    }
  };

  return (
    <div className="grid grid-cols-4 gap-x-6">
      <div className="col-span-1 flex flex-col gap-y-3 rounded-3xl bg-cs-dark-800 p-6">
        {chats &&
          chats.length > 0 &&
          chatsPopulated &&
          chats.map((chat) => (
            <ChatUser
              key={chat.users[0]?.id}
              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
              label={`${chat.users[0]?.first_name} ${chat.users[0]?.last_name}`}
              userId={chat.users[0]?.id as unknown as string}
              handleClick={handleUserClick}
            />
          ))}
        {!chats ||
          (chats.length === 0 && (
            <p className="text-center font-medium">У вас пока нет чатов.</p>
          ))}
      </div>
      <div className="col-span-3">
        {(activeUserId || router.query.id) && <ChatMessaging to={activeUser} />}
      </div>
    </div>
  );
};

export default ChatView;
