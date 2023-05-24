const CsAvatar = ({
  label,
  className,
}: {
  label: string;
  className?: string;
}) => {
  const letter = label.slice(0, 1);
  const classes = className ?? "";
  return (
    <div
      className={`flex h-8 w-8 items-center justify-center rounded-full bg-cs-red p-2 ${classes}`}
    >
      <p className="font-medium leading-none text-white">{letter}</p>
    </div>
  );
};

export default CsAvatar;
