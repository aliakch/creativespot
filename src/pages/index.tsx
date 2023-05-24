/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

import MainAdvantagesCard from "@/components/MainAdvantagesCard";
import MainFAQCard from "@/components/MainFAQCard";
import MainAdvantagesArrow from "@/images/MainAdvantagesArrow.svg";
import MainAdvantagesStars from "@/images/MainAdvantagesStars.svg";
import MainAdvantagesTicks from "@/images/MainAdvantagesTicks.svg";
import MainFAQChat from "@/images/MainFAQChat.svg";
import MainFAQRegister from "@/images/MainFAQRegister.svg";
import MainFAQSearch from "@/images/MainFAQSearch.svg";
import MainFAQSettings from "@/images/MainFAQSettings.svg";
import MainSectionPrimaryImage from "@/images/MainSectionPrimary.svg";
import MainSectionPrimaryMobile from "@/images/MainSectionPrimaryMobile.svg";
import MainLayout from "@/layouts/MainLayout";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>CreativeSpot | Креативный мир Москвы</title>
        <meta
          name="description"
          content="Погрузитесь в креативный мир Москвы. Найдите свою площадку и заявите о себе"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainLayout>
        <main>
          <section className="container my-10 lg:my-20">
            <div className="flex flex-wrap items-center justify-center md:hidden">
              <Image src={MainSectionPrimaryMobile} alt="" />
            </div>
            <Image
              className="hidden md:block"
              src={MainSectionPrimaryImage}
              alt=""
            />
          </section>
          <section className="container my-10 lg:my-20">
            <h3 className="mb-9 text-2xl font-bold text-white md:text-3xl lg:text-5xl">
              Погрузитесь в креативный мир Москвы
            </h3>
            <div className="grid grid-cols-2 gap-8">
              <div className="order-2 col-span-2 lg:order-1 lg:col-span-1">
                <p className="mb-4 font-light text-white lg:mb-8">
                  Мы собрали в одном месте арендодателей с лучшими
                  арт-пространствами разных районов Москвы с удобными функциями
                  поиска и общения клиентов с собственниками во встроенном чате.
                </p>
                <p className="font-light text-white">
                  У нас можно как найти, так и выставить на аренду лофт, клуб,
                  креативную площадку или пространство на открытом воздухе.
                </p>
              </div>
              <div className="order-1 col-span-2 lg:order-2 lg:col-span-1">
                <Image
                  className="w-full"
                  src="/images/secondary-section-image.png"
                  alt=""
                  height={300}
                  width={554}
                />
              </div>
            </div>
          </section>
          <section id="how-it-works" className="container my-10 lg:my-20">
            <h3 className="mb-9 text-2xl font-bold text-white md:text-3xl lg:text-5xl">
              Как это работает?
            </h3>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <MainFAQCard title="РЕГИСТРАЦИЯ">
                <Image src={MainFAQRegister} alt="" />
              </MainFAQCard>
              <MainFAQCard title="НАСТРОЙКА ЛК">
                <Image src={MainFAQSettings} alt="" />
              </MainFAQCard>
              <div className="hidden lg:block" />
              <div className="hidden lg:block" />
              <MainFAQCard title="ПОИСК / РАЗМЕЩЕНИЕ">
                <Image src={MainFAQSearch} alt="" />
              </MainFAQCard>
              <MainFAQCard title="ОБЩЕНИЕ В ЧАТЕ">
                <Image src={MainFAQChat} alt="" />
              </MainFAQCard>
            </div>
          </section>
          <section className="container my-10 mb-20 lg:my-20 lg:mb-40">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <MainAdvantagesCard
                title="C нами надежно"
                text="Отзывы о площадках позволяют выбрать надежного собственника и запланировать мероприятие, которое запомнится"
                hasTopPadding
              >
                <Image src={MainAdvantagesStars} alt="" />
              </MainAdvantagesCard>
              <MainAdvantagesCard
                title="Откликнуться легко"
                text="В каждом объявлении указан номер телефона арендодателя, а также присутствует кнопка “Написать сообщение”"
              >
                <Image src={MainAdvantagesArrow} alt="" />
              </MainAdvantagesCard>
              <MainAdvantagesCard
                title="Быстрые сделки"
                text="Рабочее общение происходит в чате на сайте и нацелено на скорейшее достижение выгодного соглашения"
                hasTopPadding
              >
                <Image src={MainAdvantagesTicks} alt="" />
              </MainAdvantagesCard>
            </div>
          </section>
        </main>
      </MainLayout>
    </>
  );
};

export default Home;
