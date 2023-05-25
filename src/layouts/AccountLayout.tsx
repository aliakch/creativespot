import AccountNavigation from "@/components/account/AccountNavigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { type Role } from "@/types/user";

export default function AccountLayout({
  children,
  role = "leaseholder",
  selectedOption,
}: {
  children: React.ReactNode;
  role: Role;
  selectedOption: string;
}) {
  return (
    <>
      <Header />
      <div className="container grid grid-cols-4 gap-x-8">
        <section className="col-span-1">
          <AccountNavigation role={role} selectedOption={selectedOption} />
        </section>
        <main className="col-span-3">{children}</main>
      </div>
      <Footer />
    </>
  );
}