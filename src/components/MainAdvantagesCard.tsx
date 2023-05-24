interface MainAdvantagesCardProps {
  title: string;
  text: string;
  hasTopPadding?: boolean;
  children: React.ReactNode;
}
const MainAdvantagesCard = ({
  title,
  text,
  hasTopPadding = false,
  children,
}: MainAdvantagesCardProps) => {
  const paddingClass = hasTopPadding ? "lg:pt-8" : "";
  return (
    <div className={paddingClass}>
      <h6 className="mb-3 text-2xl font-bold text-white md:text-3xl lg:text-4xl">
        {title}
      </h6>
      {children}
      <p className="mt-3 text-white lg:mt-7">{text}</p>
    </div>
  );
};

export default MainAdvantagesCard;
