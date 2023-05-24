const MainFAQCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div>
      <h5 className="mb-6 text-2xl font-bold uppercase text-white md:text-3xl lg:text-5xl">
        {title}
      </h5>
      {children}
    </div>
  );
};

export default MainFAQCard;
