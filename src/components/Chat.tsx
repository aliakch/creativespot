/* eslint-disable promise/always-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { type Chat, type ChatMessage, type User } from "@prisma/client";
import { useRouter } from "next/router";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { connect } from "socket.io-client";

import userState from "@/store/user";
import { apiClient } from "@/utils/api";

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
interface ChatMessagingProps {
  currentChatId?: string;
}
const connection = connect("http://localhost:3000", {
  path: "/api/messaging",
  autoConnect: true,
});

connection.on("connect", () => {
  console.log("connected!");
});

connection.onAny((event, ...args) => {
  console.log(event, args);
});

const ChatMessaging = ({ currentChatId }: ChatMessagingProps) => {
  // me - to get current user
  const me = useRecoilValue(userState);
  const router = useRouter();
  // chat ID and data
  const [chatId, setChatId] = useState<string | undefined>(currentChatId);
  const [chatData, setChatData] = useState<Chat | false>(false);
  const [chatLoaded, setChatLoaded] = useState(true);
  // current input message
  const [msg, setMsg] = useState("");
  // user
  const [users, setUser] = useState<User | false>(false);
  // peer
  const [peer, setPeer] = useState<User | false>(false);

  // chat history
  const chatHistory = useRecoilValue(chatState);
  const setChatHistory = useSetRecoilState(chatState);

  // create chat in database if not found
  const createChatIfNotExists = async (
    userId: string,
    peerId: string,
    estateId: string
  ) => {
    const response = await apiClient.users.createChat.query({
      user_from: userId,
      user_to: peerId,
      estate_id: estateId,
    });
    setChatId(response.id);
    setChatData(response);
    setPeer(getPeer(response.userFrom, response.userTo));
    void getMessageHistory(response.id);
  };

  const getPeer = (userFrom: User, userTo: User) => {
    if (me) {
      if (userFrom.id !== me.id) {
        return userFrom;
      }
    }
    return userTo;
  };

  // get chat data if chat id exists
  const getChatDataById = async (chatId: string) => {
    const response = await apiClient.users.getChatByCode.query({
      chat_id: chatId,
    });
    if (response !== null) {
      setChatData(response);
      setPeer(getPeer(response.userFrom, response.userTo));
    }
  };

  const getOrCreateChatDataFromUrl = async (
    myId: string,
    peerId: string,
    estateId: string
  ) => {
    const response = await apiClient.users.getChatByUsersAndEstate.query({
      user_id: myId,
      peer_id: peerId,
      estate_id: estateId,
    });
    if (response === null) {
      await createChatIfNotExists(myId, peerId, estateId);
    } else {
      setChatId(response.id);
      setChatData(response);
      setPeer(getPeer(response.userFrom, response.userTo));
    }
  };

  // trigger chat creation if not exists
  useEffect(() => {
    // if there are peer id and estate id BUT chat id isn't set explicitly, try finding by peer and estate OR create chat if not found
    if (!chatLoaded && me && (!chatId || chatId === "")) {
      const peerId = router.query.peer_id as string | undefined;
      const estateId = router.query.estate_id as string | undefined;
      if (peerId && estateId) {
        void getOrCreateChatDataFromUrl(me.id, peerId, estateId);
      }
      setChatLoaded(true);
    } else if (chatId) {
      void getChatDataById(chatId);
      void getMessageHistory(chatId);
    }
  }, [chatLoaded, me]);

  useEffect(() => {
    setChatLoaded(false);
  }, []);

  const getMessageHistory = async (chatId: string) => {
    const results = await apiClient.users.getChatHistory.query({
      chatId,
    });
    if (results != null) {
      setChatHistory(results);
    }
  };

  // get new messages on socket.io poll
  connection.on("message", (message: ChatMessage) => {
    setChatHistory([...chatHistory, ...[message]]);
  });

  const handleInput = async () => {
    if (peer !== false && me) {
      const newMessage = {
        user_from: me.id,
        user_to: peer.id,
        content: msg,
        chat_id: chatId,
      };

      const response = await fetch("/api/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: newMessage,
        }),
      });
      if (response.ok) setMsg("");
    }
  };

  return (
    <>
      {peer && (
        <div className="max-w-2xl">
          <div className="mb-4 flex  flex-wrap items-center border-b border-cs-dark-800 pb-4">
            <h4 className="block text-3xl font-semibold">
              {peer.first_name} {peer.last_name}
            </h4>
            <CsButton type="button" rounded className="ml-auto">
              Забронировать
            </CsButton>
          </div>
          <ScrollToBottom>
            <div className="flex flex-col gap-2">
              {chatHistory.map((message) => (
                <div
                  key={message.id}
                  className={`
                flex flex-wrap
                ${
                  me.id === message.userFromId ? "justify-end" : "justify-start"
                }
                `}
                >
                  <p
                    className={`rounded-xl  px-4 py-3 text-sm font-medium ${
                      me.id === message.userFromId
                        ? "rounded-br-none bg-cs-primary"
                        : "rounded-bl-none bg-cs-dark-800 "
                    }`}
                  >
                    {message.content}
                  </p>
                </div>
              ))}
            </div>
          </ScrollToBottom>
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
  userFrom: User;
  userTo: User;
  active?: boolean | undefined;
};
const ChatView = () => {
  const router = useRouter();
  const me = useRecoilValue(userState);
  // chat list
  const [chats, setChats] = useState<ChatListItem[] | false>(false);
  // whether chat list is loaded
  const [chatsLoaded, setChatsLoaded] = useState(true);
  // whether chats are populated (boolean) - e.g. have active state
  const [chatsPopulated, setChatsPopulated] = useState(false);
  // active chat id
  const [activeChatId, setActiveChatId] = useState("");

  useEffect(() => {
    if (!chatsLoaded) {
      apiClient.users.getChats
        .query()
        .then((res) => {
          if (res) {
            if (res.length > 0) {
              setChats(res);
            }
            setChatsLoaded(true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [chatsLoaded]);

  useEffect(() => {
    setChatsLoaded(false);
  }, []);

  useEffect(() => {
    if (chatsLoaded) {
      if (chats !== false || (Array.isArray(chats) && chats.length > 0)) {
        if (chats === false || me === false) return;
        setChats(
          chats.map((chat) => {
            return {
              ...chat,
              ...{
                active: false,
              },
            };
          })
        );
        setChatsPopulated(true);
      }
    }
  }, [chatsLoaded, me]);

  const handleUserClick = (id: string) => {
    if (chats !== false && chats.length > 0) {
      const chatsUpdated = chats.map((chat) => {
        if (chat.id === id) {
          setActiveChatId(chat.id);
          return { ...chat, ...{ active: true } };
        } else {
          return { ...chat, ...{ active: false } };
        }
      });
      setChats(chatsUpdated);
    }
  };

  const getPeer = (userFrom: User, userTo: User) => {
    if (me) {
      if (userFrom.id !== me.id) {
        return userFrom;
      }
    }
    return userTo;
  };

  return (
    <div className="grid grid-cols-4 gap-x-6">
      <div className="col-span-1 flex flex-col gap-y-3 rounded-3xl bg-cs-dark-800 p-6">
        {chats &&
          chats.length > 0 &&
          chatsPopulated &&
          chats.map((chat) => (
            <ChatUser
              key={chat.id}
              label={`${getPeer(chat.userFrom, chat.userTo).first_name} ${
                getPeer(chat.userFrom, chat.userTo).last_name
              }`}
              userId={getPeer(chat.userFrom, chat.userTo).id}
              handleClick={() => {
                handleUserClick(chat.id);
              }}
            />
          ))}
        {!chats ||
          (chats.length === 0 && (
            <p className="text-center font-medium">У вас пока нет чатов.</p>
          ))}
      </div>
      <div className="col-span-3">
        {(activeChatId || router.query.peer_id) && (
          <ChatMessaging currentChatId={activeChatId} />
        )}
      </div>
    </div>
  );
};

export default ChatView;
