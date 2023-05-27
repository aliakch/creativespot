import Chat from "@/components/Chat";
import MainLayout from "@/layouts/MainLayout";

const MessagesPage = () => {
  return (
    <MainLayout>
      <main className="container">
        <h1 className="mb-10 text-3xl font-bold text-white">
          Личные сообщения
        </h1>
        <Chat />
      </main>
    </MainLayout>
  );
};

export default MessagesPage;
